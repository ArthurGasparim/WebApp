export default function verificarAutenticacao(requisicao,resposta,next){
    if (requisicao.session.autenticado){
        next();
    }
    else{
        resposta.redirect("/login.html");
    }
}