require('../config/config')
require('../server/seeders/questions')

const request = require('request')



function receivedMessage(event){
    let senderID = event.sender.id;
    let recipientID=event.recipient.id;
    let messageText =event.message.text;
    let timeOfMessage=event.timestamp;
    let message =event.message;

    
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
            enviarMensajeTexto(senderID, process.env.PTI_003);
            sendInformation(senderID);
        break;

        case 'PT1_001':
            enviarMensajeTexto(senderID, process.env.PTI_003);
            sendQuestionT1(senderID);
        break;

        case 'PT2_001':
            enviarMensajeTexto(senderID, process.env.PTI_003);  

        break;

        case 'PT3_001':
            enviarMensajeTexto(senderID, process.env.PTI_003);  

        break;

        case 'PT4_001':
            enviarMensajeTexto(senderID, process.env.PTI_003);

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
    }else if(SiContiene(messageText,'informacion')){
        sendInformation(senderID)
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
			id: recipientID
        },
        message:{
            attachment:{
              type:"template",
              payload:{
                template_type:"generic",
                elements:[
                   {
                    title:process.env.PTI_004,
                    image_url:"https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI",
                    subtitle:"",
                    buttons:[
                      {
                        type:"postback",
                        title:"Responder",
                        payload:"PT1_001"
                      }              
                    ]      
                  },
                  {
                    title:process.env.PTI_005,
                    image_url:"https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI",
                    subtitle:"",
                    buttons:[
                     {
                        type:"postback",
                        title:"Responder",
                        payload:"PT2_001"
                      }              
                    ]      
                  },
                  {
                    title:process.env.PTI_006,
                    image_url:"https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI",
                    subtitle:"",
                    buttons:[
                     {
                        type:"postback",
                        title:"Responder",
                        payload:"PT3_001"
                      }              
                    ]      
                  },
                  {
                    title:process.env.PTI_007,
                    image_url:"https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI",
                    subtitle:"",
                    buttons:[
                     {
                        type:"postback",
                        title:"Responder",
                        payload:"PT4_001"
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

function sendQuestionT1(recipientID){
    let messageData={
        recipient:{
            id: recipientID
        },
        message:{
            attachment:{
                type:'template',
                payload:{
                    template_type:'generic',
                    elements:[
                        {
                            title:process.env.PT1_001,
                            image_url:'https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI',
                            subtitle:'',
                            buttons:[
                                {
                                    type:'postback',
                                    title:'Responder',
                                    payload:'RPT1_001'
                                }
                            ]
                        },
                        {
                            title:process.env.PT1_002,
                            image_url:'https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI',
                            subtitle:'',
                            buttons:[
                                {
                                    type:'postback',
                                    title:'Responder',
                                    payload:'RPT1_002'
                                }
                            ]
                        },
                        {
                            title:process.env.PT1_003,
                            image_url:'https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI',
                            subtitle:'',
                            buttons:[
                                {
                                    type:'postback',
                                    title:'Responder',
                                    payload:'RPT1_003'
                                }
                            ]
                        },
                        {
                            title:process.env.PT1_004,
                            image_url:'https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI',
                            subtitle:'',
                            buttons:[
                                {
                                    type:'postback',
                                    title:'Responder',
                                    payload:'RPT1_004'
                                }
                            ]
                        },
                        {
                            title:process.env.PT1_005,
                            image_url:'https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI',
                            subtitle:'',
                            buttons:[
                                {
                                    type:'postback',
                                    title:'Responder',
                                    payload:'RPT1_005'
                                }
                            ]
                        },
                        {
                            title:process.env.PT1_006,
                            image_url:'https://media.licdn.com/dms/image/C4D0BAQG9Kkblye3_1Q/company-logo_200_200/0?e=1551312000&v=beta&t=lJsh_2K0Yvt4f_3akq38KJzEinw4_xjTqqsnwei-lJI',
                            subtitle:'',
                            buttons:[
                                {
                                    type:'postback',
                                    title:'Responder',
                                    payload:'RPT1_006'
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
function buttonText(title,msgpayload){
    return{
        type: 'postback',
        title: title,
        payload: msgpayload,
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