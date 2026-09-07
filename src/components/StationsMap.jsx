import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const createUserMarkerIcon = () => L.divIcon({
    className: 'custom-user-pin',
    html: `
    <div class="relative flex items-center justify-center w-6 h-6">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white shadow-md"></span>
    </div>
  `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const createBestOptionMarkerIcon = () => L.divIcon({
    className: 'custom-best-pin',
    html: `
    <div class="relative group cursor-pointer">
      <div class="flex items-center justify-center w-10 h-10 bg-emerald-500 text-slate-950 font-extrabold rounded-full border-2 border-white shadow-xl shadow-emerald-500/50 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
        🏆
      </div>
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-emerald-500"></div>
    </div>
  `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
});

const createStandardMarkerIcon = (rank) => L.divIcon({
    className: 'custom-station-pin',
    html: `
    <div class="relative group cursor-pointer">
      <div class="flex items-center justify-center w-8 h-8 bg-slate-900 text-emerald-400 font-bold rounded-full border-2 border-slate-700 shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform text-xs">
        ${rank}
      </div>
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-slate-900"></div>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
});

function MapController({ bounds }) {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
        }
    }, [bounds, map]);
    return null;
}

export default function StationsMap({ userCoords, stations, bestOptionAddress }) {
    if (!userCoords || !stations || !Array.isArray(stations) || stations.length === 0) return null;
    
    const validStations = stations.map((st) => {
        let lat = NaN;
        let lng = NaN;

        if (st.latitud || st.lat) lat = parseFloat(st.latitud ?? st.lat);
        if (st.longitud || st.lng) lng = parseFloat(st.longitud ?? st.lng);

        const mapUrl = st.google_maps_url || st.url_maps;
        if ((isNaN(lat) || isNaN(lng)) && mapUrl) {
            try {
                const match = mapUrl.match(/(?:query=|destination=|=|@)([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);
                if (match) {
                    lat = parseFloat(match[1]);
                    lng = parseFloat(match[2]);
                }
            } catch (e) {
                console.warn("Error parseando coordenadas:", e);
            }
        }

        const isBest = bestOptionAddress && (
            st.address?.toLowerCase().includes(bestOptionAddress.toLowerCase()) ||
            bestOptionAddress.toLowerCase().includes(st.address?.toLowerCase())
        );

        return { ...st, parsedLat: lat, parsedLng: lng, isBest };
    }).filter((st) => !isNaN(st.parsedLat) && !isNaN(st.parsedLng) && st.parsedLat !== 0);

    if (validStations.length === 0) return null;

    const bounds = [
        [userCoords.lat, userCoords.lng],
        ...validStations.map((s) => [s.parsedLat, s.parsedLng])
    ];


    return (
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl relative bg-slate-900 z-0">
            <MapContainer
                center={[userCoords.lat, userCoords.lng]}
                zoom={12}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController bounds={bounds} />
                <Marker position={[userCoords.lat, userCoords.lng]} icon={createUserMarkerIcon()}>
                    <Popup>
                        <div className="text-xs font-bold text-slate-900">Tu Ubicación</div>
                    </Popup>
                </Marker>
                {validStations.map((st, idx) => {
                    const isTopOption = st.isBest || idx === 0;
                    const markerIcon = isTopOption
                        ? createBestOptionMarkerIcon()
                        : createStandardMarkerIcon(idx + 1);

                    return (
                        <Marker
                            key={st.id || idx}
                            position={[st.parsedLat, st.parsedLng]}
                            icon={markerIcon}
                        >
                            <Popup>
                                <div className="text-xs space-y-1 p-0.5">
                                    <div className="flex items-center space-x-1">
                                        {isTopOption && <span className="text-xs">🏆</span>}
                                        <strong className="block text-sm text-slate-900 font-bold">
                                            {idx + 1}. {st.label || st.nombre}
                                        </strong>
                                    </div>
                                    <p className="text-slate-600">{st.address || st.direccion}</p>
                                    <div className="pt-1 flex items-center justify-between font-bold">
                                        <span className="text-emerald-600 text-sm">{st.price?.toFixed(3)} €/L</span>
                                        <span className="text-slate-500 text-[11px]">{st.distancia_km} km</span>
                                    </div>
                                    {st.google_maps_url && (
                                        <a
                                            href={st.google_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="!text-white mt-2 flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition text-[11px] shadow-sm no-underline"
                                        >
                                            <span>Cómo llegar</span>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}