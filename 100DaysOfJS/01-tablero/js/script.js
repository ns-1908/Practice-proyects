 /* RESUMEN
 Visualizando las vueltas con count incluido
Supongamos que se elige una grilla de 3 filas y 3 columnas.

La variable count empieza en 0 y se le suma 2 en cada paso, para asegurarse de que cada celda tenga un ID distinto, 
como gridCol2, gridCol4, gridCol6, etc.

🔁 Vuelta por vuelta:
🧱 Vuelta 1 del bucle exterior (fila 1):
count = 0 → count += 2 → count = 2

**************Se crea fila 1*************

🔹 Vuelta 1 del bucle interior (columna 1):

count = 2 → count += 2 → count = 4

Celda con ID = gridCol4

🔹 Vuelta 2 del bucle interior (columna 2):

count = 4 → count += 2 → count = 6

Celda con ID = gridCol6

🔹 Vuelta 3 del bucle interior (columna 3):

count = 6 → count += 2 → count = 8

Celda con ID = gridCol8

Se agrega fila 1 con celdas 4, 6 y 8

🧱 Vuelta 2 del bucle exterior (fila 2):
count = 8 → count += 2 → count = 10

*******************Se crea fila 2****************

🔹 Vuelta 1 (columna 1): count = 10 → 12 → ID = gridCol12

🔹 Vuelta 2 (columna 2): count = 12 → 14 → ID = gridCol14

🔹 Vuelta 3 (columna 3): count = 14 → 16 → ID = gridCol16

Se agrega fila 2 con celdas 12, 14 y 16

🧱 Vuelta 3 del bucle exterior (fila 3):
count = 16 → count += 2 → count = 18

*****************Se crea fila 3*****************

🔹 Vuelta 1 (columna 1): count = 18 → 20 → ID = gridCol20

🔹 Vuelta 2 (columna 2): count = 20 → 22 → ID = gridCol22

🔹 Vuelta 3 (columna 3): count = 22 → 24 → ID = gridCol24

Se agrega fila 3 con celdas 20, 22 y 24
 */


let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorInput = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

/*define un objeto events en JavaScript que sirve para asociar eventos de interacción del usuario, 
diferenciando entre mouse y pantallas táctiles (touch).*/
let events = {  //Evento se le llama a la interaccion como la de hacer click
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart", //cuando se toca la pantalla
    move: "touchmove", //cuando se arrastra el dedo
    up: "touchend", //cuando se levanta el dedo
  },
};

let deviceType = "";
let draw = false;
let erase = false;

/*Esta función intenta crear un TouchEvent. Si lo logra, asume que es un dispositivo táctil. */
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent"); //Si el navegador no da error (no da exception), lo asume como tactil...
                                        //Touch event es una clase especifica del navegador(webapi de js)
                                        // que representa un evento de interaccion tactil(tocar una pantalla).
                                        //Es una clase que define los eventos relacionados con pantallas táctiles: touchstart,touchmove,touchend...
    deviceType = "touch";       //Este es el valor que importa
    return true;                //no se recoge el dato en ninguna variable
  } catch (e) {
    deviceType = "mouse";       //Este es el valor que importa
    return false;               //no se recoge el dato en ninguna variable
  }
};
isTouchDevice();





/*Crea filas (div.gridRow) y columnas (div.gridCol) dentro del contenedor.
Usa un contador para generar IDs únicos por celda. (Hasta antes del primer if dentro del for let j)*/
gridButton.addEventListener("click", () => {        //gridButton es el Create-grid   
  container.innerHTML = "";                         // Limpia el contenido anterior
  let count = 0;                                    //Se declara una variable count para crear id únicos para cada celda

  /*Los for anidados se usan cuando necesitás recorrer una estructura en dos dimensiones, como una grilla o tabla.
    El for externo crea una fila por iteración (div.gridRow).
    El for interno, dentro de cada fila, crea las columnas o celdas (div.gridCol).
🔗  */
  for (let i = 0; i < gridHeight.value; i++) {      //Bucle que se repite tantas veces como el valor del alto de la grilla. Cada vuelta del bucle representa una fila de la grilla.
    count += 2;                                     //Suma 2 a count en cada vuelta (probablemente una forma arbitraria de garantizar IDs únicos).
    let div = document.createElement("div");        //Crea un nuevo div que será una fila de la grilla.
    div.classList.add("gridRow");                   //Le agrega la clase "gridRow" al div, para poder estilizarlo con CSS y organizarlo visualmente como fila.

    for (let j = 0; j < gridWidth.value; j++) {     // Crea una celda (columna) por cada unidad de ancho
      count += 2;
      let col = document.createElement("div");      // Crea un div para la celda
      col.classList.add("gridCol");                 // Le asigna la clase para estilos
      col.setAttribute("id", `gridCol${count}`);    // Le da un id único basado en el contador. setAttribute asigna o modifica un atributo HTML en un elemento del DOM.En este caso, se usa para establecer un id único a cada celda con el formato gridColX (gridCol27).

      /* Al presionar sobre una celda (mousedown o touchstart), se activa el modo "dibujar".
            Cambia el color de fondo de la celda actual.
            Si está en modo "borrar", la celda se vuelve transparente.*/
      col.addEventListener(events[deviceType].down, () => {  //deviceType tiene valores mouse o touch, estos son los valores tambien de los eventos
                                                              //addEventListener escucha a los eventos, que pueden ser click, en este caso el evento es el mousedown o touchstart y activa la funcion flecha que le sigue...
        draw = true;                                          //draw es true porque estamos dibujando
        if (erase) {                                          //si borrar es true el background de la celda es transparente
          col.style.backgroundColor = "transparent";
        } else {
          col.style.backgroundColor = colorInput.value;       //pero si borrar es falto el fondo es el color de valor del input color
        }
      });

      /*Mientras se mueve el mouse o el dedo, busca el elemento debajo de ese punto y llama a una 
        función checker(elementId).
        Usa elementFromPoint para saber sobre qué celda se está moviendo. */
      col.addEventListener(events[deviceType].move, (e) => {   //e es el objeto evento, que contiene información como la posición del cursor o del dedo..   deviceType tiene valores mouse o touch, estos son los valores tambien de los eventos
                                                              //addEventListener escucha a los eventos, que pueden ser click, en este caso el evento es el mousemove o touchmove y activa la funcion flecha que le sigue...
        let elementId = document.elementFromPoint(             //document.elementFromPoint(x, y): devuelve el elemento HTML que está bajo las coordenadas x, y del evento (el punto donde se está moviendo el mouse o el dedo).
            !isTouchDevice() ? e.clientX : e.touches[0].clientX,  //!isTouchDevice() → si NO es táctil, usa e.clientX y e.clientY (coordenadas del mouse).
            !isTouchDevice() ? e.clientY : e.touches[0].clientY   //Si es táctil, usa e.touches[0].clientX/Y (coordenadas del dedo).
          ).id;                                                   //.id: extrae el id del elemento detectado.
        checker(elementId);                                      //Llama a la función checker, pasándole el id del elemento detectado.
      });                                                       //Esa función decide si pintar o borrar esa celda.

      /*Cuando el usuario suelta el botón o el dedo, termina la acción de dibujar (draw = false). */
      col.addEventListener(events[deviceType].up, () => {
        draw = false;
      });
      /*Agregar cada celda a su fila, y cada fila al contenedor
       Así se construye toda la grilla visualmente.*/
      div.appendChild(col);
    }
    container.appendChild(div);
  }
});




function checker(elementId) {
  let gridColumns = document.querySelectorAll(".gridCol"); // devuelve todos
  gridColumns.forEach((element) => {
    if (elementId == element.id) {
      if (draw && !erase) {
        element.style.backgroundColor = colorInput.value;
      } else if (draw && erase) {
        element.style.backgroundColor = "transparent";
      }
    }
  });
}



clearGridButton.addEventListener("click", ()=>{
  container.innerHTML="";
});
eraseBtn.addEventListener("click", ()=>{
  erase=true;
});
paintBtn.addEventListener("click", ()=>{
  erase=false;
});

gridWidth.addEventListener("input",()=>{
  widthValue.innerHTML = gridWidth.value < 9? `0${gridWidth.value}`:gridWidth.value
})
gridHeight.addEventListener("input",()=>{
  heightValue.innerHTML = gridHeight.value < 9? `0${gridHeight.value}`:gridHeight.value
})

window.onload = () =>{
  gridHeight.value = 0;
  gridWidth.value =0;
};