import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-4 left-4 right-4 z-40 transition-all duration-500 rounded-2xl ${isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-xl border border-gray-200/50'
            : 'bg-white/80 backdrop-blur-md border border-gray-200/30'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                <Truck className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                            TransportConnect
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        <a href="about" className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-gray-50">
                            <span className="relative z-10">À propos</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>

                        <a href="login" className="group relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:bg-gray-50 ml-4">
                            <span className="relative z-10">Se connecter</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>

                        <a href="register" className="group relative px-6 py-2 ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center">
                                S'inscrire
                                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </a>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden relative p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                            {isMenuOpen ? (
                                <X className="h-6 w-6 transform rotate-90" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu with creative animations */}
            <div className={`md:hidden transition-all duration-500 ease-out ${isMenuOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                <div className="px-4 py-4 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 rounded-b-2xl">
                    <div className="space-y-2">
                        <a
                            href="#about"
                            className={`block px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-medium transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                }`}
                            style={{ transitionDelay: '100ms' }}
                        >
                            À propos
                        </a>

                        <a
                            href="login"
                            className={`block px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 font-medium transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                }`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            Se connecter
                        </a>

                        <a
                            href="register"
                            className={`block px-4 py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center group ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                }`}
                            style={{ transitionDelay: '300ms' }}
                        >
                            <div className="flex items-center justify-center">
                                S'inscrire
                                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rounded-b-2xl"></div>
        </nav>
    );
};

export default Navbar;