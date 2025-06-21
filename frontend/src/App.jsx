import { Routes, Route } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import NotFound from './pages/public/NotFound';
import HomePage from './pages/public/HomePage';
import Dashboard from './pages/conducteur/DashboardConducteur';
import CreerAnnonce from './pages/conducteur/CréerAnnonce';
import MyAnnonces from './pages/conducteur/MyAnnonces';
import Historique from './pages/conducteur/Historique';
import ConducteurRatings from './pages/conducteur/ConducteurRatings';
import NotificationsConducteur from './pages/conducteur/NotificationsConducteur';
import ProfilConducteur from './pages/conducteur/ProfilConducteur';
import MesTrajets from './pages/conducteur/MesTrajets';
import EditAnnonce from './pages/conducteur/EditAnnonce';
import MesDemandes from './pages/conducteur/MesDemandes';

import SearchAnnonces from './pages/expediteur/SearchAnnonces';
import DashboardExpediteur from './pages/expediteur/DashboardExpediteur';
import ProfilExpediteur from './pages/expediteur/ProfilExpediteur';
import MyDemandes from './pages/expediteur/MyDemandes';
import PackageHistory from './pages/expediteur/PackageHistory';
import ExpediteurRatings from './pages/expediteur/ExpediteurRatings';

import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/conducteur/dashboard" element={
          <ProtectedRoute requiredRole="conducteur">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/CreerAnnonce" element={
          <ProtectedRoute requiredRole="conducteur">
            <CreerAnnonce />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/MesAnnonce" element={
          <ProtectedRoute requiredRole="conducteur">
            <MyAnnonces />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/Historique" element={
          <ProtectedRoute requiredRole="conducteur">
            <Historique />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/ratings" element={
          <ProtectedRoute requiredRole="conducteur">
            <ConducteurRatings />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/notifications" element={
          <ProtectedRoute requiredRole="conducteur">
            <NotificationsConducteur />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/profil" element={
          <ProtectedRoute requiredRole="conducteur">
            <ProfilConducteur />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/trajets" element={
          <ProtectedRoute requiredRole="conducteur">
            <MesTrajets />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/demandes" element={
          <ProtectedRoute requiredRole="conducteur">
            <MesDemandes />
          </ProtectedRoute>
        } />
        <Route path="/conducteur/edit-annonce/:id" element={
          <ProtectedRoute requiredRole="conducteur">
            <EditAnnonce />
          </ProtectedRoute>
        } />

        <Route path="/expediteur/dashboard" element={
          <ProtectedRoute requiredRole="expediteur">
            <DashboardExpediteur />
          </ProtectedRoute>
        } />
        <Route path="/expediteur/search" element={
          <ProtectedRoute requiredRole="expediteur">
            <SearchAnnonces />
          </ProtectedRoute>
        } />
        <Route path="/expediteur/demandes" element={
          <ProtectedRoute requiredRole="expediteur">
            <MyDemandes />
          </ProtectedRoute>
        } />
        <Route path="/expediteur/historique" element={
          <ProtectedRoute requiredRole="expediteur">
            <PackageHistory />
          </ProtectedRoute>
        } />
        <Route path="/expediteur/ratings" element={
          <ProtectedRoute requiredRole="expediteur">
            <ExpediteurRatings />
          </ProtectedRoute>
        } />
        <Route path="/expediteur/profil" element={
          <ProtectedRoute requiredRole="expediteur">
            <ProfilExpediteur />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
