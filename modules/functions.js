require('../config/config')
require('../server/seeders/questions')

const request = require('request')



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
            mj='oe qué pasa?',
            enviarMensajeTexto(senderID,mj);
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
                    text:process.env.PTI_001,
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
                    text: process.env.PTI_002,
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
		recipient:{
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

function sendInformation2(recipientID){
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



//funcion para enviar el requisito HTTP a la plataforma de facebook messenger
function callSendAPI(messageData){
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.TOKEN},
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



module.exports ={
    receivedMessage,
    receivedPostback
}