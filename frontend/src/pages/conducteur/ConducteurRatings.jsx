import React, { useState } from "react";
import { Star, User, X, Menu } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const ConducteurRatings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const ratings = [
        {
            id: 1,
            user: "Fatima Zahra",
            rating: 5,
            comment: "Service excellent, ponctuel et très professionnel !",
            date: "2025-06-10"
        },
        {
            id: 2,
            user: "Youssef El Amrani",
            rating: 4,
            comment: "Bonne expérience, je recommande.",
            date: "2025-06-08"
        },
        {
            id: 3,
            user: "Sara Benali",
            rating: 5,
            comment: "Très sympathique et efficace.",
            date: "2025-06-05"
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
                        Mes Avis & Notes
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes Avis & Notes</h1>
                    <div className="space-y-6">
                        {ratings.map((rating) => (
                            <div key={rating.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="text-blue-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-gray-800">{rating.user}</span>
                                        <span className="text-xs text-gray-400">{rating.date}</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className={i < rating.rating ? "text-yellow-400" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <p className="text-gray-700">{rating.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConducteurRatings;
