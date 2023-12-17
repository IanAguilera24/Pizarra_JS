let lienzo, ctx, pintar, borrar = false;
    let lastX, lastY;
    let colorLapiz = '#000';
    let grosorLapiz = 5;
  
    function iniciarPizarra() {
      lienzo = document.getElementById('pizarra');
      ctx = lienzo.getContext('2d');
      ctx.lineWidth = grosorLapiz;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = colorLapiz;
  
      lienzo.addEventListener('mousedown', empezarDibujo);
      lienzo.addEventListener('mouseup', terminarDibujo);
      lienzo.addEventListener('mousemove', dibujar);
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
      if (borrar) {
        ctx.clearRect(event.offsetX - 10, event.offsetY - 10, 20, 20); // Borra un área alrededor del cursor
        return;
      }
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      [lastX, lastY] = [event.offsetX, event.offsetY];
    }
  
    function activarLapiz() {
      borrar = false;
      ctx.strokeStyle = colorLapiz;
      ctx.lineWidth = grosorLapiz;
    }
  
    function activarGomaDeBorrar() {
      borrar = true;
      ctx.strokeStyle = '#fff'; // Cambia el color a blanco para simular la goma de borrar
      ctx.lineWidth = 20; // Ancho mayor para borrar con más facilidad
    }
  
    function restablecerPizarra() {
      borrar = false;
      ctx.clearRect(0, 0, lienzo.width, lienzo.height); // Borra todo el lienzo
      ctx.strokeStyle = '#000'; // Restablece el color del trazo a negro
      ctx.lineWidth = 5; // Restablece el ancho del trazo
    }
  
    function cambiarColorLapiz(color) {
      colorLapiz = color;
      if (!borrar) {
        ctx.strokeStyle = colorLapiz;
      }
    }
  
    function cambiarGrosor(valor) {
      grosorLapiz = valor;
      document.getElementById('grosorValor').innerText = valor;
      ctx.lineWidth = grosorLapiz;
    }
  
    function capturarPizarra() {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
  
      tempCanvas.width = lienzo.width;
      tempCanvas.height = lienzo.height;
  
      tempCtx.fillStyle = '#fff'; // Fondo blanco
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
      tempCtx.drawImage(lienzo, 0, 0);
  
      const imagenURL = tempCanvas.toDataURL('image/png');
      const enlaceDescarga = document.createElement('a');
      enlaceDescarga.href = imagenURL;
      enlaceDescarga.download = 'captura_pizarra.png';
      enlaceDescarga.click();
    }
  
    window.onload = iniciarPizarra;