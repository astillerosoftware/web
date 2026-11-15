# CLAUDE.md · Web de Astillero Software (astillerosoftware.es)

Guía rápida para trabajar en este repositorio. Textos en español de España, claros y sin jerga.
Este repositorio es **público**: aquí no se escribe nada interno (clientes, precios, acuerdos, claves).

## Qué es
Web corporativa estática de Astillero Software: servicios, apps propias (Cuaderna, Cucharón, Singladura),
trabajos de referencia (webs de demostración de negocios ficticios), método, configurador «Tu proyecto»,
preguntas y formulario de contacto. Sin framework ni paso de compilación: HTML, CSS y JS a mano.

## Publicación
- Cloudflare Workers con assets estáticos (`wrangler.jsonc`, `assets.directory = "./"`). **Cada push a `main` se publica solo**
  (Workers Builds; el resultado aparece como checks del commit en GitHub). `.assetsignore` deja fuera `.git`, `wrangler.jsonc` y este archivo.
- Dominio `astillerosoftware.es` (registrado en DonDominio). `_redirects` para URL retiradas (p. ej. `/nido/` → `/#proyectos`).
- Antes de subir: probar en local (`python3 -m http.server`) con Chrome, en ancho de PC y de móvil, sin errores en consola.

## Mapa
```
index.html                 portada (CSS en <style> dentro; JS en js/portada.js)
js/portada.js              toda la lógica de la portada (menú, tema, aviso de novedades, pestañas de las apps, configurador, formulario)
js/tema.js                 aplica el tema claro/oscuro guardado antes de pintar (se carga en <head>)
paginas.css                estilos comunes de las páginas interiores
cuaderna/ cucharon/ singladura/   página propia de cada app (enlazan a la app en su subdominio *.astillerosoftware.es)
referencias/<demo>/        webs de demostración (carnes-valdehierro, policlinica-vereda, talleres-biela), cada una con su demo.js
referencias/demo-astillero.js     común a las demos: botón fijo para volver a Astillero y cierre al final
privacidad.html            política de privacidad
sitemap.xml robots.txt og.png favicon.svg favicon-firma.png CNAME _redirects
```

## Reglas
- **CSP estricta** en `<meta http-equiv="Content-Security-Policy">` de **cada** página, justo tras `<meta charset>`.
  Nada de `<script>` en línea ni `onclick=""`: todo JS va en archivos `.js` propios. Solo se permite en línea `application/ld+json`.
  Estilos en línea sí están permitidos (`style-src 'unsafe-inline'`). Si se añade un recurso externo, hay que añadir su dominio a la CSP de todas las páginas.
  Comprobar que no salen errores «Refused to…» en consola. Nota objetivo en Mozilla Observatory: A+.
- **Página nueva** = CSP + `<script src="/js/tema.js">` en `<head>` + aviso de Cloudflare Web Analytics antes de `</body>` + entrada en `sitemap.xml`
  + enlace en el menú y el pie de todas las páginas.
- **Analítica**: Cloudflare Web Analytics, sin cookies (`static.cloudflareinsights.com/beacon.min.js`, mismo token en todas las páginas).
  Todas las páginas deben medir visitas. No se usan Google Analytics ni cookies.
- **Aviso «Nuevo» de la portada** (arriba del todo): se monta solo con los bloques que llevan `data-novedad="AAAA-MM-DD"` y
  `data-novedad-txt="Texto"` (más un `id`). Rota entre las 3 novedades de los últimos 30 días; si no hay ninguna, muestra la última como «Novedad».
  Para anunciar algo, basta con poner esos atributos al bloque nuevo.
- **Productos en la portada**: secciones `.proy` que alternan el móvil a derecha e izquierda (`.proy-b` = móvil a la izquierda).
  Si se quita o añade un producto, revisar que siga alternando y que la primera tras otra lleve `border-top:0`.
- **Formulario de contacto**: envía por `fetch` a `https://cuaderna-jam-gwhugrdqcub6e9ba.swedencentral-01.azurewebsites.net/api/contacto`
  (servidor de Cuaderna, que reenvía el correo). Ese dominio está en `connect-src`. En pruebas, interceptar la petición para no mandar mensajes reales.
- **Fuentes**: hoy se cargan de Google Fonts (permitido en la CSP). La rama `textos-legales` las sirve desde `/fuentes` y quita Google Fonts de la CSP.
- **Imagen de Astillero Software** en todo: rojo lacre, tinta azul marino, cuadrícula de plano. Firmar siempre como Astillero Software, nunca con nombres personales.
- Nada de datos personales de usuarios: las apps no ven la información de nadie, y la web tampoco debe recogerla salvo en el formulario.

## Ramas
- `main`: lo publicado.
- `textos-legales`: aviso legal, política de cookies y fuentes propias. Al día con `main` y con su CSP; pendiente de fusionar.
- `cucharon`, `nido-bajo-peticion`, `claude/project-thread-0g1om9`: antiguas o ya fusionadas, se pueden borrar.

## Comprobaciones
- Observatory: el repositorio `astillerosoftware/cuaderna` tiene el workflow **«Comprobar web»** (`comprobar-web.yml`), que pasa
  Mozilla Observatory a astillerosoftware.es y a cuaderna.astillerosoftware.es. Lanzarlo tras cambios de seguridad.
- Commits en español, describiendo el cambio para una persona no técnica.
