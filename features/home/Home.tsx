import React from 'react';
import { Link } from 'react-router-dom';
import { ImageCarousel } from '../../components/ImageCarousel';
import { Scissors, Clock, Star, Calendar } from 'lucide-react';

const carouselImages = [
    '/images/carousel/interior.png',
    '/images/carousel/tools.png',
    '/images/carousel/client.png',
    '/images/carousel/waiting.png',
];

const features = [
    {
        icon: Scissors,
        title: 'Servicios Premium',
        description: 'Cortes, barbería, coloración y tratamientos de lujo',
    },
    {
        icon: Calendar,
        title: 'Reservas Fáciles',
        description: 'Sistema de booking intuitivo en 4 simples pasos',
    },
    {
        icon: Star,
        title: 'Profesionales Expertos',
        description: 'Estilistas certificados con años de experiencia',
    },
    {
        icon: Clock,
        title: 'Horarios Flexibles',
        description: 'Disponibilidad de 9:00 AM a 6:00 PM',
    },
];

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <ImageCarousel images={carouselImages} autoPlayInterval={5000} />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <img
                        src="/images/logo.png"
                        alt="BShop Logo"
                        className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl"
                    />
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                        Bienvenido a <span className="text-gold-500">BShop</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-200 mb-8 drop-shadow-md">
                        Tu destino premium para servicios de belleza y barbería
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-zinc-950 font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-gold-500/50"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 backdrop-blur-sm border border-zinc-700"
                        >
                            Registrarse
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-zinc-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-12 text-white">
                        ¿Por qué elegir <span className="text-gold-500">BShop</span>?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 hover:border-gold-500/50 transition-all hover:transform hover:scale-105"
                            >
                                <div className="bg-gold-500/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 border border-gold-500/20">
                                    <feature.icon className="text-gold-500" size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                <p className="text-zinc-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6 text-white">
                        ¿Listo para tu transformación?
                    </h2>
                    <p className="text-xl text-zinc-300 mb-8">
                        Únete a cientos de clientes satisfechos y reserva tu cita hoy
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-10 py-5 bg-gold-500 hover:bg-gold-600 text-zinc-950 font-bold text-lg rounded-lg transition-all transform hover:scale-105 shadow-xl shadow-gold-500/30"
                    >
                        Comenzar Ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-zinc-800 bg-zinc-950">
                <div className="max-w-6xl mx-auto text-center text-zinc-500">
                    <p>&copy; 2025 BShop. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};
