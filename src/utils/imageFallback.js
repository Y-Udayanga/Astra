// A branded inline SVG placeholder shown whenever a remote product image fails
// to load (dead Unsplash links, network blocks, etc.). Because it's a data URI
// it can never itself 404, so the storefront never shows a broken-image icon.
export const FALLBACK_IMG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="#0f0f17"/>
  <rect width="800" height="800" fill="url(#g)" opacity="0.18"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
    font-family="Outfit, Inter, sans-serif" font-size="64" font-weight="700"
    fill="url(#g)" letter-spacing="6">ASTRA</text>
</svg>`);

// Attach to any <img> via onError. Guards against infinite loops by clearing
// the handler before swapping the source.
export const handleImgError = (e) => {
    const el = e.currentTarget;
    if (el.dataset.fallbackApplied === 'true') return;
    el.dataset.fallbackApplied = 'true';
    el.onerror = null;
    el.src = FALLBACK_IMG;
};
