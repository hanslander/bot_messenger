require('../config/config')

const express = require('express')
const request = require('request')
const app =express();

app.get('/setup',(req, res)=>{

    setupGetStartedButton(res);
    setupGreetingText(res);
    setupPersistentMenu(res);
})


function setupGreetingText(res){
    let messageData = {
        greeting:[
            {
            locale:'default',
            text:"Bienvenido {{user_first_name}}, 😃 soy Prestabot, para resolver cualquier duda o tener más información haga click en EMPEZAR 👇👇"
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

    function setupGetStartedButton(res){
        let messageData = {
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
    

function setupPersistentMenu(res){
    let messageData = {
        persistent_menu:[
            {
            locale:"default",
            composer_input_disabled:false,
            call_to_actions:[
                {
                title:'MENU',
                type:'nested',
                call_to_actions:[
                    {
                    title:'Quiénes somos?',
                    type:'web_url',
                    url:"https://www.prestamype.com/nosotros",
                    webview_height_ratio:"full"
                    },
                    {
                    title:'Ayuda',
                    type:'postback',
                    payload:"getstarted2"
                    },
                    {
                    title:'Visita nuestra website',
                    type:'web_url',
                    url:'https://www.prestamype.com',
                    webview_height_ratio:'full'
                    }
                ]
                }]
            },
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
    
    


    module.exports = app;