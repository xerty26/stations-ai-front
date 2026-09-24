import React from 'react';

export default function SeoExtraContent() {
    return (
        <section className="w-full space-y-10 text-slate-300">
            <article className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight text-center">
                    ¿Por qué usar GasOneClick para buscar gasolineras baratas?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-3 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                            ⚡
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100">
                            Precios de Gasolina en Tiempo Real
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                            Sincronización directa con el <strong className="text-slate-300">Geoportal de Gasolineras del Ministerio</strong>. Consulta los datos actualizados del litro de carburante en tiempo real sin desfases.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-3 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                            📍
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100">
                            Gasolineras Cerca de Mi Ubicación
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                            Activa tu <strong className="text-slate-300">geolocalización GPS</strong> para calcular la distancia exacta y filtrar las estaciones de servicio más cercanas en un radio de 5km, 10km, 20km o 30km.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-3 backdrop-blur-sm hover:border-slate-700/80 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                            💶
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100">
                            Ahorro Real en Cada Repostaje
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                            Compara precios entre estaciones <strong className="text-slate-300">low cost y marcas tradicionales</strong> (Repsol, Cepsa, BP, Plenoil, Ballenoil) para ahorrar hasta 15€ por depósito.
                        </p>
                    </div>
                </div>
            </article>
            <article className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                    Comparador de Precios de Combustible en España: Diésel, Gasolina y Alternativos
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed">
                    Encontrar la <strong className="text-slate-200">gasolinera más barata hoy</strong> es fundamental para optimizar el presupuesto mensual de transporte. El precio del barril de petróleo Brent y las fluctuaciones del mercado energético provocan variaciones diarias en el importe del litro de combustible en las distintas comunidades autónomas y provincias.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
                            <span>⛽</span> Tipos de Carburante Disponibles
                        </h3>
                        <ul className="text-xs md:text-sm text-slate-400 space-y-2 list-disc list-inside">
                            <li><strong className="text-slate-300">Gasolina 95 Octanos (E5 / E10):</strong> El combustible estándar para vehículos de gasolina.</li>
                            <li><strong className="text-slate-300">Gasolina 98 Octanos:</strong> Para motores de alto rendimiento y alta compresión.</li>
                            <li><strong className="text-slate-300">Diésel A (Gasóleo A):</strong> La opción más común para turismos y furgonetas diésel.</li>
                            <li><strong className="text-slate-300">Gasóleo Premium / Diésel Plus:</strong> Con aditivos especiales para limpieza de inyectores.</li>
                            <li><strong className="text-slate-300">GLP y GNC:</strong> Gases licuados y comprimidos para vehículos con etiqueta ECO.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
                            <span>💡</span> Consejos para Ahorrar Gasolina
                        </h3>
                        <ul className="text-xs md:text-sm text-slate-400 space-y-2 list-disc list-inside">
                            <li><strong className="text-slate-300">Planifica tu ruta:</strong> Evita desplazamientos innecesarios buscando la estación más barata sobre la marcha.</li>
                            <li><strong className="text-slate-300">Surtidores automáticos:</strong> Las gasolineras desatendidas suelen ofrecer tarifas más reducidas.</li>
                            <li><strong className="text-slate-300">Presión de neumáticos:</strong> Circular con la presión correcta reduce el consumo hasta un 3%.</li>
                            <li><strong className="text-slate-300">Conducción eficiente:</strong> Mantén velocidades uniformes y utiliza marchas largas.</li>
                        </ul>
                    </div>
                </div>
            </article>
            <article className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-sm shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                    Preguntas Frecuentes sobre Gasolineras y Carburantes
                </h2>

                <div className="space-y-3">
                    <details className="group border border-slate-800 rounded-xl bg-slate-950/50 p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:border-slate-700">
                        <summary className="flex items-center justify-between font-medium text-slate-200 text-sm md:text-base">
                            <span>¿Cómo funciona la búsqueda de gasolineras por GPS en GasOneClick?</span>
                            <span className="ml-2 transition-transform duration-300 group-open:rotate-180 text-emerald-400">▼</span>
                        </summary>
                        <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                            Al hacer clic en "GPS Activo", la aplicación detecta tus coordenadas actuales (sin almacenar ningún dato privado) y realiza una consulta en tiempo real para listar las estaciones de servicio ordenadas por precio y distancia dentro del radio seleccionado.
                        </p>
                    </details>

                    <details className="group border border-slate-800 rounded-xl bg-slate-950/50 p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:border-slate-700">
                        <summary className="flex items-center justify-between font-medium text-slate-200 text-sm md:text-base">
                            <span>¿Es fiable el precio del diésel, la gasolina y los combustibles mostrados?</span>
                            <span className="ml-2 transition-transform duration-300 group-open:rotate-180 text-emerald-400">▼</span>
                        </summary>
                        <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                            Sí. Toda la información procede del Ministerio para la Transición Ecológica y el Reto Demográfico. Las estaciones de servicio tienen la obligación legal de reportar cualquier cambio de tarifa inmediatamente.
                        </p>
                    </details>

                    <details className="group border border-slate-800 rounded-xl bg-slate-950/50 p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:border-slate-700">
                        <summary className="flex items-center justify-between font-medium text-slate-200 text-sm md:text-base">
                            <span>¿Qué diferencia hay entre la gasolina 95 y la gasolina 98?</span>
                            <span className="ml-2 transition-transform duration-300 group-open:rotate-180 text-emerald-400">▼</span>
                        </summary>
                        <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                            La principal diferencia radica en el octanaje (resistencia a la detonación). La gasolina 98 está indicada para motores de alta gama o deportivos que requieren mayor compresión. Para la inmensa mayoría de los turismos, la gasolina 95 es la recomendada por el fabricante y la más económica.
                        </p>
                    </details>
                </div>
            </article>
        </section>
    );
}