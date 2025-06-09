
const fetchEntregadoresURL = 'http://localhost:4000/entregadores';
const fetchFornURL = 'http://localhost:4000/fornecedores';

const form = document.getElementById("regEntregadoresForm");
let entList = [];
let fornMap = {}; 

if (localStorage.getItem("entregadores"))
    entList = JSON.parse(localStorage.getItem("entregadores"));

form.onsubmit = handleSubmission;

function handleSubmission(event){
    event.preventDefault(); // Stop form from submitting
    event.stopPropagation(); // impedindo que outros observem esse evento
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }

    const nome = document.getElementById("nome").value;
    const cnpj = document.getElementById("cnpj").value;
    const telefone = document.getElementById("telefone").value;
    const fornID = document.getElementById("forn").value;
    const entregador = {nome, cnpj, telefone, fornID};
    registerEntregador(entregador); // send to server 
    form.reset();
    showEntregadoresTable();
}

function showEntregadoresTable(){
    const divTable = document.getElementById("tabela");
    divTable.innerHTML = "";
    if (entList.length === 0) { 
        divTable.innerHTML="<p class='alert alert-info text-center'>Não há entregadores cadastrados</p>";
        return;
    }

    const table = document.createElement('table');
    table.className="table table-striped table-hover";

    const tableHeader = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    tableHeader.innerHTML=`
        <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>Fornecedor</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    for (let i = 0; i < entList.length; i++) {
        const row = document.createElement('tr');
        row.id = entList[i].id;
        row.innerHTML=`
            <td style="text-align: left; padding-right: 12vw;">${entList[i].nome}</td>
            <td style="text-align: left; padding-right: 80px;">${entList[i].cnpj}</td>
            <td style="text-align: left; padding-right: 80px;">${entList[i].telefone}</td>
            <td style="text-align: center; ">${fornMap[entList[i].fornID].nome}</td>
            <td style="text-align: right; width: 100%;">
                <button type="button" class="btn btn-danger" onclick="deleteEntregador('${entList[i].id}')">
                    Excluir
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function deleteEntregador(id) {
    if(confirm("Deseja realmente excluir o entregador " + id + "?")){
        fetch(fetchEntregadoresURL + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok) return resposta.json();
        }).then((dados)=>{
            alert("Entregador excluído com sucesso!");
            entList = entList.filter((ent) => { 
                return ent.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(entList));
            document.getElementById(id)?.remove(); // Remove row
        }).catch((erro) => {
            alert("Não foi possível excluir o entregador: " + erro);
        });
    }
}

function updateRegisterSelects() {
    const fornSelect = document.getElementById("forn");
    for(const [k, v] of Object.entries(fornMap)) fornSelect.innerHTML += `<option value="${k}">${v.nome}</option>`;
}

function list2hashmap(list, hashmap) {
    for(let i = 0; i < list.length; i++)
        hashmap[list[i].id] = list[i];
}
function fetchEntregadorData(){
    Promise.all([
        fetch(fetchFornURL).then(res => res.ok ? res.json() : Promise.reject("Failed forns"))
    ]).then(([forns]) => {
        list2hashmap(forns, fornMap);
        updateRegisterSelects();
        return fetch(fetchEntregadoresURL).then(res => res.ok ? res.json() : Promise.reject("Failed entregadores"));
    }).then((entregadores) => {
        entList = entregadores;
        showEntregadoresTable();
    }).catch((error) => {
        alert("Erro ao tentar recuperar dados do servidor! " + error);
    });
}


function registerEntregador(entregador){

    fetch(fetchEntregadoresURL, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(entregador)
    })
    .then((resposta)=>{
        if(resposta.ok) return resposta.json();
    })
    .then((data) =>{
        alert(`Entregador incluído com sucesso! ID:${data.id}`);
        entregador.id = data.id;
        entList.push(entregador);
        showEntregadoresTable();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar a entregador:" + erro);
    });

}

fetchEntregadorData();