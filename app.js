const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use((req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*');

 // authorized headers for preflight requests
 // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 next();

 app.options('*', (req, res) => {
  // allowed XHR methods
  res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
  res.send();
 });
});


app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


app.get('/',function (req,res) {
 res.render('index')
})

app.post('/', jsonParser ,function (req,res) {
 res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
 if(!req.body) { res.sendStatus(400)}
 console.log(req.body)
 res.render('index')
})

app.post('/about',function (req,res) {
 if(!req.body) { res.sendStatus(400)}
 console.log(req)
 res.render('index')
})

app.get('/news/:id',function (req,res) {

 let obj = {title:"News",
            id: 46,
             pharagrafs:["Первый","Второй","Третий","Четверый"]}
 res.render('news', {newsId: req.params.id, data:obj})
})

app.get('/about',function (req,res) {
 res.render('about')
})

app.listen(3000)






// let server = http.createServer((req, res) => {
//
//  if(req.url === '/home' || req.url === '/'){
//   res.writeHead(200, {'Content-type':'text/html; charset=utf-8'})
//   let read_part = fs.createReadStream(__dirname+'/index.ejs')
//   read_part.pipe(res)
//  } else if (req.url === '/about'){
//   res.writeHead(200, {'Content-type':'text/html; charset=utf-8'})
//   let read_part = fs.createReadStream(__dirname+'/about.ejs')
//   read_part.pipe(res)
//  } else {
//   res.writeHead(404, {'Content-type':'text/html; charset=utf-8'})
//   let read_part = fs.createReadStream(__dirname+'/404.html')
//   read_part.pipe(res)
//  }
//
// })
// server.listen(3000, '127.0.0.1')
