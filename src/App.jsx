import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLoyout';

// Pages
import Home from './pages/Home';
import Legal from './pages/Legal';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/legal" element={<Legal />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}