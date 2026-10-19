import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLoyout';

// Pages
import Home from './pages/Home';
import Legal from './pages/Legal';
import Provinces from './pages/Provinces';
import Province from './pages/Province';
import NationalHistory from './pages/NationalHistory';

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/gasolineras" element={<Provinces />} />
                <Route path="/gasolineras/:slug" element={<Province />} />
                <Route path="/historico-precios" element={<NationalHistory />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}