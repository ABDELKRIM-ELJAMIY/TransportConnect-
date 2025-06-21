import React, { useState, useEffect } from "react";
import { Star, X, Menu, Filter, Search, ThumbsUp, MessageCircle, Calendar, Reply, Send } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from "axios";

const ConducteurRatings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [replyModal, setReplyModal] = useState({
        isOpen: false,
        evaluationId: null,
        reply: ""
    });

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    // Fetch user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data.user);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    // Fetch evaluations
    const fetchEvaluations = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/evaluations/user/${userData?._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                console.log('Fetched evaluations:', response.data.data);
                setEvaluations(response.data.data);
            } else {
                setError('Erreur lors du chargement des évaluations.');
            }
        } catch (err) {
            console.error("Error fetching evaluations:", err);
            setError('Erreur lors du chargement des évaluations.');
        } finally {
            setLoading(false);
        }
    };

    // Reply to evaluation
    const handleReply = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/evaluations/${replyModal.evaluationId}/reply`, {
                reponseEvalue: {
                    commentaire: replyModal.reply,
                    date: new Date()
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setEvaluations(prev => prev.map(evaluation =>
                evaluation._id === replyModal.evaluationId
                    ? {
                        ...evaluation,
                        reponseEvalue: {
                            commentaire: replyModal.reply,
                            date: new Date()
                        }
                    }
                    : evaluation
            ));

            // Close modal
            setReplyModal({
                isOpen: false,
                evaluationId: null,
                reply: ""
            });

            alert('Réponse envoyée avec succès!');
        } catch (err) {
            console.error("Error sending reply:", err);
            alert('Erreur lors de l\'envoi de la réponse: ' + (err.response?.data?.message || err.message));
        }
    };

    const openReplyModal = (evaluationId) => {
        setReplyModal({
            isOpen: true,
            evaluationId,
            reply: ""
        });
    };

    const closeReplyModal = () => {
        setReplyModal({
            isOpen: false,
            evaluationId: null,
            reply: ""
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData?._id) {
            fetchEvaluations();
        }
    }, [userData]);

    const filters = [
        { value: "all", label: "Tous", count: evaluations.length },
        { value: "5", label: "5 étoiles", count: evaluations.filter(r => r.note === 5).length },
        { value: "4", label: "4 étoiles", count: evaluations.filter(r => r.note === 4).length },
        { value: "3", label: "3 étoiles", count: evaluations.filter(r => r.note === 3).length },
        { value: "2", label: "2 étoiles", count: evaluations.filter(r => r.note === 2).length },
        { value: "1", label: "1 étoile", count: evaluations.filter(r => r.note === 1).length }
    ];

    const averageRating = evaluations.length > 0 ?
        evaluations.reduce((acc, evaluation) => acc + evaluation.note, 0) / evaluations.length : 0;
    const totalRatings = evaluations.length;
    const fiveStarCount = evaluations.filter(r => r.note === 5).length;
    const fourStarCount = evaluations.filter(r => r.note === 4).length;
    const threeStarCount = evaluations.filter(r => r.note === 3).length;
    const twoStarCount = evaluations.filter(r => r.note === 2).length;
    const oneStarCount = evaluations.filter(r => r.note === 1).length;

    const filteredEvaluations = evaluations.filter(evaluation => {
        const matchesFilter = selectedFilter === "all" ||
            evaluation.note.toString() === selectedFilter;
        const matchesSearch = evaluation.evaluateurId?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evaluation.evaluateurId?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evaluation.commentaire?.toLowerCase().includes(searchTerm.toLowerCase());
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
                            {filteredEvaluations.map((evaluation) => (
                                <div key={evaluation._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold">
                                                    {evaluation.evaluateurId?.prenom?.charAt(0) || ''}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-gray-800">{evaluation.evaluateurId?.prenom} {evaluation.evaluateurId?.nom}</h3>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <Calendar size={14} />
                                                    <span>{new Date(evaluation.createdAt).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {renderStars(evaluation.note)}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700 mb-2">{evaluation.commentaire}</p>
                                    </div>

                                    {/* Show existing reply if any */}
                                    {evaluation.reponseEvalue && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-sm font-medium text-gray-700">Votre réponse:</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(evaluation.reponseEvalue.date).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{evaluation.reponseEvalue.commentaire}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                                                <ThumbsUp size={16} />
                                                <span className="text-sm">Utile</span>
                                            </button>
                                            {!evaluation.reponseEvalue && (
                                                <button
                                                    onClick={() => openReplyModal(evaluation._id)}
                                                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                                                >
                                                    <Reply size={16} />
                                                    <span className="text-sm">Répondre</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredEvaluations.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <Star className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun avis trouvé</h3>
                                <p className="text-gray-500">Vous n'avez pas encore reçu d'évaluations</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Chargement des évaluations...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-12">
                                <div className="text-red-500 mb-4">⚠️</div>
                                <h3 className="text-lg font-medium text-gray-600 mb-2">Erreur</h3>
                                <p className="text-gray-500">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reply Modal */}
                {replyModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Répondre à l'évaluation</h3>
                                <button
                                    onClick={closeReplyModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Votre réponse
                                </label>
                                <textarea
                                    value={replyModal.reply}
                                    onChange={(e) => setReplyModal(prev => ({ ...prev, reply: e.target.value }))}
                                    placeholder="Partagez votre point de vue..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={closeReplyModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={!replyModal.reply.trim()}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ConducteurRatings;
