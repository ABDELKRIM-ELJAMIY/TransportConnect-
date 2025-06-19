import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import ImageHome from '../../assets/HomePage.jpeg';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-[rgb(255,255,255)] relative overflow-hidden">
            {/* Motifs géométriques */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 border-4 border-[rgb(199,132,0)] rotate-45 opacity-30"></div>
                <div className="absolute top-40 right-32 w-24 h-24 border-4 border-[rgb(0,117,73)] rotate-12 opacity-40"></div>
                <div className="absolute bottom-32 left-32 w-28 h-28 border-4 border-[rgb(0,66,140)] -rotate-12 opacity-35"></div>
                <div className="absolute bottom-20 right-20 w-20 h-20 border-4 border-[rgb(25,42,86)] rotate-45 opacity-25"></div>
            </div>

            {/* Barre supérieure décorative */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[rgb(0,66,140)] via-[rgb(0,117,73)] to-[rgb(199,132,0)]"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Texte principal */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Étoiles */}
                        <div className="flex justify-center lg:justify-start gap-2 mb-4">
                            <Star className="w-6 h-6 text-[rgb(0,0,0)] fill-current" />
                            <Star className="w-6 h-6 text-[rgb(25,42,86)] fill-current" />
                            <Star className="w-6 h-6 text-[rgb(199,132,0)] fill-current" />
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            <span className="text-[rgb(50,50,50)]">Optimisez votre</span>
                            <br />
                            <span className="bg-gradient-to-r from-[rgb(0,66,140)] via-[rgb(0,117,73)] to-[rgb(199,132,0)] bg-clip-text text-transparent">
                                logistique transport
                            </span>
                        </h1>

                        <div className="w-24 h-1 bg-gradient-to-r from-[rgb(0,66,140)] to-[rgb(199,132,0)] mx-auto lg:mx-0 rounded-full"></div>

                        <p className="text-xl text-[rgb(50,50,50)] leading-relaxed max-w-xl mx-auto lg:mx-0">
                            TransportConnect simplifie la mise en relation entre expéditeurs et transporteurs.
                            Bénéficiez de trajets optimisés et de coûts réduits grâce à notre plateforme collaborative.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center lg:justify-start">
                            <a
                                href="/register"
                                className="group relative px-8 py-4 bg-gradient-to-r from-[rgb(0,66,140)] to-[rgb(0,117,73)] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[rgb(0,117,73)] to-[rgb(0,66,140)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center justify-center gap-3">
                                    Commencer maintenant
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>

                            <a
                                href="/about"
                                className="group px-8 py-4 border-3 border-[rgb(0,66,140)] text-[rgb(0,66,140)] font-bold text-lg rounded-xl hover:bg-[rgb(0,66,140)] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            >
                                En savoir plus
                            </a>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[rgb(0,66,140)] via-[rgb(0,117,73)] to-[rgb(199,132,0)] rounded-3xl transform rotate-3 opacity-80"></div>
                        <div className="absolute -inset-2 bg-gradient-to-tl from-[rgb(199,132,0)] via-[rgb(0,117,73)] to-[rgb(0,66,140)] rounded-2xl transform -rotate-2 opacity-60"></div>

                        <div className="relative bg-white p-6 rounded-2xl shadow-2xl transform hover:rotate-0 transition-transform duration-500">
                            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-[rgb(0,66,140)] opacity-60"></div>
                            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-[rgb(0,117,73)] opacity-60"></div>
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-[rgb(199,132,0)] opacity-60"></div>
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-[rgb(25,42,86)] opacity-60"></div>

                            <div className="w-full h-80 bg-[rgb(255,255,255)] rounded-xl overflow-hidden flex items-center justify-center">
                                <img
                                    src={ImageHome}
                                    alt="ImageHome"
                                    className="object-cover w-full h-full rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-[rgb(0,117,73)] rounded-full animate-bounce shadow-lg"></div>
                        <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-[rgb(25,42,86)] rounded-full animate-pulse shadow-lg"></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[rgb(0,66,140)] via-[rgb(0,117,73)] to-[rgb(199,132,0)]"></div>
        </div>
    );
};

export default HomePage;
