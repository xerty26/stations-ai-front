import React, { useState, useEffect } from 'react';
import {
    Fuel,
    MapPin,
    Map,
    Navigation,
    Sparkles,
    RefreshCw,
    TrendingDown,
    Clock,
    ExternalLink,
    Search,
    SlidersHorizontal
} from 'lucide-react';

// Components
import StationsMap from './components/StationsMap';
import SelectGpsMap from './components/SelectGpsMap';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import FrequentSearches from './components/FrequentSearches';

// Hooks
import { useRecentSearches } from './hooks/useRecentSearches';

const API_BASE_URL = import.meta.env.VITE_API_STATIONS_URL || '';

const FUELS = [
    { id: 'gasolina_95_e5', label: 'Gasolina 95 E5' },
    { id: 'gasolina_98_e5', label: 'Gasolina 98 E5' },
    { id: 'gasoleo_a', label: 'Diésel / Gasóleo A' },
    { id: 'gasoleo_premium', label: 'Diésel / Gasóleo Premium' },
];

const RADIUS_OPTIONS = [5, 10, 20, 30];

export default function App() {
    const [coords, setCoords] = useState({ lat: 40.41683699839633, lng: -3.7034332752227788 });
    const [fuel, setFuel] = useState('gasoleo_a');
    const [radius, setRadius] = useState(10);
    const [liters, setLiters] = useState(50);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [usingGPS, setUsingGPS] = useState(false);
    const [openMapGPS, setOpenMapGPS] = useState(false);
    const [search, setSearch] = useState(false);

    const { searches, saveSearch, removeSearch } = useRecentSearches();

    useEffect(() => {
        getGPSLocation();
    }, []);

    const handleSearch = (searchData) => {
        setCoords({ lat: searchData.lat, lng: searchData.lng });
        setFuel(searchData.fuel);
        setRadius(searchData.radius);

        saveSearch(searchData);
        fetchReport(searchData);
    };

    const getGPSLocation = () => {
        if (!navigator.geolocation) {
            setError("Tu navegador no soporta geolocalización.");
            return;
        }
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setCoords(newCoords);
                    setUsingGPS(true);
                    setOpenMapGPS(false);
                },
                (err) => {
                    //setOpenMapGPS(true);
                    setUsingGPS(false);
                },
                { timeout: 8000 }
            );
        }
    };

    const getMapLocation = (openMapGps) => {
        setOpenMapGPS(openMapGps);
        setUsingGPS(false);
    };

    const fetchReport = async (searchData) => {
        const targetCoords = {lat: searchData.lat, lng: searchData.lng};
        const radius = searchData.radius;
        const fuel = searchData.fuel;
        setLoading(true);
        setError(null);

        try {
            if (!API_BASE_URL) {
                throw new Error('No se ha configurado la URL de la API');
            }
            const url = `${API_BASE_URL}/stations/nearby/report?user_lat=${targetCoords.lat}&user_lng=${targetCoords.lng}&radius_km=${radius}&fuel=${fuel}`;
            const res = await fetch(url);

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Error al conectar con el servidor');
            }

            const json = await res.json();
            setData(json);
            setError(null);
            setSearch(true);
        } catch (err) {
            setError('Error en el servidor, prueba más tarde');
            console.error('Error in server:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const bestOption = data?.ia?.best_option || null;
    const topStations = data?.top_estaciones || [];
    const minPrice = topStations.length > 0 ? topStations[0].price : 0 || 0;
    const maxPrice = topStations.length > 0 ? topStations[topStations.length - 1].price : 0 || 0;
    const minDistance = topStations.length > 0 ? topStations.filter(st => st.distancia_km > 0).sort((a, b) => a.distancia_km - b.distancia_km)[0].distancia_km : 0;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

            {/* CABECERA */}
            <header className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <picture className="flex items-center shrink-0">
                            <source media="(min-width: 1280px)" srcSet="/mark-512x512.png" />
                            <source media="(min-width: 1024px)" srcSet="/mark-192x192.png" />
                            <source media="(min-width: 640px)" srcSet="/mark-128x128.png" />
                            <img
                                src="/mark-64x64.png"
                                alt="GasOneClick Mark"
                                className="w-9 h-9 sm:w-10 sm:h-10 object-contain p-0 block"
                            />
                        </picture>
                        <picture className="flex items-center shrink-0 -ml-1">
                            <source media="(min-width: 1024px)" srcSet="/logo-horizontal-512x128.png" />
                            <source media="(min-width: 640px)" srcSet="/logo-horizontal-256x64.png" />
                            <img
                                src="/logo-horizontal-128x32.png"
                                alt="GasOneClick"
                                className="h-7 sm:h-8 w-auto object-contain block"
                            />
                        </picture>
                    </div>
                    <div className="flex items-center space-x-2 gap-1.5 sm:gap-2">
                        <button
                            onClick={() => getMapLocation(!openMapGPS)}
                            className={`flex items-center space-x-1 text-xs px-3 py-1.5 sm:px-3 sm:py-2 rounded-full border transition cursor-pointer ${openMapGPS
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                }`}
                        >
                            <Map className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{openMapGPS ? 'Mapa Activo' : 'Mapa desactivado'}</span>
                        </button>
                        <button
                            onClick={() => getGPSLocation(true)}
                            className={`flex items-center space-x-1 text-xs px-3 py-1.5 sm:px-3 sm:py-2 rounded-full border transition cursor-pointer ${usingGPS
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                }`}
                        >
                            <Navigation className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{usingGPS ? 'GPS Activo' : 'Usar mi GPS'}</span>
                        </button>
                    </div>
                </div>

                {/* PANEL DE FILTROS Y CONTROLES */}
                {search && (
                    <button
                        onClick={() => { setSearch(false); setUsingGPS(false); setOpenMapGPS(false); getGPSLocation(); }}
                        className="text-emerald-400 hover:text-emerald-300 text-xs cursor-pointer"
                    >
                        Volver a buscar
                    </button>
                )}
                {!search && (
                    <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 space-y-4">
                        <FrequentSearches 
                            searches={searches} 
                            onSelectSearch={(item) => handleSearch(item)} 
                            onDeleteSearch={removeSearch} 
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Tipo de Combustible</label>
                                <select
                                    value={fuel}
                                    onChange={(e) => setFuel(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:cursor-not-allowed"
                                >
                                    {FUELS.map((f) => (
                                        <option key={f.id} value={f.id}>{f.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Radio de Búsqueda</label>
                                <div className="flex space-x-2">
                                    {RADIUS_OPTIONS.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRadius(r)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed ${radius === r
                                                ? 'bg-emerald-500 text-slate-950'
                                                : 'bg-slate-900 text-slate-400 hover:bg-slate-700 border border-slate-700'
                                                }`}
                                        >
                                            {r} km
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {
                            !usingGPS && !openMapGPS && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-sm">
                                    No hay permisos para acceder a la localización, activa el GPS o prueba a seleccionar en el mapa.
                                    <button
                                        onClick={() => setOpenMapGPS(true)}
                                        className="text-emerald-400 hover:text-emerald-300 text-xs cursor-pointer"
                                    >
                                        Abrir mapa
                                    </button>
                                </div>
                            )
                        }
                        {openMapGPS && (
                            <SelectGpsMap
                                coords={coords}
                                onCoordsChange={(newCoords) => {
                                    setCoords(newCoords);
                                    setUsingGPS(false);
                                }}
                                radiusKm={radius}
                            />
                        )}

                        {/* BOTÓN PRINCIPAL DE BÚSQUEDA */}
                        <button
                            onClick={() => handleSearch({ hour:`${new Date().getHours()}:${new Date().getMinutes()}`, lat: coords.lat, lng: coords.lng, fuel, radius })}
                            disabled={loading || (!usingGPS && !openMapGPS)}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Analizando gasolineras...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    <span>Buscar la Mejor Gasolinera</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </header>

            {/* MANEJO DE ERRORES */}
            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-sm">
                    {error}
                </div>
            )}

            {/* SKELETON SCREEN MIENTRAS CARGA */}
            {loading && (
                <div className="space-y-4 animate-pulse">
                    <div className="h-44 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                    <div className="h-28 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                    <div className="h-64 bg-slate-800/50 rounded-2xl border border-slate-700/30"></div>
                </div>
            )}

            {/* MENSAJE INICIAL SI AÚN NO SE HA BUSCADO */}
            {!loading && !data && !error && (
                <div className="text-center py-12 px-4 bg-slate-800/20 rounded-2xl border border-slate-800/50 space-y-3">
                    <div className="inline-flex p-3 bg-slate-800 rounded-full text-slate-400">
                        <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-200">Ajusta tus criterios y busca</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Selecciona el tipo de combustible y el radio máximo para obtener las mejores opciones en tu zona en tiempo real.
                    </p>
                </div>
            )}

            {/* RESULTADOS */}
            {!loading && data && (
                <main className="space-y-6">
                    {/* HERO CARD: MEJOR OPCIÓN RECOMENDADA POR IA */}
                    {bestOption && (
                        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-medium">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Recomendación</span>
                                </span>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-emerald-400">{bestOption.precio?.toFixed(3)} €</span>
                                    <span className="text-xs text-slate-400 block">/ litro</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-white leading-snug">{bestOption.nombre}</h2>
                                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{bestOption.direccion}, {bestOption.municipio}</span>
                                </p>
                                {bestOption.horario && (
                                    <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                                        <Clock className="w-3.5 h-3.5 shrink-0" />
                                        <span>{bestOption.horario}</span>
                                    </p>
                                )}
                            </div>

                            {/* ESTIMACIÓN DE AHORRO */}
                            {maxPrice > bestOption.precio && (
                                <>
                                <span className="text-xs p-2 text-slate-300">Repostando ({liters}L vs. la gasolinera más cara):</span>
                                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
                                    <span className="text-slate-300">Ahorro est. :</span>
                                    <span className="font-bold text-emerald-400">
                                        +  {((maxPrice - bestOption.precio) * liters).toFixed(2)} €
                                    </span>
                                    <span className="text-slate-300">Ahorro mensual est. :</span>
                                    <span className="font-bold text-emerald-400">
                                        + {((maxPrice - bestOption.precio) * liters * 4).toFixed(2)} €
                                    </span>
                                </div>
                                </>
                            )}

                            {/* BOTÓN NAVEGACIÓN */}
                            {bestOption.google_maps_url && (
                                <a
                                    href={bestOption.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-sm shadow-lg shadow-emerald-500/10"
                                >
                                    <span>Ir con Google Maps</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    )}

                    {/* INSIGHTS DE IA */}
                    {data.ia?.saving_advice && (
                        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40 space-y-2">
                            <div className="flex items-center space-x-2 text-amber-400">
                                <Sparkles className="w-4 h-4" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Consejo de Ahorro</h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{data.ia.saving_advice}</p>
                        </div>
                    )}

                    {/* RANKING TOP 5 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
                            <TrendingDown className="w-4 h-4 text-emerald-400" />
                            <span>Las 5 Gasolineras más baratas en la zona</span>
                        </h3>

                        <div className="space-y-2">
                            <StationsMap className="w-full h-80 rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl relative bg-slate-900 z-0"
                                userCoords={coords}
                                stations={data.top_estaciones}
                                bestOptionAddress={bestOption?.direccion}
                            />
                            {topStations.map((st, idx) => {
                                const diffWithMin = st.price - minPrice;
                                const diffWithMax = st.price === maxPrice;
                                return (
                                    <div key={st.id || idx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/40 flex items-center justify-between text-xs space-x-3">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-[10px]">
                                                {idx + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white truncate">{st.label}</p>
                                                <p className="text-slate-400 truncate text-[11px]">{st.address}
                                                    <span className={`ml-1 ${minDistance === st.distancia_km? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>({st.distancia_km} km)</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-sm text-white block">{st.price?.toFixed(3)} €</span>
                                            <span className={`text-[10px] ${diffWithMin === 0 ? 'text-emerald-400 font-semibold' : diffWithMax ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                                                {diffWithMin === 0 ? 'Más barata' : diffWithMax ? 'Más cara' : `+${diffWithMin.toFixed(3)} €`}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </main>
            )}

            <PWAInstallPrompt />
        </div>
    );
}