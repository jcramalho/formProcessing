var http = require('http')
var url = require('url')
var pug = require('pug')
var fs = require('fs')

http.createServer((req,res) =>{
    var purl = url.parse(req.url, true)
    var query = purl.query

    console.log('Recebi o pedido: ' + req.url)
    console.log('Com a query: ' + JSON.stringify(query))

    if(purl.pathname == '/registo'){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(pug.renderFile('form-aluno.pug'))
        res.end()
    }
    else if(purl.pathname == '/processaForm'){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write(pug.renderFile('aluno-recebido.pug', {aluno: query}))
        res.end()
    }
    else if(purl.pathname == '/w3.css'){
        res.writeHead(200, {'Content-Type': 'text/css'})
        fs.readFile('stylesheets/w3.css', (erro, dados) => {
            if(!erro) res.write(dados)
            else res.write(pug.renderFile('erro.pug', {e: erro}))
            res.end()
        })
    }
    else{
        res.writeHead(501, {'Content-Type': 'text/html; charset=utf-8'})
        res.end('Erro: ' + purl.pathname + ' não está implementado!')
    }
}).listen(3018, ()=>{
    console.log('Servidor à escuta na porta 3018...')
})
