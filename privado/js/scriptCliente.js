
const urlBase = 'http://localhost:4000/clientes';

const formulario = document.getElementById("formCadCliente");
let listaDeClientes = [];

if (localStorage.getItem("clientes")){
    //recuperando do armazenamento local a lista de clientes
    listaDeClientes = JSON.parse(localStorage.getItem("clientes"));
}

formulario.onsubmit=manipularSubmissao;

function manipularSubmissao(evento){
    if (formulario.checkValidity()){
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const uf = document.getElementById("uf").value;
        const cep = document.getElementById("cep").value;
        const cliente = {cpf,nome,telefone,cidade,uf,cep};
        //localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
        cadastrarCliente(cliente);//enviar requisição p/ servidor
        formulario.reset();
        mostrarTabelaClientes();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); //cancelamento do evento
    evento.stopPropagation(); //impedindo que outros observem esse evento

}

function mostrarTabelaClientes(){
    const divTabela = document.getElementById("tabela");
    divTabela.innerHTML=""; //apagando o conteúdo da div
    if (listaDeClientes.length === 0){
        divTabela.innerHTML="<p class='alert alert-info text-center'>Não há clientes cadastrados</p>";
    }
    else{
        const tabela = document.createElement('table');
        tabela.className="table table-striped table-hover";

        const cabecalho = document.createElement('thead');
        const corpo = document.createElement('tbody');
        cabecalho.innerHTML=`
            <tr>
                <th>CPF</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>UF</th>
                <th>CEP</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        for (let i=0; i < listaDeClientes.length; i++){
            const linha = document.createElement('tr');
            linha.id=listaDeClientes[i].id;
            linha.innerHTML=`
                <td>${listaDeClientes[i].cpf}</td>
                <td>${listaDeClientes[i].nome}</td>
                <td>${listaDeClientes[i].telefone}</td>
                <td>${listaDeClientes[i].cidade}</td>
                <td>${listaDeClientes[i].uf}</td>
                <td>${listaDeClientes[i].cep}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirCliente('${listaDeClientes[i].id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `;
            corpo.appendChild(linha);
        }
        tabela.appendChild(corpo);
        divTabela.appendChild(tabela);

    }
}

function excluirCliente(id){
    if(confirm("Deseja realmente excluir o cliente " + id + "?")){
        fetch(urlBase + "/" + id,{
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
        }).then((dados)=>{
            alert("Cliente excluído com sucesso!");
            listaDeClientes = listaDeClientes.filter((cliente) => { 
                return cliente.id !== id;
            });
            //localStorage.setItem("clientes", JSON.stringify(listaDeClientes));
            document.getElementById(id)?.remove(); //excluir a linha da tabela
        }).catch((erro) => {
            alert("Não foi possível excluir o cliente: " + erro);
        });
    }
}

function obterDadosClientes(){
    //enviar uma requisição para a fonte servidora
    fetch(urlBase, {
        method:"GET"
    })
    .then((resposta)=>{
        if (resposta.ok){
            return resposta.json();
        }
    })
    .then((clientes)=>{
        listaDeClientes=clientes;
        mostrarTabelaClientes();
    })
    .catch((erro)=>{
        alert("Erro ao tentar recuperar clientes do servidor!");
    });
}


function cadastrarCliente(cliente){

    fetch(urlBase, {
       "method":"POST",
       "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(cliente)
    })
    .then((resposta)=>{
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((dados) =>{
        alert(`Cliente incluído com sucesso! ID:${dados.id}`);
        listaDeClientes.push(cliente);
        mostrarTabelaClientes();
    })
    .catch((erro)=>{
        alert("Erro ao cadastrar o cliente:" + erro);
    });

}

obterDadosClientes();