if (process.env.NODE_ENV !== 'production') {
 require('dotenv').config()
 require('dotenv').parse('/.env')
}


const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const users = []
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,  useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

initializePassport(
              passport,
email => users.find(user => user.email === email),
id => users.find(user => user.id === id)
)

app.set('view engine', 'ejs');
app.set('views',__dirname+'/views')
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static('public'));
app.use(flash())
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(methodOverride('_method'))


// app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//
//  // authorized headers for preflight requests
//  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
//  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//  next();
//
//  app.options('*', (req, res) => {
//   // allowed XHR methods
//   res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
//   res.send();
//  });
// });




app.get('/', checkAuthenticated, function (req,res) {
 res.render('index',{name:req.user.name})
})
app.get('/login', checkNotAuthenticated, function (req,res) {
 res.render('login')
})
app.get('/register', checkNotAuthenticated, function (req,res) {
 res.render('register')
})

app.post('/register', checkNotAuthenticated, async function(req,res){
 try {
const hashedPassword = await bcrypt.hash(req.body.password, 10)
  users.push({
   id:Date.now().toString(),
   name: req.body.name,
   email: req.body.email,
   password: hashedPassword
  })
  res.redirect('/login')
 } catch {
  console.log('Error!')
res.redirect('/register')
 }
 console.log(users)
})

app.post('/login', checkNotAuthenticated,  passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.delete('/logout', (req, res)=>{
  req.logOut()
  res.redirect('/login')
})

 function checkAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
     return next()
   }
   res.redirect('/login')
 }

 function checkNotAuthenticated(req, res, next){
   if (req.isAuthenticated()) {
    return res.redirect('/')
   }
  next()
 }

app.listen(process.env.PORT ||3000)

