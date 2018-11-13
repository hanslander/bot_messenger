const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const config = require('config')


// Token de la pagina: Bot_Mype
const APP_TOKEN = 'EAAZATRP1BH14BAPL7FD8jCtKvW5BS5BE9lmAUHBZAr6ekydMIiTNHoNFXcIqjTBLVOJK3fAOxWLPYBLZCOqlALBbEXLsGR3ToIMQZBQugyaLM4WCn36gm5d1zIBInH9KsPCviZArnGYIFuqUNAzY6q3BAnYDFkakqvPBgLdZARRJEJ1ZCwcaNvu'

var app =express();

app.use(bodyParser.json())


app.get('/',(req, res)=>{
    res.send('Este es un bot de prueba, by HANS')
})

app.get('/webhook', (req,res)=>{
    if(req.query['hub.verify_token'] === 'xuvi_token'){
        res.send(req.query['hub.challenge'])
    }else{
        res.send('esta conectado correctamente a la webhook')
    }
})


app.post('/webhook', (req,res)=>{
    let data = req.body
    if(data.object == 'page'){
        data.entry.forEach((pageEntry) => {

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
    
    res.sendStatus(200)
})



function receivedMessage(event){
    let senderID = event.sender.id;
    let messageText =event.message.text;
    let message =event.message;


    evaluarMensaje(senderID,messageText)

  
    
}

function receivedPostback(event){
    let senderID = event.sender.id;
    let payload= event.postback.payload;

    switch (payload){
        default:
            enviarMensajeTexto(senderID,'Hay un problema de respuesta')
    }

}

// funcion para reponder los mensajes tipeados o enviados por el ususario
function evaluarMensaje(senderID,messageText){
    let mensaje ='';
    

    if(SiContiene(messageText,'ayuda')||SiContiene(messageText,'help')){
        mensaje = 'Por el momento no te puedo ayudar, es decir miraaaame!!! \n necesito ayuda yo también D:'
    }else if(SiContiene(messageText,'hola')){
        mensaje= 'Holaaaa, soy German!!!'
    }else{
        mensaje = 'tenemos problemas ' + messageText
    }

    enviarMensajeTexto(senderID,mensaje)
 
    
}




//Enviar texto plano
function enviarMensajeTexto(senderID, mensaje){
    let messageData ={
        recipient : {
            id: senderID
        },
        message: {
            text: mensaje
        }
    }

    callSendAPI(messageData)
}



//funcion para enviar el requisito HTTP a la plataforma de facebook messenger
function callSendAPI(messageData){
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: APP_TOKEN},
        method: 'POST',
        json: messageData
    }, (err,res, data)=>{
        if(err){
            console.log('error al enviar el mensage')
        }else{
            console.log('se envio el mensaje')
        }
    })

}

function SiContiene(texto,word){
    return texto.indexOf(word) > -1
}

app.listen(3000, ()=>{
    console.log('server ready in localhost 3000')
    
})