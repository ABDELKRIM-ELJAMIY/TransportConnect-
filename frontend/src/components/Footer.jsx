import React from 'react';
import { Truck, Globe, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-indigo-400">TransportConnect</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            La plateforme de référence pour le transport collaboratif de marchandises au Maroc.
                            Connectons le royaume, un colis à la fois.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <Globe className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-indigo-300 mb-4">Plateforme</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Pour les conducteurs</a></li>
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Pour les expéditeurs</a></li>
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Sécurité</a></li>
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Tarifs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-indigo-300 mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Centre d'aide</a></li>
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Conditions d'utilisation</a></li>
                            <li><a href="#" className="hover:text-indigo-300 transition-colors">Confidentialité</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 TransportConnect. Tous droits réservés.
                        </p>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <div className="flex items-center space-x-1 text-gray-400 text-sm">
                                <span>Made with</span>
                                <Heart className="w-4 h-4 text-indigo-400" />
                                <span>in Morocco</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;