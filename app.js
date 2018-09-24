    const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const config = require('config')



const APP_TOKEN = 'EAAZATRP1BH14BAInvd8RAA5BP58EuABe4fK5gEr8I6Pzyctp377D8ZBGAJy6LEZAKYEzeD2fb6Xcdb274X6ZBPZBG1uMp9uBXPr0cNJZBRKnmuiXgnGdaxJvrI2rXmeApjEU6YNARLdBmx8WZA7W5nxmAFEIaJIaYEryK0MZBGzZBYQZDZD'

var app =express();

app.use(bodyParser.json())

app.listen(3000, ()=>{
    console.log('server ready in localhost 3000')
    
})

app.get('/',(req, res)=>{
    res.send('Este es un bot de prueba, by HANS')
})

app.get('/webhook', (req,res)=>{
    if(req.query['hub.verify_token'] === 'xuvi_token'){
        res.send(req.query['hub.challenge'])
    }else{
        res.send('esta conectado correctamente al webhook')
    }
    res.send('error: no existe conexion')
})
app.get('/setup',(req, res)=>{

    setupGetStartedButton(res);
    setupPersistentMenu(res);
    setupGreetingText(res);
})

app.post('/webhook', (req,res)=>{
    let data = req.body
    if(data.object == 'page'){
        data.entry.forEach((pageEntry) => {
            pageEntry.messaging.forEach((messagingEvent)=>{
                if(messagingEvent.message){  
                    getMessage(messagingEvent) 
                }else if(messagingEvent.postback){
                    getPostback(messagingEvent)
                }else{
                    console.log('Webhook get desconocido: ', messagingEvent)
                }
            })
        });
    }
    

    res.sendStatus(200)
})

function setupGreetingText(res){
    var messageData = {
        "greeting":[
            {
            "locale":"default",
            "text":"Greeting text for default local !"
            }, {
            "locale":"en_US",
            "text":"Greeting text for en_US local !"
            }
        ]};
    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ APP_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            res.send(body);
    
        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
    
    }
    
    function setupPersistentMenu(res){
    var messageData = 
        {"persistent_menu":[
            {
            "locale":"default",
            "composer_input_disabled":true,
            "call_to_actions":[
                {
                "title":"Info",
                "type":"nested",
                "call_to_actions":[
                    {
                    "title":"Help",
                    "type":"postback",
                    "payload":"HELP_PAYLOAD"
                    },
                    {
                    "title":"Contact Me",
                    "type":"postback",
                    "payload":"CONTACT_INFO_PAYLOAD"
                    }
                ]
                },
                {
                "type":"web_url",
                "title":"Visit website ",
                "url":"http://www.techiediaries.com",
                "webview_height_ratio":"full"
                }
            ]
            },
            {
            "locale":"zh_CN",
            "composer_input_disabled":false
            }
        ]};  
    // Start the request
    request({
        url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ APP_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            res.send(body);
    
        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
    
    }
    
    
    function setupGetStartedButton(res){
    var messageData = {
            "get_started":{
                "payload":"getstarted"
            }
    };
    // Start the request
    request({
        url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ APP_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            res.send(body);
    
        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
    }

function getMessage(event){
    let senderID = event.sender.id
    let recipientID=event.recipient.id
    let messageText =event.message.text

    evaluarMensaje(senderID,messageText)
    mostrarsaludo(senderID)
  
    
}

function getPostback(event){
    let senderID = event.sender.id
    let recipientID= envent.recipient.id
    let payload= event.postback.payload

    switch (payload){
/*        case 'get_started':
            sendGetStarted(senderID);
            break;
        case 'check_in':
            sendTextMessage(senderID, "Iniciando");
            break;
*/
        default:
            enviarMensajeTexto(senderID, 'Llamando al postback')
    }

}

// funcion para enviar mensajes
function evaluarMensaje(senderID,messageText){
    let mensaje ='';
    

    if(SiContiene(messageText,'ayuda')||SiContiene(messageText,'help')){
        mensaje = 'Por el momento no te puedo ayudar'
    }else if(SiContiene(messageText,'Hola')||SiContiene(messageText,'hola')){
        sendGetStarted(senderID)
    }else if(SiContiene(messageText,'troll')){
        enviarMensajeImagen(senderID)
    }else if(SiContiene(messageText,'Iniciar')){
        enviarMensajeTemplate(senderID)
    }else{
        mensaje = 'tenemos problemas ' + messageText
    }

    enviarMensajeTexto(senderID,mensaje)
 
    
}

//funcion de envio del boton de inicio
function sendGetStarted(recipientID){
    let messageData ={
        recipient:{
            id: recipientID
        },
        message:{
            attachment:{
                type: 'template',
                payload: {
                    template_type: 'button',
                    text:'Bienvenido {{user_first_name}}! este es Pretabot, en que te puedo ayudar :D ',
                    buttons:[{
                        type: 'postback',
                        title: 'Iniciar',
                        payload: 'Iniciar'
                    }]
                }
            }
        }
    }
    callSendAPI(messageData)
}


//funcion saludo
function mostrarsaludo(){
    let messageData={
        recipient :{
            id:senderID
            },
         //   message:{
                greeting:[
                        {
                            locale:'default',
                            text: 'Hola {{user_first_name}}!'
                        }
                    ]
        
         //   }
    }
    callSendAPI(messageData)
}
//funcion para enviar imagen
function enviarMensajeImagen(senderID){
    let messageData ={
         recipient :{
             id:senderID
             },
            message:{
                attachment:{
                    type:'image',
                    payload:{
                        url:'https://tr4.cbsistatic.com/hub/i/2017/09/14/daa3c2c0-d6ca-4ec5-96f8-e6639eb23fad/853430cd937c9e8727b68aff1dd6f10c/troll-meme1.jpg',
                        is_reusable: true
                    }
                }
            }
        }

        callSendAPI(messageData)
     }


//enviar templates
function enviarMensajeTemplate(senderID){
    let messageData ={
        recipient:{
            id: senderID
        },
        message:{
            attachment:{
                type: 'template',
                payload:{
                    template_type: 'generic',
                    elements: [elementTemplate()]
                }
            }
        }
    }
    callSendAPI(messageData)
}

//Enviar una vetana 
function elementTemplate(){
    return{
        title: 'Smash',
        image_url:'https://pbs.twimg.com/profile_images/943983596192268289/CCGZSbD6_400x400.jpg',
        subtitle: 'Le gusta jugar Dota :V',
        buttons: [buttonTemplate('DOTA2','http://es.dota2.com/'),buttonTemplate('Mira el international aqui.','https://www.youtube.com/watch?v=Nv4MpESxtsM')]
    }
}

function buttonTemplate(title,url){
    return{
        type:'web_url',
        url: url,
        title: title
    }
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