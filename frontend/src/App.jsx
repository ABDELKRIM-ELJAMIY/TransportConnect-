import { Routes, Route } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import NotFound from './pages/public/NotFound';
import HomePage from './pages/public/HomePage';
import Dashboard from './pages/conducteur/DashboardConducteur';
import CreerAnnonce from './pages/conducteur/CréerAnnonce';
// import MesAnnonces from './pages/conducteur/MesAnnonces';
import MyAnnonces from './pages/conducteur/MyAnnonces';
import Historique from './pages/conducteur/Historique';
import ConducteurRatings from './pages/conducteur/ConducteurRatings';
import NotificationsConducteur from './pages/conducteur/NotificationsConducteur';
import ProfilConducteur from './pages/conducteur/ProfilConducteur';
import MesTrajets from './pages/conducteur/MesTrajets';
// import Navbar from './components/Navbar';

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conducteur/dashboard" element={<Dashboard />} />
        <Route path="/conducteur/CreerAnnonce" element={<CreerAnnonce />} />
        <Route path="/conducteur/MesAnnonce" element={<MyAnnonces />} />
        <Route path="/conducteur/Historique" element={<Historique />} />
        <Route path="/conducteur/ratings" element={<ConducteurRatings />} />
        <Route path="/conducteur/notifications" element={<NotificationsConducteur />} />
        <Route path="/conducteur/profil" element={<ProfilConducteur />} />
        <Route path="/conducteur/Trajets" element={<MesTrajets />} />





        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
