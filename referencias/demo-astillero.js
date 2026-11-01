/* Astillero Software · elementos comunes de las webs de demostración.
   Añade un botón fijo para volver al portal y un cierre al final de la página.
   Uso: <script src="/referencias/demo-astillero.js" defer></script> */
(() => {
  "use strict";
  if (document.getElementById("ast-demo-estilos")) return;
  const PORTAL = "/#trabajos";
  const css = `
  .ast-volver{position:fixed;left:max(16px,env(safe-area-inset-left,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:75;display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 18px 0 8px;border-radius:999px;background:#0A1522;color:#E9EFF6;font:600 14.5px/1 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:none;box-shadow:0 12px 30px -10px rgba(0,0,0,.55),0 0 0 1px rgba(147,184,222,.25);transition:transform .25s,box-shadow .2s,opacity .25s,visibility .25s;opacity:0;visibility:hidden;transform:translateY(12px)}
  .ast-volver.ast-ver{opacity:1;visibility:visible;transform:none}
  .ast-volver.ast-ver:hover{transform:translateY(-2px);box-shadow:0 16px 34px -10px rgba(0,0,0,.6),0 0 0 1px rgba(227,86,62,.7)}
  .ast-volver:focus-visible{outline:3px solid #E3563E;outline-offset:3px}
  .ast-volver svg{width:34px;height:34px;flex:none}
  .ast-volver small{display:block;font-size:11px;font-weight:500;color:#93A7BC;margin-top:3px;letter-spacing:.02em}
  @media (max-width:520px){.ast-volver .ast-t{display:none}.ast-volver{padding:0 8px;min-height:50px}}
  .ast-cierre{background:#0A1522;color:#E9EFF6;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
  .ast-cierre > div{max-width:1200px;margin:0 auto;padding-block:clamp(48px,7vw,80px);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px}
  .ast-cierre p{margin:0;max-width:40rem}
  .ast-cierre b{display:block;font-size:clamp(24px,3vw,34px);line-height:1.1;letter-spacing:-.01em;margin-bottom:10px;color:#fff}
  .ast-cierre span{color:#93A7BC;font-size:16px;line-height:1.5}
  .ast-cierre nav{display:flex;flex-wrap:wrap;gap:10px}
  .ast-cierre a{display:inline-flex;align-items:center;gap:8px;min-height:50px;padding:0 22px;border-radius:999px;font-weight:600;font-size:16px;text-decoration:none;border:1px solid rgba(147,184,222,.32);color:#E9EFF6}
  .ast-cierre a:hover{border-color:#E9EFF6}
  .ast-cierre a.ast-1{background:#E3563E;border-color:#E3563E;color:#FFF4EF}
  .ast-cierre a.ast-1:hover{background:#cf4a33}
  @media print{.ast-volver,.ast-cierre{display:none}}`;
  const st = document.createElement("style"); st.id = "ast-demo-estilos"; st.textContent = css; document.head.appendChild(st);

  const logo = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="32" fill="#E3563E"/><g fill="none" stroke="#FFF4EF" stroke-width="4" stroke-linecap="round"><path d="M14 22H50"/><path d="M18 22Q18 44 32 49Q46 44 46 22"/><path d="M25 22Q25 37 32 41Q39 37 39 22"/><path d="M32 22V49"/></g></svg>';

  const a = document.createElement("a");
  a.className = "ast-volver"; a.href = PORTAL;
  a.setAttribute("aria-label", "Volver al portal de Astillero Software");
  a.innerHTML = logo + '<span class="ast-t">Volver a Astillero<small>Ver más trabajos</small></span>';
  document.body.appendChild(a);
  const umbral = () => Math.min(innerHeight * 0.6, 520);
  const revisar = () => a.classList.toggle("ast-ver", scrollY > umbral());
  addEventListener("scroll", revisar, { passive: true }); revisar();

  const cierre = document.createElement("section");
  cierre.className = "ast-cierre"; cierre.setAttribute("aria-label", "Astillero Software");
  cierre.innerHTML = '<div><p><b>Has visto una web de demostración de Astillero Software.</b><span>Diseñamos y programamos webs a medida, con cita online, tienda o lo que tu negocio necesite.</span></p><nav><a class="ast-1" href="/#contacto">Quiero una web así</a><a href="' + PORTAL + '">← Volver al portal</a></nav></div>';
  const pie = document.querySelector("body > footer");
  pie ? pie.after(cierre) : document.body.appendChild(cierre);
})();
