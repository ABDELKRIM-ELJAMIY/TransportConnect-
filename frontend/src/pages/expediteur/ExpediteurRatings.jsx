import React, { useState, useEffect } from "react";
import { Star, X, Menu, Package, TrendingUp, Award, User, Calendar, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import Sidebar from "../../components/expediteur/SidebarExpediteur";
import axios from "axios";

const ExpediteurRatings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [stats, setStats] = useState({
        averageRating: 0,
        totalRatings: 0,
        fiveStarRatings: 0,
        recentRatings: 0
    });

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data.user);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    // Fetch expediteur ratings
    const fetchRatings = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/evaluations/expediteur/${userData?.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const ratingsData = response.data.data || response.data.evaluations || [];
                setRatings(ratingsData);

                // Calculate statistics
                const totalRatings = ratingsData.length;
                const averageRating = totalRatings > 0 ?
                    ratingsData.reduce((sum, rating) => sum + rating.note, 0) / totalRatings : 0;
                const fiveStarRatings = ratingsData.filter(rating => rating.note === 5).length;
                const recentRatings = ratingsData.filter(rating =>
                    new Date(rating.dateCreation) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length;

                setStats({
                    averageRating: Math.round(averageRating * 10) / 10,
                    totalRatings,
                    fiveStarRatings,
                    recentRatings
                });
            } else {
                setError('Erreur lors du chargement des évaluations.');
            }
        } catch (err) {
            console.error("Error fetching ratings:", err);
            setError('Erreur lors du chargement des évaluations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData?.id) {
            fetchRatings();
        }
    }, [userData]);

    const filters = [
        { value: "all", label: "Toutes", icon: Star },
        { value: "5", label: "5 étoiles", icon: Award },
        { value: "4", label: "4 étoiles", icon: TrendingUp },
        { value: "3", label: "3 étoiles", icon: Package },
        { value: "2", label: "2 étoiles", icon: ThumbsDown },
        { value: "1", label: "1 étoile", icon: ThumbsDown }
    ];

    const filteredRatings = ratings.filter(rating => {
        return selectedFilter === "all" || rating.note.toString() === selectedFilter;
    });

    const getRatingColor = (rating) => {
        if (rating >= 4) return "text-green-600";
        if (rating >= 3) return "text-yellow-600";
        return "text-red-600";
    };

    const getRatingText = (rating) => {
        if (rating === 5) return "Excellent";
        if (rating === 4) return "Très bien";
        if (rating === 3) return "Bien";
        if (rating === 2) return "Moyen";
        if (rating === 1) return "Mauvais";
        return "Non évalué";
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />
                <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement des évaluations...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} userData={userData} />

            <main className={`flex-1 min-h-screen bg-gray-50 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                {/* Header */}
                <div className="bg-white/95 backdrop-blur-xl p-4 shadow-sm flex items-center justify-between border-b border-gray-200/50 sticky top-0 z-30">
                    <button
                        onClick={toggleSidebar}
                        className="group relative p-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 transition-transform duration-300">
                            {sidebarOpen ? (
                                <X size={24} className="transform rotate-90 group-hover:rotate-0 transition-transform duration-300" />
                            ) : (
                                <Menu size={24} className="transform group-hover:scale-110 transition-transform duration-300" />
                            )}
                        </div>
                    </button>

                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Mes Évaluations
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes Évaluations</h1>

                        <div className="flex gap-2 overflow-x-auto mb-6">
                            {filters.map((filter) => {
                                const Icon = filter.icon;
                                return (
                                    <button
                                        key={filter.value}
                                        onClick={() => setSelectedFilter(filter.value)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${selectedFilter === filter.value
                                            ? "bg-green-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span>{filter.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Note Moyenne</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.averageRating}/5</p>
                                </div>
                                <Star className="text-green-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Évaluations</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.totalRatings}</p>
                                </div>
                                <Award className="text-blue-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">5 Étoiles</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.fiveStarRatings}</p>
                                </div>
                                <Star className="text-yellow-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ce Mois</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.recentRatings}</p>
                                </div>
                                <TrendingUp className="text-purple-500" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition des Notes</h2>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = ratings.filter(r => r.note === stars).length;
                                const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-1 w-16">
                                            <span className="text-sm text-gray-600">{stars}</span>
                                            <Star className="text-yellow-400" size={16} />
                                        </div>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Ratings List */}
                    <div className="space-y-4">
                        {filteredRatings.map((rating) => (
                            <div key={rating._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <User className="text-green-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {rating.conducteur?.prenom} {rating.conducteur?.nom}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {rating.demande?.annonce?.lieuDepart?.nom || 'N/A'} → {rating.demande?.annonce?.destination?.nom || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < rating.note ? "text-yellow-400 fill-current" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <div className={`text-sm font-medium ${getRatingColor(rating.note)}`}>
                                            {getRatingText(rating.note)}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="mr-2 text-gray-500" size={16} />
                                        <span>{new Date(rating.dateCreation).toLocaleDateString('fr-FR')}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Package className="mr-2 text-gray-500" size={16} />
                                        <span>{rating.demande?.typeMarchandise || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <MessageCircle className="mr-2 text-gray-500" size={16} />
                                        <span>{rating.commentaire ? 'Avec commentaire' : 'Sans commentaire'}</span>
                                    </div>
                                </div>

                                {rating.commentaire && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700 italic">"{rating.commentaire}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredRatings.length === 0 && (
                        <div className="text-center py-12">
                            <Star className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune évaluation trouvée</h3>
                            <p className="text-gray-500">Vous n'avez pas encore reçu d'évaluations</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExpediteurRatings;
