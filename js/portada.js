(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ls = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
  // Dirección del servidor que recibe los mensajes. Vacía: se ofrece copiar el mensaje.
  const API_CONTACTO = "https://cuaderna-jam-gwhugrdqcub6e9ba.swedencentral-01.azurewebsites.net/api/contacto";

  /* ---------- tema ---------- */
  const raiz = document.documentElement;
  const temaGuardado = ls.get("astillero.tema"); if (temaGuardado) raiz.dataset.theme = temaGuardado;
  const oscuroAhora = () => raiz.dataset.theme ? raiz.dataset.theme === "dark" : !matchMedia("(prefers-color-scheme: light)").matches;
  $("#bTema").onclick = () => { const t = oscuroAhora() ? "light" : "dark"; raiz.dataset.theme = t; ls.set("astillero.tema", t); leerColores(); };

  /* ---------- aviso de novedades ----------
     Se monta solo a partir de los bloques de la página que llevan
     data-novedad="AAAA-MM-DD" y data-novedad-txt="Texto del aviso".
     Para anunciar algo nuevo basta con ponerle esos dos atributos (y un id). */
  (() => {
    const caja = $("#novedad"); if (!caja) return;
    const DIAS = 30, MAX = 3, hoy = Date.now();
    const todas = $$("[data-novedad]").map((el, orden) => ({
      id: el.id, txt: el.dataset.novedadTxt, fecha: new Date(el.dataset.novedad + "T00:00:00"), orden
    })).filter(n => n.id && n.txt && !isNaN(n.fecha))
      .sort((a, b) => b.fecha - a.fecha || b.orden - a.orden);
    if (!todas.length) { caja.remove(); return; }
    const recientes = todas.filter(n => (hoy - n.fecha) / 864e5 <= DIAS).slice(0, MAX);
    const lista = recientes.length ? recientes : todas.slice(0, 1);
    caja.querySelector("b").textContent = recientes.length ? "Nuevo" : "Novedad";
    const txt = caja.querySelector(".nov-txt"), pts = caja.querySelector(".nov-pts");
    if (lista.length > 1) pts.innerHTML = lista.map(() => "<i></i>").join("");
    let i = 0;
    const pintar = () => {
      const n = lista[i]; txt.textContent = n.txt; caja.href = "#" + n.id;
      caja.setAttribute("aria-label", "Novedad: " + n.txt);
      [...pts.children].forEach((p, k) => p.classList.toggle("on", k === i));
    };
    pintar();
    if (lista.length < 2 || reducido) return;
    let parado = false;
    ["mouseenter", "focusin"].forEach(e => caja.addEventListener(e, () => parado = true));
    ["mouseleave", "focusout"].forEach(e => caja.addEventListener(e, () => parado = false));
    setInterval(() => {
      if (parado || document.hidden) return;
      caja.classList.add("cambia");
      setTimeout(() => { i = (i + 1) % lista.length; pintar(); caja.classList.remove("cambia"); }, 300);
    }, 5000);
  })();

  /* ---------- aviso breve ---------- */
  let tt; const aviso = txt => { const t = $("#toast"); t.textContent = txt; t.classList.add("ver"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("ver"), 2200); };

  /* ---------- cabecera, progreso, volver arriba ---------- */
  const cab = $("#cabecera"), prog = $("#progreso"), arriba = $("#bArriba");
  let ultimo = 0, pendiente = false;
  const alScroll = () => {
    pendiente = false;
    const y = scrollY, alto = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${alto > 0 ? y / alto : 0})`;
    cab.classList.toggle("solido", y > 12);
    cab.classList.toggle("oculto", y > 400 && y > ultimo + 4 && !$("#movil").classList.contains("abierto"));
    if (y < ultimo - 4) cab.classList.remove("oculto");
    ultimo = y;
    arriba.classList.toggle("ver", y > 900);
    avanceProceso();
  };
  addEventListener("scroll", () => { if (!pendiente){ pendiente = true; requestAnimationFrame(alScroll); } }, {passive: true});
  arriba.onclick = () => scrollTo({top: 0, behavior: reducido ? "auto" : "smooth"});

  /* ---------- menú: enlace activo ---------- */
  const enlaces = $$("nav.menu a");
  const secciones = enlaces.map(a => $(a.getAttribute("href")));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id));
  }), {rootMargin: "-45% 0px -50% 0px"});
  secciones.forEach(s => s && io.observe(s));

  /* ---------- menú móvil ---------- */
  const movil = $("#movil"), bMenu = $("#bMenu");
  const abrir = si => { movil.classList.toggle("abierto", si); bMenu.setAttribute("aria-expanded", si); document.body.style.overflow = si ? "hidden" : ""; if (si) setTimeout(() => $("#bCerrar").focus(), 200); else bMenu.focus({preventScroll: true}); };
  bMenu.onclick = () => abrir(true); $("#bCerrar").onclick = () => abrir(false);
  movil.querySelectorAll("a").forEach(a => a.addEventListener("click", () => abrir(false)));
  addEventListener("keydown", e => { if (e.key === "Escape" && movil.classList.contains("abierto")) abrir(false); });

  /* ---------- aparición suave (visible siempre; solo se desplaza) ---------- */
  if (!reducido && "IntersectionObserver" in window){
    const rev = $$(".rev").filter(el => el.getBoundingClientRect().top > innerHeight);
    rev.forEach(el => el.classList.add("pre"));
    const ob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.remove("pre"); ob.unobserve(e.target); } }), {rootMargin: "0px 0px -8% 0px"});
    rev.forEach(el => ob.observe(el));
  }

  /* ---------- cinta: duplicar para bucle continuo ---------- */
  const pista = $("#pista"); pista.innerHTML += pista.innerHTML;

  /* ---------- botones magnéticos ---------- */
  if (!reducido && matchMedia("(pointer:fine)").matches){
    $$(".iman").forEach(b => {
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.setProperty("--mx", ((e.clientX - r.left - r.width/2) * .18) + "px"); b.style.setProperty("--my", ((e.clientY - r.top - r.height/2) * .25) + "px"); });
      b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
    });
  }

  /* ---------- foco de luz en tarjetas ---------- */
  $$(".serv").forEach(c => c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); c.style.setProperty("--x", (e.clientX - r.left) + "px"); c.style.setProperty("--y", (e.clientY - r.top) + "px"); }));

  /* ---------- plano de formas interactivo ---------- */
  const cv = $("#casco"), ctx = cv.getContext("2d");
  let col = {};
  function leerColores(){ const s = getComputedStyle(raiz); col = { linea: s.getPropertyValue("--line-strong").trim(), tenue: s.getPropertyValue("--line").trim(), acento: s.getPropertyValue("--accent").trim(), fg: s.getPropertyValue("--fg").trim(), muted: s.getPropertyValue("--muted").trim() }; dibujar(); }
  matchMedia("(prefers-color-scheme: light)").addEventListener?.("change", leerColores);
  let W = 0, H = 0, dpr = 1;
  const estado = { manga: 1, llenado: .55, objManga: 1, objLlenado: .55, t: 0, raton: null };
  function medir(){ const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); dibujar(); }
  function dibujar(){
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cub = H * .30, base = H * .72, prof = base - cub;
    const semi = W * .36 * estado.manga, N = 10;
    // líneas de agua y línea base
    ctx.lineWidth = 1;
    for (let k = 0; k <= 5; k++){
      const y = base - prof * k / 5;
      ctx.strokeStyle = k === 3 ? col.acento : col.tenue; ctx.setLineDash(k === 3 ? [6, 5] : []);
      ctx.beginPath(); ctx.moveTo(W * .06, y); ctx.lineTo(W * .94, y); ctx.stroke();
    }
    ctx.setLineDash([]);
    // crujía
    ctx.strokeStyle = col.linea; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(cx, H * .14); ctx.lineTo(cx, H * .9); ctx.stroke(); ctx.setLineDash([]);
    // cuadernas: popa a la izquierda, proa a la derecha
    for (let i = 0; i <= N; i++){
      const f = i / N;
      const forma = 1 - Math.pow(Math.abs(f - .45) / .55, 2.1);       // manga relativa de cada cuaderna
      const w = semi * Math.max(.06, forma);
      const lleno = estado.llenado * (.55 + .45 * forma);
      const lado = f < .45 ? -1 : 1;
      const ola = reducido ? 0 : Math.sin(estado.t * .9 + i * .55) * 2;
      const xs = cx + lado * w, xFondo = cx;
      ctx.strokeStyle = i === 5 ? col.acento : col.fg;
      ctx.globalAlpha = i === 5 ? 1 : .35 + .5 * forma;
      ctx.lineWidth = i === 5 ? 2 : 1.2;
      ctx.beginPath();
      ctx.moveTo(xs, cub + ola);
      ctx.bezierCurveTo(cx + lado * w * (1.02 + .1 * estado.manga), cub + prof * lleno, cx + lado * w * (.15 + .6 * lleno), base, xFondo, base);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // cubierta y cota de manga
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - semi, cub - 18); ctx.lineTo(cx + semi, cub - 18); ctx.stroke();
    [cx - semi, cx + semi].forEach(x => { ctx.beginPath(); ctx.moveTo(x, cub - 24); ctx.lineTo(x, cub - 12); ctx.stroke(); });
    ctx.fillStyle = col.muted; ctx.font = "500 10.5px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
    ctx.fillText("MANGA", cx, cub - 24);
    ctx.textAlign = "left"; ctx.fillStyle = col.acento; ctx.fillText("LF", W * .06, base - prof * 3 / 5 - 6);
    // retícula del cursor
    if (estado.raton){
      const {x, y} = estado.raton; ctx.strokeStyle = col.acento; ctx.globalAlpha = .55; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const lectura = $("#lecturaManga");
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    estado.raton = {x, y};
    estado.objManga = .72 + .52 * Math.abs(x - r.width / 2) / (r.width / 2);
    estado.objLlenado = .3 + .6 * (y / r.height);
    if (reducido){ estado.manga = estado.objManga; estado.llenado = estado.objLlenado; dibujar(); }
  });
  cv.addEventListener("pointerleave", () => { estado.raton = null; estado.objManga = 1; estado.objLlenado = .55; if (reducido){ estado.manga = 1; estado.llenado = .55; dibujar(); } });
  let visible = true, ultimoT = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);
  function bucle(t){
    requestAnimationFrame(bucle);
    if (!visible || document.hidden) return;
    const dt = Math.min(.05, (t - ultimoT) / 1000 || 0); ultimoT = t;
    estado.t += dt; estado.manga += (estado.objManga - estado.manga) * .08; estado.llenado += (estado.objLlenado - estado.llenado) * .08;
    lectura.textContent = "Manga " + estado.manga.toFixed(2).replace(".", ",");
    dibujar();
  }
  new ResizeObserver(medir).observe(cv);
  leerColores();
  if (!reducido) requestAnimationFrame(bucle);

  /* ---------- Cuaderna: pestañas que cambian la pantalla ---------- */
  const textos = {
    dictar: "Pulsas el botón, hablas y listo. Cuaderna pasa la voz a texto y guarda el audio por si acaso. Pensada para apuntar desde el coche o al salir de una visita.",
    ordenar: "La inteligencia artificial pone título, separa tareas, detecta fechas y personas y te lo recuerda a tiempo. Tú solo apuntas.",
    pasar: "Pasa una nota a otra persona por WhatsApp con un enlace claro. Quien la recibe la abre, la marca como hecha y te llega el aviso."
  };
  const pantallas = {
    dictar: `<div class="nota"><b>Llamar a Ramírez por el pedido</b><small>Hoy · 09:12 · dictada</small></div><div class="ondas">${Array.from({length: 16}, (_, i) => `<i style="animation-delay:${(i * .07).toFixed(2)}s"></i>`).join("")}</div><div class="micro"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></div>`,
    ordenar: `<div class="nota"><b>Presupuesto cuadro eléctrico</b><small>Mañana · 10:00</small><div class="chips"><i>Cliente</i><i>Recordatorio</i></div></div><div class="nota"><b>Lista de material</b><small>3 de 5 hechas</small><div class="chips"><i>Lista</i><i>Obra</i></div></div><div class="nota"><b>Idea: catálogo en PDF</b><small>Sin fecha</small><div class="chips"><i>Idea</i></div></div>`,
    pasar: `<div class="nota"><b>Revisar instalación nave 3</b><small>Para Ana · viernes</small></div><div class="wa">Hola Ana 👋<br><b>📒 Revisar instalación nave 3</b><br>📅 Para el viernes<br>👉 Ábrela y márcala como hecha</div><div class="nota" style="border-color:#7FB58F"><b>✓ Ana la ha marcado como hecha</b><small>Hace un momento</small></div>`
  };
  const pest = $$("#proyectos .pestanas button");
  const mostrar = clave => { pest.forEach(b => b.setAttribute("aria-selected", b.dataset.p === clave)); $("#pestTxt").textContent = textos[clave]; $("#pVista").innerHTML = pantallas[clave]; };
  pest.forEach(b => b.onclick = () => { mostrar(b.dataset.p); parado = true; });
  let idx = 0, parado = false; mostrar("dictar");
  if (!reducido) setInterval(() => { if (parado || document.hidden) return; idx = (idx + 1) % 3; mostrar(["dictar", "ordenar", "pasar"][idx]); }, 6000);
  const hora = () => { const d = new Date(); $("#pHora").textContent = d.toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}); }; hora(); setInterval(hora, 30000);

  /* ---------- Cucharón: pestañas que cambian la pantalla ---------- */
  const cuTextos = {
    buscar: "Escribes lo que te apetece y Cucharón busca en la web, lee las recetas de los primeros resultados y te las ordena: arriba, las mejor posicionadas y las más completas y claras. Cada una con su fuente.",
    comensales: "Dices cuántos sois y todas las cantidades se recalculan al momento. Después la mandas a la lista de la compra o la cocinas paso a paso, en letra grande.",
    libro: "Con tus recetas creas tu propio libro de cocina en PDF: portada, dedicatoria, índice, las recetas y un cierre con todas las fuentes. Para imprimir o regalar."
  };
  const cuPantallas = {
    buscar: `<div class="cu-busca"><span>merluza en salsa verde</span><i>Buscar</i></div><span class="cu-et">3 recetas · revisadas 8 webs</span><div class="cu-ficha top"><div class="sup"><span class="cu-et">01 · Cocina Fácil</span><span class="cu-nota">86</span></div><b>Merluza en salsa verde</b><small>35 min · para 4 · 4,8 ★ (312)</small></div><div class="cu-ficha"><div class="sup"><span class="cu-et">02 · Recetas de la tía</span><span class="cu-nota">71</span></div><b>Merluza a la vasca</b><small>40 min · para 2</small></div><div class="cu-ficha"><div class="sup"><span class="cu-et">03 · Una revista</span><span class="cu-nota">64</span></div><b>Merluza con almejas</b><small>30 min · para 4</small></div>`,
    comensales: `<div class="cu-paso"><span>Para</span><span class="ctl"><i>−</i><output>6</output><i>+</i></span><span style="font-weight:400;color:#5D6577">personas</span></div><div class="cu-ing"><div><em>450 g</em>lentejas pardinas</div><div><em>1½</em>cebolla</div><div><em>3 dientes</em>ajo</div><div><em>1½ cdta.</em>pimentón dulce</div><div><em>2,3 l</em>agua</div></div><div class="cu-ficha"><span class="cu-et">Fuente</span><span class="fte"><strong>Cocina de la abuela</strong> · Marta Gil</span></div>`,
    libro: `<span class="cu-et">Tu libro de cocina · A5</span><div class="cu-libro"><div class="cu-pag portada"><span style="font:600 5px var(--f-mono);letter-spacing:.12em">RECETARIO</span><b>Recetario de la familia</b><span style="font-style:italic">De la cocina de casa</span></div><div class="cu-pag"><h5>ÍNDICE</h5><span class="c">SOPAS Y GUISOS</span><div class="l"><span>Lentejas estofadas</span><span>5</span></div><div class="l"><span>Salmorejo</span><span>7</span></div><span class="c">POSTRES</span><div class="l"><span>Bizcocho de yogur</span><span>10</span></div><div class="l"><span>Tarta de queso</span><span>12</span></div><span class="c">FUENTES</span><div class="l"><span>Todas las fuentes</span><span>14</span></div></div></div><div class="cu-ficha"><span class="fte">Portada · dedicatoria · índice · recetas · <strong>fuentes</strong> · cierre</span></div>`
  };
  const cuPest = $$("#cucharon .pestanas button");
  const cuMostrar = clave => { cuPest.forEach(b => b.setAttribute("aria-selected", b.dataset.c === clave)); $("#cuTxt").textContent = cuTextos[clave]; $("#cuVista").innerHTML = cuPantallas[clave]; };
  let cuIdx = 0, cuParado = false;
  cuPest.forEach(b => b.onclick = () => { cuMostrar(b.dataset.c); cuParado = true; });
  cuMostrar("buscar");
  if (!reducido) setInterval(() => { if (cuParado || document.hidden) return; cuIdx = (cuIdx + 1) % 3; cuMostrar(["buscar", "comensales", "libro"][cuIdx]); }, 6000);
  const cuHora = () => { $("#cuHora").textContent = new Date().toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}); }; cuHora(); setInterval(cuHora, 30000);

  /* ---------- Singladura: pestañas que cambian la pantalla ---------- */
  const siTextos = {
    juntar: "Eliges fotos de tu galería y Singladura mira en el móvil cuáles encajan con las fechas del viaje. Tú decides cuáles compartir; las demás no salen de tu móvil.",
    linea: "Las fotos de todos, juntas por día y por momentos, con la inicial de quien la hizo. Puedes ver solo las de una persona y abrir cada una a pantalla completa.",
    descargar: "Te llevas el viaje entero en calidad original, en un ZIP con las fotos ordenadas por fecha y autor. Al llegar la fecha de cierre se borra todo, también las fotos."
  };
  const siT = (c, i = "", ok = "") => `<div class="si-t ${c} ${ok}">${i}</div>`;
  const siPantallas = {
    juntar: `<span class="si-et">Oporto · 12–15 nov.</span><b class="si-h">Añade las tuyas</b><span class="si-et">38 de 212 encajan con el viaje</span><div class="si-rej">${siT("", "", "ok")}${siT("b", "", "ok")}${siT("c", "", "ok")}${siT("d", "", "ok")}${siT("e", "", "ok")}${siT("f", "", "no")}</div><span class="si-et">¿Son del viaje? · 3</span><div class="si-rej">${siT("c", "", "no")}${siT("b", "", "no")}${siT("d", "", "no")}</div><div class="si-btn">Compartir 38 fotos</div>`,
    linea: `<span class="si-et">Oporto · 4 personas · 214 fotos</span><b class="si-h">Sábado 12 nov.</b><div class="si-mom"><b>11:40</b><span>6 fotos</span></div><div class="si-rej">${siT("", "<i>L</i>")}${siT("c", "<i class='v'>A</i>")}${siT("b", "<i class='n'>T</i>")}${siT("d", "<i>L</i>")}${siT("", "<i class='m'>M</i>")}${siT("c", "<i class='v'>A</i>")}</div><div class="si-mom"><b>20:15</b><span>3 fotos</span></div><div class="si-rej">${siT("e", "<i class='n'>T</i>")}${siT("f", "<i>L</i>")}${siT("b", "<i class='m'>M</i>")}</div>`,
    descargar: `<span class="si-et">Oporto · 214 fotos · 484 MB</span><b class="si-h">Descargar el viaje</b><div class="si-zip"><div>Oporto (1 de 2).zip<small>132 fotos · 300 MB</small></div><em>LISTO</em></div><div class="si-zip"><div>Oporto (2 de 2).zip<small>82 fotos · 184 MB</small></div><em>64 %</em></div><div class="si-cand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span><b>Cifradas en tu móvil.</b> Ni nosotros podemos verlas. Abierto hasta el 14 de enero.</span></div><div class="si-btn">Descargar el viaje completo</div>`
  };
  const siPest = $$("#singladura .pestanas button");
  const siMostrar = clave => { siPest.forEach(b => b.setAttribute("aria-selected", b.dataset.s === clave)); $("#siTxt").textContent = siTextos[clave]; $("#siVista").innerHTML = siPantallas[clave]; };
  let siIdx = 0, siParado = false;
  siPest.forEach(b => b.onclick = () => { siMostrar(b.dataset.s); siParado = true; });
  siMostrar("juntar");
  if (!reducido) setInterval(() => { if (siParado || document.hidden) return; siIdx = (siIdx + 1) % 3; siMostrar(["juntar", "linea", "descargar"][siIdx]); }, 6000);
  const siHora = () => { $("#siHora").textContent = new Date().toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}); }; siHora(); setInterval(siHora, 30000);

  /* ---------- método: línea de avance ---------- */
  const proceso = $("#proceso"), pasos = $$(".paso"), linea = $("#avance");
  function avanceProceso(){
    const r = proceso.getBoundingClientRect(), centro = innerHeight * .55;
    const h = Math.max(0, Math.min(r.height - 16, centro - r.top));
    linea.style.setProperty("--h", h + "px");
    pasos.forEach(p => { const pr = p.getBoundingClientRect(); p.classList.toggle("vivo", pr.top + 30 < centro); });
  }
  avanceProceso();

  /* ---------- configurador ---------- */
  const plazos = ["Lo antes posible", "En un mes", "En unos 2 meses", "En 3 a 6 meses", "Sin prisa"];
  const leerConfig = () => ({
    tipos: $$("#cTipo input:checked").map(i => i.value),
    punto: $("#cPunto input:checked")?.value || "",
    plazo: plazos[+$("#cPlazo").value - 1],
    pres: $("#cPres input:checked")?.value || ""
  });
  function pintarConfig(){
    const c = leerConfig();
    $("#rTipo").textContent = c.tipos.length ? c.tipos.join(", ") : "Marca al menos una opción";
    $("#rPunto").textContent = c.punto; $("#rPlazo").textContent = c.plazo; $("#rPres").textContent = c.pres;
    $("#cPlazoTxt").textContent = c.plazo;
    $("#medidor").style.setProperty("--p", (c.tipos.length ? 55 + Math.min(45, c.tipos.length * 15) : 15) + "%");
  }
  $("#configurador").addEventListener("change", pintarConfig); $("#cPlazo").addEventListener("input", pintarConfig); pintarConfig();
  $("#bLlevar").addEventListener("click", () => {
    const c = leerConfig();
    const txt = `Necesito: ${c.tipos.length ? c.tipos.join(", ") : "(por concretar)"}.\nPunto de partida: ${c.punto}.\nPlazo: ${c.plazo}.\nPresupuesto aproximado: ${c.pres}.\n\nMás detalles: `;
    const m = $("#fMsg"); m.value = txt; contar(); setTimeout(() => { m.focus({preventScroll: true}); m.setSelectionRange(m.value.length, m.value.length); }, 600);
    aviso("Resumen añadido al formulario");
  });

  /* ---------- formulario ---------- */
  const fMsg = $("#fMsg");
  const contar = () => { $("#fCont").textContent = `${fMsg.value.length} / 1500`; };
  fMsg.addEventListener("input", contar);
  const reglas = { fNombre: v => v.trim().length >= 2, fEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), fMsg: v => v.trim().length >= 20 };
  const validar = id => { const el = $("#" + id), ok = reglas[id](el.value), c = el.closest(".campo"); c.classList.toggle("mal", !ok); c.classList.toggle("bien", ok); return ok; };
  Object.keys(reglas).forEach(id => { $("#" + id).addEventListener("blur", () => { if ($("#" + id).value) validar(id); }); $("#" + id).addEventListener("input", () => { if ($("#" + id).closest(".campo").classList.contains("mal")) validar(id); }); });
  const fAviso = $("#fAviso");
  $("#formulario").addEventListener("submit", async e => {
    e.preventDefault();
    const malos = Object.keys(reglas).filter(id => !validar(id));
    if (malos.length){ $("#" + malos[0]).focus(); return; }
    if (!$("#fAcepto").checked){ aviso("Marca la casilla de aceptación para enviar"); $("#fAcepto").focus(); return; }
    const datos = { nombre: $("#fNombre").value.trim(), empresa: $("#fEmpresa").value.trim(), email: $("#fEmail").value.trim(), tel: $("#fTel").value.trim(), mensaje: fMsg.value.trim(), web: $("#fWeb").value };
    const b = $("#fEnviar"); b.disabled = true; b.firstChild.textContent = "Enviando… ";
    let enviado = false;
    if (API_CONTACTO){
      try { const r = await fetch(API_CONTACTO, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(datos)}); enviado = r.ok; } catch(err){ enviado = false; }
    }
    b.disabled = false; b.firstChild.textContent = "Enviar mensaje ";
    fAviso.hidden = false;
    if (enviado){
      fAviso.className = "aviso-f ok"; fAviso.innerHTML = `<b>Mensaje enviado.</b><span>Gracias, ${datos.nombre.split(" ")[0]}. Te escribiremos a ${datos.email}.</span>`;
      e.target.reset(); contar(); $$(".campo").forEach(c => c.classList.remove("bien"));
    } else {
      const texto = `${datos.nombre}${datos.empresa ? " (" + datos.empresa + ")" : ""}\n${datos.email}${datos.tel ? " · " + datos.tel : ""}\n\n${datos.mensaje}`;
      fAviso.className = "aviso-f";
      fAviso.innerHTML = `<b>No hemos podido enviarlo desde aquí.</b><span>Copia el mensaje y mándalo a <b>hola@astillerosoftware.es</b>. Lo recibimos igual.</span><pre id="fTexto"></pre><div><button type="button" class="copiar" id="fCopiar" style="margin:0">Copiar mensaje</button></div>`;
      $("#fTexto").textContent = texto;
      $("#fCopiar").onclick = () => copiar(texto, "Mensaje copiado");
    }
    fAviso.scrollIntoView({block: "nearest", behavior: reducido ? "auto" : "smooth"});
  });

  /* ---------- copiar ---------- */
  function copiar(txt, ok){
    const p = navigator.clipboard?.writeText(txt);
    if (p) p.then(() => aviso(ok), () => seleccionar());
    else seleccionar();
    function seleccionar(){ const el = $("#fTexto") || $("#correo"); const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); aviso("Selecciónalo y cópialo"); }
  }
  $$("[data-copiar]").forEach(b => b.onclick = () => copiar($("#" + b.dataset.copiar).textContent, "Correo copiado"));

  $("#anio").textContent = new Date().getFullYear();
})();
