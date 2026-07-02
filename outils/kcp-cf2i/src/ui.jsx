import { useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, X, Image as ImageIcon, ImagePlus } from "lucide-react";
import { NAVY, NAVY2, ORANGE, LIGHT, GREY, LINE, SUBTLE } from "./store.js";

/* ---------- éditeur (panneaux de saisie) ---------- */
export function AutoGrow({ value, onChange, className, style, placeholder }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }, [value]);
  return <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} rows={1} placeholder={placeholder}
    className={className} style={{ resize: "none", overflow: "hidden", ...style }} />;
}
export function Action({ onClick, icon, label, primary }) {
  return <button onClick={onClick} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-md"
    style={primary ? { background: ORANGE, color: "#fff" } : { background: "#fff", color: NAVY, border: `1px solid ${LINE}` }}>{icon} {label}</button>;
}
export function Panel({ title, children }) {
  return <div className="bg-white rounded-lg p-4 shadow-sm" style={{ border: `1px solid ${LINE}` }}>{title && <div className="font-bold mb-3" style={{ color: NAVY }}>{title}</div>}{children}</div>;
}
export function Toggle({ open, onClick, icon, title, hint }) {
  return <button onClick={onClick} className="w-full flex items-center gap-2 text-left">{icon}<span className="font-bold" style={{ color: NAVY }}>{title}</span>{hint && <span className="text-xs" style={{ color: GREY }}>{hint}</span>}<span className="flex-1" />{open ? <ChevronDown size={16} color={GREY} /> : <ChevronRight size={16} color={GREY} />}</button>;
}
export function Field({ label, v, onChange, placeholder }) {
  return <label className="block mb-2">{label && <span className="text-[11px] font-semibold" style={{ color: GREY }}>{label}</span>}<input value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full text-sm rounded-md border px-2.5 py-1.5 mt-0.5" style={{ borderColor: LINE }} /></label>;
}
export function Select({ label, v, onChange, options }) {
  return <label className="block mb-2"><span className="text-[11px] font-semibold" style={{ color: GREY }}>{label}</span><select value={v} onChange={(e) => onChange(e.target.value)} className="w-full text-sm rounded-md border px-2 py-1.5 mt-0.5 bg-white" style={{ borderColor: LINE }}>{options.map((o) => <option key={o}>{o}</option>)}</select></label>;
}
export function Area({ label, v, onChange, rows = 3, placeholder, mono }) {
  return <label className="block mb-2">{label && <span className="text-[11px] font-semibold" style={{ color: GREY }}>{label}</span>}<textarea value={v} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full text-sm rounded-md border p-2.5 mt-0.5" style={{ borderColor: LINE, fontFamily: mono ? "ui-monospace, monospace" : "inherit", fontSize: mono ? 12 : 14 }} /></label>;
}
export function Uploader({ label, hint, img, onPick, onClear, thumbBg }) {
  return (
    <div>
      <div className="text-[11px] font-semibold mb-1" style={{ color: GREY }}>{label} <span className="font-normal">· {hint}</span></div>
      {img ? (
        <div className="relative rounded-md overflow-hidden flex items-center justify-center" style={{ border: `1px solid ${LINE}`, background: thumbBg || "#fff", height: 70 }}>
          <img src={img} alt="" className="max-h-[58px] max-w-[90%] object-contain" />
          <button onClick={onClear} className="absolute top-1 right-1 rounded-full p-0.5" style={{ background: "#fff", border: `1px solid ${LINE}` }}><X size={12} color="#c0392b" /></button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer text-xs font-semibold" style={{ border: `1px dashed ${GREY}`, color: NAVY, height: 70 }}>
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
