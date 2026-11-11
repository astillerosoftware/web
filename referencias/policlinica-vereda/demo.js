(() => {
"use strict";
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ---------- datos de la policlínica de demostración ---------- */
const UNIDADES = {
  clinica: { n: "Clínica", c: "var(--c-clinica)" },
  dental: { n: "Dental", c: "var(--c-dental)" },
  estetica: { n: "Estética", c: "var(--c-estetica)" },
  fisio: { n: "Fisioterapia", c: "var(--c-fisio)" }
};
const ESPECIALISTAS = [
  { p: "Dra. Carmen Ruiz", e: "Medicina general · Dirección médica", g: "medica" },
  { p: "Dr. Pablo Serrano", e: "Medicina interna", g: "medica" },
  { p: "Dra. Inés Molina", e: "Dermatología", g: "medica" },
  { p: "Dr. Javier Ortega", e: "Cirugía vascular", g: "quirurgica" },
  { p: "Dr. Andrés Prieto", e: "Traumatología", g: "quirurgica" },
  { p: "Dra. Marta Llorente", e: "Otorrinolaringología", g: "quirurgica" },
  { p: "Dr. Luis Herrera", e: "Urología", g: "quirurgica" },
  { p: "Dra. Sofía Navas", e: "Podología", g: "quirurgica", k: "pie podologo plantillas" },
  { p: "Dr. Álvaro Gil", e: "Pediatría", g: "infancia" },
  { p: "Dra. Elena Campos", e: "Ginecología y obstetricia", g: "infancia" },
  { p: "Unidad de Psicología", e: "Psicología, pedagogía y logopedia", g: "infancia" }
];
const CATALOGO = [
  ...ESPECIALISTAS.map(x => ({ t: x.e.split(" · ")[0], u: "clinica", d: x.p, k: x.k || "" })),
  { t: "Psicología infantil", u: "clinica", d: "Unidad de Psicología", k: "niños psicologo" },
  { t: "Reconocimiento carné de conducir", u: "clinica", d: "Centro de reconocimientos", k: "carnet psicotecnico renovar permiso" },
  { t: "Reconocimiento licencia de armas", u: "clinica", d: "Centro de reconocimientos", k: "caza escopeta" },
  { t: "Reconocimiento seguridad privada", u: "clinica", d: "Centro de reconocimientos", k: "vigilante" },
  { t: "Reconocimiento gruista", u: "clinica", d: "Centro de reconocimientos", k: "grua" },
  { t: "Perros potencialmente peligrosos", u: "clinica", d: "Centro de reconocimientos", k: "ppp licencia perro" },
  { t: "Titulaciones náuticas", u: "clinica", d: "Centro de reconocimientos", k: "barco patron" },
  { t: "Radiografía", u: "clinica", d: "Radiología", k: "rayos x placa radiologia" },
  { t: "Ortopantomografía", u: "clinica", d: "Radiología dental", k: "panoramica dientes" },
  { t: "TAC dental 3D", u: "dental", d: "Diagnóstico por imagen", k: "tac tag escaner cbct 3d implantes" },
  { t: "Electrocardiograma", u: "clinica", d: "Medicina interna", k: "corazon ecg" },
  { t: "Ecografía ginecológica", u: "clinica", d: "Ginecología", k: "eco embarazo" },
  { t: "Test de intolerancia a la lactosa", u: "clinica", d: "Pruebas complementarias", k: "leche aliento" },
  { t: "Test de intolerancia a la fructosa", u: "clinica", d: "Pruebas complementarias", k: "fruta aliento" },
  { t: "Test SIBO", u: "clinica", d: "Pruebas complementarias", k: "intestino aliento hinchazon" },
  { t: "Celiaquía", u: "clinica", d: "Pruebas complementarias", k: "gluten celiaco" },
  { t: "Helicobacter pylori", u: "clinica", d: "Pruebas complementarias", k: "estomago aliento" },
  { t: "Test de sensibilidad alimentaria", u: "clinica", d: "Pruebas complementarias", k: "alimentos intolerancia" },
  { t: "Test de drogas", u: "clinica", d: "Pruebas complementarias", k: "toxicos" },
  { t: "Prueba de paternidad", u: "clinica", d: "Pruebas complementarias", k: "adn" },
  { t: "Test de embarazo", u: "clinica", d: "Pruebas complementarias", k: "embarazada" },
  { t: "ITS y VPH", u: "clinica", d: "Pruebas complementarias", k: "transmision sexual papiloma" },
  { t: "Accidente laboral", u: "clinica", d: "Unidad de accidentes", k: "mutua trabajo" },
  { t: "Accidente de tráfico", u: "clinica", d: "Unidad de accidentes", k: "coche seguro latigazo" },
  { t: "Odontología conservadora", u: "dental", d: "Empastes y restauraciones", k: "caries empaste" },
  { t: "Odontopediatría", u: "dental", d: "Dentista infantil", k: "niños dentista infantil" },
  { t: "Periodoncia", u: "dental", d: "Encías", k: "encias piorrea" },
  { t: "Implantes dentales", u: "dental", d: "Implantología", k: "implante diente" },
  { t: "Estética dental", u: "dental", d: "Sonrisa", k: "blanqueamiento carillas" },
  { t: "Cirugía oral", u: "dental", d: "Injertos y encía", k: "muela juicio injerto" },
  { t: "Ortodoncia e Invisalign", u: "dental", d: "Brackets y alineadores invisibles", k: "invisalign brackets alineadores ortodoncia invisible" },
  { t: "Prótesis dentales", u: "dental", d: "Cerámica, zirconio o resina", k: "dentadura corona" },
  { t: "Bruxismo y ATM", u: "dental", d: "Férulas y mandíbula", k: "rechinar ferula" },
  { t: "Endodoncia", u: "dental", d: "Tratamiento del nervio", k: "matar nervio" },
  { t: "Radiografía dental", u: "dental", d: "Ortopantomografía", k: "rayos dientes" },
  { t: "Depilación láser", u: "estetica", d: "Para todo tipo de vello", k: "laser vello" },
  { t: "Radiofrecuencia", u: "estetica", d: "Colágeno y firmeza", k: "flacidez" },
  { t: "Tonificación muscular", u: "estetica", d: "Sin esfuerzo, con electromagnetismo", k: "musculo abdomen" },
  { t: "Peeling de carbón", u: "estetica", d: "Rejuvenecimiento con carbón activo", k: "carbon peeling" },
  { t: "Hidrodermoabrasión", u: "estetica", d: "Higiene facial avanzada", k: "limpieza facial" },
  { t: "Eliminación de tatuajes", u: "estetica", d: "Y micropigmentación", k: "tatuaje" },
  { t: "Tratamiento del acné", u: "estetica", d: "Granos, cicatrices y poros", k: "acne poros" },
  { t: "Maderoterapia", u: "estetica", d: "Remodelación corporal", k: "celulitis" },
  { t: "Presoterapia", u: "estetica", d: "Piernas cansadas y retención", k: "drenaje retencion piernas" },
  { t: "Celulitis y remodelación corporal", u: "estetica", d: "Valoración gratuita", k: "grasa localizada cavitacion hifu" },
  { t: "Rejuvenecimiento facial", u: "estetica", d: "Arrugas, manchas y flacidez", k: "arrugas manchas lifting" },
  { t: "Fisioterapia general", u: "fisio", d: "Lesiones musculares y articulares", k: "dolor espalda contractura" },
  { t: "Fisioterapia a domicilio", u: "fisio", d: "En toda la comarca", k: "casa" },
  { t: "Fisioterapia deportiva", u: "fisio", d: "Prevención y recuperación", k: "deporte lesion" },
  { t: "Fisioterapia pediátrica", u: "fisio", d: "Bebés, niños y adolescentes", k: "niños bebe" },
  { t: "Fisioterapia neurológica", u: "fisio", d: "Sistema nervioso", k: "ictus" },
  { t: "Suelo pélvico", u: "fisio", d: "Valoración incluida", k: "incontinencia postparto" },
  { t: "Fisioterapia invasiva", u: "fisio", d: "Con ecografía", k: "epi puncion seca electrolisis" },
  { t: "Osteopatía", u: "fisio", d: "Terapia manual", k: "" },
  { t: "Pilates terapéutico", u: "fisio", d: "Con fisioterapeuta", k: "pilates" },
  { t: "Cólico del lactante", u: "fisio", d: "Primeros 4 meses", k: "bebe llanto colico" },
  { t: "Medicina estética facial", u: "estetica", d: "Rejuvenecimiento y lifting sin cirugía", k: "medicina estetica arrugas" },
  { t: "Rehabilitación de prótesis de rodilla", u: "fisio", d: "Rehabilitación", k: "rodilla protesis" },
  { t: "Rehabilitación por accidente de tráfico", u: "fisio", d: "Convenio de tráfico", k: "latigazo cervical coche" }
];
CATALOGO.forEach(x => x.s = norm(x.t + " " + x.d + " " + x.k + " " + UNIDADES[x.u].n));

/* ---------- tema ---------- */
const raiz = document.documentElement;
$("#bTema").addEventListener("click", () => {
  const oscuro = raiz.dataset.theme ? raiz.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  raiz.dataset.theme = oscuro ? "light" : "dark";
});

/* ---------- barra de mejoras ---------- */
$("#bMejoras").addEventListener("click", e => {
  const ver = $("#mejoras").classList.toggle("ver");
  e.currentTarget.setAttribute("aria-expanded", ver);
});

/* ---------- menú móvil ---------- */
const movil = $("#movil");
const menu = si => { movil.classList.toggle("ver", si); $("#bMenu").setAttribute("aria-expanded", si); document.body.style.overflow = si ? "hidden" : ""; };
$("#bMenu").onclick = () => menu(true);
$("#bCerrarMenu").onclick = () => menu(false);
$$("a", movil).forEach(a => a.addEventListener("click", () => menu(false)));

/* ---------- buscador ---------- */
const q = $("#q"), lista = $("#lista-q");
let sel = -1, hits = [];
function buscar(texto) {
  const t = norm(texto.trim());
  if (!t) { lista.classList.remove("ver"); q.setAttribute("aria-expanded", "false"); return; }
  const palabras = t.split(/\s+/);
  hits = CATALOGO.map(x => {
    let p = 0;
    for (const w of palabras) { const ok = w.length < 4 ? x.s.split(/[^a-z0-9]+/).some(t => t.startsWith(w)) : x.s.includes(w); if (!ok) return null; p += norm(x.t).startsWith(w) ? 3 : norm(x.t).includes(w) ? 2 : 1; }
    return { x, p };
  }).filter(Boolean).sort((a, b) => b.p - a.p).slice(0, 8).map(h => h.x);
  sel = -1;
  lista.innerHTML = hits.length
    ? hits.map((x, i) => `<button type="button" class="res" role="option" id="op-${i}" aria-selected="false" data-i="${i}"><span class="pt" style="background:${UNIDADES[x.u].c}"></span><span><b>${x.t}</b><span>${UNIDADES[x.u].n} · ${x.d}</span></span><em>Pedir cita →</em></button>`).join("")
    : `<p class="vacio">No encontramos «${texto.replace(/[<>&]/g, "")}». Pregunta al asistente o llámanos al 900 000 000.</p>`;
  lista.classList.add("ver"); q.setAttribute("aria-expanded", "true");
}
q.addEventListener("input", () => buscar(q.value));
q.addEventListener("keydown", e => {
  const ops = $$(".res", lista);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault(); if (!ops.length) return;
    sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + ops.length) % ops.length;
    ops.forEach((o, i) => o.setAttribute("aria-selected", i === sel));
    q.setAttribute("aria-activedescendant", ops[sel].id);
  } else if (e.key === "Enter" && sel >= 0) { e.preventDefault(); ops[sel].click(); }
  else if (e.key === "Escape") { lista.classList.remove("ver"); }
});
lista.addEventListener("click", e => { const b = e.target.closest(".res"); if (!b) return; const x = hits[+b.dataset.i]; lista.classList.remove("ver"); abrirCita({ u: x.u, s: x.t }); });
document.addEventListener("click", e => { if (!e.target.closest(".buscador")) lista.classList.remove("ver"); });
$$("[data-sug]").forEach(b => b.addEventListener("click", () => { q.value = b.dataset.sug; q.focus(); buscar(q.value); }));

/* ---------- especialistas ---------- */
const grid = $("#espGrid");
const iniciales = n => n.replace(/^(Dr\.|Dra\.|Unidad de)\s*/, "").split(" ").slice(0, 2).map(w => w[0]).join("");
function pintarEsp(f) {
  grid.innerHTML = ESPECIALISTAS.filter(x => f === "todos" || x.g === f).map((x, i) =>
    `<div class="esp t-clinica" style="--vt:esp-${ESPECIALISTAS.indexOf(x)}"><span class="av" aria-hidden="true">${iniciales(x.p)}</span><span><b>${x.p}</b><span>${x.e}</span></span><button type="button" aria-label="Pedir cita con ${x.p}" data-esp="${ESPECIALISTAS.indexOf(x)}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></button></div>`).join("");
}
pintarEsp("todos");
$$(".filtros button").forEach(b => b.addEventListener("click", () => {
  const cambiar = () => { $$(".filtros button").forEach(x => x.setAttribute("aria-pressed", x === b)); pintarEsp(b.dataset.f); };
  document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches ? document.startViewTransition(cambiar) : cambiar();
}));
grid.addEventListener("click", e => { const b = e.target.closest("[data-esp]"); if (!b) return; const x = ESPECIALISTAS[+b.dataset.esp]; abrirCita({ u: "clinica", s: x.e.split(" · ")[0], pro: x.p }); });

/* ---------- seguros ---------- */
const ver = $("#veredicto");
const icoSi = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
const icoInfo = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>';
$("#seguro").addEventListener("change", e => {
  const v = e.target.value;
  const txt = {
    "": null,
    "privado-salud": [true, "Trabajamos con las principales aseguradoras privadas. Dinos cuál tienes y te confirmamos la cobertura antes de la cita."],
    mutualidad: [true, "Atendemos a mutualistas. Trae tu tarjeta y, si tu entidad lo pide, el volante de autorización."],
    trafico: [true, "Sí. Gestionamos tu caso y la rehabilitación en nuestra unidad de fisioterapia, adherida al convenio de tráfico."],
    laboral: [true, "Sí. Contamos con unidad de accidentes laborales para la primera atención. Trae el parte de tu mutua."],
    privado: [true, "Sin problema: puedes venir como paciente privado. Te informamos del precio antes de la consulta."]
  }[v];
  if (!txt) { ver.className = "veredicto"; return; }
  ver.className = "veredicto ver " + (txt[0] ? "si" : "consulta");
  ver.innerHTML = (txt[0] ? icoSi : icoInfo) + "<span>" + txt[1] + "</span>";
});

/* ---------- cita (asistente de 5 pasos) ---------- */
const dlg = $("#dCita"), cuerpo = $("#mCuerpo"), bSig = $("#mSig"), bAtras = $("#mAtras");
let paso = 0, cita = {};
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function proximosDias() {
  const out = []; const d = new Date(); d.setHours(0, 0, 0, 0);
  while (out.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d)); }
  return out;
}
function huecos(fecha) {
  const base = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "16:30", "17:00", "17:30", "18:00", "18:30"];
  let s = fecha.getDate() * 7 + fecha.getMonth();
  return base.map(h => { s = (s * 9301 + 49297) % 233280; return { h, libre: s / 233280 > 0.35 }; });
}
function pintarPaso() {
  $$(".pasos i").forEach((i, k) => i.classList.toggle("on", k <= paso));
  bAtras.style.visibility = paso > 0 && paso < 5 ? "visible" : "hidden";
  bSig.style.display = paso < 5 ? "" : "none";
  let h = "";
  if (paso === 0) {
    h = `<h4>¿En qué unidad?</h4><div class="opciones">${Object.entries(UNIDADES).map(([k, u]) => `<button type="button" class="op" data-v="${k}" aria-pressed="${cita.u === k}"><b style="color:${u.c}">${u.n}</b><span>${{ clinica: "Médicos y pruebas", dental: "1.ª consulta gratis", estetica: "Facial y corporal", fisio: "Fisio y osteopatía" }[k]}</span></button>`).join("")}</div>`;
  } else if (paso === 1) {
    const ops = CATALOGO.filter(x => x.u === cita.u);
    h = `<h4>¿Qué necesitas en ${UNIDADES[cita.u].n}?</h4><div class="opciones">${ops.map(x => `<button type="button" class="op" data-v="${x.t}" aria-pressed="${cita.s === x.t}"><b>${x.t}</b><span>${x.d}</span></button>`).join("")}</div>`;
  } else if (paso === 2) {
    h = `<h4>Elige día</h4><div class="dias">${proximosDias().map(d => { const k = d.toISOString().slice(0, 10); return `<button type="button" class="op" data-v="${k}" aria-pressed="${cita.dia === k}"><span>${DIAS[d.getDay()]}</span><b>${d.getDate()}</b><span>${MESES[d.getMonth()]}</span></button>`; }).join("")}</div>`;
  } else if (paso === 3) {
    const d = new Date(cita.dia + "T00:00");
    h = `<h4>Elige hora · ${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}</h4><div class="horas">${huecos(d).map(x => `<button type="button" class="op" data-v="${x.h}" ${x.libre ? "" : "disabled"} aria-pressed="${cita.hora === x.h}">${x.h}</button>`).join("")}</div><p class="aviso-demo">Huecos de demostración: en la web real salen de la agenda del centro.</p>`;
  } else if (paso === 4) {
    const d = new Date(cita.dia + "T00:00");
    h = `<h4>Tus datos</h4><div class="resumen"><div><span>Unidad</span><b>${UNIDADES[cita.u].n}</b></div><div><span>Servicio</span><b>${cita.s}</b></div>${cita.pro ? `<div><span>Profesional</span><b>${cita.pro}</b></div>` : ""}<div><span>Fecha</span><b>${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]} · ${cita.hora}</b></div></div>
    <div class="form-cita"><label>Nombre y apellidos<input type="text" id="cNom" autocomplete="name" value="${cita.nom || ""}"></label><label>Teléfono móvil<input type="tel" id="cTel" autocomplete="tel" inputmode="tel" value="${cita.tel || ""}"></label><label class="check"><input type="checkbox" id="cPriv" ${cita.priv ? "checked" : ""}>Acepto la política de privacidad y que me contactéis para gestionar la cita.</label><label class="check"><input type="checkbox" id="cRec" checked>Quiero recibir un recordatorio por WhatsApp el día antes.</label></div>`;
  } else {
    h = `<div class="ok-grande"><span class="circ"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg></span><h4>¡Solicitud de cita lista!</h4><p style="color:var(--muted)">En la web real recibirías ahora la confirmación por WhatsApp y un enlace para añadirla a tu calendario o anularla.</p><p class="aviso-demo">Demostración: no se ha enviado ningún dato.</p><button type="button" class="btn btn-1" data-cerrar>Cerrar</button></div>`;
  }
  cuerpo.innerHTML = h;
  bSig.textContent = paso === 4 ? "Confirmar cita" : "Continuar";
  validar();
}
function validar() {
  const ok = [cita.u, cita.s, cita.dia, cita.hora, cita.nom && cita.tel && cita.priv][paso];
  bSig.disabled = !ok; bSig.style.opacity = ok ? 1 : .45;
}
cuerpo.addEventListener("click", e => {
  const b = e.target.closest(".op"); if (!b || b.disabled) return;
  const campo = ["u", "s", "dia", "hora"][paso];
  if (campo === "u" && cita.u !== b.dataset.v) { cita.s = null; cita.pro = null; }
  cita[campo] = b.dataset.v;
  $$(".op", cuerpo).forEach(o => o.setAttribute("aria-pressed", o === b));
  validar();
});
cuerpo.addEventListener("input", () => {
  if (paso !== 4) return;
  cita.nom = $("#cNom").value.trim(); cita.tel = $("#cTel").value.replace(/\D/g, "").length >= 9 ? $("#cTel").value : ""; cita.priv = $("#cPriv").checked;
  validar();
});
bSig.addEventListener("click", () => { if (!bSig.disabled) { paso++; pintarPaso(); } });
bAtras.addEventListener("click", () => { paso = Math.max(0, paso - 1); pintarPaso(); });
dlg.addEventListener("click", e => { if (e.target.closest("[data-cerrar]") || e.target === dlg) dlg.close(); });
function abrirCita(pre = {}) {
  cita = { ...pre }; paso = pre.s ? 2 : pre.u ? 1 : 0;
  menu(false); pintarPaso(); dlg.showModal();
}
document.addEventListener("click", e => { const b = e.target.closest("[data-cita]"); if (!b || b.closest("dialog")) return; e.preventDefault(); abrirCita(b.dataset.cita ? { u: b.dataset.cita } : {}); });

/* ---------- asistente (demo con respuestas sobre datos reales del centro) ---------- */
const chat = $("#chat"), fab = $("#fab"), msjs = $("#mensajes");
let saludado = false;
function abrirChat(si) {
  chat.classList.toggle("ver", si); fab.setAttribute("aria-expanded", si);
  if (si && !saludado) { saludado = true; bot("¡Hola! Soy el asistente de Policlínica Vereda. Puedo ayudarte con citas, seguros, resultados, pruebas y cómo llegar. ¿Qué necesitas?"); }
  if (si) setTimeout(() => $("#tChat").focus(), 50);
}
fab.onclick = () => abrirChat(!chat.classList.contains("ver"));
$("#cerrarChat").onclick = () => abrirChat(false);
function añadir(html, quien) { const d = document.createElement("div"); d.className = "msg " + quien; d.innerHTML = html; msjs.appendChild(d); msjs.scrollTop = msjs.scrollHeight; return d; }
function bot(html) {
  const t = añadir('<span class="escribiendo" aria-label="Escribiendo"><i></i><i></i><i></i></span>', "bot");
  setTimeout(() => { t.innerHTML = html; msjs.scrollTop = msjs.scrollHeight; }, 550);
}
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function responder(texto) {
  const t = norm(texto);
  const BCITA = (u = "") => `<div class="acc"><button type="button" data-cita="${u}">Pedir cita</button><a href="#contacto">WhatsApp</a></div>`;
  if (/urgen|dolor (en el )?pecho|no puedo respirar|desmay|sangr/.test(t)) return "Si es una urgencia, llama ahora al <b>112</b>. Yo no puedo valorar síntomas.";
  if (/donde|direcc|llegar|ubica|mapa|aparcar/.test(t)) return "Estamos en la <b>C/ de la Salud, 12</b>, en el centro de la ciudad, con aparcamiento cercano.";
  if (/horari|hora abr|abris|abierto|cierra/.test(t)) return "Abrimos de lunes a viernes de 8:00 a 21:00 y los sábados de 9:00 a 14:00. Pide cita online y verás los huecos libres." + BCITA();
  if (/seguro|mutua|aseguradora|poliza/.test(t)) return "Trabajamos con las principales aseguradoras privadas, mutualidades y mutuas laborales. Dime cuál tienes y te confirmamos la cobertura antes de la cita." + BCITA();
  if (/resultado|analisis|analitica|laborator|informe/.test(t)) return "Puedes ver tus resultados e informes en el área del paciente con el código que te damos en el centro.";
  if (/precio|cuanto cuesta|cuesta|tarifa|presupuesto/.test(t)) return "Te damos presupuesto sin compromiso. En Dental la <b>primera consulta es gratuita</b> y en Estética la valoración corporal también." + BCITA();
  if (/cita|reserv|turno|consulta con/.test(t)) return "Puedo abrirte la cita online: eliges unidad, servicio, día y hora en menos de un minuto." + BCITA();
  if (/domicilio|casa/.test(t)) return "Sí, hacemos <b>fisioterapia a domicilio</b> en toda la comarca." + BCITA("fisio");
  if (/trabaj(ar|o) con vosotros|empleo|curriculum/.test(t)) return "Puedes enviar tu currículum a <b>hola@policlinicavereda.example</b>.";
  const palabras = t.split(/\s+/).filter(w => w.length > 3);
  const encontrados = CATALOGO.filter(x => palabras.some(w => x.s.includes(w))).slice(0, 3);
  if (encontrados.length) return "Esto es lo que tenemos relacionado:\n" + encontrados.map(x => `• <b>${x.t}</b> — ${UNIDADES[x.u].n}${x.d ? " · " + x.d : ""}`).join("\n") + BCITA(encontrados[0].u);
  return "No estoy seguro de haberte entendido. Puedes llamarnos al <b>900 000 000</b> o escribirnos por WhatsApp y te atiende una persona." + BCITA();
}
function preguntar(texto) { if (!texto.trim()) return; añadir(esc(texto), "yo"); bot(responder(texto)); }
$("#fChat").addEventListener("submit", e => { e.preventDefault(); const i = $("#tChat"); preguntar(i.value); i.value = ""; });
$$(".rapidas button").forEach(b => b.onclick = () => preguntar(b.dataset.p));
msjs.addEventListener("click", e => { const b = e.target.closest("[data-cita]"); if (b) { e.stopPropagation(); abrirCita(b.dataset.cita ? { u: b.dataset.cita } : {}); } });

addEventListener("keydown", e => { if (e.key === "Escape") { abrirChat(false); menu(false); } });
})();
