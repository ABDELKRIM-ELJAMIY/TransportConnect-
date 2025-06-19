import { Star, Home, User, Settings, Truck, Package, History, Bell, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const SidebarConducteur = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const menuItems = [
        {
            icon: Home,
            label: "Dashboard",
            href: "/conducteur/dashboard"
        },
        {
            icon: Star,
            label: "Avis",
            href: "/conducteur/ratings"
        },
        {
            icon: Truck,
            label: "Créer Annonce",
            href: "/conducteur/CreerAnnonce"
        },
        {
            icon: Package,
            label: "Mes Annonces",
            href: "/conducteur/MesAnnonce"
        },
        {
            icon: MapPin,
            label: "Mes Trajets",
            href: "/conducteur/trajets"
        },
        {
            icon: History,
            label: "Historique",
            href: "/conducteur/Historique"
        },
        {
            icon: User,
            label: "Profil",
            href: "/conducteur/profil"
        },
        {
            icon: Settings,
            label: "Paramètres",
            href: "/conducteur/parametres"
        }
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-all duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl">
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-30"></div>
                                    <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                        <Truck className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        Menu
                                    </h2>
                                    <p className="text-xs text-gray-400">Conducteur</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <Link
                                    key={index}
                                    to={item.href}
                                    className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive
                                        ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white border border-blue-500/30 shadow-lg"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                        }`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: isOpen ? "slideInLeft 0.3s ease-out forwards" : "none"
                                    }}
                                >
                                    <div className={`relative ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"
                                        } transition-colors duration-300`}>
                                        <Icon size={20} className="transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-700/50">
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    Ahmed Benali
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    Conducteur Vérifié
                                </p>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                </div>
            </aside>


        </>
    );
};

export default SidebarConducteur;
