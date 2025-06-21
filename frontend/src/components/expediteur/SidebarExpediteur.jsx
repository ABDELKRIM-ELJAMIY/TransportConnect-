import { Star, Home, User, Package, Search, History, Bell, MapPin, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SidebarExpediteur = ({ isOpen, toggleSidebar, userData }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: Home,
            label: "Dashboard",
            href: "/expediteur/dashboard"
        },
        {
            icon: Search,
            label: "Rechercher",
            href: "/expediteur/search"
        },
        {
            icon: Package,
            label: "Mes Demandes",
            href: "/expediteur/demandes"
        },
        {
            icon: History,
            label: "Historique",
            href: "/expediteur/historique"
        },
        {
            icon: Star,
            label: "Avis",
            href: "/expediteur/ratings"
        },
        {
            icon: User,
            label: "Profil",
            href: "/expediteur/profil"
        }
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

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
                <div className="h-full bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white shadow-2xl">
                    <div className="p-6 border-b border-green-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-30"></div>
                                    <div className="relative w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        Menu
                                    </h2>
                                    <p className="text-xs text-green-400">Expéditeur</p>
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
                                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-500/30 shadow-lg"
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                        }`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: isOpen ? "slideInLeft 0.3s ease-out forwards" : "none"
                                    }}
                                >
                                    <div className={`relative ${isActive ? "text-green-400" : "text-gray-400 group-hover:text-green-400"
                                        } transition-colors duration-300`}>
                                        <Icon size={20} className="transform group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-300">
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-green-700/50">
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-800/50 to-green-700/50 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center overflow-hidden">
                                {userData?.profileImage ? (
                                    <img
                                        src={getImageUrl(userData.profileImage)}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <User size={16} className="text-white" style={{ display: userData?.profileImage ? 'none' : 'flex' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {userData ? `${userData.prenom} ${userData.nom}` : 'Chargement...'}
                                </p>
                                <p className="text-xs text-green-400 truncate">
                                    Expéditeur
                                </p>
                            </div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                    <div className="p-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 justify-center"
                        >
                            <LogOut size={20} className="mr-2" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SidebarExpediteur; 