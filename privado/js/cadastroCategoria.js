
const urlBase = 'http://localhost:4000/categorias';

const form = document.getElementById("regCategoryForm");
let catList = [];

if (localStorage.getItem("categorias"))
    catList = JSON.parse(localStorage.getItem("categorias"));

form.onsubmit = handleSubmission;

function handleSubmission(event){
    event.preventDefault(); // Stop form from submitting
    event.stopPropagation(); // impedindo que outros observem esse evento
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

    const label = document.getElementById("label").value;
    const category = {label};
    registerCategory(category); // send to server 
    form.reset();
    showCategoriesTable();
}

function showCategoriesTable(){
    const divTable = document.getElementById("tabela");
    divTable.innerHTML = "";
    if (catList.length === 0) { 
        divTable.innerHTML="<p class='alert alert-info text-center'>Não há categorias cadastradas</p>";
        return;
    }

    const table = document.createElement('table');
    table.className="table table-striped table-hover";

    const tableHeader = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    tableHeader.innerHTML=`
        <tr>
            <th>Nome</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    for (let i = 0; i < catList.length; i++){
        const row = document.createElement('tr');
        row.id = catList[i].id;
        row.innerHTML=`
            <td style="text-align: left;">${catList[i].label}</td>
            <td style="text-align: right; width: 100%;">
                <button type="button" class="btn btn-danger" onclick="deleteCategory('${catList[i].id}')">
                    Excluir
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function deleteCategory(id) {
    if(confirm("Deseja realmente excluir a categoria " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok) return resposta.json();
        }).then((dados)=>{
            alert("Categoria excluída com sucesso!");
            catList = catList.filter((cat) => { 
                return cat.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(catList));
            document.getElementById(id)?.remove(); // Remove row
        }).catch((erro) => {
            alert("Não foi possível excluir a categoria: " + erro);
        });
    }
}

function fetchCategoryData(){
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok) return resposta.json();
    })
    .then((categories)=>{
        catList = categories;
        showCategoriesTable();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar categorias do servidor! " + erro);
    });
}


function registerCategory(category){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(category)
    })
    .then((resposta)=>{
        if(resposta.ok) return resposta.json();
    })
    .then((data) =>{
        alert(`Categoria incluída com sucesso! ID:${data.id}`);
        category.id = data.id;
        catList.push(category);
        showCategoriesTable();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar a categoria:" + erro);
    });

}

fetchCategoryData();