document.getElementById("fEncargo").addEventListener("submit", function (e) {
  e.preventDefault();
  if (this.querySelector(".aviso")) return;
  var p = document.createElement("p");
  p.className = "aviso"; p.setAttribute("role", "status");
  p.textContent = "Esto es una web de demostración: el encargo no se envía. En la versión real llegaría al correo y al móvil del obrador.";
  this.appendChild(p);
});
