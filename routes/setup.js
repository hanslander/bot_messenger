require('../config/config')

const express = require('express')
const request = require('request')
const app =express();

app.get('/setup',(req, res)=>{

    setupGetStartedButton(res);
    setupPersistentMenu(res);
    setupGreetingText(res);
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
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ process.env.TOKEN,
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
        url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ process.env.TOKEN,
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
        url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ process.env.TOKEN,
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

    module.exports = app;