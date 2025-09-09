import races from "./data/races.json";
import { useEffect, useMemo, useState } from "react";
import { getCardImage } from "./lib/cardImages";
import { getColorIcon } from "./lib/cardImages";

// Orden fijo (ajústalo si quieres otro orden)
const COLOR_ORDER = ["Red","White","Orange","Yellow","Green","Blue","Purple","Brown"];

// Colores de fondo de los íconos (puedes ajustar tonos)
const COLOR_BG = {
  Red:    "#ef4444",
  White:  "#ffffff",
  Orange: "#f97316",
  Yellow: "#f59e0b",
  Green:  "#22c55e",
  Blue:   "#3b82f6",
  Purple: "#a855f7",
  Brown:  "#895129",
};

export default function App() {
  const options = useMemo(() => races.map(r => r.Name), []);
  const [raceName, setRaceName] = useState(options[0] ?? null);
  const current = useMemo(() => races.find(r => r.Name === raceName), [raceName]);

  // color seleccionado (uno a la vez)
  const [selColor, setSelColor] = useState(COLOR_ORDER[0]);

  useEffect(() => {
    // al cambiar de carrera, escoger el primer color disponible
    if (!current) return;
    const firstAvailable = COLOR_ORDER.find(c => current[c]);
    setSelColor(firstAvailable ?? COLOR_ORDER[0]);
  }, [current]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* cabecera solo con el picker de carrera */}
      <header className="p-3 flex justify-center">
        <div className="join">
          <select
            className="select select-primary join-item"
            value={raceName ?? ""}
            onChange={(e) => setRaceName(e.target.value)}
          >
            {options.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          <button className="btn join-item" onClick={() => setRaceName(options[0])}>Reset</button>
        </div>
      </header>

      {/* LAYOUT HORIZONTAL pensado para móvil apaisado */}
      <main className="mx-auto p-3 max-w-6xl">
        <div className="flex items-stretch gap-3">
          {/* BARRA IZQUIERDA: iconos por color */}
          <ColorRail
            race={current}
            selected={selColor}
            onSelect={setSelColor}
          />

          {/* VIEWPORT: todas las cartas apiladas, solo 1 visible */}
          <CardViewport race={current} selectedColor={selColor} />
        </div>
      </main>
    </div>
  );
}

function ColorRail({ race, selected, onSelect }) {
  return (
    <aside className="bg-base-200 rounded-2xl p-2 flex flex-col gap-2 w-16 items-center justify-center">
      {COLOR_ORDER.map((color) => {
        const enabled = !!(race && race[color]);
        const isSel = selected === color;
        const iconUrl = getColorIcon(color);

        return (
          <button
            key={color}
            onClick={() => enabled && onSelect(color)}
            aria-label={color}
            title={color}
            className={[
              "relative w-12 h-12 rounded-xl overflow-hidden transition",
              enabled ? "cursor-pointer" : "opacity-30 cursor-not-allowed",
              isSel
                ? "ring ring-primary ring-offset-2"
                : "ring ring-base-300 ring-offset-2"
            ].join(" ")}
            style={{ background: COLOR_BG[color] }}
          >
            {iconUrl && (
              <img
                src={iconUrl}
                alt=""
                className="absolute inset-0 m-auto w-7 h-7 object-contain pointer-events-none"
                loading="eager"
                // mejora contraste si tu PNG es claro
                style={{ filter: color === "White" ? "drop-shadow(0 0 2px rgba(0,0,0,.35))" : "none" }}
              />
            )}
          </button>
        );
      })}
    </aside>
  );
}

function CardViewport({ race, selectedColor }) {
  // tamaño del recuadro y apilado
  return (
    <section className="relative flex-1 bg-base-200 rounded-2xl shadow-inner aspect-[16/9] overflow-hidden grid place-items-center">
      {/* Apilamos todas; solo la del color seleccionado se ve */}
      <div className="relative w-full h-full">
        {COLOR_ORDER.map((color) => {
          const cardName = race?.[color];
          if (!cardName) return null;
          const url = getCardImage(color, cardName);
          return (
            <img
              key={color}
              src={url || ""}
              alt=""
              className={[
                "absolute inset-0 m-auto object-contain max-h-full max-w-full transition-opacity duration-300",
                selectedColor === color ? "opacity-100" : "opacity-0 pointer-events-none"
              ].join(" ")}
              loading="eager"
            />
          );
        })}
      </div>
    </section>
  );
}
