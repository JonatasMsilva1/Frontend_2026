const cria = document.getElementById("b");
const btn = document.getElementById("btn");

const estados = {
    normal: "normal-removebg-preview.png",
    puto: "irritado-removebg-preview.png",
    morto: "morto.png",
    comendo: "comendo-removebg-preview.png",
    alimentado: "alimentado-removebg-preview.png",
}

let contador = 0;
let intervalo = null;
let time_click = null;
let time_out = null;

function controlador() {
    if (intervalo) clearInterval(intervalo)

    intervalo = setInterval(() => {
        contador++;

        console.log("tempo:", contador);

        if (contador == 30) {
            cria.src = estados.puto;
        }

        if (contador == 60) {
            cria.src = estados.morto;
        }
    }, 1000);
}

function alimentar() {
   cria.src = estados.comendo; 
   contador = 0;
}

controlador();
