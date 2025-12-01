import React, { useState, useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
  existingSpouses?: string[];
  onAddChild: (name: string) => void;
  onEditName: (name: string) => void;
  onAddSpouse: (name: string) => void;
  onRemoveSpouse: (name: string) => void;
  onDelete: () => void;
  canDelete?: boolean;
};

const NodeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentName,
  existingSpouses = [],
  onAddChild,
  onEditName,
  onAddSpouse,
  onRemoveSpouse,
  onDelete,
  canDelete,
}) => {
  const [txt, setTxt] = useState(currentName || "");
  useEffect(() => setTxt(currentName || ""), [currentName]);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Focus trap & ESC
  useEffect(() => {
    if (!isOpen) return;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const dialog = dialogRef.current;
    if (firstInputRef.current) firstInputRef.current.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab' && dialog) {
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(el => !el.hasAttribute('disabled'));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade" aria-modal="true" role="dialog" aria-label="Modify Tree Node">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={dialogRef} className="relative w-full max-w-xl mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 animate-scale">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Modify Tree Node</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" aria-label="Close">✕</button>
        </div>
        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</label>
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-slate-100"
              value={txt}
              onChange={(e) => setTxt(e.target.value)}
              placeholder="Enter name"
              ref={firstInputRef}
            />
          </div>
          {existingSpouses.length > 0 && (
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Existing Spouses</label>
              <div className="flex flex-wrap gap-2">
                {existingSpouses.map((sp) => (
                  <div key={sp} className="flex items-center gap-1">
                    <input
                      readOnly
                      value={sp}
                      className="rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs text-slate-700 dark:text-slate-200 w-auto"
                    />
                    <button
                      onClick={() => onRemoveSpouse(sp)}
                      className="px-2 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-600/20"
                      title="Remove this spouse"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
          <button
            onClick={() => onAddChild(txt)}
            disabled={!txt}
            className="inline-flex items-center gap-1 rounded-md bg-brand-600 disabled:opacity-40 text-white px-3 py-2 text-xs font-semibold hover:bg-brand-500 transition"
          >Add Child</button>
          <button
            onClick={() => onAddSpouse(txt)}
            disabled={!txt}
            className="inline-flex items-center gap-1 rounded-md bg-purple-600 disabled:opacity-40 text-white px-3 py-2 text-xs font-semibold hover:bg-purple-500 transition"
          >Add Spouse</button>
          <button
            onClick={() => setTxt("")}
            disabled={!txt}
            className="inline-flex items-center gap-1 rounded-md border border-orange-400 text-orange-600 px-3 py-2 text-xs font-semibold hover:bg-orange-50 disabled:opacity-40 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-500/20"
          >Clear Input</button>
          <button
            onClick={() => onEditName(txt)}
            disabled={!txt || txt === currentName}
            className="inline-flex items-center gap-1 rounded-md border border-green-500 text-green-600 dark:text-green-400 px-3 py-2 text-xs font-semibold hover:bg-green-50 dark:hover:bg-green-500/20 disabled:opacity-40"
          >Save Name</button>
          <button
            onClick={() => onDelete()}
            disabled={!canDelete}
            className="inline-flex items-center gap-1 ml-auto rounded-md border border-red-500 text-red-600 dark:text-red-400 px-3 py-2 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-500/20 disabled:opacity-40"
          >Delete Node</button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
