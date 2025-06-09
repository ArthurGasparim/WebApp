const fetchClientsURL = 'http://localhost:4000/clientes';
const fetchFornURL = 'http://localhost:4000/fornecedores';
const fetchEntregadoresURL = 'http://localhost:4000/entregadores';
const fetchCategoriesURL = 'http://localhost:4000/categorias';

let clientList = [];
let fornList = [];
let entList = [];
let catList = [];
let fornMap = {}; 

function showClientTable() {
    const divTable = document.getElementById("client-table");
    divTable.innerHTML = "";
    if (clientList.length === 0) { 
        divTable.innerHTML="<p class='alert alert-info text-center'>Não há clientes cadastrados</p>";
        return;
    }

    const table = document.createElement('table');
    table.className="table table-striped table-hover";

    const tableHeader = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    tableHeader.innerHTML=`
        <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Cidade</th>
            <th>UF</th>
            <th>CEP</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    for (let i = 0; i < clientList.length; i++) {
        const row = document.createElement('tr');
        row.id = clientList[i].id;
        row.innerHTML=`
            <td>${clientList[i].cpf}</td>
            <td>${clientList[i].nome}</td>
            <td>${clientList[i].telefone}</td>
            <td>${clientList[i].cidade}</td>
            <td>${clientList[i].uf}</td>
            <td>${clientList[i].cep}</td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function showFornTable() {
    const divTable = document.getElementById("forn-table");
    divTable.innerHTML = "";
    if (fornList.length === 0) { 
        divTable.innerHTML="<p class='alert alert-info text-center'>Não há fornecedores cadastrados</p>";
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
            <th>CEP</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    for (let i = 0; i < fornList.length; i++) {
        const row = document.createElement('tr');
        row.id = fornList[i].id;
        row.innerHTML=`
            <td>${fornList[i].nome}</td>
            <td>${fornList[i].cnpj}</td>
            <td>${fornList[i].cep}</td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function showEntTable() {
    const divTable = document.getElementById("ent-table");
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
            <td>${entList[i].nome}</td>
            <td>${entList[i].cnpj}</td>
            <td>${entList[i].telefone}</td>
            <td>${fornMap[entList[i].fornID].nome}</td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function showCatTable() {
    const divTable = document.getElementById("category-table");
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
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    divTable.appendChild(table);
}

function showTables(){
    showClientTable();
    showFornTable();
    showEntTable();
    showCatTable();
}

function list2hashmap(list, hashmap) {
    for(let i = 0; i < list.length; i++)
        hashmap[list[i].id] = list[i];
}

function fetchData(){
    Promise.all([
        fetch(fetchClientsURL).then(res => res.ok ? res.json() : Promise.reject("Failed clients")),
        fetch(fetchFornURL).then(res => res.ok ? res.json() : Promise.reject("Failed forns")),
        fetch(fetchCategoriesURL).then(res => res.ok ? res.json() : Promise.reject("Failed categories"))
    ]).then(([clients, forns, categories]) => {
        list2hashmap(forns, fornMap);
        clientList = clients;
        fornList = forns;
        catList = categories;
        return fetch(fetchEntregadoresURL).then(res => res.ok ? res.json() : Promise.reject("Failed entregadores"));
    }).then((entregadores) => {
        entList = entregadores;
        showTables();
    }).catch((error) => {
        alert("Erro ao tentar recuperar dados do servidor! " + error);
    });
}

fetchData();