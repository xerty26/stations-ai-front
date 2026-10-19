import { formatPrice } from '../utils/format';
import { formatDate } from '../utils/history';

const WIDTH = 600;
const HEIGHT = 220;
const MARGIN = { top: 12, right: 12, bottom: 24, left: 52 };

export default function HistoryChart({ points, label }) {
    const values = points.map((point) => point.avg);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    const x = (index) => MARGIN.left + (index / (points.length - 1)) * innerWidth;
    const y = (value) => MARGIN.top + (1 - (value - min) / range) * innerHeight;
    const line = points.map((point, index) => `${x(index).toFixed(1)},${y(point.avg).toFixed(1)}`).join(' ');
    const area = `${MARGIN.left},${HEIGHT - MARGIN.bottom} ${line} ${x(points.length - 1).toFixed(1)},${HEIGHT - MARGIN.bottom}`;
    const ticks = [max, (max + min) / 2, min];

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} className="w-full h-auto text-emerald-400">
            {ticks.map((tick) => (
                <g key={tick}>
                    <line x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={y(tick)} y2={y(tick)} className="stroke-slate-800" strokeWidth="1" />
                    <text x={MARGIN.left - 6} y={y(tick) + 3} textAnchor="end" className="fill-slate-500 text-[10px]">{formatPrice(tick)}</text>
                </g>
            ))}
            <polygon points={area} fill="currentColor" opacity="0.1" />
            <polyline points={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <text x={MARGIN.left} y={HEIGHT - 6} className="fill-slate-500 text-[10px]">{formatDate(points[0].date)}</text>
            <text x={WIDTH - MARGIN.right} y={HEIGHT - 6} textAnchor="end" className="fill-slate-500 text-[10px]">{formatDate(points[points.length - 1].date)}</text>
        </svg>
    );
}
