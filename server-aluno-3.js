// Servidor com persistência de dados em JSON

var http = require('http')
var url = require('url')
var pug = require('pug')
var fs = require('fs')
var jsonfile = require('jsonfile')

var myDados = "alunos.json"

var { parse } = require('querystring')

http.createServer((req,res) =>{
    var purl = url.parse(req.url, true)
    var query = purl.query

    console.log('Recebi o pedido: ' + req.url)
    console.log('Método: ' + req.method)

    if (req.method === 'POST') {
        recuperaInfo(req, result => {
            jsonfile.readFile(myDados, (erro, alunos) => {
                if (erro) console.error(erro)
                else{
                    alunos.push(result)
                    jsonfile.writeFile(myDados, result, erro => {
                        if (erro) console.error(erro)
                        else console.log('Registo gravado com sucesso.')
                      })
                    console.dir(alunos)
                }
              })
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(pug.renderFile('aluno-recebido.pug', {aluno: result}))
            res.end()
        })
    } 
    else{
        if(purl.pathname == '/registo'){
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(pug.renderFile('form-aluno-2.pug'))
            res.end()
        }
        else if(purl.pathname == '/processaForm'){
            fs.appendFile("alunos.json", JSON.stringify(query) , function (err) {
                if (err) console.log(err)
                else console.log('Registo adicionado ao ficheiro.')
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(pug.renderFile('aluno-recebido.pug', {aluno: query}))
                res.end()
             })
        }
        else if(purl.pathname == '/lista'){
            jsonfile.readFile(myDados, (erro, alunos) => {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                if (erro) res.write(pug.renderFile('erro.pug', {e: erro}))
                else res.write(pug.renderFile('lista-alunos.pug', alunos))
                res.end()
            })
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
    }
}).listen(3018, ()=>{
    console.log('Servidor à escuta na porta 3018...')
})

function recuperaInfo(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}