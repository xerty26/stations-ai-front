import { Outlet } from 'react-router-dom';

// Components
import Footer from '../components/Footer';

export default function MainLoyout() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <Outlet />
            <Footer />
        </div>
    );
}