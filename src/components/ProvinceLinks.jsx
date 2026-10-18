import { Link } from 'react-router-dom';
import { PROVINCE_NAMES } from '../utils/provinces';

export default function ProvinceLinks({ slugs }) {
    return (
        <ul className="flex flex-wrap gap-2">
            {slugs.map((slug) => (
                <li key={slug}>
                    <Link
                        to={`/gasolineras/${slug}`}
                        className="inline-block bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-1.5 text-xs md:text-sm text-slate-200 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                    >
                        {PROVINCE_NAMES[slug] || slug}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
