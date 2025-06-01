
const fetchProductsURL = 'http://localhost:4000/produtos';
const fetchCategoriesURL = 'http://localhost:4000/categorias';
const fetchFornURL = 'http://localhost:4000/fornecedores';

const form = document.getElementById("regProdutosForm");
let prodList = [];
let catMap = {};
let fornMap = {}; 

if (localStorage.getItem("produtos"))
    prodList = JSON.parse(localStorage.getItem("produtos"));

form.onsubmit = handleSubmission;

function handleSubmission(event){
    event.preventDefault(); // Stop form from submitting
    event.stopPropagation(); // impedindo que outros observem esse evento
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

    const nome = document.getElementById("nome").value;
    const quantidade = document.getElementById("qtd").value;
    const preco = document.getElementById("preco").value;
    const catID = document.getElementById("cat").value;
    const fornID = document.getElementById("forn").value;
    const imagem = document.getElementById("image").value;
    const product = {nome, quantidade, preco, catID, fornID, imagem};
    registerProduct(product); // send to server 
    form.reset();
    showProductsTable();
}

function showProductsTable(){
    const divTable = document.getElementById("tabela");
    divTable.innerHTML = "";
    if (prodList.length === 0) { 
        divTable.innerHTML="<p class='alert alert-info text-center'>Não há produtos cadastradas</p>";
        return;
    }

    const table = document.createElement('table');
    table.className="table table-striped table-hover";

    const tableHeader = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    tableHeader.innerHTML=`
        <tr>
            <th>Nome</th>
            <th>Qtd.</th>
            <th>Preco</th>
            <th>Categoria</th>
            <th>Fornecedor</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    for (let i = 0; i < prodList.length; i++) {
        const row = document.createElement('tr');
        row.id = prodList[i].id;
        row.innerHTML=`
            <td style="text-align: left; padding-right: 12vw;">${prodList[i].nome}</td>
            <td style="text-align: left; padding-right: 80px;">${prodList[i].quantidade}</td>
            <td style="text-align: left; padding-right: 80px;">$${prodList[i].preco}</td>
            <td style="text-align: center; padding-right: 80px;">${catMap[prodList[i].catID].label}</td>
            <td style="text-align: center; ">${fornMap[prodList[i].fornID].nome}</td>
            <td style="text-align: right; width: 100%;">
                <button type="button" class="btn btn-danger" onclick="deleteProduct('${prodList[i].id}')">
                    Excluir
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function deleteProduct(id) {
    if(confirm("Deseja realmente excluir o produto " + id + "?")){
        fetch(fetchProductsURL + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok) return resposta.json();
        }).then((dados)=>{
            alert("Produto excluído com sucesso!");
            prodList = prodList.filter((prod) => { 
                return prod.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(prodList));
            document.getElementById(id)?.remove(); // Remove row
        }).catch((erro) => {
            alert("Não foi possível excluir o produto: " + erro);
        });
    }
}

function updateRegisterSelects() {
    const catSelect = document.getElementById("cat");
    for(const [k, v] of Object.entries(catMap)) catSelect.innerHTML += `<option value="${k}">${v.label}</option>`;

    const fornSelect = document.getElementById("forn");
    for(const [k, v] of Object.entries(fornMap)) fornSelect.innerHTML += `<option value="${k}">${v.nome}</option>`;
}

function list2hashmap(list, hashmap) {
    for(let i = 0; i < list.length; i++)
        hashmap[list[i].id] = list[i];
}
function fetchProductData(){
    Promise.all([
        fetch(fetchCategoriesURL).then(res => res.ok ? res.json() : Promise.reject("Failed categories")),
        fetch(fetchFornURL).then(res => res.ok ? res.json() : Promise.reject("Failed forns"))
    ]).then(([categories, forns]) => {
        list2hashmap(categories, catMap);
        list2hashmap(forns, fornMap);
        updateRegisterSelects();
        return fetch(fetchProductsURL).then(res => res.ok ? res.json() : Promise.reject("Failed products"));
    }).then((products) => {
        prodList = products;
        showProductsTable();
    }).catch((error) => {
        alert("Erro ao tentar recuperar dados do servidor! " + error);
    });
}


function registerProduct(product){

    fetch(fetchProductsURL, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(product)
    })
    .then((resposta)=>{
        if(resposta.ok) return resposta.json();
    })
    .then((data) =>{
        alert(`Produto incluído com sucesso! ID:${data.id}`);
        product.id = data.id;
        prodList.push(product);
        showProductsTable();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar a produto:" + erro);
    });

}

fetchProductData();