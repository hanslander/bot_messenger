require('../config/config')

const express = require('express')
const request = require('request')
const app =express();

app.get('/setup',(req, res)=>{

    setupGetStartedButton(res);
    setupGreetingText(res);
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
    
    

    module.exports = app;