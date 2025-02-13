var localCarrinho = localStorage.getItem('carrinho');

// Verifica se há algo no localStorage antes de parsear
var carrinho = [];
if (localCarrinho) {
    try {
        carrinho = JSON.parse(localCarrinho);
        if (!Array.isArray(carrinho)) {
            carrinho = []; // Garante que seja sempre um array
        }
    } catch (e) {
        console.error("Erro ao ler o carrinho do localStorage:", e);
        carrinho = []; // Reseta o carrinho se houver erro no JSON
    }
}

// Lógica para exibição do carrinho
if (carrinho.length > 0) {
    renderizarCarrinho();
    calcularTotal();
} else {
    carrinhoVazio();
}

function renderizarCarrinho() {
    $("#listaCarrinho").empty();

    // PERCORRER O CARRINHO E RENDERIZAR A INTERFACE
    $.each(carrinho, function(index, itemCarrinho) {
        var imagem = itemCarrinho.item?.imagem || "img/default.png";
        var nome = itemCarrinho.item?.nome || "Produto sem nome";
        var caracteristica = itemCarrinho.item?.principal_caracteristica || "Sem informação";
        var precoPromocional = itemCarrinho.item?.preco_promocional || 0;
        var quantidade = itemCarrinho.quantidade || 1;

        var itemDiv = `
            <div class="item-carrinho" data-index="${index}">
                <div class="area-img">
                    <img src="${imagem}" alt="Imagem do Produto">
                </div>
                <div class="area-details">
                    <div class="sup">
                        <span class="name-prod">${nome}</span>
                        <a class="delete-item" data-index="${index}" href="#"><i class="mdi mdi-close"></i></a>
                    </div>
                    <div class="middle">
                        <span>${caracteristica}</span>
                    </div>
                    <div class="preco-quantidade">
                        <span>${precoPromocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <div class="count">
                            <a class="minus" data-index="${index}" href="#">-</a>
                            <input readonly class="qtd-item" type="text" value="${quantidade}">
                            <a class="plus" data-index="${index}" href="#">+</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#listaCarrinho").append(itemDiv);
    });

    // Atualizar eventos de clique para alterar quantidade
    ativarEventos();
}

function ativarEventos() {
    $(".minus").on("click", function() {
        var index = $(this).data("index");
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        } else {
            carrinho.splice(index, 1); // Remove item se a quantidade for 1
        }
        atualizarCarrinho();
    });

    $(".plus").on("click", function() {
        var index = $(this).data("index");
        carrinho[index].quantidade++;
        atualizarCarrinho();
    });

    $(document).on("click", ".delete-item", function() {
        var index = $(this).closest('.item-carrinho').data('index');
        app.dialog.confirm('Tem certeza que quer remover este item?', 'Remover', function(){
            carrinho.splice(index, 1);
            atualizarCarrinho();
        });
    });
}

function atualizarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    if (carrinho.length > 0) {
        renderizarCarrinho();
        calcularTotal();
    } else {
        carrinhoVazio();
    }
}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function(index, itemCarrinho) {
        var preco = itemCarrinho.item.preco_promocional || 0;
        totalCarrinho += (itemCarrinho.quantidade * preco);
    });

    // MOSTRAR O TOTAL
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}

function carrinhoVazio() {
    console.log('Carrinho está vazio');

    // ESVAZIAR LISTA DO CARRINHO
    $("#listaCarrinho").empty();

    // ESCONDER BOTÃO DE COMPRA E TOTAIS
    $("#toolbarTotais").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    // MOSTRAR IMAGEM E MENSAGEM DE CARRINHO VAZIO
    $("#listaCarrinho").html(`
        <div class="text-align-center">
            <img width="300" src="img/empty.gif" alt="Carrinho vazio">
            <br>
            <span class="color-black">Nada por enquanto...</span>
        </div>
    `);
}

function esvaziarCarrinho() {
    localStorage.removeItem('carrinho');
    carrinho = [];
    carrinhoVazio();
}

// EVENTO PARA ESVAZIAR O CARRINHO
$(document).ready(function() {
    $("#esvaziar").on('click', function() {
        app.dialog.confirm(
            'Tem certeza que quer esvaziar o carrinho?',
            '<div style="text-align: center;"><strong>ESVAZIAR</strong></div>',
            esvaziarCarrinho
        );
    });
});
