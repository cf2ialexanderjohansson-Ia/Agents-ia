import { useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, X, Image as ImageIcon, ImagePlus } from "lucide-react";
import { NAVY, NAVY2, ORANGE, LIGHT, GREY, LINE, SUBTLE } from "./store.js";

/* ---------- éditeur (panneaux de saisie) — habillage "app", style SaaS ---------- */
const FOCUS_RING = "0 0 0 3px rgba(237,111,8,0.14)";
const INPUT_BASE = "w-full text-sm rounded-lg border px-3 py-2 mt-1 bg-white outline-none transition-shadow duration-150";

function useFocusRing() {
  return {
    onFocus: (e) => { e.target.style.borderColor = ORANGE; e.target.style.boxShadow = FOCUS_RING; },
    onBlur: (e) => { e.target.style.borderColor = LINE; e.target.style.boxShadow = "none"; },
  };
}

export function AutoGrow({ value, onChange, className, style, placeholder }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }, [value]);
  return <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} rows={1} placeholder={placeholder}
    className={className} style={{ resize: "none", overflow: "hidden", ...style }} />;
}
export function Action({ onClick, icon, label, primary, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      style={primary
        ? { background: ORANGE, color: "#fff", boxShadow: "0 1px 2px rgba(237,111,8,0.35)" }
        : { background: "#fff", color: NAVY, border: `1px solid ${LINE}`, boxShadow: "0 1px 2px rgba(15,23,42,0.03)" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(0.97)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
    >
      {icon} {label}
    </button>
  );
}
export function Panel({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: `1px solid ${LINE}`, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <div className="font-bold text-[13.5px]" style={{ color: NAVY }}>{title}</div>
        </div>
      )}
      {children}
    </div>
  );
}
export function Toggle({ open, onClick, icon, title, hint }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 text-left group">
      <span className="inline-flex items-center justify-center rounded-lg shrink-0" style={{ width: 28, height: 28, background: "#FFF3EA" }}>{icon}</span>
      <span className="font-bold text-[13.5px]" style={{ color: NAVY }}>{title}</span>
      {hint && <span className="text-xs" style={{ color: GREY }}>{hint}</span>}
      <span className="flex-1" />
      <span className="rounded-md p-1 transition-transform duration-150" style={{ transform: open ? "rotate(0deg)" : "rotate(0deg)" }}>
        {open ? <ChevronDown size={16} color={GREY} /> : <ChevronRight size={16} color={GREY} />}
      </span>
    </button>
  );
}
export function Field({ label, v, onChange, placeholder }) {
  const focus = useFocusRing();
  return (
    <label className="block mb-2.5">
      {label && <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREY }}>{label}</span>}
      <input value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={INPUT_BASE} style={{ borderColor: LINE }} {...focus} />
    </label>
  );
}
export function Select({ label, v, onChange, options }) {
  const focus = useFocusRing();
  return (
    <label className="block mb-2.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREY }}>{label}</span>
      <select value={v} onChange={(e) => onChange(e.target.value)} className={INPUT_BASE + " cursor-pointer"} style={{ borderColor: LINE }} {...focus}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
export function Area({ label, v, onChange, rows = 3, placeholder, mono }) {
  const focus = useFocusRing();
  return (
    <label className="block mb-2.5">
      {label && <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: GREY }}>{label}</span>}
      <textarea value={v} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className={INPUT_BASE + " resize-none"}
        style={{ borderColor: LINE, fontFamily: mono ? "ui-monospace, monospace" : "inherit", fontSize: mono ? 12 : 14 }} {...focus} />
    </label>
  );
}
export function Uploader({ label, hint, img, onPick, onClear, thumbBg }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: GREY }}>{label} <span className="font-normal normal-case">· {hint}</span></div>
      {img ? (
        <div className="relative rounded-lg overflow-hidden flex items-center justify-center" style={{ border: `1px solid ${LINE}`, background: thumbBg || "#fff", height: 74 }}>
          <img src={img} alt="" className="max-h-[60px] max-w-[90%] object-contain" />
          <button onClick={onClear} className="absolute top-1.5 right-1.5 rounded-full p-1 transition-colors" style={{ background: "#fff", border: `1px solid ${LINE}` }}><X size={12} color="#c0392b" /></button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 rounded-lg cursor-pointer text-xs font-semibold transition-colors duration-150" style={{ border: `1.5px dashed #C7CFDA`, color: NAVY, height: 74, background: "#FAFBFC" }}>
          <ImageIcon size={16} /> Choisir une image<input type="file" accept="image/*" className="hidden" onChange={onPick} />
        </label>
      )}
    </div>
  );
}

/* ---------- document (charte plan d'action) ---------- */
export function Logo({ constants, light }) {
  if (constants?.logo) {
    return light
      ? <div className="bg-white rounded px-2 py-1 inline-flex"><img src={constants.logo} alt="CF2i" className="h-6 object-contain" /></div>
      : <img src={constants.logo} alt="CF2i" className="h-6 object-contain" />;
  }
  const col = light ? "#fff" : NAVY;
  return (
    <div className="flex flex-col items-end leading-none">
      <span className="font-black tracking-tight" style={{ color: col, fontSize: 18 }}>CF2<span style={{ color: ORANGE }}>i</span></span>
      <span className="font-semibold" style={{ color: light ? SUBTLE : GREY, fontSize: 7, letterSpacing: "0.25em" }}>FORMATION</span>
    </div>
  );
}

// En-tête de page intérieure : sur-titre orange + titre marine + logo
export function PreviewHeader({ constants, eyebrow, code, title, sub }) {
  return (
    <div className="px-7 pt-6 pb-4 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-bold uppercase mb-1" style={{ color: ORANGE, fontSize: 10, letterSpacing: "0.22em" }}>
            {eyebrow}{code ? ` · ${code}` : ""}
          </div>
          <h1 className="font-extrabold leading-tight" style={{ color: NAVY, fontSize: 24 }}>{title}</h1>
          {sub && <p className="mt-1" style={{ color: GREY, fontSize: 12 }}>{sub}</p>}
        </div>
        <div className="shrink-0"><Logo constants={constants} /></div>
      </div>
    </div>
  );
}

// Carte à barre d'accent verticale (style plan d'action)
export function AccentCard({ accent = ORANGE, title, children, full }) {
  return (
    <div className={full ? "col-span-2" : ""} style={{ background: "#fff", border: `1px solid ${LINE}`, borderLeft: `3px solid ${accent}`, borderRadius: 4, padding: "11px 14px" }}>
      {title && <div className="font-bold mb-1.5" style={{ color: NAVY, fontSize: 11 }}>{title}</div>}
      {children}
    </div>
  );
}

export function DayLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span style={{ width: 16, height: 2, background: ORANGE }} />
      <span className="font-bold uppercase" style={{ color: NAVY, fontSize: 11, letterSpacing: "0.1em" }}>{children}</span>
    </div>
  );
}

export function Bullets({ items }) {
  return (
    <ul className="space-y-0.5">
      {(!items || items.length === 0) && <li className="text-[10px]" style={{ color: GREY }}>—</li>}
      {(items || []).map((it, i) => (
        <li key={i} className="text-[10px] leading-snug pl-3 relative" style={{ color: "#374350" }}>
          <span className="absolute left-0 top-[5px] w-1 h-1 rounded-full" style={{ background: ORANGE }} />{it}
        </li>
      ))}
    </ul>
  );
}

export function BlockHead({ icon, title }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="inline-flex items-center justify-center rounded" style={{ background: ORANGE, width: 18, height: 18 }}>{icon}</span>
      <span className="font-bold text-[11px]" style={{ color: NAVY }}>{title}</span>
    </div>
  );
}

export function PreviewFooter({ constants, doc = "Fiche descriptive" }) {
  return (
    <div className="px-7 py-3 mt-2 flex items-end justify-between" style={{ borderTop: `1px solid ${LINE}` }}>
      <div>
        <div className="text-[9px]" style={{ color: NAVY }}>
          <span className="font-bold">Contact :</span> {constants.tel} · {constants.email}
        </div>
        <div className="text-[8px] mt-0.5" style={{ color: GREY }}>{constants.legal}</div>
      </div>
      <div className="text-[8px] uppercase tracking-wide shrink-0 ml-4" style={{ color: GREY, letterSpacing: "0.12em" }}>{doc} · CF2i</div>
    </div>
  );
}
