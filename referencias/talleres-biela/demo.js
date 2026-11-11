(() => {
"use strict";
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const eur = n => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&h=540&q=65`;

/* ---------- servicios (precios orientativos de ejemplo) ---------- */
const SERVICIOS = [
  { id: "mec", cod: "MEC-01", t: "Mecánica general", d: "Averías de motor, ruidos, pérdidas de aceite o agua y todo lo que el coche te esté avisando.", desde: null, h: "Según avería", foto: "1615906655593-ad0386982a0f", rango: [60, 400], horas: [1, 6] },
  { id: "dia", cod: "DIA-02", t: "Diagnosis electrónica", d: "Lectura de centralitas, testigo del motor, programación de llaves y actualizaciones.", desde: 35, h: "30 min", foto: "1623682783900-fea916dcba74", rango: [35, 60], horas: [0.5, 1] },
  { id: "ace", cod: "ACE-03", t: "Aceite y filtros", d: "Aceite según especificación del fabricante, filtros de aceite, aire, habitáculo y combustible.", desde: 59, h: "45 min", foto: "1771340742493-52fbd5476ccb", rango: [59, 160], horas: [0.75, 1.5] },
  { id: "neu", cod: "NEU-04", t: "Neumáticos y alineado", d: "Montaje, equilibrado, reparación de pinchazos y alineado 3D con informe impreso.", desde: 15, h: "por rueda", foto: "1599082267768-4815b2ea6bd2", rango: [60, 520], horas: [0.75, 1.5] },
  { id: "fre", cod: "FRE-05", t: "Frenos", d: "Pastillas, discos, líquido y revisión completa del sistema de frenado.", desde: 89, h: "1 h", foto: "1588017530244-c57df911f73b", rango: [89, 340], horas: [1, 2.5] },
  { id: "dis", cod: "DIS-06", t: "Distribución y embrague", d: "Kit de distribución con bomba de agua, embrague y volante bimasa.", desde: 290, h: "1 día", foto: "1785779594175-2d677ec4bae2", rango: [290, 1100], horas: [4, 8] },
  { id: "itv", cod: "ITV-07", t: "Pre-ITV y luces", d: "Revisamos lo que mira la ITV y lo dejamos listo: luces, frenos, holguras y emisiones.", desde: 25, h: "40 min", foto: "1616761879141-f485e5fed5df", rango: [25, 90], horas: [0.5, 1.5] },
  { id: "sus", cod: "SUS-08", t: "Suspensión y escape", d: "Amortiguadores, silentblocks, rótulas, catalizador y filtro de partículas.", desde: 120, h: "2 h", foto: "1698796783361-c92fe82d9b79", rango: [120, 780], horas: [1.5, 5] }
];
const lista = $("#listaSrv"), visor = $("#visor");
lista.innerHTML = SERVICIOS.map(s => `
  <article class="srv" data-foto="${s.foto}">
    <span class="cod">${s.cod}</span>
    <img class="mini" src="${U(s.foto)}" alt="" loading="lazy">
    <div><h3>${s.t}</h3><p>${s.d}</p></div>
    <div class="precio">${s.desde ? `<small>Desde</small><b>${eur(s.desde)}</b>` : `<small>Precio</small><b>A medida</b>`}<span>${s.h}</span></div>
  </article>`).join("");
/* foto que sigue al ratón al pasar por cada servicio */
const fino = matchMedia("(hover:hover) and (min-width:861px)");
let rx = 0, ry = 0, vx = 0, vy = 0, anim = null;
function mover() { vx += (rx - vx) * .18; vy += (ry - vy) * .18; visor.style.left = vx + "px"; visor.style.top = vy + "px"; anim = requestAnimationFrame(mover); }
lista.addEventListener("pointermove", e => { if (!fino.matches) return; rx = e.clientX + 200; ry = e.clientY; if (!anim) { vx = rx; vy = ry; mover(); } });
$$(".srv", lista).forEach(el => {
  el.addEventListener("pointerenter", () => { if (!fino.matches) return; visor.style.backgroundImage = `url("${U(el.dataset.foto)}")`; visor.classList.add("ver"); });
  el.addEventListener("pointerleave", () => visor.classList.remove("ver"));
});
lista.addEventListener("pointerleave", () => { cancelAnimationFrame(anim); anim = null; });
SERVICIOS.forEach(s => { const i = new Image(); i.src = U(s.foto); });

/* ---------- presupuesto al instante ---------- */
const ICO = {
  urbano: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 16h16v-3l-2-4H8l-3 4H4z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/></svg>',
  suv: '<svg class="ico" viewBox="0 0 24 24"><path d="M3 16h18v-4l-2-5H6L3 12z"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/></svg>',
  furgo: '<svg class="ico" viewBox="0 0 24 24"><path d="M2 17V7h12v10M14 10h4l4 4v3h-8"/><circle cx="6" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/></svg>'
};
const VEH = [{ id: "urbano", t: "Urbano", f: 0.9 }, { id: "suv", t: "Berlina / SUV", f: 1.15 }, { id: "furgo", t: "Furgoneta", f: 1.35 }];
let veh = "urbano"; const elegidos = new Set(["ace"]);
$("#opsVeh").innerHTML = VEH.map(v => `<button type="button" class="op" data-v="${v.id}" aria-pressed="${v.id === veh}">${ICO[v.id]}${v.t}</button>`).join("");
$("#opsSrv").innerHTML = SERVICIOS.map(s => `<button type="button" class="op" data-s="${s.id}" aria-pressed="${elegidos.has(s.id)}">${s.t}</button>`).join("");
$("#opsVeh").addEventListener("click", e => { const b = e.target.closest(".op"); if (!b) return; veh = b.dataset.v; $$(".op", $("#opsVeh")).forEach(x => x.setAttribute("aria-pressed", x === b)); ticket(); });
$("#opsSrv").addEventListener("click", e => { const b = e.target.closest(".op"); if (!b) return; const id = b.dataset.s; elegidos.has(id) ? elegidos.delete(id) : elegidos.add(id); b.setAttribute("aria-pressed", elegidos.has(id)); ticket(); });
const red = n => Math.round(n / 5) * 5;
const horasTxt = h => h < 1 ? `${Math.round(h * 60)} min` : h >= 8 ? `${Math.round(h / 8)} día${h >= 16 ? "s" : ""}` : `${h.toLocaleString("es-ES", { maximumFractionDigits: 1 })} h`;
function ticket() {
  const v = VEH.find(x => x.id === veh), sel = SERVICIOS.filter(s => elegidos.has(s.id));
  const t = $("#ticket");
  if (!sel.length) { t.innerHTML = `<span class="mono">PRESUPUESTO ORIENTATIVO</span><p class="vacio">Marca al menos un servicio para ver el precio estimado.</p>`; return; }
  const min = red(sel.reduce((a, s) => a + s.rango[0], 0) * v.f), max = red(sel.reduce((a, s) => a + s.rango[1], 0) * v.f);
  const h0 = sel.reduce((a, s) => a + s.horas[0], 0), h1 = sel.reduce((a, s) => a + s.horas[1], 0);
  t.innerHTML = `<span class="mono">PRESUPUESTO ORIENTATIVO · ${v.t.toUpperCase()}</span>
    ${sel.map(s => `<div class="linea">${s.t}<span>${eur(red(s.rango[0] * v.f))} – ${eur(red(s.rango[1] * v.f))}</span></div>`).join("")}
    <div class="linea">Tiempo de taller<span>${horasTxt(h0)} – ${horasTxt(h1)}</span></div>
    <div class="total"><small>Total estimado, IVA incluido</small><b>${eur(min)} – ${eur(max)}</b></div>
    <a class="btn btn-a" href="#cita" id="bLlevarCita">Pedir cita con este presupuesto</a>
    <span class="mono" style="font-size:11.5px">Precios de ejemplo. El definitivo, cerrado tras revisar el coche.</span>`;
  $("#bLlevarCita").onclick = () => { $("#cSrv").value = sel[0].id; $("#cObs").value = "Presupuesto web: " + sel.map(s => s.t).join(", ") + ` (${v.t}). Estimado ${eur(min)} – ${eur(max)}.`; };
}
ticket();
$("#cSrv").innerHTML = SERVICIOS.map(s => `<option value="${s.id}">${s.t}</option>`).join("") + '<option value="otro">Otro / no lo sé</option>';

/* ---------- tienda ---------- */
const DIBUJO = {
  aceite: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M38 34h34l10 12v58H30V46z" fill="#FFC400" stroke="#FFC400"/><path d="M50 22h14v12H50z"/><path d="M82 46h12v20" /><rect x="40" y="60" width="32" height="28" fill="#0E0F11" stroke="none"/><path d="M48 70h16M48 78h10" stroke="#FFC400"/></svg>',
  filtro: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3"><rect x="32" y="26" width="56" height="70" rx="6" fill="#2A2D33"/><path d="M32 40h56M32 82h56" stroke="#FFC400" stroke-width="5"/><path d="M42 48v26M50 48v26M58 48v26M66 48v26M74 48v26"/><ellipse cx="60" cy="26" rx="28" ry="6" fill="#16181B"/></svg>',
  freno: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3"><circle cx="58" cy="62" r="40"/><circle cx="58" cy="62" r="16" fill="#2A2D33"/><circle cx="58" cy="62" r="5"/><path d="M58 30v4M58 90v4M26 62h4M86 62h4M36 40l3 3M77 81l3 3M80 40l-3 3M39 81l-3 3" stroke-width="2"/><path d="M84 30a42 42 0 0 1 12 18l-16 8a24 24 0 0 0-6-10z" fill="#FFC400" stroke="#FFC400"/></svg>',
  bateria: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3"><rect x="20" y="36" width="80" height="56" rx="4" fill="#2A2D33"/><rect x="32" y="28" width="14" height="8" fill="currentColor"/><rect x="74" y="28" width="14" height="8" fill="currentColor"/><path d="M58 46l-10 18h12l-8 18" stroke="#FFC400" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  luz: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M44 74c-8-6-12-14-12-24a28 28 0 0 1 56 0c0 10-4 18-12 24v10H44z" fill="#FFC400" stroke="#FFC400"/><path d="M46 92h28M50 100h20"/><path d="M60 8v8M22 22l6 6M98 22l-6 6M10 50h8M102 50h8"/></svg>',
  escobilla: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M20 92L100 32" stroke-width="5"/><path d="M26 98L104 40" stroke="#FFC400" stroke-width="7"/><path d="M60 64l8 10"/></svg>',
  v16: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3"><path d="M44 96h32l4-10H40z" fill="#2A2D33"/><path d="M46 86l4-46h20l4 46z" fill="#FF8A00" stroke="#FF8A00"/><path d="M50 52h20M49 66h22" stroke="#0E0F11" stroke-width="4"/><path d="M32 34a32 32 0 0 1 56 0M24 26a44 44 0 0 1 72 0" stroke="#FFC400" stroke-linecap="round"/></svg>'
};
const CATS = [["todo","Todo"],["aceites","Aceites y líquidos"],["filtros","Filtros"],["frenos","Frenos"],["baterias","Baterías"],["luces","Iluminación"],["escobillas","Escobillas"],["seguridad","Seguridad"]];
const PROD = [
  { ref: "AC-5W30-5L", c: "aceites", d: "aceite", t: "Aceite sintético 5W-30, 5 L", comp: "Gasolina y diésel con norma ACEA C3", p: 42.9, st: 14, tag: "Más vendido" },
  { ref: "AC-5W40-4L", c: "aceites", d: "aceite", t: "Aceite sintético 5W-40, 4 L", comp: "Motores de gasolina y diésel sin FAP", p: 36.5, st: 9 },
  { ref: "LQ-REF-5L", c: "aceites", d: "aceite", t: "Anticongelante orgánico 30 %, 5 L", comp: "Listo para usar · color rosa", p: 14.9, st: 22 },
  { ref: "LQ-DOT4-1L", c: "frenos", d: "aceite", t: "Líquido de frenos DOT 4, 1 L", comp: "Cambio recomendado cada 2 años", p: 9.5, st: 18 },
  { ref: "FI-ACE-1102", c: "filtros", d: "filtro", t: "Filtro de aceite", comp: "Confirmamos referencia por matrícula", p: 9.9, st: 30 },
  { ref: "FI-AIR-2210", c: "filtros", d: "filtro", t: "Filtro de aire", comp: "Confirmamos referencia por matrícula", p: 16.5, st: 12 },
  { ref: "FI-HAB-3340", c: "filtros", d: "filtro", t: "Filtro de habitáculo con carbón activo", comp: "Retiene polen y olores", p: 18.9, st: 4 },
  { ref: "FR-PAS-DEL", c: "frenos", d: "freno", t: "Juego de pastillas delanteras", comp: "Con testigo de desgaste", p: 34.9, st: 7, tag: "Montaje 35 €" },
  { ref: "FR-DIS-280", c: "frenos", d: "freno", t: "Pareja de discos ventilados 280 mm", comp: "Montar siempre con pastillas nuevas", p: 69, st: 3 },
  { ref: "BA-60AH", c: "baterias", d: "bateria", t: "Batería 60 Ah · 540 A", comp: "Turismos de gasolina hasta 1.6", p: 89, st: 6 },
  { ref: "BA-74AH-EFB", c: "baterias", d: "bateria", t: "Batería EFB 74 Ah · 680 A", comp: "Coches con Start-Stop", p: 129, st: 2 },
  { ref: "LU-H7-X2", c: "luces", d: "luz", t: "Lámparas H7 +130 %, pack de 2", comp: "Homologadas para circular", p: 19.9, st: 25 },
  { ref: "LU-W5W-X10", c: "luces", d: "luz", t: "Lámparas W5W de posición, pack de 10", comp: "Posición, matrícula e interior", p: 7.9, st: 40 },
  { ref: "ES-6045", c: "escobillas", d: "escobilla", t: "Escobillas planas 60 + 45 cm", comp: "Adaptadores incluidos", p: 22.9, st: 11 },
  { ref: "ES-TRAS-30", c: "escobillas", d: "escobilla", t: "Escobilla trasera 30 cm", comp: "Portones y monovolúmenes", p: 9.9, st: 8 },
  { ref: "SG-V16-DGT", c: "seguridad", d: "v16", t: "Baliza V16 conectada a la DGT", comp: "Obligatoria desde enero de 2026", p: 39.9, st: 16, tag: "Obligatoria" }
];
let cat = "todo", txt = "";
const cesta = new Map();
$("#cats").innerHTML = CATS.map(([id, n]) => `<button type="button" class="cat" data-c="${id}" aria-pressed="${id === cat}">${n}</button>`).join("");
$("#cats").addEventListener("click", e => { const b = e.target.closest(".cat"); if (!b) return; cat = b.dataset.c; $$(".cat").forEach(x => x.setAttribute("aria-pressed", x === b)); pintarProd(); });
$("#qProd").addEventListener("input", e => { txt = norm(e.target.value.trim()); pintarProd(); });
function pintarProd() {
  const vis = PROD.filter(p => (cat === "todo" || p.c === cat) && (!txt || norm(p.t + " " + p.ref + " " + p.comp).includes(txt)));
  $("#productos").innerHTML = vis.length ? vis.map(p => `
    <article class="prod">
      <div class="lam"><span class="ref">${p.ref}</span>${p.tag ? `<span class="tag">${p.tag}</span>` : ""}${DIBUJO[p.d]}</div>
      <div class="cuerpo">
        <h3>${p.t}</h3>
        <span class="comp">${p.comp}</span>
        <span class="stock ${p.st <= 4 ? "poco" : ""}">${p.st <= 4 ? `Últimas ${p.st} unidades` : "En stock en el taller"}</span>
        <div class="pie"><b>${eur(p.p)}</b><button class="btn btn-a" type="button" data-add="${p.ref}" aria-label="Añadir ${p.t} a la cesta">Añadir</button></div>
      </div>
    </article>`).join("") : `<p class="sin">No tenemos «${$("#qProd").value.replace(/[<>&]/g, "")}» en la tienda online. Pregúntanos por WhatsApp: casi todo lo conseguimos en 24 h.</p>`;
}
pintarProd();

/* ---------- cesta ---------- */
let montaje = false, reservado = false;
const panel = $("#cesta"), velo = $("#velo");
function abrir(si) {
  panel.classList.toggle("ver", si); velo.classList.toggle("ver", si); panel.setAttribute("aria-hidden", !si);
  document.body.style.overflow = si ? "hidden" : "";
  if (si) setTimeout(() => $("#bCerrarCesta").focus(), 50); else $("#bCesta").focus({ preventScroll: true });
}
$("#bCesta").onclick = () => abrir(true);
$("#bCerrarCesta").onclick = () => abrir(false);
velo.onclick = () => abrir(false);
addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("ver")) abrir(false); });
let tTimer;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("ver"); clearTimeout(tTimer); tTimer = setTimeout(() => t.classList.remove("ver"), 2200); }
$("#productos").addEventListener("click", e => {
  const b = e.target.closest("[data-add]"); if (!b) return;
  const p = PROD.find(x => x.ref === b.dataset.add);
  const q = (cesta.get(p.ref) || 0) + 1;
  if (q > p.st) { toast("No quedan más unidades en el taller"); return; }
  cesta.set(p.ref, q); reservado = false; pintarCesta(); toast("Añadido: " + p.t);
});
$("#lineas").addEventListener("click", e => {
  const b = e.target.closest("[data-q]"); if (!b) return;
  const ref = b.dataset.ref, p = PROD.find(x => x.ref === ref);
  const q = Math.min(p.st, (cesta.get(ref) || 0) + (+b.dataset.q));
  q <= 0 ? cesta.delete(ref) : cesta.set(ref, q); pintarCesta();
});
function pintarCesta() {
  const n = [...cesta.values()].reduce((a, b) => a + b, 0);
  const badge = $("#nCesta"); badge.hidden = !n; badge.textContent = n;
  const lin = $("#lineas"), pie = $("#cestaPie");
  if (reservado) {
    lin.innerHTML = `<div class="cesta-vacia"><b style="display:block;font:900 26px/1.1 var(--f-d);color:var(--amarillo);text-transform:uppercase;margin-bottom:10px">Reserva lista</b>Te avisaríamos por WhatsApp cuando esté preparada para recoger${montaje ? " y te propondríamos hora para el montaje" : ""}.<br><br><span class="aviso">Web de demostración: no se ha enviado ningún pedido ni cobro.</span></div>`;
    pie.innerHTML = `<button class="btn btn-b" type="button" id="bSeguir">Seguir mirando</button>`;
    $("#bSeguir").onclick = () => { cesta.clear(); reservado = false; pintarCesta(); abrir(false); };
    return;
  }
  if (!n) { lin.innerHTML = `<p class="cesta-vacia">La cesta está vacía.<br>Añade repuestos desde la tienda.</p>`; pie.innerHTML = ""; return; }
  let sub = 0;
  lin.innerHTML = [...cesta].map(([ref, q]) => { const p = PROD.find(x => x.ref === ref); sub += p.p * q;
    return `<div class="lin"><div><b>${p.t}</b><div class="mono">${p.ref} · ${eur(p.p)}</div></div><span class="imp">${eur(p.p * q)}</span>
      <div class="cant"><button type="button" data-ref="${ref}" data-q="-1" aria-label="Quitar una unidad de ${p.t}">−</button><span>${q}</span><button type="button" data-ref="${ref}" data-q="1" aria-label="Añadir una unidad de ${p.t}">+</button></div></div>`; }).join("");
  const mont = montaje ? 25 : 0;
  pie.innerHTML = `<label class="check" for="chkMont"><input type="checkbox" id="chkMont" ${montaje ? "checked" : ""}>Quiero que me lo monten en el taller (desde ${eur(25)}, te confirmamos el precio)</label>
    <div class="tot"><span>Total${montaje ? " con montaje" : ""}</span><b>${eur(sub + mont)}</b></div>
    <button class="btn btn-a" type="button" id="bReservar">Reservar y recoger en el taller</button>
    <span class="aviso">Pagas al recoger. Si no es compatible con tu coche, lo cambiamos sin coste.</span>`;
  $("#chkMont").onchange = e => { montaje = e.target.checked; pintarCesta(); };
  $("#bReservar").onclick = () => { reservado = true; pintarCesta(); };
}
pintarCesta();

/* ---------- cita ---------- */
const hoy = new Date(); hoy.setDate(hoy.getDate() + 1);
$("#cDia").min = hoy.toISOString().slice(0, 10);
$("#cMat").addEventListener("input", e => { e.target.value = e.target.value.toUpperCase().replace(/[^0-9A-Z ]/g, ""); });
$("#fCita").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.currentTarget, falta = [];
  if ($("#cMat").value.replace(/\s/g, "").length < 6) falta.push("la matrícula");
  if (!$("#cNom").value.trim()) falta.push("tu nombre");
  if ($("#cTel").value.replace(/\D/g, "").length < 9) falta.push("un teléfono de 9 cifras");
  f.querySelector(".ok")?.remove();
  const p = document.createElement("p"); p.className = "ok"; p.setRole = null; p.setAttribute("role", "status");
  p.textContent = falta.length ? "Falta " + falta.join(", ") + "." : `Cita solicitada para ${$("#cMat").value}. Te confirmaríamos la hora por WhatsApp. (Demostración: no se ha enviado nada.)`;
  if (falta.length) { p.style.background = "var(--asfalto-3)"; p.style.color = "var(--blanco)"; p.style.borderLeft = "6px solid var(--amarillo)"; }
  f.appendChild(p);
});
})();
