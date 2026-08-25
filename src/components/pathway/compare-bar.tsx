'use client';

export function CompareBar({
  selectedCount,
  onCompare,
  onActionPlan,
  onClear
}: {
  selectedCount: number;
  onCompare: () => void;
  onActionPlan: () => void;
  onClear: () => void;
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-slide-in">
      <div className="font-medium">
        <span className="font-bold text-brand-400">{selectedCount}</span> selected
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onCompare}
          disabled={selectedCount < 2}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-full font-semibold transition-colors text-sm"
        >
          Compare
        </button>
        <button 
          onClick={onActionPlan}
          className="bg-brand-500 hover:bg-brand-400 text-slate-900 px-4 py-2 rounded-full font-bold transition-colors text-sm"
        >
          Get Action Plan
        </button>
        <button 
          onClick={onClear}
          className="text-slate-400 hover:text-white px-2 py-2 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
