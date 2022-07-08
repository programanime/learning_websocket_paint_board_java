/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var wsUri = "ws://"+document.location.host + document.location.pathname + "echo";

var websocket = new WebSocket(wsUri);
var save=document.getElementById("save");
websocket.onopen = function (evt){OnOpen(evt) };
websocket.onmessage = function (evt){OnMessage(evt)};
websocket.onerror = function (evt){OnError(evt)};

var salida = document.getElementById("salida");
var listaColores = document.getElementById("colores");
var listaTam = document.getElementById("tamano");
var tipoClick = false;
var punto = 0;
var colorActual = "red";
var tamActual = 1;
var context;
var canvas

function main(){
    canvas = document.getElementById("tablero");
    if (!canvas){
        console.log("Su navegador no soporta canvas");
        writeToSreen("Su navegador no soporta canvas");
        return;
    }
    context = canvas.getContext("2d");
  
    //Registramos el evento de presionar click en el canvas
    canvas.addEventListener("mousedown", 
        function (e) {
            tipoClick = true;
        }
    );
  
    //Registramos el evento del soltar el click en el canvas
    canvas.addEventListener("mouseup", 
        function (e){
            tipoClick = false;
        }
    );
  
     //Registramos el evento de mover el mause sobre el canvas
    canvas.addEventListener("mousemove", 
        function pintar(e){
            if(tipoClick){
                punto = coorCanvas(canvas, e.clientX, e.clientY);
                send_message();        
            }
        }
    );
}

function coorCanvas(canvas, x, y){
    var cuadroCanvas = canvas.getBoundingClientRect();
    return {x: x - cuadroCanvas.left * (canvas.width / cuadroCanvas.width),
            y: y - cuadroCanvas.top * (canvas.height / cuadroCanvas.height) };
}

function send_message(){
    var d = {"x":punto.x, "y":punto.y, "color":colorActual, "tam":tamActual};
    websocket.send(JSON.stringify(d));
}

function set_color(){
    colorActual = listaColores.value;
}
function set_tamano(){
    tamActual = listaTam.value;
}

function limpiar(){
    tamActual = -1;
    send_message();
}

function OnOpen(evt){
    writeToSreen("Conectado a " + wsUri);
    console.log("Conectado a " + wsUri);
}

function OnMessage(evt){
    var datos = JSON.parse(evt.data);  
    if (datos.tam == -1){
        tamActual = listaTam.value;
        context.clearRect(0, 0, 800, 480); //800x480 es el tamaño del canvas del tablero
    }else{
        context.fillStyle = datos.color;
        context.fillRect (datos.x, datos.y, datos.tam, datos.tam);
    }
}

function OnError(evt){
    writeToSreen('<span style="color:red;">ERROR:</span>'+evt.data);
}

function guardar() {
  var dataUrl = canvas.toDataURL('image/jpeg');  
  save.download = "tablero.jpeg";
  save.href = dataUrl;
  save.click();
}

function writeToSreen(message){
    salida.innerHTML+=message+"<br>";
}