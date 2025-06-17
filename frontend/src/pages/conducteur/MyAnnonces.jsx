// src/pages/conducteur/MyAnnonces.jsx
import React, { useState } from "react";
import { Link } from 'react-router-dom';

import { MapPin, CalendarDays, Package, Weight, Truck, BadgeCheck, X, Menu, Edit, Trash2 } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const MyAnnonces = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const annonces = [
        {
            id: 1,
            lieuDepart: "Casablanca",
            destination: "Marrakech",
            dateDepart: "2025-06-18",
            dateArrivee: "2025-06-19",
            typeMarchandise: "Électronique",
            poidsMaximum: 500,
            prix: 1200,
            statut: "active",
        },
        {
            id: 2,
            lieuDepart: "Rabat",
            destination: "Fès",
            dateDepart: "2025-06-20",
            dateArrivee: "2025-06-21",
            typeMarchandise: "Textile",
            poidsMaximum: 300,
            prix: 800,
            statut: "active",
        },
        {
            id: 3,
            lieuDepart: "Tanger",
            destination: "Agadir",
            dateDepart: "2025-06-22",
            dateArrivee: "2025-06-23",
            typeMarchandise: "Mobilier",
            poidsMaximum: 800,
            prix: 1500,
            statut: "inactive",
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <main
                className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
                {/* Fixed Header */}
                <div className="bg-white/95 backdrop-blur-xl p-4 shadow-sm flex items-center justify-between border-b border-gray-200/50 sticky top-0 z-30">
                    <button
                        onClick={toggleSidebar}
                        className="group relative p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 transition-transform duration-300">
                            {sidebarOpen ? (
                                <X size={24} className="transform rotate-90 group-hover:rotate-0 transition-transform duration-300" />
                            ) : (
                                <Menu size={24} className="transform group-hover:scale-110 transition-transform duration-300" />
                            )}
                        </div>
                    </button>

                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Mes Annonces
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Mes Annonces</h1>
                        <Link to="/conducteur/CreerAnnonce">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Nouvelle Annonce
                            </button>
                        </Link>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {annonces.map((annonce) => (
                            <div key={annonce.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-gray-800 font-semibold">
                                        <MapPin className="mr-2 text-blue-600" size={20} />
                                        {annonce.lieuDepart} → {annonce.destination}
                                    </div>
                                    <span
                                        className={`text-sm px-2 py-1 rounded-full font-medium ${annonce.statut === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {annonce.statut}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                    <p className="flex items-center">
                                        <CalendarDays className="mr-2 text-gray-500" size={18} />
                                        Départ: {annonce.dateDepart}
                                    </p>
                                    <p className="flex items-center">
                                        <CalendarDays className="mr-2 text-gray-500" size={18} />
                                        Arrivée: {annonce.dateArrivee}
                                    </p>
                                    <p className="flex items-center">
                                        <Package className="mr-2 text-gray-500" size={18} />
                                        Marchandise: {annonce.typeMarchandise}
                                    </p>
                                    <p className="flex items-center">
                                        <Weight className="mr-2 text-gray-500" size={18} />
                                        Poids max: {annonce.poidsMaximum} kg
                                    </p>
                                    <p className="flex items-center">
                                        <Truck className="mr-2 text-gray-500" size={18} />
                                        Prix: {annonce.prix} MAD
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyAnnonces;
