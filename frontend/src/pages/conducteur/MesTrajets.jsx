// src/pages/conducteur/MesTrajets.jsx
import React, { useState } from "react";
import { X, Menu, Truck, MapPin, Calendar, Clock, Package, User, Phone, Mail, Navigation, CheckCircle, Edit, Eye } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const MesTrajets = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedTrip, setSelectedTrip] = useState(null);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const trips = [
        {
            id: 1,
            from: "Casablanca",
            to: "Rabat",
            date: "2025-06-18",
            time: "08:00",
            status: "en_cours",
            cargo: "Électronique",
            weight: "500 kg",
            customer: "Fatima Zahra",
            price: 1200,
            distance: "95 km"
        },
        {
            id: 2,
            from: "Rabat",
            to: "Fès",
            date: "2025-06-19",
            time: "10:00",
            status: "confirme",
            cargo: "Textile",
            weight: "300 kg",
            customer: "Youssef El Amrani",
            price: 800,
            distance: "200 km"
        }
    ];

    const filters = [
        { value: "all", label: "Tous", icon: Truck },
        { value: "en_cours", label: "En Cours", icon: Navigation },
        { value: "confirme", label: "Confirmés", icon: CheckCircle },
        { value: "en_attente", label: "En Attente", icon: Clock },
        { value: "termine", label: "Terminés", icon: CheckCircle }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "en_cours":
                return "bg-blue-100 text-blue-700";
            case "confirme":
                return "bg-green-100 text-green-700";
            case "en_attente":
                return "bg-yellow-100 text-yellow-700";
            case "termine":
                return "bg-gray-100 text-gray-700";
            case "annule":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "en_cours":
                return "En Cours";
            case "confirme":
                return "Confirmé";
            case "en_attente":
                return "En Attente";
            case "termine":
                return "Terminé";
            case "annule":
                return "Annulé";
            default:
                return status;
        }
    };

    const filteredTrips = trips.filter(trip =>
        selectedFilter === "all" || trip.status === selectedFilter
    );

    const TripDetailsModal = ({ trip, onClose }) => {
        if (!trip) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Détails du Trajet</h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MapPin className="text-blue-600" size={20} />
                                        <span className="font-semibold text-gray-800">Départ</span>
                                    </div>
                                    <p className="text-gray-600">{trip.from} → {trip.to}</p>
                                </div>
                                <div className="text-gray-400">
                                    <Navigation size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MapPin className="text-green-600" size={20} />
                                        <span className="font-semibold text-gray-800">Arrivée</span>
                                    </div>
                                    <p className="text-gray-600">{trip.to}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Informations du Trajet</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Date: {trip.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Heure: {trip.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Package className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Marchandise: {trip.cargo}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Truck className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Poids: {trip.weight}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Navigation className="text-gray-400" size={16} />
                                        <span className="text-gray-600">Distance: {trip.distance}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Informations Client</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <User className="text-gray-400" size={16} />
                                        <span className="text-gray-600">{trip.customer}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="text-gray-400" size={16} />
                                        <span className="text-gray-600">+212 6 12 34 56 78</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="text-gray-400" size={16} />
                                        <span className="text-gray-600">fatima.zahra@email.com</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-3">Prix</h3>
                                    <div className="text-2xl font-bold text-green-600">
                                        {trip.price} MAD
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                            {trip.status === "en_attente" && (
                                <>
                                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                        Accepter
                                    </button>
                                    <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                        Refuser
                                    </button>
                                </>
                            )}
                            {trip.status === "confirme" && (
                                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                    Commencer le Trajet
                                </button>
                            )}
                            {trip.status === "en_cours" && (
                                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                    Terminer le Trajet
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <main
                className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
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
                        Mes Trajets
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Mes Trajets</h1>
                        <div className="text-sm text-gray-600">
                            {filteredTrips.length} trajet{filteredTrips.length > 1 ? 's' : ''} trouvé{filteredTrips.length > 1 ? 's' : ''}
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedFilter(filter.value)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedFilter === filter.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-4">
                        {filteredTrips.map((trip) => (
                            <div key={trip.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-gray-800 font-semibold">
                                                    <MapPin className="mr-2 text-blue-600" size={20} />
                                                    {trip.from} → {trip.to}
                                                </div>
                                                <span className={`text-sm px-2 py-1 rounded-full font-medium ${getStatusColor(trip.status)}`}>
                                                    {getStatusText(trip.status)}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">{trip.price} MAD</div>
                                                <div className="text-sm text-gray-500">{trip.distance}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 text-gray-500" size={16} />
                                                {trip.date}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-2 text-gray-500" size={16} />
                                                {trip.time}
                                            </div>
                                            <div className="flex items-center">
                                                <Package className="mr-2 text-gray-500" size={16} />
                                                {trip.cargo}
                                            </div>
                                            <div className="flex items-center">
                                                <Truck className="mr-2 text-gray-500" size={16} />
                                                {trip.weight}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <User className="text-gray-400" size={16} />
                                                <span className="text-sm text-gray-600">{trip.customer}</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedTrip(trip)}
                                                    className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} />
                                                    <span className="text-sm">Détails</span>
                                                </button>
                                                {trip.status === "en_attente" && (
                                                    <button className="flex items-center space-x-2 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                        <Edit size={16} />
                                                        <span className="text-sm">Modifier</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTrips.length === 0 && (
                        <div className="text-center py-12">
                            <Truck className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun trajet trouvé</h3>
                            <p className="text-gray-500">Aucun trajet ne correspond à vos filtres</p>
                        </div>
                    )}
                </div>
            </main>

            {selectedTrip && (
                <TripDetailsModal
                    trip={selectedTrip}
                    onClose={() => setSelectedTrip(null)}
                />
            )}
        </div>
    );
};

export default MesTrajets; 