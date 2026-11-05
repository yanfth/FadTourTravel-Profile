export default function Toast({ toast }) {
  const isVisible = Boolean(toast?.show);

  return (
    <div
      id="fad-toast"
      className={`fixed top-20 right-4 sm:right-8 z-[95] max-w-sm transform transition-transform duration-500 bg-slate-950/92 backdrop-blur-xl border border-white/15 text-white rounded-2xl px-4 py-3.5 shadow-2xl flex items-start gap-3 ${
        isVisible ? 'translate-x-0' : 'translate-x-[150%]'
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-[#EF3340] text-white flex items-center justify-center shrink-0 font-bold text-xs">
        ✓
      </div>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-white">
          {toast?.title || 'FAD Tour & Travel'}
        </p>
        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
          {toast?.msg || 'Rute perjalanan berhasil diperbarui.'}
        </p>
      </div>
    </div>
  );
}
