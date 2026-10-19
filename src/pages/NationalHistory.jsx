import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import Header from '../components/Header';
import AdSense from '../components/AdSense';
import HistoryChart from '../components/HistoryChart';

// Utils
import { SITE_URL, formatName, formatPrice } from '../utils/format';
import { formatCents, formatChange, formatDate, summarizeHistory } from '../utils/history';
import { PROVINCE_NAMES } from '../utils/provinces';

const API_BASE_URL = import.meta.env.VITE_API_STATIONS_URL || '';

const FUEL_LABELS = {
    gasolina_95_e5: 'Gasolina 95',
    gasolina_98_e5: 'Gasolina 98',
    gasoleo_a: 'Diésel A',
    gasoleo_premium: 'Diésel A+',
};

const RANGES = [
    { days: 30, label: '30 días' },
    { days: 180, label: '6 meses' },
    { days: 365, label: '12 meses' },
];

const SORTS = [
    { key: 'name', label: 'Provincia' },
    { key: 'avg', label: 'Precio medio' },
    { key: 'change7', label: '7 días' },
    { key: 'change30', label: '30 días' },
];

const buttonClass = (active) =>
    `px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${active
        ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-semibold'
        : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:border-emerald-500/40'}`;

function Change({ value }) {
    if (value === null || value === undefined) return <span className="text-slate-600">–</span>;
    const color = value > 0 ? 'text-rose-400' : value < 0 ? 'text-emerald-400' : 'text-slate-400';

    return <span className={`font-semibold ${color}`}>{formatChange(value)}</span>;
}

export default function NationalHistory() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [fuel, setFuel] = useState('gasolina_95_e5');
    const [days, setDays] = useState(365);
    const [sort, setSort] = useState({ key: 'avg', direction: 1 });

    useEffect(() => {
        fetch(`${API_BASE_URL}/stations/history`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(setData)
            .catch((err) => {
                console.error('Error loading price history:', err.message);
                setError(true);
            });
    }, []);

    const series = data?.national[fuel];
    const points = series ? series.slice(-(days + 1)) : null;
    const summary = points?.length > 1 ? summarizeHistory(points) : null;

    const provinces = (data?.provinces || [])
        .filter((province) => province.fuels[fuel])
        .map((province) => ({
            slug: province.slug,
            name: PROVINCE_NAMES[province.slug] || formatName(province.name),
            ...province.fuels[fuel],
        }));
    const byChange = [...provinces].filter((province) => province.change30 !== null).sort((a, b) => a.change30 - b.change30);
    const byPrice = [...provinces].sort((a, b) => a.avg - b.avg);

    const sortedProvinces = [...provinces].sort((a, b) => {
        const first = a[sort.key] ?? Infinity;
        const second = b[sort.key] ?? Infinity;
        const order = sort.key === 'name' ? first.localeCompare(second, 'es') : first - second;
        return order * sort.direction;
    });

    const changeSort = (key) =>
        setSort((current) => ({ key, direction: current.key === key ? -current.direction : 1 }));

    return (
        <>
            <title>Histórico de precios de la gasolina y el diésel en España | GasOneClick</title>
            <meta name="description" content="Evolución del precio de la gasolina y el diésel en España durante el último año, con la media nacional, las variaciones por provincia y dónde está más barato repostar." />
            <link rel="canonical" href={`${SITE_URL}/historico-precios`} />
            {error && <meta name="robots" content="noindex" />}

            <Header />
            <main className="space-y-6">
                <header className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                        Histórico de precios de la gasolina y el diésel en España
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Cómo ha evolucionado en el último año el precio medio del litro de gasolina 95, gasolina 98, diésel A y diésel A+ en España. Cada día calculamos la media de todas las gasolineras de cada provincia con los precios que comunican al Ministerio para la Transición Ecológica, y la media nacional se pondera por el número de estaciones.
                    </p>
                    <Link to="/gasolineras" className="text-emerald-400 hover:text-emerald-300">Ver precios por provincia</Link>
                </header>

                {!data && !error && (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-10 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                        <div className="h-64 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                        <div className="h-64 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-slate-400">
                        No se ha podido cargar el histórico. <Link to="/gasolineras" className="text-emerald-400 hover:text-emerald-300">Ver precios por provincia</Link>
                    </p>
                )}

                {data && summary && (
                    <>
                        <section className="space-y-4">
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Carburante">
                                {Object.entries(FUEL_LABELS).map(([id, label]) => (
                                    <button key={id} type="button" onClick={() => setFuel(id)} className={buttonClass(fuel === id) + ' hover:text-emerald-300 cursor-pointer'} aria-pressed={fuel === id}>
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-lg md:text-xl font-bold text-slate-100">
                                        Precio medio de {FUEL_LABELS[fuel].toLowerCase()} en España
                                    </h2>
                                    <div className="flex gap-2" role="group" aria-label="Periodo">
                                        {RANGES.map((range) => (
                                            <button key={range.days} type="button" onClick={() => setDays(range.days)} className={buttonClass(days === range.days) + ' hover:text-emerald-300 cursor-pointer'} aria-pressed={days === range.days}>
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <HistoryChart points={points} label={`Evolución del precio medio de ${FUEL_LABELS[fuel]} en España`} />

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 space-y-1">
                                        <p className="text-slate-400">Hoy</p>
                                        <p className="text-lg font-bold text-slate-100">{formatPrice(summary.current.avg)} €/L</p>
                                    </div>
                                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 space-y-1">
                                        <p className="text-slate-400">Cambio en 7 / 30 días</p>
                                        <p><Change value={summary.change7} /> · <Change value={summary.change30} /></p>
                                    </div>
                                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 space-y-1">
                                        <p className="text-slate-400">Más barato del periodo</p>
                                        <p className="font-bold text-slate-100">{formatPrice(summary.lowest.avg)} €/L</p>
                                        <p className="text-slate-500">{formatDate(summary.lowest.date)}</p>
                                    </div>
                                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 space-y-1">
                                        <p className="text-slate-400">Más caro del periodo</p>
                                        <p className="font-bold text-slate-100">{formatPrice(summary.highest.avg)} €/L</p>
                                        <p className="text-slate-500">{formatDate(summary.highest.date)}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {summary.change30 !== null && <>
                                        En los últimos 30 días el precio medio de la {FUEL_LABELS[fuel].toLowerCase()} {summary.change30 > 0 ? 'ha subido' : summary.change30 < 0 ? 'ha bajado' : 'se ha mantenido'}
                                        {summary.change30 !== 0 && <> {formatCents(Math.abs(summary.change30))}</>} y se sitúa en {formatPrice(summary.current.avg)} €/L.{' '}
                                    </>}
                                    {byPrice.length > 0 && <>
                                        Hoy la provincia más barata es {byPrice[0].name} ({formatPrice(byPrice[0].avg)} €/L) y la más cara, {byPrice[byPrice.length - 1].name} ({formatPrice(byPrice[byPrice.length - 1].avg)} €/L).{' '}
                                    </>}
                                    {byChange.length > 1 && <>
                                        En el último mes ha bajado más {byChange[0].name} ({formatChange(byChange[0].change30)}) y ha subido más {byChange[byChange.length - 1].name} ({formatChange(byChange[byChange.length - 1].change30)}).
                                    </>}
                                </p>
                            </div>
                        </section>

                        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                            <h2 className="text-lg md:text-xl font-bold text-slate-100">
                                Precio de {FUEL_LABELS[fuel].toLowerCase()} por provincia
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-slate-400 border-b border-slate-800">
                                            {SORTS.map(({ key, label }) => (
                                                <th key={key} className={`py-2 font-medium ${key === 'name' ? '' : 'text-right'}`} aria-sort={sort.key === key ? (sort.direction === 1 ? 'ascending' : 'descending') : 'none'}>
                                                    <button type="button" onClick={() => changeSort(key)} className="hover:text-emerald-400">
                                                        {label}{sort.key === key && (sort.direction === 1 ? ' ↑' : ' ↓')}
                                                    </button>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {sortedProvinces.map((province) => (
                                            <tr key={province.slug}>
                                                <td className="py-2">
                                                    <Link to={`/gasolineras/${province.slug}`} className="text-slate-200 hover:text-emerald-400">{province.name}</Link>
                                                </td>
                                                <td className="py-2 text-right font-semibold text-slate-100">{formatPrice(province.avg)} €</td>
                                                <td className="py-2 text-right text-xs"><Change value={province.change7} /></td>
                                                <td className="py-2 text-right text-xs"><Change value={province.change30} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                    <h2 className="text-lg md:text-xl font-bold text-slate-100">
                        De qué depende el precio del carburante
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        El precio que ves en el surtidor suma el coste del crudo (el barril Brent cotizado en dólares, por lo que el tipo de cambio también influye), el refino y el transporte, los impuestos (el impuesto especial de hidrocarburos y el IVA) y el margen de cada gasolinera. Los impuestos son un importe fijo por litro más un porcentaje, así que amortiguan las subidas y bajadas del crudo: una variación grande del barril se traduce en un cambio menor en el precio final.
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Las variaciones del crudo tardan entre una y dos semanas en notarse en el surtidor. La gasolina y el diésel no se mueven a la vez, porque cada uno depende de su propio mercado de refino, y por eso la distancia entre ambos cambia a lo largo del año. Cada provincia añade además diferencias propias, como la competencia entre estaciones, el peso de las gasolineras low cost o la distancia a las refinerías y los puertos.
                    </p>
                </section>

                {data && summary && <AdSense />}
            </main>
        </>
    );
}
