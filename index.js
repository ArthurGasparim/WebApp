// npm init e posteriormente adicionar "type": "module" em package.json e o script "start" : "index.js"
// npm install express

import express from 'express'; // "type": "module"
// const express = require("express"); "type": "commonjs"
import session from 'express-session'
import verificarAutenticacao from "./seguranca/autenticacao.js";

const fetchU = 'http://localhost:4000/usuarios'

const host = "0.0.0.0";
const porta = 3000;
const app = express(); // app web passa a ouvir a porta 3000

// Possibilitando a comunicação com estado (stateful)

app.use(session({
    secret: "M1nH4Ch4v3S3cR3t4",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true
    }
}));

// configurar o express para processar os parâmetros contidos na url
// qs: true - mais poderosa para lidar com parâmetros da requisição
// querystring
app.use(express.urlencoded({extended: true})); // midware
// compartilhando publicamente os arquivos existentes na pasta "publico"
app.use(express.static("publico")); // assets ou conteúdo estático

app.post("/cadastro",(requisicao,resposta) => {
    const usu = {};
    usu.nome = requisicao.body.nome;
    usu.senha = requisicao.body.senha;
    var flag = 1;
    fetch(fetchU,{
        method:"GET"
    }).then((resposta) => {
        if(resposta.ok)
            return resposta.json();
    })
    .then((dados)=>{
        for (let usuario of dados)
        {
            console.log(usuario.nome === usu.nome)
            if(usuario.nome !== usu.nome) continue;
            flag = 0;

            console.log(flag);
            var conteudo = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/css/login.css"/>
                <link rel="stylesheet" href="/css/bootstrap.min.css"/>
                <title>Página de Cadastro</title>
            </head>
            <body>
                <div class="container">
                    <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <h2 class="text-center text-dark mt-5">Bem-vindo</h2>
                        <div class="text-center mb-5 text-dark">Faça o cadastro</div>
                        <div class="card my-5">
                
                        <form action="/cadastro" method="POST" class="card-body cardbody-color p-lg-5">
                            <div class="mb-3">
                            <input type="text" class="form-control" id="nome" name="nome" aria-describedby="emailHelp"
                                placeholder="nome">
                            </div>
                            <div class="mb-3">
                            <input type="password" class="form-control" id="senha" name="senha" placeholder="senha">
                            </div>
                            <div class="text-center"><button type="submit" class="btn btn-color px-5 mb-5 w-100">Cadastre</button></div>
                        </form>
                        <div class="alert alert-danger">Usuário já existe!</div>
                        </div>
                
                    </div>
                    </div>
                </div>
            </body>
            </html>
                    `;
            break;
        }
            
        if(flag === 1)
        {
            fetch(fetchU,{
                method:"POST",
                body:JSON.stringify(usu),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then((resposta) => {
                if(resposta.ok) return resposta.json();
            })
            .then((dados)=>{
                console.log("Inseriu: "+usu.nome);
            })
            .catch((erro)=>{
                console.log("Erro Insercao: "+usu);
            })
            resposta.redirect("/login.html")
        }
        else resposta.send(conteudo);
    })
    .catch((erro)=>{
        console.log("Erro GET: "+ erro);
    })
})

app.post("/login", (requisicao, resposta) => {
    // desestruturação javascript
    const {usuario, senha} = requisicao.body;
    fetch(fetchU)
    .then(resposta =>{
        if(resposta.ok)
            return resposta.json();
    })
    .then(dados =>{
        for(let usu of dados)
        {
            if(usu.nome === usuario && usu.senha === senha)
            {
                requisicao.session.autenticado = true;
                break;
            }
        }
        if(requisicao.session.autenticado)
        {
           return resposta.redirect("/menu.html");
        }
          
        else
        {
            let conteudo = `
                <!DOCTYPE html>
                <html lang="pt-br">
        
                    <head>
                    <meta charset="UTF-8">
                    <title>Login</title>
                    <link rel="stylesheet" href="css/bootstrap.min.css">
                    <link rel="stylesheet" href="css/login.css">
                    </head>
        
                    <body>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-6 offset-md-3">
                                    <h2 class="text-center text-dark mt-5">Bem-vindo</h2>
                                    <div class="text-center mb-5 text-dark">Faça o login</div>
                                    <div class="card my-5">
                                        <form class="card-body cardbody-color p-lg-5" action="/login" method="post">
                                            <div class="text-center">
                                                <img src="/imagens/login-avatar.webp"
                                                    class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                                                    width="200px" alt="profile">
                                            </div>
                                            <div class="mb-3">
                                                <input type="text" class="form-control" id="usuario" value="${usuario}" name="usuario"
                                                    aria-describedby="emailHelp"
                                                    placeholder="Usuário">
                                            </div>
                                            <div class="mb-3">
                                                <input type="password" class="form-control" id="senha" name="senha" placeholder="Senha">
                                            </div>
                                            <div class="text-center">
                                                <button type="submit" class="btn btn-color px-5 mb-5 w-100">Login</button>
                                            </div>
                                            <div class="alert alert-danger">Usuário ou senha incorretos!</div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
        
                </html>
            `;
            resposta.send(conteudo);
            resposta.end();
        }
        })
        .catch(erro =>{
            console.log("Erro GetLogin: "+erro);
        })
        console.log(requisicao.session.autenticado)
        
        }
);

// compartilhando conteúdo privado mediante autenticação
app.use(verificarAutenticacao, express.static("privado"));
// daqui para baixo, os endpoints só serão acessados mediante autenticação.

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy(); // exclui a sessão de um usuário (aquele que escolheu acessar o endereço)
    resposta.redirect("/login.html"); // lembre-se que esse recurso é público
    resposta.end();
});

app.get("/products", (request, response) => {
    
});

app.listen(porta, host, () => {
    console.log(`Servidor em execução em http://${host}:${porta}`);
});
