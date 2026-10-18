import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

// Components
import Header from '../components/Header';
import AdSense from '../components/AdSense';

// Utils
import { SITE_URL } from '../utils/format';
import { PROVINCE_NAMES } from '../utils/provinces';

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

    const stationCounts = Object.fromEntries((provinces || []).map((province) => [province.slug, province.stations]));

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

                {error && (
                    <p className="text-sm text-slate-400">
                        No se han podido cargar los recuentos de gasolineras. <Link to="/" className="text-emerald-400 hover:text-emerald-300">Volver al buscador</Link>
                    </p>
                )}

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(PROVINCE_NAMES).map(([slug, name]) => (
                        <li key={slug}>
                            <Link
                                to={`/gasolineras/${slug}`}
                                className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors"
                            >
                                <span className="flex items-center gap-2 font-semibold text-slate-100">
                                    <MapPin className="w-4 h-4 text-emerald-400" />
                                    {name}
                                </span>
                                {stationCounts[slug] && (
                                    <span className="text-xs text-slate-400">{stationCounts[slug]} gasolineras</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                    <h2 className="text-lg md:text-xl font-bold text-slate-100">
                        Por qué cambia el precio del combustible entre provincias
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        El precio final del litro suma el coste del crudo y su refino, los impuestos (IVA e impuesto especial de hidrocarburos), el transporte hasta la estación y el margen de cada gasolinera. Los tres primeros son casi iguales en toda la península. El margen es lo que más cambia: depende de la competencia local, de si la estación es de una marca tradicional o low cost y de si está desatendida.
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Canarias, Ceuta y Melilla tienen una fiscalidad propia (IGIC e IPSI en lugar del IVA), así que sus precios no son comparables con los de la península. En las provincias con mucha competencia entre estaciones, como Madrid, Barcelona o Valencia, suele haber más gasolineras baratas. En zonas rurales con pocas estaciones, la diferencia entre la más barata y la más cara puede ser mayor.
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Los precios se obtienen del Geoportal del Ministerio para la Transición Ecológica y el Reto Demográfico, donde cada gasolinera está obligada a comunicar sus cambios de tarifa. Las medias de cada provincia se calculan con todas las estaciones que venden ese carburante, y el ranking muestra las diez más baratas.
                    </p>
                </section>
                {provinces && <AdSense />}
            </main>
        </>
    );
}
