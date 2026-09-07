import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Icono simple y limpio para el centro de selección
const centerIcon = L.divIcon({
    className: 'custom-center-pin',
    html: `
    <div class="flex items-center justify-center w-8 h-8 bg-emerald-500 text-white rounded-full border-2 border-white shadow-xl text-xs font-bold">
      📍
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

function ClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                isManual: true
            });
        },
    });
    return null;
}

function RecenterMap({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords?.lat && coords?.lng) {
            map.setView([coords.lat, coords.lng], map.getZoom());
        }
    }, [coords, map]);
    return null;
}

export default function SelectGpsMap({ coords, onCoordsChange, radiusKm = 5 }) {
    if (!coords) return null;

    // Convertir los kilómetros a metros para Leaflet
    const radiusInMeters = radiusKm * 1000;

    const handleDragEnd = (e) => {
        const latLng = e.target.getLatLng();
        onCoordsChange({
            lat: latLng.lat,
            lng: latLng.lng,
            isManual: true
        });
    };

    return (
        <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-700 shadow-xl relative bg-slate-900">
            <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={11}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ClickHandler onSelect={onCoordsChange} />
                <RecenterMap coords={coords} />

                {/* 1. CÍRCULO CON EL RADIO EN KILÓMETROS REALES */}
                <Circle
                    center={[coords.lat, coords.lng]}
                    radius={radiusInMeters}
                    pathOptions={{
                        color: '#10b981',
                        fillColor: '#10b981',
                        fillOpacity: 0.15,
                        weight: 2,
                        dashArray: '6, 6',
                        className: 'pulse-radius-circle'
                    }}
                />

                {/* 2. MARCADOR CENTRAL */}
                <Marker
                    position={[coords.lat, coords.lng]}
                    icon={centerIcon}
                    draggable={true}
                    eventHandlers={{ dragend: handleDragEnd }}
                >
                    <Popup className="custom-leaflet-popup">
                        <div className="text-xs p-1 font-semibold text-slate-800 text-center">
                            Radio de búsqueda: <strong>{radiusKm} km</strong>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}