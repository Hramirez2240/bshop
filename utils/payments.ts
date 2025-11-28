export type PaymentResult = { success: boolean; id?: string; message?: string };

// Mock payment charge - for demo only.
// In a real app, you should charge via a secure backend with Stripe/PayPal/etc.
export const chargePayment = async (amount: number, description?: string): Promise<PaymentResult> => {
  // Simulate network latency and random failure for demo
  await new Promise(r => setTimeout(r, 800));

  // In the demo, we'll always succeed for amounts <= 1000, otherwise fail
  if (amount <= 1000) {
    return { success: true, id: `pm_${Date.now()}`, message: 'Cobro simulado completado' };
  }

  return { success: false, message: 'Error simulando cobro' };
};
