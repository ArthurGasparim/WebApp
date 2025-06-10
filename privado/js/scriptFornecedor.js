
var listaFornecedores = []
const formulario = document.getElementById("formCadForn")

const fetchF = "http://localhost:4000/fornecedores";

console.log(formulario)
formulario.onsubmit = manipularSubmissao

function manipularSubmissao(evento){
    console.log("Oi")
    if(formulario.checkValidity()){
        const nome = document.getElementById("nome").value;
        const cnpj = document.getElementById("cnpj").value;
        const cep = document.getElementById("cep").value;
        const fornecedor = {nome,cnpj,cep};
        cadastrar(fornecedor);
        formulario.reset();
    }
    else{
        formulario.classList.add('was-validated');
    }
    evento.preventDefault(); 
    evento.stopPropagation();
}

function mostrarTabela(){
    const tabela = document.getElementById("tabela")
    tabela.className="table table-striped table-hover"
    if(listaFornecedores.length == 0)
        tabela.innerHTML = "<p> Nenhum fornecedor cadastrado ainda</p>"
    else
    {
        tabela.innerHTML="";
        const cabecalho = document.createElement("thead");
        cabecalho.innerHTML = cabecalho.innerHTML=`
            <tr>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>CEP</th>
                <th>Ações</th>
            </tr>
        `;
        tabela.appendChild(cabecalho);
        const corpo = document.createElement("tbody")
        corpo.id = "corpo";
        for( elem of listaFornecedores)
        {
            const linha = document.createElement("tr")
            linha.innerHTML = `
            <td>${elem.nome}</td>
            <td>${elem.cnpj}</td>
            <td>${elem.cep}</td>
            <td><button type="button" class="btn btn-danger" onclick="excluirFornecedor('${elem.id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            `
            corpo.appendChild(linha)
        }
        tabela.appendChild(corpo);
    }
}

function cadastrar(fornecedor){
    fetch(fetchF,{
        method:"POST",
        "headers": {
          "Content-Type":"application/json",
       },
       "body": JSON.stringify(fornecedor)
    })
    .then(resposta =>{
        if(resposta.ok)
            return resposta.json();
    })
    .then(dado => {
        listaFornecedores.push(dado)
        if(listaFornecedores.length == 1)
            mostrarTabela()
        else
        {
            const tabela = document.getElementById("corpo")
            tabela.innerHTML +=  `
            <tr>
                <td>${dado.nome}</td>
                <td>${dado.cnpj}</td>
                <td>${dado.cep}</td>
                <td><button type="button" class="btn btn-danger" onclick="excluirFornecedor('${dado.id}')"><i class="bi bi-trash"></i>Excluir</button></td>
            </tr>
            `    
        }
        
    })
}

function excluirFornecedor(id){
    if(confirm("Deseja excluir o usuario: "+id)){
        fetch(fetchF+"/"+id,{
        method:"DELETE"
        })
        .then(resposta =>{
            if(resposta.ok)
            {
                listaFornecedores = listaFornecedores.filter((forn)=>{
                return forn.id !== id;
                 })
                mostrarTabela();
                return resposta.json();
            }
        })
        .catch(erro => {
            console.log("Erro Delete: "+erro);
        })
    }
    
}

function obterFornecedores(){
    fetch(fetchF,{
        method:"GET"
    })
    .then(resposta =>{
        if(resposta.ok)
            return resposta.json();
    })
    .then(dados =>{
        listaFornecedores = dados;
        mostrarTabela();
    })
    .catch(erro =>{
        console.log("Erro ObtFunc: "+erro)
    })
}


obterFornecedores();
