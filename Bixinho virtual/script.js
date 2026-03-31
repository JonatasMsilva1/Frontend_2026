const cria         = document.getElementById("b");
const vidaBar      = document.getElementById("vidaBar");
const sujeiraBar   = document.getElementById("sujeiraBar");
const sonoBar      = document.getElementById("sonoBar");
const vidaVal      = document.getElementById("vidaVal");
const sujeiraVal   = document.getElementById("sujeiraVal");
const sonoVal      = document.getElementById("sonoVal");
const statusLabel  = document.getElementById("statusLabel");
const dirtOverlay  = document.getElementById("dirt-overlay");
const btnLimpar    = document.getElementById("btnLimpar");
const btnDormir    = document.getElementById("btnDormir");
const labelDormir  = document.getElementById("labelDormir");
const btnDianoite  = document.getElementById("btnDianoite");
const eyeLeft      = document.getElementById("eye-left");
const eyeRight     = document.getElementById("eye-right");
const pupilLeft    = document.getElementById("pupil-left");
const pupilRight   = document.getElementById("pupil-right");

const imgs = {
    normal:    "normal-removebg-preview.png",
    irritado:  "irritado-removebg-preview.png",
    morto:     "morto.png",
    comendo:   "comendo-removebg-preview.png",
    alimentado:"amoroso.png",
    dormindo:  "dormindo.png",
};

const fundoDia   = "imagem de fundo dia.png";
const fundoNoite = "imagem de fundo.png";

let vida    = 100;
let sujeira = 0;
let sono    = 0;
let estado  = "normal";
let isDia      = true;
let isDormindo = false;

const HORA_TICK = 5_000;
let horasJogo  = 8;

let minutosSobrevividos = 0;
let totalAlimentacoes = 0;
let nuncaMorreu = carregarLS("nuncaMorreu", true);

let tmVida       = null;
let tmSujeira    = null;
let tmSono       = null;
let tmRelogio    = null;
let tmMinutos    = null;
let tmComendo    = null;
let tmAlimentado = null;
let tmZzz        = null;

const CONQUISTAS = [
    { id: "sobreviveu_1min", icon: "⏱️", nome: "Sobreviveu 1 minuto",  desc: "O bixinho chegou vivo ao 1º minuto!" },
    { id: "sobreviveu_5min", icon: "⏰", nome: "Sobreviveu 5 minutos", desc: "5 minutos de pet vivo — bom trabalho!" },
    { id: "nunca_morreu",    icon: "💎", nome: "Nunca deixou morrer",  desc: "5 min sobrevividos sem morrer nenhuma vez." },
    { id: "alimentou_10",    icon: "🍪", nome: "Alimentou 10 vezes",   desc: "10 cookies entregues!" },
    { id: "alimentou_50",    icon: "🎂", nome: "Alimentou 50 vezes",   desc: "50 cookies! Esse bixinho tá bem fed." },
];

let conquistasFeitas = new Set(carregarLS("conquistas", []));
document.getElementById("achievement-total").textContent = CONQUISTAS.length;

function desbloquear(id) {
    if (conquistasFeitas.has(id)) return;
    conquistasFeitas.add(id);
    salvarLS("conquistas", [...conquistasFeitas]);

    const c = CONQUISTAS.find(x => x.id === id);
    if (!c) return;

    const container = document.getElementById("toast-container");
    const el = document.createElement("div");
    el.className = "achievement-toast alert bg-yellow-100 border border-yellow-400 shadow-lg py-2 px-4 text-sm gap-2 w-auto max-w-xs";
    el.innerHTML = `<span class="text-xl">${c.icon}</span><div><div class="font-bold text-yellow-800">Conquista desbloqueada!</div><div class="text-yellow-700">${c.nome}</div></div>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4200);

    renderizarConquistas();
}

function checarConquistas() {
    if (minutosSobrevividos >= 1) desbloquear("sobreviveu_1min");
    if (minutosSobrevividos >= 5) desbloquear("sobreviveu_5min");
    if (minutosSobrevividos >= 5 && nuncaMorreu) desbloquear("nunca_morreu");
    if (totalAlimentacoes >= 10) desbloquear("alimentou_10");
    if (totalAlimentacoes >= 50) desbloquear("alimentou_50");
}

function renderizarConquistas() {
    const lista = document.getElementById("conquistas-lista");
    const count = document.getElementById("achievement-count");
    count.textContent = conquistasFeitas.size;

    lista.innerHTML = CONQUISTAS.map(c => {
        const ok = conquistasFeitas.has(c.id);
        return `
        <div class="flex items-center gap-2 p-2 rounded-xl ${ok ? "bg-yellow-100 border border-yellow-300" : "bg-gray-100 opacity-50"}">
            <span class="text-xl">${ok ? c.icon : "🔒"}</span>
            <div>
                <div class="text-xs font-bold text-gray-800">${c.nome}</div>
                <div class="text-xs text-gray-500">${c.desc}</div>
            </div>
        </div>`;
    }).join("");
}

function toggleConquistas() {
    const panel = document.getElementById("conquistas-panel");
    panel.classList.toggle("hidden");
    renderizarConquistas();
}

function iniciarVida() {
    clearInterval(tmVida);
    tmVida = setInterval(() => {
        if (estado === "morto") return;

        let drain = 0.8;
        if (isDormindo)    drain = 0.2;
        if (sujeira > 60)  drain += 0.4;
        if (sono > 75)     drain += 0.6;

        vida = clamp(vida - drain, 0, 100);
        sincronizarBarras();

        if (vida <= 0) { morrer(); return; }

        if (!["comendo","alimentado","dormindo","morto"].includes(estado)) {
            atualizarEstadoPorStats();
        }
    }, 4_000);
}

function iniciarSujeira() {
    clearInterval(tmSujeira);
    tmSujeira = setInterval(() => {
        if (estado === "morto") return;
        const ganho = isDormindo ? 1.8 : 1.2;
        sujeira = clamp(sujeira + ganho, 0, 100);
        sincronizarBarras();
        atualizarDirtOverlay();
        atualizarBotaoLimpar();
    }, 10_000);
}

function atualizarDirtOverlay() {
    dirtOverlay.style.opacity = ((sujeira / 100) * 0.9).toFixed(2);
}

function atualizarBotaoLimpar() {
    const sujo = sujeira >= 20;
    btnLimpar.disabled = !sujo;
    btnLimpar.classList.toggle("opacity-40",        !sujo);
    btnLimpar.classList.toggle("cursor-not-allowed", !sujo);
    btnLimpar.classList.toggle("hover:scale-110",    sujo);
    btnLimpar.classList.toggle("active:scale-95",    sujo);
    btnLimpar.classList.toggle("dirty-pulse",        sujeira >= 70);
}

function limpar() {
    if (estado === "morto" || !sujeira) return;
    sujeira = 0;
    sincronizarBarras();
    atualizarDirtOverlay();
    atualizarBotaoLimpar();
    cria.style.transform = "scale(1.08) rotate(-3deg)";
    setTimeout(() => { cria.style.transform = "scale(1) rotate(0deg)"; }, 300);
}

function iniciarSono() {
    clearInterval(tmSono);
    tmSono = setInterval(() => {
        if (estado === "morto") return;

        if (isDormindo) {
            sono = clamp(sono - 6, 0, 100);
            if (sono === 0) acordar();
        } else {
            const ganho = isDia ? 1.0 : 2.5;
            sono = clamp(sono + ganho, 0, 100);
        }

        sincronizarBarras();

        if (!["comendo","alimentado","dormindo","morto"].includes(estado)) {
            atualizarEstadoPorStats();
        }
    }, 6_000);
}

function toggleDormir() {
    if (estado === "morto") return;
    isDormindo ? acordar() : dormir();
}

function dormir() {
    isDormindo = true;
    estado     = "dormindo";

    cria.src = imgs.dormindo;
    esconderOlhos();

    btnDormir.textContent   = "☀️";
    labelDormir.textContent = "Acordar";

    clearTimeout(tmComendo);
    clearTimeout(tmAlimentado);

    spawnZzz();
    tmZzz = setInterval(spawnZzz, 2_200);

    sincronizarStatus();
}

function acordar() {
    if (!isDormindo) return;
    isDormindo = false;

    clearInterval(tmZzz);

    cria.style.filter = "";
    mostrarOlhos();
    abrirOlhos();

    btnDormir.textContent   = "😴";
    labelDormir.textContent = "Dormir";

    atualizarEstadoPorStats();
    sincronizarStatus();
}

function spawnZzz() {
    const wrapper = document.getElementById("pet-wrapper");
    const el = document.createElement("div");
    el.className = "zzz-float";
    el.textContent = "💤";
    el.style.top   = "18%";
    el.style.right = "14%";
    wrapper.appendChild(el);
    setTimeout(() => el.remove(), 2_200);
}

function alimentar() {
    if (estado === "morto") {
        ressuscitar();
        return;
    }

    if (isDormindo) acordar();

    totalAlimentacoes++;
    vida = clamp(vida + 25, 0, 100);
    sincronizarBarras();

    clearTimeout(tmComendo);
    clearTimeout(tmAlimentado);

    cria.src = imgs.comendo;
    estado   = "comendo";
    sincronizarStatus();

    tmComendo = setTimeout(() => {
        cria.src = imgs.alimentado;
        estado   = "alimentado";
        cria.style.transform = "scale(1.04) translateY(-4%)";
        sincronizarStatus();

        tmAlimentado = setTimeout(() => {
            cria.style.transform = "scale(1)";
            atualizarEstadoPorStats();
            sincronizarStatus();
        }, 2_000);
    }, 1_100);

    checarConquistas();
}

function morrer() {
    clearTimeout(tmComendo);
    clearTimeout(tmAlimentado);
    clearInterval(tmZzz);

    nuncaMorreu = false;
    salvarLS("nuncaMorreu", false);

    estado     = "morto";
    isDormindo = false;

    cria.src             = imgs.morto;
    cria.style.transform = "translateY(10%) scale(0.88)";
    cria.style.filter    = "grayscale(1)";

    olhosDeadX();
    esconderOlhos();
    sincronizarStatus();

    clearInterval(tmVida);
}

function ressuscitar() {
    cria.src             = imgs.normal;
    cria.style.transform = "scale(1)";
    cria.style.filter    = "";

    vida       = 60;
    sujeira    = 0;
    sono       = 0;
    estado     = "normal";
    isDormindo = false;

    sincronizarBarras();
    atualizarDirtOverlay();
    atualizarBotaoLimpar();
    atualizarCorVida();
    mostrarOlhos();
    abrirOlhos();

    btnDormir.textContent   = "😴";
    labelDormir.textContent = "Dormir";

    iniciarVida();
    sincronizarStatus();
}

function iniciarRelogio() {
    clearInterval(tmRelogio);
    aplicarHora();
    tmRelogio = setInterval(() => {
        horasJogo = (horasJogo + 1) % 24;
        aplicarHora();
    }, HORA_TICK);
}

function aplicarHora() {
    const noite = horasJogo >= 20 || horasJogo < 7;
    if (noite && isDia)        setNoite();
    else if (!noite && !isDia) setDia();
}

function setDia() {
    isDia = true;
    document.body.style.backgroundImage = `url('${fundoDia}')`;
    btnDianoite.textContent = "🌞";
}

function setNoite() {
    isDia = false;
    document.body.style.backgroundImage = `url('${fundoNoite}')`;
    btnDianoite.textContent = "🌙";
}

function alternarDiaNoite() {
    isDia ? setNoite() : setDia();
    horasJogo = isDia ? 8 : 21;
}

document.addEventListener("mousemove", (e) => {
    if (estado === "morto" || isDormindo) return;

    [
        { eye: eyeLeft,  pupil: pupilLeft  },
        { eye: eyeRight, pupil: pupilRight },
    ].forEach(({ eye, pupil }) => {
        if (!eye || !pupil) return;
        const r   = eye.getBoundingClientRect();
        const cx  = r.left + r.width  / 2;
        const cy  = r.top  + r.height / 2;
        const ang = Math.atan2(e.clientY - cy, e.clientX - cx);
        const dist = Math.min(7, r.width / 4);
        pupil.style.transform = `translate(${(Math.cos(ang) * dist).toFixed(2)}px, ${(Math.sin(ang) * dist).toFixed(2)}px)`;
    });
});

function fecharOlhos() {
    eyeLeft.classList.add("sleeping");
    eyeRight.classList.add("sleeping");
}
function abrirOlhos() {
    eyeLeft.classList.remove("sleeping", "dead");
    eyeRight.classList.remove("sleeping", "dead");
    pupilLeft.style.display  = "";
    pupilRight.style.display = "";
}
function olhosDeadX() {
    eyeLeft.classList.add("dead");
    eyeRight.classList.add("dead");
}
function esconderOlhos() {
    eyeLeft.style.display  = "none";
    eyeRight.style.display = "none";
}
function mostrarOlhos() {
    eyeLeft.style.display  = "";
    eyeRight.style.display = "";
}

function atualizarEstadoPorStats() {
    const irritado = vida <= 35 || sono >= 78;
    if (irritado && estado !== "irritado") {
        cria.src = imgs.irritado;
        estado   = "irritado";
    } else if (!irritado && estado !== "normal") {
        cria.src = imgs.normal;
        estado   = "normal";
    }
}

function sincronizarBarras() {
    vidaBar.value    = vida;
    sujeiraBar.value = sujeira;
    sonoBar.value    = sono;
    vidaVal.textContent    = Math.round(vida);
    sujeiraVal.textContent = Math.round(sujeira);
    sonoVal.textContent    = Math.round(sono);
    atualizarCorVida();
}

function atualizarCorVida() {
    const base = "progress flex-1";
    if      (vida > 60) vidaBar.className = `${base} progress-success`;
    else if (vida > 30) vidaBar.className = `${base} progress-warning`;
    else                vidaBar.className = `${base} progress-error`;
}

function sincronizarStatus() {
    const mapa = {
        normal:    "😊 Feliz",
        irritado:  "😠 Irritado",
        comendo:   "🍪 Comendo...",
        alimentado:"🥰 Satisfeito",
        dormindo:  "😴 Dormindo...",
        morto:     "💀 Morto — clique no cookie para reviver!",
    };
    statusLabel.textContent = mapa[estado] ?? "";
}

function iniciarContadorMinutos() {
    clearInterval(tmMinutos);
    tmMinutos = setInterval(() => {
        if (estado === "morto") return;
        minutosSobrevividos++;
        checarConquistas();
    }, 60_000);
}

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

function salvarLS(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (_) {}
}
function carregarLS(chave, padrao) {
    try {
        const v = localStorage.getItem(chave);
        return v !== null ? JSON.parse(v) : padrao;
    } catch (_) { return padrao; }
}

renderizarConquistas();
sincronizarBarras();
sincronizarStatus();
atualizarDirtOverlay();
atualizarBotaoLimpar();

iniciarVida();
iniciarSujeira();
iniciarSono();
iniciarRelogio();
iniciarContadorMinutos();
