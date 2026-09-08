export default function FrequentSearches({ searches, onSelectSearch, onDeleteSearch }) {
    if (!searches || searches.length === 0) return null;

    return (
        <div className="w-full my-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">Búsquedas recientes:</p>
            <div className="flex flex-wrap gap-2">
                {searches.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-full px-3 py-1 text-xs text-slate-200 transition-colors cursor-pointer group"
                    >
                        <span onClick={() => onSelectSearch(item)} className="flex items-center gap-1 font-medium">
                            📍 {item.hour || `${item.lat.toFixed(2)}, ${item.lng.toFixed(2)}`}
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">
                                ({item.fuel.includes('gasolina') ? '95' : 'Diesel'})
                            </span>
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSearch(item.id);
                            }}
                            className="text-slate-500 hover:text-red-400 font-bold ml-1 text-xs"
                            title="Eliminar"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}