const cryptoRandomString = require('crypto-random-string');
const express = require('express')
const router = express.Router()
const Subscriber = require('../models/player')
const cors = require('cors')

// router.post('/start', async (req, res)=>{
//
//     const id = await cryptoRandomString({length: 6, characters: '1234567890'});
//     const subscriber = new Subscriber({
//         room_id: id,
//         name: req.body.name,
//         move_turn:false,
//         reply:" ",
//         x:-1,
//         y:-1
//     })
//
//     try{
//         const newSubscriber = await subscriber.save()
//         res.status(201).send(newSubscriber)
//     } catch (e){
//         res.status(400).json({message: e.message})
//     }
// })

module.exports = router