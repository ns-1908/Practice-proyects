

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
let events = {
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
    document.createEvent("TouchEvent"); //Si el navegador no da error, lo asume como tactil...
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
🔗 ¿Por qué están anidados y no separados?
    Porque cada fila (gridRow) necesita contener sus propias celdas (gridCol).
    Si estuvieran separados, no habría forma clara de que cada conjunto de columnas quede dentro de su fila correspondiente. */

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
      col.addEventListener(events[deviceType].down, () => {
        draw = true;
        if (erase) {
          col.style.backgroundColor = "transparent";
        } else {
          col.style.backgroundColor = colorInput.value;
        }
      });

      /*Mientras se mueve el mouse o el dedo, busca el elemento debajo de ese punto y llama a una 
        función checker(elementId) (que no está incluida en tu código, así que no sabemos aún qué hace).
        Usa elementFromPoint para saber sobre qué celda se está moviendo. */
      col.addEventListener(events[deviceType].move, (e) => {
        let elementId = document.elementFromPoint(
            !isTouchDevice() ? e.clientX : e.touches[0].clientX,
            !isTouchDevice() ? e.clientY : e.touches[0].clientY
          ).id;
        checker(elementId);
      });

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