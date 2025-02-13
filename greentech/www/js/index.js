fetch('js/backend.json')
    .then(response => response.json())
    .then(data => {
        try {
            // Salvar os dados do backend no localStorage
            localStorage.setItem('produtos', JSON.stringify(data));
            console.log('Dados dos produtos salvos no localStorage');
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }

        // Simular carregamento online
        setTimeout(() => {
            const produtosContainer = $("#produtos");
            produtosContainer.empty(); // Esvaziar a área de produtos

            data.forEach(produto => {
                const produtoHTML = `
                    <div class="item-card">
                        <a data-id="${produto.id}" href="#" class="item">
                            <div class="img-container">
                                <img src="${produto.imagem}" alt="${produto.nome}">
                            </div>
                            <div class="nome-rating">
                                <span class="color-gray"></span>
                                <span class="bold margin-right">
                                    <i class="mdi mdi-star"></i> 
                                    ${produto.rating}
                                </span>
                            </div>
                            <div class="price">${produto.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</div>
                        </a>
                    </div>
                `;

                produtosContainer.append(produtoHTML);
                produtosContainer.find('.color-gray').last().text(produto.nome); // Evitar XSS
            });

        }, 1000);
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));

// Atualizar contador do carrinho de forma segura
setTimeout(() => {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        $('.btn-cart').attr('data-count', carrinho.length);
    } catch (error) {
        console.error('Erro ao acessar o carrinho no localStorage:', error);
    }
}, 300);

// Delegação de evento para itens adicionados dinamicamente
$(document).on('click', '.item', function() {
    const id = $(this).attr('data-id');
    localStorage.setItem('detalhe', id);
    app.views.main.router.navigate('/detalhes/');
});
