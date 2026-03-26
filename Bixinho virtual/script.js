const cria = document.getElementById("b");
const btn = document.getElementById("btn");

const estados = {
    normal: "normal-removebg-preview.png",
    puto: "irritado-removebg-preview.png",
    morto: "morto.png",
    comendo: "comendo-removebg-preview.png",
    alimentado: "amoroso.png",
}

let contador = 0;
let intervalo = null;
let time_click = null;
let time_out = null;

const fundoDia = "imagem de fundo dia.png";
const fundoNoite = "imagem de fundo.png";

let horas = 0;          
let intervaloDiaNoite;  
let isDia = false;

const vidaBar = document.getElementById("vidaBar");
let vida = 100;

let estadoAtual = "normal";

function controlador() {
    if (intervalo) clearInterval(intervalo);

    intervalo = setInterval(() => {

        
        if (estadoAtual === "morto") return;

        vida -= 3.5;
        if (vida < 0) vida = 0;

        vidaBar.value = vida;
        atualizarCorVida();

        console.log("vida:", vida);

        
        if (vida <= 0) {
            cria.src = estados.morto;
            cria.style.transform = "translateY(200px) scale(0.6)";
            estadoAtual = "morto";

            clearInterval(intervalo); 
            return;
        }

        
        else if (vida <= 50 && estadoAtual !== "puto") {
            cria.src = estados.puto;
            cria.style.transform = "scale(1)";
            estadoAtual = "puto";
        }

        
        else if (vida > 50 && estadoAtual !== "normal") {
            cria.src = estados.normal;
            cria.style.transform = "scale(1)";
            estadoAtual = "normal";
        }

    }, 1000);
}

function alimentar() {

     if (estadoAtual === "morto") {
        estadoAtual = "normal";
        vida = 70; 

        controlador(); 
    }

    cria.style.width = "600px";
    cria.style.transform = "scale(1) translateY(0)";
    cria.src = estados.comendo;

    vida += 20;
    if (vida > 100) vida = 100;
    vidaBar.value = vida;

    contador = 0;

    if (time_click) clearTimeout(time_click);
    if (time_out) clearTimeout(time_out);

    time_click = setTimeout(() => {
        cria.src = estados.alimentado;

        cria.style.transform = "scale(0.5)";

        time_out = setTimeout(() => {
            cria.src = estados.normal;

            cria.style.transform = "scale(1)";

        }, 2000);

    }, 1000);
}

function atualizarFundo() {
    if (intervaloDiaNoite) clearInterval(intervaloDiaNoite);

    intervaloDiaNoite = setInterval(() => {
        horas++;

        console.log("horas:", horas);

        if (horas >= 12) {
            document.body.style.backgroundImage = `url('${fundoNoite}')`;
            isDia = false;
        } else {
            document.body.style.backgroundImage = `url('${fundoDia}')`;
            isDia = true;
        }

        if (horas >= 24) horas = 0;

    }, 5000);
}

function alternarDiaNoite() {
    if (isDia) {
        document.body.style.backgroundImage = `url('${fundoNoite}')`;
        isDia = false;
    } else {
        document.body.style.backgroundImage = `url('${fundoDia}')`;
        isDia = true;
    }
}

function atualizarCorVida() {
    if (vida > 60) {
        vidaBar.className = "progress progress-success w-56";
    } else if (vida > 30) {
        vidaBar.className = "progress progress-warning w-56";
    } else {
        vidaBar.className = "progress progress-error w-56";
    }
}


controlador();
atualizarFundo();
