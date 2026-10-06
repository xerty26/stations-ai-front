import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

// Components
import Header from '../components/Header';
import AdSense from '../components/AdSense';

// Utils
import { SITE_URL, formatName } from '../utils/format';

const API_BASE_URL = import.meta.env.VITE_API_STATIONS_URL || '';

export default function Provinces() {
    const [provinces, setProvinces] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stations/provinces`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(setProvinces)
            .catch((err) => {
                console.error('Error loading provinces:', err.message);
                setError(true);
            });
    }, []);

    return (
        <>
            <title>Precios de gasolina y diésel por provincia | GasOneClick</title>
            <meta name="description" content="Consulta el precio medio, mínimo y máximo de la gasolina y el diésel en cada provincia, con las gasolineras más baratas según los datos oficiales del Ministerio." />
            <link rel="canonical" href={`${SITE_URL}/gasolineras`} />
            {error && <meta name="robots" content="noindex" />}

            <Header />
            <main className="space-y-6">
                <header className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                        Precios de gasolina y diésel por provincia
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Elige una provincia para ver el precio medio de cada carburante, la diferencia entre la gasolinera más barata y la más cara, y el ranking de estaciones con el litro más económico. Los precios son los que las propias gasolineras comunican al Ministerio.
                    </p>
                </header>

                {!provinces && !error && <p className="text-sm text-slate-400">Cargando provincias…</p>}

                {error && (
                    <p className="text-sm text-slate-400">
                        No se han podido cargar las provincias. <Link to="/" className="text-emerald-400 hover:text-emerald-300">Volver al buscador</Link>
                    </p>
                )}

                {provinces && (
                    <>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {provinces.map((province) => (
                                <li key={province.slug}>
                                    <Link
                                        to={`/gasolineras/${province.slug}`}
                                        className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors"
                                    >
                                        <span className="flex items-center gap-2 font-semibold text-slate-100">
                                            <MapPin className="w-4 h-4 text-emerald-400" />
                                            {formatName(province.name)}
                                        </span>
                                        <span className="text-xs text-slate-400">{province.stations} gasolineras</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <AdSense />
                    </>
                )}
            </main>
        </>
    );
}
