import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-950/60 backdrop-blur-md py-6 px-4 mt-auto">
            <div className="max-w-md mx-auto flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-sm">
                    <span className="text-emerald-400">⚡</span> GasOneClick
                </div>
                <nav className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                    <Link to="/legal" className="hover:text-emerald-400 transition-colors cursor-pointer">
                        Aviso Legal
                    </Link>
                    <span className="text-slate-700">·</span>
                    <Link to="/legal?tab=privacidad" className="hover:text-emerald-400 transition-colors cursor-pointer">
                        Privacidad y GPS
                    </Link>
                    <span className="text-slate-700">·</span>
                    <Link to="/legal?tab=terminos" className="hover:text-emerald-400 transition-colors cursor-pointer">
                        Términos del Servicio
                    </Link>
                    <span className="text-slate-700">·</span>
                    <Link to="/legal?tab=cookies" className="hover:text-emerald-400 transition-colors cursor-pointer">
                        Política de Cookies
                    </Link>
                </nav>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                    Precios obtenidos de fuentes oficiales en tiempo real. ©{new Date().getFullYear()} GasOneClick.
                </p>
            </div>
        </footer>
    );
}