const produtos = {
    "123": { nome: "Jorge e Mateus", preco: 9.0 },
    "456": { nome: "Fala mansa", preco: 3.0 },
    "789": { nome: "Sabrina Carpintcher", preco: 12.0 },
    "147": { nome: "Gaucho da Fronteira", preco: 90.5 },
};

let carrinho = [];

const audio = new Audio("bip.mp3");

window.onload = () => {
    document.getElementById("cod").focus();
};

function addProduto() {
    const codHtml = document.getElementById("cod");
    const qtdHtml = document.getElementById("qtd");

    const valorCod = codHtml.value;
    const valorQtd = Number(qtdHtml.value);

    if (!produtos[valorCod]) {
        AlertItem();
        return;
    }

    const infoProduto = produtos[valorCod];

    const item = {
        nome: infoProduto.nome,
        preco: infoProduto.preco,
        quantidade: valorQtd,
        subTot: infoProduto.preco * valorQtd
    };

    carrinho.push(item);

    audio.currentTime = 0;
    audio.play();

    atualizarTela();

    qtdHtml.value = 1;
    codHtml.value = "";
}
