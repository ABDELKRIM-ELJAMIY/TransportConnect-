import React, { useState } from "react";
import { Star, X, Menu, Filter, Search, ThumbsUp, MessageCircle, Calendar } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const ConducteurRatings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const ratings = [
        {
            id: 1,
            clientName: "Fatima Zahra",
            rating: 5,
            comment: "Excellent service ! Le conducteur était ponctuel et professionnel. Je recommande vivement.",
            date: "2025-06-15",
            trip: "Casablanca → Rabat",
            isVerified: true,
            helpful: 12
        },
        {
            id: 2,
            clientName: "Youssef El Amrani",
            rating: 4,
            comment: "Bon trajet, conducteur sympathique. Livraison dans les délais.",
            date: "2025-06-14",
            trip: "Rabat → Fès",
            isVerified: true,
            helpful: 8
        },
        {
            id: 3,
            clientName: "Amina Benjelloun",
            rating: 5,
            comment: "Service impeccable ! Le conducteur a pris soin de mes marchandises et a été très communicatif.",
            date: "2025-06-13",
            trip: "Marrakech → Agadir",
            isVerified: false,
            helpful: 15
        },
        {
            id: 4,
            clientName: "Hassan Tazi",
            rating: 3,
            comment: "Trajet correct mais un peu de retard au départ. Sinon tout s'est bien passé.",
            date: "2025-06-12",
            trip: "Tanger → Casablanca",
            isVerified: true,
            helpful: 5
        },
        {
            id: 5,
            clientName: "Leila Mansouri",
            rating: 5,
            comment: "Fantastique ! Conducteur très professionnel et véhicule impeccable. Je recommande !",
            date: "2025-06-11",
            trip: "Fès → Oujda",
            isVerified: true,
            helpful: 20
        },
        {
            id: 6,
            clientName: "Karim Alami",
            rating: 4,
            comment: "Bon service, ponctuel et respectueux. Je ferai appel à nouveau.",
            date: "2025-06-10",
            trip: "Agadir → Marrakech",
            isVerified: false,
            helpful: 7
        }
    ];

    const filters = [
        { value: "all", label: "Tous", count: ratings.length },
        { value: "5", label: "5 étoiles", count: ratings.filter(r => r.rating === 5).length },
        { value: "4", label: "4 étoiles", count: ratings.filter(r => r.rating === 4).length },
        { value: "3", label: "3 étoiles", count: ratings.filter(r => r.rating === 3).length },
        { value: "verified", label: "Vérifiés", count: ratings.filter(r => r.isVerified).length }
    ];

    const averageRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
    const totalRatings = ratings.length;
    const fiveStarCount = ratings.filter(r => r.rating === 5).length;
    const fourStarCount = ratings.filter(r => r.rating === 4).length;
    const threeStarCount = ratings.filter(r => r.rating === 3).length;

    const filteredRatings = ratings.filter(rating => {
        const matchesFilter = selectedFilter === "all" ||
            (selectedFilter === "verified" && rating.isVerified) ||
            rating.rating.toString() === selectedFilter;
        const matchesSearch = rating.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rating.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rating.trip.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
        ));
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
                        Avis et Notes
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-800 mb-1">{averageRating.toFixed(1)}</div>
                                        <div className="flex justify-center mb-2">
                                            {renderStars(Math.round(averageRating))}
                                        </div>
                                        <div className="text-sm text-gray-600">{totalRatings} avis</div>
                                    </div>
                                    <div className="hidden md:block w-px h-16 bg-gray-300"></div>
                                </div>

                                <div className="flex-1 md:ml-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600 w-16">5 étoiles</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${(fiveStarCount / totalRatings) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-8">{fiveStarCount}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600 w-16">4 étoiles</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${(fourStarCount / totalRatings) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-8">{fourStarCount}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600 w-16">3 étoiles</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{ width: `${(threeStarCount / totalRatings) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-8">{threeStarCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans les avis..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setSelectedFilter(filter.value)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedFilter === filter.value
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        <span>{filter.label}</span>
                                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                            {filter.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredRatings.map((rating) => (
                                <div key={rating.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold">
                                                    {rating.clientName.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-gray-800">{rating.clientName}</h3>
                                                    {rating.isVerified && (
                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                            Vérifié
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <Calendar size={14} />
                                                    <span>{rating.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {renderStars(rating.rating)}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 mb-2">{rating.comment}</p>
                                        <div className="text-sm text-gray-500">
                                            Trajet: {rating.trip}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                                                <ThumbsUp size={16} />
                                                <span className="text-sm">Utile ({rating.helpful})</span>
                                            </button>
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                                                <MessageCircle size={16} />
                                                <span className="text-sm">Répondre</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredRatings.length === 0 && (
                            <div className="text-center py-12">
                                <Star className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun avis trouvé</h3>
                                <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConducteurRatings;
