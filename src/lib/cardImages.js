// Carga todas las cartas: /assets/cards/<Color>/<Nombre>.(png|PNG|webp|jpg|jpeg)
const cardImages = import.meta.glob("../assets/cards/*/*.{png,PNG,webp,jpg,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  });
  
  // Carga todos los íconos: /assets/icons/colors/<Color>.(png|PNG|webp|svg)
  const colorIcons = import.meta.glob("../assets/icons/*.{png,PNG,webp,svg}", {
    eager: true,
    query: "?url",
    import: "default",
  });
  
  // Busca en varias extensiones posibles
  function findWithExt(obj, basePath, exts) {
    for (const ext of exts) {
      const key = `${basePath}.${ext}`;
      if (obj[key]) return obj[key];
    }
    return null;
  }
  
  export function getCardImage(color, cardName) {
    if (!color || !cardName) return null;
    const base = `../assets/cards/${color}/${cardName}`;
    return findWithExt(
      cardImages,
      base,
      ["png", "PNG", "webp", "jpg", "jpeg"]
    );
  }
  
  export function getColorIcon(color) {
    if (!color) return null;
    const base = `../assets/icons/${color}`;
    return findWithExt(
      colorIcons,
      base,
      ["png", "PNG", "webp", "svg"]
    );
  }
  
  // --- (opcional) debug rápido en dev ---
  export function debugGlob() {
    console.log("[cards]", Object.keys(cardImages));
    console.log("[icons]", Object.keys(colorIcons));
  }
  