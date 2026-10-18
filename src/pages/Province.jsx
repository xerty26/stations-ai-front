import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Search } from 'lucide-react';

// Components
import Header from '../components/Header';
import AdSense from '../components/AdSense';
import ProvinceLinks from '../components/ProvinceLinks';

// Utils
import { SITE_URL, formatName, formatPrice, formatEuros } from '../utils/format';
import { getRelatedProvinces, PROVINCE_NAMES } from '../utils/provinces';

const API_BASE_URL = import.meta.env.VITE_API_STATIONS_URL || '';

const FUEL_LABELS = {
    gasoleo_a: 'Diésel A',
    gasolina_95_e5: 'Gasolina 95',
    gasolina_98_e5: 'Gasolina 98',
    gasoleo_premium: 'Diésel A+',
};

const TANK_LITERS = 50;

export default function Province() {
    const { slug } = useParams();
    // Keep the slug with the result so a province change shows the loading state without resetting state in the effect
    const [result, setResult] = useState({ slug: null });

    useEffect(() => {
        fetch(`${API_BASE_URL}/stations/province/${slug}`)
            .then((res) => {
                if (res.status === 404) return { slug, notFound: true };
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json().then((data) => ({ slug, data }));
            })
            .then(setResult)
            .catch((err) => {
                console.error('Error loading province:', err.message);
                setResult({ slug, error: true });
            });
    }, [slug]);

    const loading = result.slug !== slug;
    const data = loading ? null : result.data;
    const name = PROVINCE_NAMES[slug] || (data ? formatName(data.name) : formatName(slug.replace(/-/g, ' ')));
    const fuels = data ? Object.entries(data.fuels) : [];
    const diesel = data?.fuels.gasoleo_a;
    const gasoline = data?.fuels.gasolina_95_e5;
    const updatedAt = data?.updated_at
        ? new Date(data.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <>
            <title>{`Gasolineras más baratas en ${name} hoy | GasOneClick`}</title>
            <meta name="description" content={`Precio medio de la gasolina y el diésel en ${name} y ranking de las gasolineras más baratas de la provincia con datos oficiales del Ministerio.`} />
            <link rel="canonical" href={`${SITE_URL}/gasolineras/${slug}`} />
            {!loading && !data && <meta name="robots" content="noindex" />}

            <Header />
            <main className="space-y-6">
                <header className="space-y-2">
                    <Link to="/gasolineras" className="text-xs text-slate-400 hover:text-emerald-400">
                        Todas las provincias
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                        Gasolineras más baratas en {name}
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {data ? <>Precios oficiales de las {data.total_estaciones} gasolineras de la provincia de {name}
                            {updatedAt && <>, actualizados el {updatedAt}</>}. </> : <>Precios oficiales de las gasolineras de la provincia de {name}. </>}
                        Las estaciones comunican sus precios al Ministerio para la Transición Ecológica y GasOneClick los ordena de más barato a más caro: gasolina 95, gasolina 98, diésel A y diésel A+, con el precio medio, el mínimo y el máximo de la provincia y el ranking de las diez gasolineras con el litro más económico.
                    </p>
                </header>

                {loading &&
                    <div className="space-y-4 animate-pulse">
                        <div className="h-44 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                        <div className="h-28 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                        <div className="h-64 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                    </div>
                }

                {!loading && !data && (
                    <p className="text-sm text-slate-400">
                        {result.notFound ? `Todavía no tenemos datos de ${name}.` : 'No se han podido cargar los precios.'}{' '}
                        <Link to="/gasolineras" className="text-emerald-400 hover:text-emerald-300">Ver otras provincias</Link>
                    </p>
                )}

                {data && (
                    <>
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {fuels.map(([fuel, stats]) => (
                                <div key={fuel} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 space-y-1">
                                    <p className="text-xs text-slate-400">{FUEL_LABELS[fuel]}</p>
                                    <p className="text-xl font-bold text-slate-100">{formatPrice(stats.avg)} €</p>
                                    <p className="text-[11px] text-slate-500">
                                        de {formatPrice(stats.min)} a {formatPrice(stats.max)} €/L
                                    </p>
                                </div>
                            ))}
                        </section>

                        {fuels.map(([fuel, stats]) => {
                            const cheapest = stats.top[0];
                            const saving = (stats.avg - stats.min) * TANK_LITERS;

                            return (
                                <section key={fuel} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                                    <h2 className="text-lg md:text-xl font-bold text-slate-100">
                                        {FUEL_LABELS[fuel]} más barato en {name}
                                    </h2>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        El litro de {FUEL_LABELS[fuel].toLowerCase()} cuesta de media {formatPrice(stats.avg)} € en las {stats.stations} gasolineras de {name} que lo venden.
                                        La más barata es {cheapest.label} en {formatName(cheapest.city)}, a {formatPrice(cheapest.price)} €/L: llenar allí un depósito de {TANK_LITERS} litros cuesta {formatEuros(saving)} € menos que al precio medio
                                        y {formatEuros((stats.max - stats.min) * TANK_LITERS)} € menos que en la gasolinera más cara de la provincia.
                                    </p>
                                    <ol className="divide-y divide-slate-800">
                                        {stats.top.map((station, index) => (
                                            <li key={station.id} className="flex items-center justify-between gap-3 py-2.5">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-200 truncate">
                                                        {index + 1}. {station.label}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {station.address}, {formatName(station.city)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-sm font-bold text-emerald-400">{formatPrice(station.price)} €</span>
                                                    {station.google_maps_url && (
                                                        <a
                                                            href={station.google_maps_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`Ver ${station.label} en Google Maps`}
                                                            className="text-slate-400 hover:text-emerald-400"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            );
                        })}

                        {diesel && gasoline && (
                            <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                                <h2 className="text-lg md:text-xl font-bold text-slate-100">
                                    ¿Diésel o gasolina en {name}?
                                </h2>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Hoy el diésel cuesta de media {formatPrice(diesel.avg)} €/L en {name} y la gasolina 95, {formatPrice(gasoline.avg)} €/L:
                                    {' '}{gasoline.avg > diesel.avg ? 'el diésel sale' : 'la gasolina sale'} {formatPrice(Math.abs(gasoline.avg - diesel.avg))} €/L más barato.
                                    En un depósito de {TANK_LITERS} litros son {formatEuros(Math.abs(gasoline.avg - diesel.avg) * TANK_LITERS)} € de diferencia, aunque el diésel consume menos por kilómetro y el resultado final depende de tu coche.
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Dentro de la propia provincia, el precio de la gasolina 95 varía un {((gasoline.max - gasoline.min) / gasoline.avg * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 })} % entre la gasolinera más barata ({formatPrice(gasoline.min)} €/L)
                                    y la más cara ({formatPrice(gasoline.max)} €/L). La más económica está en {formatName(gasoline.top[0].city)}.
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Las diferencias entre gasolineras vecinas suelen venir de la marca (las low cost y las desatendidas cobran menos), de la competencia en la zona y de la ubicación: las estaciones junto a autovías y en el centro de las ciudades acostumbran a ser las más caras.
                                </p>
                            </section>
                        )}

                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-2xl py-3 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Buscar las más baratas cerca de mí
                        </Link>
                        <AdSense />
                    </>
                )}

                <section className="space-y-3">
                    <h2 className="text-base font-semibold text-slate-100">
                        Consulta también
                    </h2>
                    <ProvinceLinks slugs={getRelatedProvinces(slug)} />
                </section>
            </main>
        </>
    );
}
