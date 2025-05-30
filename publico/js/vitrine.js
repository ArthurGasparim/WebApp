function loadProducts(){
    fetch('http://localhost:4000/produtos',{
        method:"GET"
    }).then((resposta) => {
        if (resposta.ok) return resposta.json();
    }).then((listaDeProdutos) => {
        const divVitrine = document.getElementById("vitrine");
        for (const produto of listaDeProdutos){
            let card = document.createElement('div');
            card.innerHTML=`
            <div class="card" style="width: 16rem; height: 25rem">
                <img width="150px" height="200px" src="${produto.imagem}" class="card-img-top" alt="...">
                <div class="card-body" style="display: flex; flex-direction: column;">
                    <h5 class="card-title" style="font-size: 16px">${produto.nome}</h5>
                    <p class="card-text">${produto.quantidade} unidades</p>
                    <p class="card-text">$${produto.preco}</p>
                    <a href="#" class="btn btn-primary" style="margin-top: auto;">Comprar</a>
                </div>
            </div>
            `;
            divVitrine.appendChild(card);
        }
    }).catch((erro)=>{
        alert("Não foi possível carregar os produtos para a vitrine:" + erro);
    });
}

loadProducts();