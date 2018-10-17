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
        res.send('esta conectado correctamente a la webhook')
    }
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
    

    res.sendStatus(200)
})

function setupGreetingText(res){
    var messageData = {
        greeting:[
            {
            locale:'default',
            text:"Bienvenido {{user_first_name}}, 😃 soy Prestabot, para resolver cualquier duda o tener más información haga click en comenzar! 👇👇"
            },
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
        {persistent_menu:[
            {
            locale:'default',
            composer_input_disabled:false,
            call_to_actions:[
                {
                title:'MENU',
                type:'nested',
                call_to_actions:[
                    {
                    title:'Quiénes somos?',
                    type:'postback',
                    url:'https://www.prestamype.com/nosotros',
                    webview_height_ratio:"full"
                    },
                    {
                    title:'Contactanos al: (01)480-0708',
                    type:'postback',
                    payload:"CONTACT_INFO_PAYLOAD"
                    }
                ]
                },
                {
                type:'web_url',
                title:'Visita nuestra website',
                url:'https://www.prestamype.com',
                webview_height_ratio:'full'
                }
            ]
            },
            {
            locale:"es_LA",
            composer_input_disabled:false,
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
            get_started:{
                payload:'getstarted'
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

function receivedMessage(event){
    let senderID = event.sender.id;
    let recipientID=event.recipient.id;
    let messageText =event.message.text;
    let timeOfMessage=event.timestamp;
    let message =event.message;

    let messageAttachmens =message.attachments;
    let messageId = message.mid;

    evaluarMensaje(senderID,messageText)
//    mostrarsaludo(senderID)
  
    
}

function receivedPostback(event){
    let senderID = event.sender.id;
    let recipientID= event.recipient.id;
    let timeOfMessage= event.timestamp;
    let payload= event.postback.payload;

    switch (payload){
        case 'getstarted':
            sendMessageStarted(senderID);
        break;

        case 'requirement':
            sendRequirements(senderID);
        break;

        case 'more_information':
            mj='algo pasa aqui',
            enviarMensajeTexto(senderID,mj);
            sendInformation(senderID);
            sendRequirements(senderID);
        break;

        default:
            enviarMensajeTexto(senderID,'Hay un problema de respuesta')
    }

}

// funcion para reponder los mensajes tipeados o enviados por el ususario
function evaluarMensaje(senderID,messageText){
    let mensaje ='';
    

    if(SiContiene(messageText,'ayuda')||SiContiene(messageText,'help')){
        mensaje = 'Por el momento no te puedo ayudar'
    }else if(SiContiene(messageText,'Cobertura')){

    }else if(SiContiene(messageText,'¿Horario de atención?')){
        enviarMensajeTexto(senderID,'Puedes contactarnos de lunes a viernes de 9 am a 6 pm, a nuestro telefono al telf: (01)480-0708');
    }else if(SiContiene(messageText,'¿Dónde están ubicados?')){
        enviarMensajeTexto(senderID,'Estamos ubicados en: Calle Mártir José Olaya 129. Of. 1304, Miraflores, Lima.');
        enviarButtons(senderID,'Ubicación','https://www.google.com.pe/maps/place/Of.+1304,+Calle+M%C3%A1rtir+Jos%C3%A9+Olaya+129,+Miraflores+15074/@-12.1194485,-77.0322329,17z/data=!3m1!4b1!4m5!3m4!1s0x9105c819d14724bd:0x11d6cf807ef9ecc1!8m2!3d-12.1194485!4d-77.0300442')
    }else if(SiContiene(messageText,'Iniciar')){
        enviarMensajeTemplate(senderID)
    }else{
        mensaje = 'tenemos problemas ' + messageText
    }

    enviarMensajeTexto(senderID,mensaje)
 
    
}

//funcion de envio del boton de inicio
function sendMessageStarted(recipientID){
    let messageData ={
        recipient:{
            id: recipientID
        },
        message:{
            attachment:{
                type: 'template',
                payload: {
                    template_type: 'button',
                    text:'Bienvenido! soy Prestabot, :D elíje una de estas opciones para poderte ayudar 👇 ',
                    buttons:[buttonTemplate('Nosotros','https://www.prestamype.com/nosotros'),
                    {
                        type:'postback',
                        title: 'Requisitos',
                        payload: 'requirement'
                    },{
                        type: 'postback',
                        title: 'Más Información',
                        payload: 'more_information'
                    }]
                }
            }
        }
    }
    callSendAPI(messageData)
}

function sendRequirements(recipientID){
    let messageData ={
        recipient:{
            id: recipientID
        },
        message:{
            attachment:{
                type:'template',
                payload:{
                    template_type: 'button',
                    text: 'Los requisitos para acceder a un préstamos son: \n -Tener una propiedad 🏡 inscrita en SUNARP en el departamento de Lima que pueda colocar como garantía.\n -Solicitar un monto 💵💵 mayor o igual a 20,000 soles. \n - Los contratos son de un año, renovables.',
                    buttons:[
                        buttonTemplate('Sí, precalificar','https://www.prestamype.com/prestamos'),
                        buttonText('Más Información','more_information')
                    ]
                }
            }
        }
    }
    callSendAPI(messageData)
}

//función para enviar más información
function sendInformation(recipientID){
    let messageData={
		recipient: {
			id : recipientID
		},
		message: {
			attachment :{
				type: "template",
				payload: {
					template_type: 'generic',
                    elements: [{
                        title:'Que tipo de garantias aceptan?',
                        subtitle:'click',
                        buttons:{
                            type: 'postback',
                            title:'Preguntar',
                            payload: 'RP1MI'  
                        }                                                    
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
function enviarMensajeImagen(senderID,imagen_url){
    let messageData ={
         recipient :{
             id:senderID
             },
            message:{
                attachment:{
                    type:'image',
                    payload:{
                        url:imagen_url,
                        is_reusable: true
                    }
                }
            }
        }

    callSendAPI(messageData)
}

//enviar un boton de redirección
function elementButton(senderID,url,title){
    let messageData ={
        recipient:{
            id: senderID
        },
        message:{
            attachment:{
                type: 'template',
                payload:{
                    template_type: 'button',
                    buttons:[{
                        type: 'web_url',
                        url: url,
                        title: title
                    }]
                }
            }
        }
    }
    callSendAPI(messageData)
}

//enviar solo botones de redireccion
function enviarButtons(senderID,title,url){
    let messageData={
        recipient:{
            id: senderID
        },
        message:{
            attachment:{
                type: 'template',
                payload:{
                    template_type: 'button',
                    text:'👇Haga click aquí!👇',
                    buttons: [buttonTemplate(title,url)]
                }
            }
        }
    }
    callSendAPI(messageData)
}



//enviar templates con botones
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

function elementTemplate(title,image_url,subtitle){
    return{
        title: title,
        image_url: image_url,
        subtitle: subtitle,
        buttons: [buttonTemplate()]
    }
}
//boton de enlace
function buttonTemplate(title,url){
    return{
        type:'web_url',
        url: url,
        title: title,
        webview_height_ratio: 'full'
    }
}
//boton de texto enlazado
function buttonText(title,msgtitle){
    return{
        type: 'postback',
        title: title,
        payload: msgtitle,
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

function sendPrueba(recipientID){
    let messageData={
        recipient:{
            id: recipientID
        },
        message:{
            attachment:{
            type:"template",
            payload:{
                template_type:"generic",
                elements:[
                {
                    title:"Welcome!",
                    image_url:"https://petersfancybrownhats.com/company_image.png",
                    subtitle:"We have the right hat for everyone.",
                    default_action: {
                    type: "web_url",
                    url: "https://petersfancybrownhats.com/view?item=103",
                    messenger_extensions: false,
                    webview_height_ratio: "tall",
                    fallback_url: "https://petersfancybrownhats.com/"
                    },
                    buttons:[
                    {
                        type:"web_url",
                        url:"https://petersfancybrownhats.com",
                        title:"View Website"
                    },{
                        type:"postback",
                        title:"Start Chatting",
                        payload:"DEVELOPER_DEFINED_PAYLOAD"
                    }              
                    ]      
                }
                ]
            }
            }
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