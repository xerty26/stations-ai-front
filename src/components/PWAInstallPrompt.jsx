import React, { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [showIOSModal, setShowIOSModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // 1. Ocultar si ya está instalada / abierta en modo PWA standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        if (isStandalone) return;

        // 2. Comprobar si el usuario ya descartó el aviso en esta sesión
        const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
        if (isDismissed) return;

        // 3. Detectar si es dispositivo iOS (iPhone / iPad)
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        if (isIosDevice) {
            // Mostrar la alerta en iOS tras 2 segundos para no ser agresivo
            const timer = setTimeout(() => setShowPrompt(true), 2000);
            return () => clearTimeout(timer);
        }

        // 4. Capturar el evento de Android / Chrome
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            setShowIOSModal(true);
            return;
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Recordar que el usuario cerró el aviso durante la sesión actual
        sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <>
            {/* BANNER / ALERTA FLOTANTE INFERIOR */}
            <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-bounce-once">
                <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-slate-100">

                    {/* Logo + Texto */}
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src="/mark-128x128.png"
                            alt="GasOneClick"
                            className="w-10 h-10 shrink-0 object-contain p-1 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                        />
                        <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>Instalar GasOneClick</span>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                                    App
                                </span>
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                                Acceso rápido y ahorra en tu combustible
                            </p>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={handleInstall}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                        >
                            Instalar
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg text-xs"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </div>

                </div>
            </div>

            {/* MODAL INSTRUCTIVO DE PASOS PARA iOS */}
            {showIOSModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-slate-200 shadow-2xl relative">

                        <button
                            onClick={() => setShowIOSModal(false)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-white text-base font-bold p-1"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <img src="/mark-128x128.png" alt="GasOneClick" className="w-10 h-10 object-contain" />
                            <div>
                                <h3 className="font-bold text-white text-sm">Instalar en tu iPhone</h3>
                                <p className="text-xs text-slate-400">GasOneClick PWA</p>
                            </div>
                        </div>

                        <ol className="text-xs space-y-2.5 mb-5 text-slate-300">
                            <li className="flex items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                                <span className="text-base">1️⃣</span>
                                <span>Toca el icono <strong>Compartir</strong> <span className="text-emerald-400 font-bold">⎋</span> en la barra de Safari.</span>
                            </li>
                            <li className="flex items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                                <span className="text-base">2️⃣</span>
                                <span>Selecciona <strong>Añadir a la pantalla de inicio</strong> ➕</span>
                            </li>
                        </ol>

                        <button
                            onClick={() => setShowIOSModal(false)}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
                        >
                            Entendido
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}