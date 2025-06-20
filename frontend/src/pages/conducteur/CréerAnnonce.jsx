import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { X, Menu, Truck, MapPin, Calendar, Package, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import Sidebar from "../../components/conducteur/SidebarConducteur";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const CreerAnnonce = () => {
    // Validation schema
    const validationSchema = Yup.object({
        lieuDepart: Yup.object({
            nom: Yup.string().required('Le nom du lieu de départ est requis'),
            latitude: Yup.number().required('La latitude est requise').min(-90).max(90),
            longitude: Yup.number().required('La longitude est requise').min(-180).max(180),
            adresse: Yup.string().required('L\'adresse est requise')
        }),
        destination: Yup.object({
            nom: Yup.string().required('Le nom de la destination est requis'),
            latitude: Yup.number().required('La latitude est requise').min(-90).max(90),
            longitude: Yup.number().required('La longitude est requise').min(-180).max(180),
            adresse: Yup.string().required('L\'adresse est requise')
        }),
        dateDepart: Yup.date().required('La date de départ est requise').min(new Date(), 'La date doit être dans le futur'),
        dateArrivee: Yup.date().required('La date d\'arrivée est requise').min(Yup.ref('dateDepart'), 'La date d\'arrivée doit être après le départ'),
        dimensions: Yup.object({
            longueurMax: Yup.number().required('La longueur maximale est requise').positive(),
            largeurMax: Yup.number().required('La largeur maximale est requise').positive(),
            hauteurMax: Yup.number().required('La hauteur maximale est requise').positive()
        }),
        poidsMaximum: Yup.number().required('Le poids maximum est requis').positive(),
        typeMarchandise: Yup.string().required('Le type de marchandise est requis'),
        capaciteDisponible: Yup.number().required('La capacité disponible est requise').positive(),
        prix: Yup.number().required('Le prix est requis').positive(),
        conditions: Yup.object({
            accepteAnimaux: Yup.boolean(),
            fumeurAccepte: Yup.boolean(),
            conditionsSpeciales: Yup.string()
        }),
        nombrePlacesDisponibles: Yup.number().required('Le nombre de places est requis').positive().integer(),
        isUrgent: Yup.boolean(),
        etapesIntermediaires: Yup.array().of(
            Yup.object({
                nom: Yup.string().required('Nom requis'),
                adresse: Yup.string().nullable(),
                latitude: Yup.number().nullable(),
                longitude: Yup.number().nullable(),
                ordre: Yup.number().nullable()
            })
        ),
    });

    const initialValues = {
        lieuDepart: { nom: '', latitude: '', longitude: '', adresse: '' },
        destination: { nom: '', latitude: '', longitude: '', adresse: '' },
        dateDepart: '',
        dateArrivee: '',
        dimensions: { longueurMax: '', largeurMax: '', hauteurMax: '' },
        poidsMaximum: '',
        typeMarchandise: 'normale',
        capaciteDisponible: '',
        prix: '',
        conditions: {
            accepteAnimaux: false,
            fumeurAccepte: false,
            conditionsSpeciales: ''
        },
        nombrePlacesDisponibles: '',
        isUrgent: false,
        etapesIntermediaires: [],
    };

    // ✅ Modifié ici : handleSubmit avec token JWT dans les headers
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/annonces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...values,
                    dateDepart: new Date(values.dateDepart).toISOString(),
                    dateArrivee: new Date(values.dateArrivee).toISOString(),
                    dimensions: {
                        longueurMax: parseFloat(values.dimensions.longueurMax),
                        largeurMax: parseFloat(values.dimensions.largeurMax),
                        hauteurMax: parseFloat(values.dimensions.hauteurMax)
                    },
                    poidsMaximum: parseFloat(values.poidsMaximum),
                    capaciteDisponible: parseFloat(values.capaciteDisponible),
                    prix: parseFloat(values.prix),
                    nombrePlacesDisponibles: parseInt(values.nombrePlacesDisponibles),
                    lieuDepart: {
                        ...values.lieuDepart,
                        latitude: parseFloat(values.lieuDepart.latitude),
                        longitude: parseFloat(values.lieuDepart.longitude)
                    },
                    destination: {
                        ...values.destination,
                        latitude: parseFloat(values.destination.latitude),
                        longitude: parseFloat(values.destination.longitude)
                    },
                    typeMarchandise: values.typeMarchandise || 'normale',
                    conditions: {
                        accepteAnimaux: values.conditions?.accepteAnimaux ?? false,
                        fumeurAccepte: values.conditions?.fumeurAccepte ?? false,
                        conditionsSpeciales: values.conditions?.conditionsSpeciales || ''
                    },
                    etapesIntermediaires: values.etapesIntermediaires || []
                })
            });

            if (response.ok) {
                toast.success('Annonce créée avec succès!');
                resetForm();
            } else {
                const err = await response.json();
                toast.error(
                    err.errors
                        ? err.errors.map(e => `${e.field}: ${e.message}`).join(' | ')
                        : err.message || 'Erreur lors de la création de l\'annonce'
                );
            }
        } catch (error) {
            toast.error('Erreur de connexion');
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-100 relative overflow-hidden font-sans">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                {/* Top bar with toggle button */}
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
                    <div></div>
                </div>
                {/* Main content previously in return */}
                <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-10">
                    <div className="max-w-5xl w-full mx-auto shadow-lg rounded-3xl bg-white overflow-hidden border border-gray-200">
                        <div className="bg-gradient-to-r from-blue-900 via-green-800 to-yellow-600 px-10 py-8 rounded-t-3xl">
                            <h1 className="text-5xl font-extrabold text-white flex items-center gap-4 drop-shadow-lg select-none">
                                <Truck className="w-12 h-12" />
                                Créer une Annonce
                            </h1>
                            <p className="text-blue-100 mt-3 text-xl font-semibold select-none">
                                Publiez votre offre de transport de marchandises
                            </p>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, values, setFieldValue }) => (
                                <Form className="p-10 space-y-10">

                                    {/* Lieu de départ */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <MapPin className="w-6 h-6 text-green-700" />
                                            Lieu de Départ
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="lieuDepart.nom" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nom du lieu
                                                </label>
                                                <Field
                                                    id="lieuDepart.nom"
                                                    name="lieuDepart.nom"
                                                    type="text"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-green-400 focus:border-transparent transition"
                                                    placeholder="Ex: Tanougha"
                                                />
                                                <ErrorMessage name="lieuDepart.nom" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="lieuDepart.adresse" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Adresse complète
                                                </label>
                                                <Field
                                                    id="lieuDepart.adresse"
                                                    name="lieuDepart.adresse"
                                                    type="text"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-green-400 focus:border-transparent transition"
                                                    placeholder="Ex: 1 Place de la Concorde, Paris"
                                                />
                                                <ErrorMessage name="lieuDepart.adresse" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="lieuDepart.latitude" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Latitude
                                                </label>
                                                <Field
                                                    id="lieuDepart.latitude"
                                                    name="lieuDepart.latitude"
                                                    type="number"
                                                    step="any"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-green-400 focus:border-transparent transition"
                                                    placeholder="Ex: 48.8566"
                                                />
                                                <ErrorMessage name="lieuDepart.latitude" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="lieuDepart.longitude" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Longitude
                                                </label>
                                                <Field
                                                    id="lieuDepart.longitude"
                                                    name="lieuDepart.longitude"
                                                    type="number"
                                                    step="any"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-green-400 focus:border-transparent transition"
                                                    placeholder="Ex: 2.3522"
                                                />
                                                <ErrorMessage name="lieuDepart.longitude" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Destination */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <MapPin className="w-6 h-6 text-red-700" />
                                            Destination
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="destination.nom" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nom du lieu
                                                </label>
                                                <Field
                                                    id="destination.nom"
                                                    name="destination.nom"
                                                    type="text"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-red-400 focus:border-transparent transition"
                                                    placeholder="Ex: BM"
                                                />
                                                <ErrorMessage name="destination.nom" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="destination.adresse" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Adresse complète
                                                </label>
                                                <Field
                                                    id="destination.adresse"
                                                    name="destination.adresse"
                                                    type="text"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-red-400 focus:border-transparent transition"
                                                    placeholder="Ex: Place Bellecour, Lyon"
                                                />
                                                <ErrorMessage name="destination.adresse" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="destination.latitude" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Latitude
                                                </label>
                                                <Field
                                                    id="destination.latitude"
                                                    name="destination.latitude"
                                                    type="number"
                                                    step="any"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-red-400 focus:border-transparent transition"
                                                    placeholder="Ex: 45.7578"
                                                />
                                                <ErrorMessage name="destination.latitude" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="destination.longitude" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Longitude
                                                </label>
                                                <Field
                                                    id="destination.longitude"
                                                    name="destination.longitude"
                                                    type="number"
                                                    step="any"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-red-400 focus:border-transparent transition"
                                                    placeholder="Ex: 4.8320"
                                                />
                                                <ErrorMessage name="destination.longitude" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Dates */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <Calendar className="w-6 h-6 text-blue-700" />
                                            Dates de Transport
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date et heure de départ
                                                </label>
                                                <Field
                                                    id="dateDepart"
                                                    name="dateDepart"
                                                    type="datetime-local"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-blue-400 focus:border-transparent transition"
                                                />
                                                <ErrorMessage name="dateDepart" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="dateArrivee" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date et heure d'arrivée
                                                </label>
                                                <Field
                                                    id="dateArrivee"
                                                    name="dateArrivee"
                                                    type="datetime-local"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-blue-400 focus:border-transparent transition"
                                                />
                                                <ErrorMessage name="dateArrivee" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Dimensions et capacité */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <Package className="w-6 h-6 text-purple-700" />
                                            Capacité et Dimensions
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="dimensions.longueurMax" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Longueur max (m)
                                                </label>
                                                <Field
                                                    id="dimensions.longueurMax"
                                                    name="dimensions.longueurMax"
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-purple-400 focus:border-transparent transition"
                                                    placeholder="2.0"
                                                />
                                                <ErrorMessage name="dimensions.longueurMax" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="dimensions.largeurMax" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Largeur max (m)
                                                </label>
                                                <Field
                                                    id="dimensions.largeurMax"
                                                    name="dimensions.largeurMax"
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-purple-400 focus:border-transparent transition"
                                                    placeholder="1.5"
                                                />
                                                <ErrorMessage name="dimensions.largeurMax" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="dimensions.hauteurMax" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Hauteur max (m)
                                                </label>
                                                <Field
                                                    id="dimensions.hauteurMax"
                                                    name="dimensions.hauteurMax"
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-purple-400 focus:border-transparent transition"
                                                    placeholder="1.0"
                                                />
                                                <ErrorMessage name="dimensions.hauteurMax" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label htmlFor="poidsMaximum" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Poids maximum (kg)
                                                </label>
                                                <Field
                                                    id="poidsMaximum"
                                                    name="poidsMaximum"
                                                    type="number"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-purple-400 focus:border-transparent transition"
                                                    placeholder="500"
                                                />
                                                <ErrorMessage name="poidsMaximum" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="capaciteDisponible" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Capacité disponible (m³)
                                                </label>
                                                <Field
                                                    id="capaciteDisponible"
                                                    name="capaciteDisponible"
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-purple-400 focus:border-transparent transition"
                                                    placeholder="2.0"
                                                />
                                                <ErrorMessage name="capaciteDisponible" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="nombrePlacesDisponibles" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nombre de places
                                                </label>
                                                <Field
                                                    id="nombrePlacesDisponibles"
                                                    name="nombrePlacesDisponibles"
                                                    type="number"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-purple-400 focus:border-transparent transition"
                                                    placeholder="2"
                                                />
                                                <ErrorMessage name="nombrePlacesDisponibles" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Type de marchandise et prix */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <DollarSign className="w-6 h-6 text-green-700" />
                                            Marchandise et Prix
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="typeMarchandise" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Type de marchandise
                                                </label>
                                                <Field
                                                    id="typeMarchandise"
                                                    name="typeMarchandise"
                                                    as="select"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-green-400 focus:border-transparent transition"
                                                >
                                                    <option value="normale">Normale</option>
                                                    <option value="fragile">Fragile</option>
                                                    <option value="dangereuse">Dangereuse</option>
                                                    <option value="refrigeree">Réfrigérée</option>
                                                </Field>
                                                <ErrorMessage name="typeMarchandise" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                            <div>
                                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Prix (€)
                                                </label>
                                                <Field
                                                    id="prix"
                                                    name="prix"
                                                    type="number"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-green-400 focus:border-transparent transition"
                                                    placeholder="150"
                                                />
                                                <ErrorMessage name="prix" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Conditions */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <AlertCircle className="w-6 h-6 text-orange-700" />
                                            Conditions
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-4">
                                                <Field
                                                    id="conditions.accepteAnimaux"
                                                    name="conditions.accepteAnimaux"
                                                    type="checkbox"
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
                                                />
                                                <label htmlFor="conditions.accepteAnimaux" className="text-base font-medium text-gray-800 cursor-pointer">
                                                    Accepte les animaux
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Field
                                                    id="conditions.fumeurAccepte"
                                                    name="conditions.fumeurAccepte"
                                                    type="checkbox"
                                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
                                                />
                                                <label htmlFor="conditions.fumeurAccepte" className="text-base font-medium text-gray-800 cursor-pointer">
                                                    Fumeur accepté
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Field
                                                    id="isUrgent"
                                                    name="isUrgent"
                                                    type="checkbox"
                                                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 transition"
                                                />
                                                <label htmlFor="isUrgent" className="text-base font-medium text-gray-800 cursor-pointer">
                                                    Transport urgent
                                                </label>
                                            </div>

                                            <div>
                                                <label htmlFor="conditions.conditionsSpeciales" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Conditions spéciales (optionnel)
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    id="conditions.conditionsSpeciales"
                                                    name="conditions.conditionsSpeciales"
                                                    rows="3"
                                                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-3 focus:ring-orange-400 focus:border-transparent transition resize-none"
                                                    placeholder="Détails supplémentaires..."
                                                />
                                                <ErrorMessage name="conditions.conditionsSpeciales" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Étapes Intermédiaires */}
                                    <section className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                                            <Package className="w-6 h-6 text-yellow-700" />
                                            Étapes Intermédiaires (optionnel)
                                        </h3>
                                        <div className="space-y-4">
                                            {values.etapesIntermediaires && values.etapesIntermediaires.length > 0 ? (
                                                values.etapesIntermediaires.map((etape, idx) => (
                                                    <div key={idx} className="flex flex-col md:flex-row md:items-end gap-2 border p-3 rounded-lg bg-white/80">
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                                                            <Field name={`etapesIntermediaires[${idx}].nom`} type="text" className="w-full px-3 py-2 border border-gray-300 rounded" placeholder={`Étape ${idx + 1}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
                                                            <Field name={`etapesIntermediaires[${idx}].adresse`} type="text" className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Adresse" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                                                            <Field name={`etapesIntermediaires[${idx}].latitude`} type="number" className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Latitude" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                                                            <Field name={`etapesIntermediaires[${idx}].longitude`} type="number" className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Longitude" />
                                                        </div>
                                                        <button type="button" onClick={() => {
                                                            const newEtapes = [...values.etapesIntermediaires];
                                                            newEtapes.splice(idx, 1);
                                                            setFieldValue('etapesIntermediaires', newEtapes);
                                                        }} className="text-red-600 px-2 py-1 rounded hover:bg-red-50">Supprimer</button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400">Aucune étape ajoutée.</div>
                                            )}
                                            <button type="button" onClick={() => setFieldValue('etapesIntermediaires', [...values.etapesIntermediaires, { nom: '', adresse: '', latitude: '', longitude: '', ordre: values.etapesIntermediaires.length + 1 }])} className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors mt-2">Ajouter une étape</button>
                                        </div>
                                    </section>

                                    {/* Bouton Soumettre */}
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-14 py-4 rounded-xl shadow-lg transition"
                                        >
                                            {isSubmitting ? 'Envoi...' : 'Créer l\'annonce'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreerAnnonce;
