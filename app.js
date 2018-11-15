const express = require('express'),
			bodyParser = require('body-parser'),
			request = require('request'),
			{ wrap } = require('./helpers/')
// const config = require('config')


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

function valid(req,res,next) {
	return req.body.object === 'page' ? next() : res.sendStatus(404)
}

app.post('/webhook', valid, (req,res) => {
	let data = req.body

	data.entry.forEach( entry => {
		let event = entry.messaging[0]
		console.log(event)
		
		// Get the sender PSID
		let sender_psid = event.sender.id;
		console.log('Sender PSID: ' + sender_psid);

		// Check if the event is a message or postback and
		// pass the event to the appropriate handler function
		if (event.message) {
			receivedMessage(sender_psid, event.message);        
		} else if (event.postback) {
			receivedPostback(sender_psid, event.postback);
		}
	})

	res.sendStatus(200)
})


function receivedMessage(psid, msg){
  let text = msg.text

	let response = { text: `You sent the message: "${text}".` }

  send_api(psid, response)
}

function receivedPostback(psid, postback){
  let payload = postback.payload;

	let lookup = {
		ala: 'ala_ps',
		lel: 'asd',
		'default': 'default >:v'
	}
	
	let response = { text: lookup[payload] || lookup['default'] }

	send_api(psid, response)
}

//funcion para enviar el requisito HTTP a la plataforma de facebook messenger
function send_api(psid, resp) {
	let body = {
		recipient: { id: psid },
		message: resp
	}
	
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: APP_TOKEN },
    method: 'POST',
    json: body
  }, (err, res, data) => {
		if (err) console.log('error al enviar el mensage')
		else console.log('se envio el mensaje')
  })
}


// app.use((err, req, res, next) => {
// 	console.log(err)
// 	res.status(err.msg ? 400 : 500).send({status: 'ne', msg: err.msg || 'Error interno'})
// })


// app.post('/webhook', (req,res)=>{
//     let data = req.body
//     if(data.object == 'page'){
//         data.entry.forEach((pageEntry) => {

//             pageEntry.messaging.forEach((messagingEvent)=>{
//                 if(messagingEvent.message){  
//                     receivedMessage(messagingEvent) 
//                 }else if(messagingEvent.postback){
//                     receivedPostback(messagingEvent)
//                 }else{
//                     console.log('Webhook get desconocido: ', messagingEvent)
//                 }
//             })
//         });
//     }
    
//     res.sendStatus(200)
// })





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





function SiContiene(texto,word){
    return texto.indexOf(word) > -1
}

app.listen(3000, ()=>{
    console.log('server ready in localhost 3000')
    
})
