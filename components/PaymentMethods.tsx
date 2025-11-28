import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { CreditCard, Trash2, Plus, CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../types';

export const PaymentMethods = () => {
  const { currentUser, paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, getPaymentMethodsByUser } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'CARD' | 'PAYPAL'>('CARD');

  // Form states for credit card
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Form states for PayPal
  const [paypalEmail, setPaypalEmail] = useState('');

  const [isDefault, setIsDefault] = useState(false);

  if (!currentUser) return null;

  const userPaymentMethods = getPaymentMethodsByUser(currentUser.id);

  const resetForm = () => {
    setCardNumber('');
    setCardHolder('');
    setExpMonth('');
    setExpYear('');
    setCvv('');
    setPaypalEmail('');
    setIsDefault(false);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    return 'Card';
  };

  const handleAddPaymentMethod = () => {
    if (!currentUser) return;

    if (paymentType === 'CARD') {
      const cleaned = cardNumber.replace(/\s/g, '');
      if (cleaned.length < 13 || !cardHolder || !expMonth || !expYear) {
        return;
      }

      addPaymentMethod({
        userId: currentUser.id,
        type: 'CARD',
        isDefault: isDefault || userPaymentMethods.length === 0,
        cardLast4: cleaned.slice(-4),
        cardBrand: detectCardBrand(cardNumber),
        cardExpMonth: expMonth,
        cardExpYear: expYear,
        cardHolderName: cardHolder
      });
    } else {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        return;
      }

      addPaymentMethod({
        userId: currentUser.id,
        type: 'PAYPAL',
        isDefault: isDefault || userPaymentMethods.length === 0,
        paypalEmail
      });
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleRemove = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este método de pago?')) {
      removePaymentMethod(id);
    }
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethod }) => (
    <Card className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          method.type === 'CARD' ? 'bg-blue-500/10 text-blue-500' : 'bg-sky-500/10 text-sky-500'
        }`}>
          <CreditCard size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">
              {method.type === 'CARD' 
                ? `${method.cardBrand} •••• ${method.cardLast4}`
                : `PayPal`
              }
            </p>
            {method.isDefault && (
              <span className="px-2 py-0.5 bg-gold-500/20 text-gold-500 text-xs rounded-full font-medium">
                Predeterminado
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400">
            {method.type === 'CARD' 
              ? `Vence ${method.cardExpMonth}/${method.cardExpYear} • ${method.cardHolderName}`
              : method.paypalEmail
            }
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!method.isDefault && (
          <Button
            variant="secondary"
            onClick={() => setDefaultPaymentMethod(method.id)}
            className="text-xs px-3 py-1"
          >
            Predeterminar
          </Button>
        )}
        <button
          onClick={() => handleRemove(method.id)}
          className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Métodos de Pago</h2>
          <p className="text-zinc-400 text-sm">Gestiona tus tarjetas y cuentas de pago</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2" />
          Agregar Método
        </Button>
      </div>

      {userPaymentMethods.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No tienes métodos de pago</h3>
          <p className="text-zinc-400 mb-4">Agrega una tarjeta o cuenta PayPal para realizar pagos</p>
          <Button onClick={() => setShowAddModal(true)}>
            Agregar Método de Pago
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {userPaymentMethods.map(method => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Agregar Método de Pago"
      >
        <div className="space-y-4">
          {/* Payment Type Toggle */}
          <div className="flex p-1 bg-zinc-800 rounded-xl">
            <button
              onClick={() => setPaymentType('CARD')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                paymentType === 'CARD' 
                  ? 'bg-zinc-700 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tarjeta de Crédito
            </button>
            <button
              onClick={() => setPaymentType('PAYPAL')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                paymentType === 'PAYPAL' 
                  ? 'bg-zinc-700 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              PayPal
            </button>
          </div>

          {paymentType === 'CARD' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Nombre del Titular
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="NOMBRE APELLIDO"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Mes</label>
                  <input
                    type="text"
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value.replace(/\D/g, '').substring(0, 2))}
                    placeholder="MM"
                    maxLength={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Año</label>
                  <input
                    type="text"
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value.replace(/\D/g, '').substring(0, 2))}
                    placeholder="YY"
                    maxLength={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Correo de PayPal
              </label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-gold-500 focus:ring-gold-500 focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-400">Establecer como predeterminado</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancelar
            </Button>
            <Button onClick={handleAddPaymentMethod} fullWidth>
              Agregar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
