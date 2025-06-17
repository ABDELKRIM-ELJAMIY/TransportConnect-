import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { X, Menu } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";

const CreerAnnonce = () => {
    const [submitted, setSubmitted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const formik = useFormik({
        initialValues: {
            lieuDepart: '',
            destination: '',
            etapesIntermediaires: '',
            dateDepart: '',
            dateArrivee: '',
            dimensionMaxLongueur: '',
            dimensionMaxLargeur: '',
            dimensionMaxHauteur: '',
            poidsMaximum: '',
            typeMarchandise: '',
            capaciteDisponible: '',
            prix: ''
        },
        validationSchema: Yup.object({
            lieuDepart: Yup.string().required('Champ requis'),
            destination: Yup.string().required('Champ requis'),
            etapesIntermediaires: Yup.string(),
            dateDepart: Yup.date().required('Champ requis'),
            dateArrivee: Yup.date().required('Champ requis'),
            dimensionMaxLongueur: Yup.number().required('Champ requis'),
            dimensionMaxLargeur: Yup.number().required('Champ requis'),
            dimensionMaxHauteur: Yup.number().required('Champ requis'),
            poidsMaximum: Yup.number().required('Champ requis'),
            typeMarchandise: Yup.string().required('Champ requis'),
            capaciteDisponible: Yup.number().required('Champ requis'),
            prix: Yup.number().required('Champ requis'),
        }),
        onSubmit: (values) => {
            const annonce = {
                ...values,
                etapesIntermediaires: values.etapesIntermediaires
                    .split(',')
                    .map((e) => e.trim())
            };
            console.log('Annonce soumise :', annonce);
            setSubmitted(true);
        }
    });

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
                        Créer une Annonce
                    </h1>
                    <div className="w-12" />
                </div>

                <div className="p-6">
                    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Créer une Annonce</h2>

                        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Lieu de Départ</label>
                                <input
                                    type="text"
                                    name="lieuDepart"
                                    onChange={formik.handleChange}
                                    value={formik.values.lieuDepart}
                                    className="w-full border rounded p-2"
                                />
                                {formik.touched.lieuDepart && formik.errors.lieuDepart && (
                                    <div className="text-red-500 text-sm">{formik.errors.lieuDepart}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Destination</label>
                                <input
                                    type="text"
                                    name="destination"
                                    onChange={formik.handleChange}
                                    value={formik.values.destination}
                                    className="w-full border rounded p-2"
                                />
                                {formik.touched.destination && formik.errors.destination && (
                                    <div className="text-red-500 text-sm">{formik.errors.destination}</div>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 text-sm font-medium">Étapes Intermédiaires (séparées par virgules)</label>
                                <input
                                    type="text"
                                    name="etapesIntermediaires"
                                    onChange={formik.handleChange}
                                    value={formik.values.etapesIntermediaires}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Date de Départ</label>
                                <input
                                    type="date"
                                    name="dateDepart"
                                    onChange={formik.handleChange}
                                    value={formik.values.dateDepart}
                                    className="w-full border rounded p-2"
                                />
                                {formik.touched.dateDepart && formik.errors.dateDepart && (
                                    <div className="text-red-500 text-sm">{formik.errors.dateDepart}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Date d'Arrivée</label>
                                <input
                                    type="date"
                                    name="dateArrivee"
                                    onChange={formik.handleChange}
                                    value={formik.values.dateArrivee}
                                    className="w-full border rounded p-2"
                                />
                                {formik.touched.dateArrivee && formik.errors.dateArrivee && (
                                    <div className="text-red-500 text-sm">{formik.errors.dateArrivee}</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Longueur max (cm)</label>
                                <input
                                    type="number"
                                    name="dimensionMaxLongueur"
                                    onChange={formik.handleChange}
                                    value={formik.values.dimensionMaxLongueur}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Largeur max (cm)</label>
                                <input
                                    type="number"
                                    name="dimensionMaxLargeur"
                                    onChange={formik.handleChange}
                                    value={formik.values.dimensionMaxLargeur}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Hauteur max (cm)</label>
                                <input
                                    type="number"
                                    name="dimensionMaxHauteur"
                                    onChange={formik.handleChange}
                                    value={formik.values.dimensionMaxHauteur}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Poids Maximum (kg)</label>
                                <input
                                    type="number"
                                    name="poidsMaximum"
                                    onChange={formik.handleChange}
                                    value={formik.values.poidsMaximum}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-1 text-sm font-medium">Type de Marchandise</label>
                                <input
                                    type="text"
                                    name="typeMarchandise"
                                    onChange={formik.handleChange}
                                    value={formik.values.typeMarchandise}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Capacité Disponible (m³)</label>
                                <input
                                    type="number"
                                    name="capaciteDisponible"
                                    onChange={formik.handleChange}
                                    value={formik.values.capaciteDisponible}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Prix (MAD)</label>
                                <input
                                    type="number"
                                    name="prix"
                                    onChange={formik.handleChange}
                                    value={formik.values.prix}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Créer l'Annonce
                                </button>
                            </div>
                        </form>

                        {submitted && (
                            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                                Annonce créée avec succès !
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreerAnnonce;
