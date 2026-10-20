import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Utils
import { formatPrice } from '../utils/format';
import { formatCents, formatChange, formatDate } from '../utils/history';

const API_BASE_URL = import.meta.env.VITE_API_STATIONS_URL || '';

const FUELS = [
    { id: 'gasoleo_a', label: 'Diésel A' },
    { id: 'gasolina_95_e5', label: 'Gasolina 95' },
];

const DAILY_ALERT = 0.01;
const WEEKLY_ALERT = 0.03;
const STREAK_ALERT = 3;

const getAlert = (label, { change1, change7, streak }) => {
    if (change1 >= DAILY_ALERT) return { up: true, text: `${label} ha subido ${formatCents(change1)} desde ayer.` };
    if (change1 <= -DAILY_ALERT) return { up: false, text: `${label} ha bajado ${formatCents(-change1)} desde ayer.` };
    if (streak >= STREAK_ALERT && change7 >= WEEKLY_ALERT)
        return { up: true, text: `${label} lleva ${streak} días subiendo: ${formatCents(change7)} más que hace una semana.` };
    if (streak <= -STREAK_ALERT && change7 <= -WEEKLY_ALERT)
        return { up: false, text: `${label} lleva ${-streak} días bajando: ${formatCents(-change7)} menos que hace una semana.` };
    return null;
};

const changeClass = (value) => (value > 0 ? 'text-rose-400' : value < 0 ? 'text-emerald-400' : 'text-slate-400');

export default function TodayPrices() {
    const [data, setData] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stations/today`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then(setData)
            .catch(() => setFailed(true));
    }, []);

    if (failed) return null;

    if (!data) {
        return <div className="h-36 rounded-2xl bg-slate-800/40 border border-slate-700/50 animate-pulse" />;
    }

    const fuels = FUELS.filter((fuel) => data.fuels[fuel.id]);
    const alerts = fuels.map((fuel) => getAlert(fuel.label, data.fuels[fuel.id])).filter(Boolean);

    return (
        <section className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 space-y-3">
            <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-200">Precio medio hoy en España</h2>
                <span className="text-[11px] text-slate-500">{formatDate(data.date)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {fuels.map(({ id, label }) => {
                    const fuel = data.fuels[id];
                    return (
                        <div key={id} className="bg-slate-900/60 rounded-xl p-3">
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="text-xl font-bold text-white">{formatPrice(fuel.avg)} €/L</p>
                            {fuel.change7 !== null && (
                                <p className={`text-[11px] ${changeClass(fuel.change7)}`}>
                                    {formatChange(fuel.change7)} en 7 días
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
            {alerts.map((alert) => (
                <p
                    key={alert.text}
                    className={`text-xs rounded-lg px-3 py-2 border ${alert.up
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}
                >
                    {alert.up ? '▲' : '▼'} {alert.text}
                </p>
            ))}
            <Link to="/historico-precios" className="inline-block text-xs text-emerald-400 hover:text-emerald-300">
                Ver histórico de precios →
            </Link>
        </section>
    );
}
