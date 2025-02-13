try {
    // RECUPERAR O ID DETALHE DO LOCALSTORAGE
    var id = parseInt(localStorage.getItem('detalhe'), 10);

    // PEGAR OS PRODUTOS DO LOCALSTORAGE
    var produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    var item = produtos.find(produto => produto.id === id);

    if (item) {
        console.log('Produto encontrado:', item);

        // GARANTIR QUE OS ELEMENTOS EXISTEM ANTES DE MANIPULAR
        $("#imagem-detalhe").attr('src', item.imagem);
        $("#nome-detalhe").text(item.nome);  // Evita XSS
        $("#rating-detalhe").text(item.rating);
        $("#like-detalhe").text(item.likes);
        $("#reviews-detalhe").text(`${item.reviews} reviews`);
        $("#descricao-detalhe").text(item.descricao);
        $("#preco-detalhe").text(item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
        $("#precopromo-detalhe").text(item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));

        var tabelaDetalhes = $("#tabdetalhes");
        var detalhesHTML = "";

        item.detalhes.forEach(detalhe => {
            detalhesHTML += `
                <tr>
                    <td>${detalhe.caracteristica}</td>
                    <td>${detalhe.detalhes}</td>
                </tr>
            `;
        });

        tabelaDetalhes.append(detalhesHTML);

    } else {
        console.log('Produto não encontrado');
    }

    // RECUPERAR O CARRINHO DO LOCALSTORAGE
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // FUNÇÃO PARA ADICIONAR AO CARRINHO
    function adicionarAoCarrinho(item, quantidade) {
        var itemNoCarrinho = carrinho.find(c => c.item.id === item.id);

        if (itemNoCarrinho) {
            // JÁ TEM O ITEM NO CARRINHO, AUMENTA A QUANTIDADE
            itemNoCarrinho.quantidade += quantidade;
            itemNoCarrinho.total_item = itemNoCarrinho.quantidade * item.preco_promocional;

        } else {
            carrinho.push({
                item: item,
                quantidade: quantidade,
                total_item: quantidade * item.preco_promocional
            });
        }

        // ATUALIZAR O LOCALSTORAGE DO CARRINHO
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    // EVENTO DE CLIQUE NO BOTÃO "ADICIONAR AO CARRINHO"
    $(".add-cart").on('click', function () {
        adicionarAoCarrinho(item, 1);

        var toastCenter = app.toast.create({
            text: `${item.nome} adicionado ao carrinho`,
            position: 'center',
            closeTimeout: 2000,
        });

        toastCenter.open();
    });

} catch (error) {
    console.error('Erro ao processar os dados:', error);
}
