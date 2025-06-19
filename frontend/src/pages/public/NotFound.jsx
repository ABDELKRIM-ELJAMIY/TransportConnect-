import React from 'react';
import { Link } from 'react-router-dom';
import { Frown, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <Frown className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page non trouvée</h2>
                <p className="text-gray-600 mb-6">
                    Désolé, nous n'avons pas trouvé la page que vous recherchez.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default NotFound;