import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// Components
import Footer from '../components/Footer';

export default function MainLoyout() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname, search]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <Outlet />
            <Footer />
        </div>
    );
}
