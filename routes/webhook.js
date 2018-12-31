require('../config/config')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const config = require('config')

const {receivedMessage,receivedPostback} = require('../modules/functions')

const app =express();

app.get('/webhook', (req,res)=>{
    if(req.query['hub.verify_token'] === process.env.VERIFY_TOKEN){
        res.send(req.query['hub.challenge'])
    }else{
        res.send('esta conectado correctamente a la webhook')
    }
})

app.post('/webhook', (req,res)=>{
    let data = req.body
    if(data.object == 'page'){
        data.entry.forEach((pageEntry) => {
            let pageID =pageEntry.id

            pageEntry.messaging.forEach((messagingEvent)=>{
                if(messagingEvent.message){  
                    receivedMessage(messagingEvent) 
                }else if(messagingEvent.postback){
                    receivedPostback(messagingEvent)
                }else{
                    console.log('Webhook get desconocido: ', messagingEvent)
                }
            })
        });
    }
    

    res.sendStatus(200);
})

module.exports = app;