import React, { useState } from 'react';
import { Truck, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">
                            TransportConnect
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Fonctionnalités</a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors">Comment ça marche</a>
                        <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Témoignages</a>
                        <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
                        <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Se connecter</a>
                        <a
                            href="/register"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            S'inscrire
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-2 space-y-3">
                        <a
                            href="#features"
                            className="block py-2 px-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                            Fonctionnalités
                        </a>
                        <a
                            href="#how-it-works"
                            className="block py-2 px-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                            Comment ça marche
                        </a>
                        <a
                            href="#testimonials"
                            className="block py-2 px-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                            Témoignages
                        </a>
                        <a
                            href="#contact"
                            className="block py-2 px-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                            Contact
                        </a>
                        <a
                            href="/login"
                            className="block py-2 px-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded transition-colors"
                        >
                            Se connecter
                        </a>
                        <a
                            href="/register"
                            className="block py-2 px-2 bg-indigo-600 text-white rounded-lg text-center hover:bg-indigo-700 transition-colors"
                        >
                            S'inscrire
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;