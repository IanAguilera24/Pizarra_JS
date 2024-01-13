let lienzo,
  ctx,
  pintar,
  borrar = false;
let lastX, lastY;
let colorLapiz = "#000000";
let grosorLapiz = 5;
let paginas = []; // Almacena los datos de cada página
let paginaActual = 0; // Índice de la página actual

function iniciarPizarra() {
  lienzo = document.getElementById("pizarra");
  ctx = lienzo.getContext("2d", { willReadFrequently: true });
  ctx.lineWidth = grosorLapiz;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = colorLapiz;

  lienzo.addEventListener("mousedown", empezarDibujo);
  lienzo.addEventListener("mouseup", terminarDibujo);
  lienzo.addEventListener("mousemove", dibujar);

  actualizarControles();
}

function empezarDibujo(event) {
  pintar = true;
  [lastX, lastY] = [event.offsetX, event.offsetY];
}

function terminarDibujo() {
  pintar = false;
}

function dibujar(event) {
  if (!pintar) return;
  const rect = lienzo.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  if (borrar) {
    ctx.clearRect(offsetX - 10, offsetY - 10, 20, 20);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  [lastX, lastY] = [offsetX, offsetY];
}

function activarLapiz() {
  borrar = false;
  ctx.strokeStyle = colorLapiz;
  ctx.lineWidth = grosorLapiz;
}

function activarGomaDeBorrar() {
  borrar = true;
  ctx.strokeStyle = "#ffffff"; // Cambia el color a blanco para simular la goma de borrar
  ctx.lineWidth = 20; // Ancho mayor para borrar con más facilidad
}

function actualizarControles() {
  document.getElementById("colorPicker").value = colorLapiz;
  document.getElementById("grosor").value = grosorLapiz;
  document.getElementById("grosorValor").innerText = grosorLapiz;
}

function crearNuevaPagina() {
  paginas.push({
    imageData: ctx.getImageData(0, 0, lienzo.width, lienzo.height),
    colorLapiz,
    grosorLapiz,
  });

  paginaActual = paginas.length - 1;
  actualizarPaginasSelector();
  restablecerPizarra();
}

function actualizarPaginasSelector() {
  const selector = document.getElementById("selectorPaginas");
  selector.innerHTML = "";

  for (let i = 0; i < paginas.length; i++) {
    const opcion = document.createElement("option");
    opcion.value = i;
    opcion.text = `${i + 1}`;
    selector.add(opcion);
  }

  selector.value = paginaActual;
}

function cambiarPagina() {
  // Guardar el progreso de la página actual antes de cambiar
  guardarProgresoPaginaActual();

  // Cambiar a la nueva página seleccionada
  paginaActual = parseInt(document.getElementById("selectorPaginas").value, 10);
  cargarPaginaActual();
}

function guardarProgresoPaginaActual() {
  // Guardar el progreso de la página actual antes de cambiar
  if (paginaActual >= 0 && paginaActual < paginas.length) {
    paginas[paginaActual] = {
      imageData: ctx.getImageData(0, 0, lienzo.width, lienzo.height),
      colorLapiz,
      grosorLapiz,
    };
  }
}

function cargarPaginaActual() {
  const pagina = paginas[paginaActual];

  if (pagina) {
    ctx.putImageData(pagina.imageData, 0, 0);
    colorLapiz = pagina.colorLapiz;
    grosorLapiz = pagina.grosorLapiz;
    actualizarControles();
  }
}

function navegarPagina(direccion) {
  const nuevaPagina = paginaActual + direccion;

  if (nuevaPagina >= 0 && nuevaPagina < paginas.length) {
    // Guardar el progreso de la página actual antes de cambiar
    guardarProgresoPaginaActual();

    paginaActual = nuevaPagina;
    cargarPaginaActual();
    actualizarPaginasSelector();
  }
}

function restablecerPizarra() {
  borrar = false;
  ctx.clearRect(0, 0, lienzo.width, lienzo.height); // Borra todo el lienzo
  ctx.strokeStyle = "#000000"; // Restablece el color del trazo a negro
  ctx.lineWidth = 5; // Restablece el ancho del trazo
  colorLapiz = "#000000"; // Restablece el color del lápiz
  grosorLapiz = 5; // Restablece el grosor del lápiz
  actualizarControles(); // Llama a una función para actualizar los controles visuales
}

function cambiarColorLapiz(color) {
  colorLapiz = color;
  if (!borrar) {
    ctx.strokeStyle = colorLapiz;
  }
}

function cambiarGrosor(valor) {
  grosorLapiz = valor;
  document.getElementById("grosorValor").innerText = valor;
  ctx.lineWidth = grosorLapiz;
}

function eliminarPagina() {
  if (paginas.length <= 1) {
    alert("No puedes eliminar la única página existente.");
    return;
  }

  if (confirm("¿Estás seguro de que deseas eliminar la página actual?")) {
    paginas.splice(paginaActual, 1);

    if (paginaActual >= paginas.length) {
      paginaActual = paginas.length - 1;
    }

    cargarPaginaActual();
    actualizarPaginasSelector();
  }
}

function copiarComoImagen() {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = lienzo.width;
  tempCanvas.height = lienzo.height;

  tempCtx.fillStyle = "#ffffff"; // Fondo blanco
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCtx.drawImage(lienzo, 0, 0);

  tempCanvas.toBlob((blob) => {
    const dataURL = URL.createObjectURL(blob);

    // Crear un elemento de imagen invisible para copiar al portapapeles
    const img = new Image();
    img.src = dataURL;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Copiar la imagen al portapapeles
      navigator.clipboard
        .write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ])
        .then(() => {
          console.log("Imagen copiada al portapapeles.");
          // Puedes agregar aquí cualquier mensaje de éxito o realizar otras acciones después de copiar.
        })
        .catch((error) => {
          console.error("Error al copiar la imagen al portapapeles:", error);
        });
    };
  }, "image/png");
}

function capturarPizarra() {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = lienzo.width;
  tempCanvas.height = lienzo.height;

  tempCtx.fillStyle = "#ffffff"; // Fondo blanco
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  tempCtx.drawImage(lienzo, 0, 0);

  const imagenURL = tempCanvas.toDataURL("image/png");
  const enlaceDescarga = document.createElement("a");
  enlaceDescarga.href = imagenURL;
  enlaceDescarga.download = "captura_pizarra.png";
  enlaceDescarga.click();
}

let colorLapizGuardado;
let grosorLapizGuardado;

function actualizarTamanoLienzo() {
  // Guardar los valores actuales de los parámetros
  colorLapizGuardado = colorLapiz;
  grosorLapizGuardado = grosorLapiz;

  // Actualizar el ancho y alto del lienzo
  lienzo.width = window.innerWidth;
  lienzo.height = window.innerHeight;

  // Restaurar los valores de los parámetros
  colorLapiz = colorLapizGuardado;
  grosorLapiz = grosorLapizGuardado;

  // Actualizar el estado de la pizarra (por ejemplo, borrar el lienzo)
}

window.addEventListener("resize", actualizarTamanoLienzo);

window.onload = iniciarPizarra;
