import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, ArrowLeft, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import Header from '../components/Header';

export default function Legal() {
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'legal'; // 'legal' | 'privacidad' | 'cookies' | 'terminos'
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <>
            <Header />
            <div className="max-w-md mx-auto w-full p-4 pb-12">
                {/* Botón de retorno al inicio */}
                <div className="mb-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a la búsqueda
                    </Link>
                </div>

                {/* Encabezado */}
                <div className="mb-6 space-y-1">
                    <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        Información Legal y Privacidad
                    </h1>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Transparencia sobre el tratamiento de datos, origen de información, publicidad y términos de uso.
                    </p>
                </div>

                {/* Selector de Pestañas / Tabs */}
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6 gap-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('legal')}
                        className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'legal'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Aviso Legal
                    </button>
                    <button
                        onClick={() => setActiveTab('privacidad')}
                        className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'privacidad'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Privacidad & GPS
                    </button>
                    <button
                        onClick={() => setActiveTab('cookies')}
                        className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'cookies'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Cookies & Anuncios
                    </button>
                    <button
                        onClick={() => setActiveTab('terminos')}
                        className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === 'terminos'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Términos
                    </button>
                </div>

                {/* Contenido de los textos legales */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-4 leading-relaxed backdrop-blur-sm">

                    {/* TAB 1: AVISO LEGAL */}
                    {activeTab === 'legal' && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <section className="space-y-2">
                                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-emerald-400" />
                                    1. Datos Identificativos (LSSI-CE)
                                </h2>
                                <p>
                                    En cumplimiento con el artículo 10 de la Ley 34/2002 (LSSI-CE), se informa que la PWA <strong>GasOneClick</strong> es una plataforma independiente de consulta de precios de carburante.
                                </p>
                                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800/80 space-y-1 text-slate-400">
                                    <p><strong className="text-slate-300">Denominación:</strong> GasOneClick</p>
                                    <p><strong className="text-slate-300">Contacto:</strong> contacto@gasoneclick.es</p>
                                    <p><strong className="text-slate-300">Alojamiento:</strong> Vercel Inc.</p>
                                </div>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-sm font-semibold text-slate-100">2. Propiedad Intelectual</h2>
                                <p>
                                    El código fuente, diseño, logotipos y marca GasOneClick son propiedad exclusiva del proyecto. Queda prohibida la reproducción total o parcial sin consentimiento.
                                </p>
                            </section>
                        </div>
                    )}

                    {/* TAB 2: PRIVACIDAD Y GPS */}
                    {activeTab === 'privacidad' && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <section className="space-y-2">
                                <h2 className="text-sm font-semibold text-slate-100">1. Tratamiento de Datos Personales (RGPD)</h2>
                                <p>
                                    GasOneClick cumple estrictamente con el Reglamento General de Protección de Datos (RGPD). No recopilamos nombres, correos electrónicos ni datos sensibles de usuario para el uso de la aplicación.
                                </p>
                            </section>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-2">
                                <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                                    📍 Geolocalización (GPS)
                                </p>
                                <p className="text-slate-300">
                                    La ubicación geográfica obtenida mediante el navegador se procesa <strong>exclusivamente en tiempo real dentro de tu propio dispositivo</strong> para mostrar las estaciones de servicio más cercanas.
                                </p>
                                <p className="text-slate-400 text-[11px]">
                                    • Tu posición exacta nunca se almacena en nuestros servidores ni se vincula a tu identidad.
                                </p>
                            </div>

                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 space-y-2">
                                <p className="font-semibold text-slate-200">💾 Almacenamiento Local (localStorage)</p>
                                <p>
                                    Utilizamos la memoria interna de tu navegador para guardar preferencias funcionales:
                                </p>
                                <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                                    <li>Historial de búsquedas recientes.</li>
                                    <li>Combustible seleccionado por defecto.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: COOKIES Y PUBLICIDAD GOOGLE ADS */}
                    {activeTab === 'cookies' && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <section className="space-y-2">
                                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                    <Cookie className="w-4 h-4 text-emerald-400" />
                                    1. Uso de Publicidad y Cookies de Terceros
                                </h2>
                                <p>
                                    GasOneClick utiliza proveedores publicitarios de terceros, incluyendo **Google AdSense**, para financiar el mantenimiento del servicio y el consumo de servidor.
                                </p>
                            </section>

                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 space-y-2">
                                <p className="font-semibold text-slate-200">🤖 Políticas de Google AdSense</p>
                                <p className="text-slate-300">
                                    Google utiliza cookies para publicar anuncios en este sitio web basándose en las visitas anteriores del usuario a este u otros sitios web.
                                </p>
                                <ul className="list-disc list-inside text-slate-400 space-y-1.5 pl-1 text-[11px]">
                                    <li>
                                        El uso de cookies publicitarias permite a Google y a sus socios mostrar anuncios basados en las visitas realizadas por los usuarios a sus sitios o a otros sitios de Internet.
                                    </li>
                                    <li>
                                        Los usuarios pueden inhabilitar la publicidad personalizada dirigiéndose a la <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Configuración de anuncios de Google</a>.
                                    </li>
                                </ul>
                            </div>

                            <section className="space-y-2">
                                <h2 className="text-sm font-semibold text-slate-100">2. Gestión y Rechazo de Cookies</h2>
                                <p>
                                    Puedes configurar tu navegador para rechazar o bloquear las cookies publicitarias en cualquier momento, o utilizar el banner de consentimiento que se muestra al acceder por primera vez. Para más información sobre el rechazo de cookies de proveedores terceros, puedes visitar <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">aboutads.info</a>.
                                </p>
                            </section>
                        </div>
                    )}

                    {/* TAB 4: TÉRMINOS DEL SERVICIO */}
                    {activeTab === 'terminos' && (
                        <div className="space-y-4 animate-in fade-in duration-150">
                            <section className="space-y-2">
                                <h2 className="text-sm font-semibold text-slate-100">1. Fuentes de Datos Oficiales</h2>
                                <p>
                                    Los precios e información de las gasolineras provienen del **Ministerio para la Transición Ecológica y el Reto Demográfico**.
                                </p>
                            </section>

                            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-2 text-amber-200/90">
                                <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Descargo de Responsabilidad
                                </p>
                                <p className="text-[11px] leading-relaxed">
                                    GasOneClick actúa como un agregador de datos públicos. No nos hacemos responsables de posibles imprecisiones temporales entre el precio mostrado en la app y el fijado finalmente en el surtidor.
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Pie de actualización */}
                <p className="text-[10px] text-center text-slate-500 mt-6">
                    Documento adaptado a las políticas de Google AdSense y RGPD. Última revisión: Septiembre 2026.
                </p>
            </div>
        </>
    );
}