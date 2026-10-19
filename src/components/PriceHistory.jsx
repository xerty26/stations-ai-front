import { formatPrice } from '../utils/format';
import { formatChange, summarizeHistory } from '../utils/history';
import { Link } from 'react-router-dom';

const WIDTH = 300;
const HEIGHT = 90;
const PADDING = 4;

function LineChart({ points, label }) {
    const values = points.map((point) => point.avg);
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    const line = points
        .map((point, index) => {
            const x = PADDING + (index / (points.length - 1)) * (WIDTH - 2 * PADDING);
            const y = PADDING + (1 - (point.avg - min) / range) * (HEIGHT - 2 * PADDING);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} className="w-full h-24 text-emerald-400">
            <polyline points={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
    );
}

function Change({ label, value }) {
    if (value === null) return null;
    const color = value > 0 ? 'text-rose-400' : value < 0 ? 'text-emerald-400' : 'text-slate-400';

    return (
        <span className="text-slate-500">
            {label} <span className={`font-semibold ${color}`}>{formatChange(value)}</span>
        </span>
    );
}

export default function PriceHistory({ name, history, fuelLabels }) {
    const fuels = Object.keys(fuelLabels).filter((fuel) => history[fuel]?.length > 1);
    if (fuels.length === 0) return null;

    const summaries = Object.fromEntries(fuels.map((fuel) => [fuel, summarizeHistory(history[fuel])]));

    return (
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-100">
                Evolución histórica del precio de los carburantes en {name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fuels.map((fuel) => {
                    const { current, change7, change30, lowest, highest } = summaries[fuel];

                    return (
                        <div key={fuel} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 space-y-2">
                            <div className="flex items-baseline justify-between">
                                <p className="text-sm font-semibold text-slate-200">{fuelLabels[fuel]}</p>
                                <p className="text-sm font-bold text-slate-100">{formatPrice(current.avg)} €/L</p>
                            </div>
                            <LineChart points={history[fuel]} label={`Precio medio de ${fuelLabels[fuel]} en ${name} durante el último año`} />
                            <div className="flex justify-between text-[11px] text-slate-500">
                                <span>Mín. {formatPrice(lowest.avg)} €</span>
                                <span>Máx. {formatPrice(highest.avg)} €</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 text-[11px]">
                                <Change label="7 días" value={change7} />
                                <Change label="30 días" value={change30} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-[11px] text-slate-500">
                Precio medio diario de todas las gasolineras de {name} según los datos del Ministerio para la Transición Ecológica.
            </p>
            <Link to="/historico-precios" className="text-emerald-400 hover:text-emerald-300">Ver histórico nacional</Link>
        </section>
    );
}
