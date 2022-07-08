var wsUri = "ws://"+document.location.host + document.location.pathname + "servidor";

var websocket = new WebSocket(wsUri);
var save=document.getElementById("save");

websocket.onmessage = function (evt){OnMessage(evt)};

var salida = document.getElementById("salida");
var listaColores = document.getElementById("colores");
var dibujando = false;
var punto = 0;
var colorActual = "red";
var context;
var canvas

function main(){
    canvas = document.getElementById("tablero");
    context = canvas.getContext("2d");
  
    canvas.addEventListener("mousedown", function (e) {dibujando = true;});
    canvas.addEventListener("mouseup", function (e){dibujando = false;});
    canvas.addEventListener("mousemove", 
        function pintar(e){
            if(dibujando){
                punto = coorCanvas(canvas, e.clientX, e.clientY);
                send_message();        
            }
        }
    );
}

function coorCanvas(canvas, x, y){
    var cuadroCanvas = canvas.getBoundingClientRect();
    return {x: x - cuadroCanvas.left * (canvas.width / cuadroCanvas.width),y: y - cuadroCanvas.top * (canvas.height / cuadroCanvas.height) };
}

function send_message(){
    var d = {"x":punto.x, "y":punto.y, "color":colorActual, "tam":25};
    websocket.send(JSON.stringify(d));
}

function set_color(){
    colorActual = listaColores.value;
}

function OnMessage(evt){
    var datos = JSON.parse(evt.data);  
    if (datos.tam == -1){
        context.clearRect(0, 0, 1000, 600);
    }else{
        context.fillStyle = datos.color;
        context.fillRect (datos.x, datos.y, datos.tam, datos.tam);
    }
}

function guardar() {
  var dataUrl = canvas.toDataURL('image/jpeg');  
  save.download = "dibujo.jpeg";
  save.href = dataUrl;
  save.click();
}