if (process.env.NODE_ENV !== 'production') {
 require('dotenv').config()
 require('dotenv').parse('/.env')
}

const cryptoRandomString = require('crypto-random-string');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
const mongoose = require('mongoose')
const Player = require('./models/player')
const cors = require('cors')


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,  useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open',async () => {
    await  Player.deleteMany({x:-1})
    let players = await Player.find()
    console.log("players", players)
    console.log('Connected to Mongoose')
})

initializePassport(
              passport,
email => users.find(user => user.email === email),
id => users.find(user => user.id === id)
)
app.options('*', cors())

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



app.post('/start', async (req, res)=>{

    const player = new Player({
        status: 'wait',
        name: req.body.name,
        enemy_id: '-1',
        enemy_name:"enemy_name",
        move_turn:false,
        reply:" ",
        x:-1,
        y:-1
    })

    try {
        const newPlayer = await player.save()
        res.status(201).send(newPlayer)
    } catch (e){
        res.status(400).json({message: e.message})
    }
})

app.post('/wait',find_enemy ,async  (req,res)=>{

    const enemy_id = res.enemy._id
    const enemy_name = res.enemy.name
    const  status = res.enemy.status

    try {
        const updated_Player = await Player.findOneAndUpdate({id:req.body.id},{$set:{
                status: status,
                enemy_id: enemy_id,
                enemy_name:enemy_name,
            }
        }, {new:true})
    res.status(201).send({enemy: res.enemy, player: updated_Player})
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

})

// app.post('/run', async  (req,res)=>{
//     try {
//         Player.findOneAndUpdate({id:req.body.id},{$set:{move_turn: req.body.move_turn,
//                                                         reply: req.body.reply,
//                                                         x: req.body.x,
//                                                         y: req.body.y}})
//         const enemy = await Player.findOne({id:req.body.enemy_id})
//         res.status(201).send(enemy)
//     } catch (err) {
//         res.status(400).json({ message: err.message })
//     }
// })

async function find_enemy(req, res, next){
    const free_enemy = '-1'
    const status = 'run'
    let enemy = await Player.findOne({enemy_id: free_enemy || req.body._id }).where('_id').ne(req.body._id)
    if (enemy) {
        enemy.status = status
        enemy.enemy_id = req.body._id
        enemy.enemy_name = req.body.name
        enemy.move_turn = true

        try {
          await  enemy.save()
        } catch (err) {
            console.log({ message: err.message }, enemy)
        }
        } else {
        enemy = {status: "wait", name:"no_enemy_found", _id: "-1", enemy_name: "no_enemy_found" }
    }
    res.enemy = enemy
    next()
}


app.listen(process.env.PORT ||3000, console.log('Server started'))

