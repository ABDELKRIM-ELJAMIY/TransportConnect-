// src/pages/conducteur/NotificationsConducteur.jsx
import React, { useState } from "react";
import { Bell, X, Menu, Check, XCircle, AlertCircle, Info, Package, Truck, Star, DollarSign, Clock, Filter, CheckCircle } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const NotificationsConducteur = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "trip_request",
            title: "Nouvelle demande de trajet",
            message: "Ahmed Benali souhaite réserver votre trajet Casablanca → Rabat pour le 20 juin",
            time: "Il y a 5 minutes",
            isRead: false,
            priority: "high",
            icon: Truck,
            action: "Voir la demande"
        },
        {
            id: 2,
            type: "rating",
            title: "Nouvel avis reçu",
            message: "Fatima Zahra vous a donné 5 étoiles pour votre dernier trajet",
            time: "Il y a 1 heure",
            isRead: false,
            priority: "medium",
            icon: Star,
            action: "Voir l'avis"
        },
        {
            id: 3,
            type: "payment",
            title: "Paiement reçu",
            message: "Vous avez reçu 1200 MAD pour le trajet Rabat → Fès",
            time: "Il y a 2 heures",
            isRead: true,
            priority: "high",
            icon: DollarSign,
            action: "Voir les détails"
        },
        {
            id: 4,
            type: "system",
            title: "Maintenance prévue",
            message: "Le système sera en maintenance le 25 juin de 02h00 à 04h00",
            time: "Il y a 3 heures",
            isRead: true,
            priority: "low",
            icon: Info,
            action: "Plus d'infos"
        },
        {
            id: 5,
            type: "announcement",
            title: "Annonce approuvée",
            message: "Votre annonce pour le trajet Tanger → Agadir a été approuvée",
            time: "Il y a 4 heures",
            isRead: true,
            priority: "medium",
            icon: Package,
            action: "Voir l'annonce"
        },
        {
            id: 6,
            type: "trip_reminder",
            title: "Rappel de trajet",
            message: "N'oubliez pas votre trajet Casablanca → Marrakech demain à 08h00",
            time: "Il y a 6 heures",
            isRead: false,
            priority: "medium",
            icon: Clock,
            action: "Voir les détails"
        },
        {
            id: 7,
            type: "cancellation",
            title: "Trajet annulé",
            message: "Le trajet Marrakech → Oujda a été annulé par le client",
            time: "Il y a 1 jour",
            isRead: true,
            priority: "high",
            icon: XCircle,
            action: "Voir les détails"
        },
        {
            id: 8,
            type: "promotion",
            title: "Offre spéciale",
            message: "Gagnez 10% de bonus sur tous vos trajets cette semaine !",
            time: "Il y a 2 jours",
            isRead: true,
            priority: "medium",
            icon: AlertCircle,
            action: "En savoir plus"
        }
    ]);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const filters = [
        { value: "all", label: "Toutes", icon: Bell },
        { value: "trip_request", label: "Demandes", icon: Truck },
        { value: "rating", label: "Avis", icon: Star },
        { value: "payment", label: "Paiements", icon: DollarSign },
        { value: "system", label: "Système", icon: Info }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "border-l-[6px] border-[#fc4b41]";
            case "medium":
                return "border-l-[6px] border-[#f6bf5a]";
            case "low":
                return "border-l-[6px] border-[#408e9a]";
            default:
                return "border-l-[6px] border-[#bbbbbb]";
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case "trip_request":
                return "text-[#226cac] bg-[#bbbbbb]";
            case "rating":
                return "text-[#f6bf5a] bg-[#bbbbbb]";
            case "payment":
                return "text-[#408e9a] bg-[#bbbbbb]";
            case "system":
                return "text-[#fc4b41] bg-[#bbbbbb]";
            case "announcement":
                return "text-[#226cac] bg-[#bbbbbb]";
            case "trip_reminder":
                return "text-[#f6bf5a] bg-[#bbbbbb]";
            case "cancellation":
                return "text-[#fc4b41] bg-[#bbbbbb]";
            case "promotion":
                return "text-[#408e9a] bg-[#bbbbbb]";
            default:
                return "text-[#bbbbbb] bg-[#bbbbbb]";
        }
    };

    const filteredNotifications = notifications.filter(notif =>
        selectedFilter === "all" || notif.type === selectedFilter
    );

    const unreadCount = notifications.filter(notif => !notif.isRead).length;

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

                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Notifications
                        </h1>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                        <div className="flex space-x-2">
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <CheckCircle size={16} />
                                <span>Tout marquer comme lu</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
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

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => {
                            const Icon = notification.icon;
                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 ${!notification.isRead ? "ring-2 ring-blue-200" : ""
                                        } ${getPriorityColor(notification.priority)}`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                                            <Icon size={24} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className={`font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 mb-3">{notification.message}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-500">{notification.time}</span>
                                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                            {notification.action}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2 ml-4">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Marquer comme lu"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-12">
                            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune notification</h3>
                            <p className="text-gray-500">Vous êtes à jour !</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationsConducteur; 