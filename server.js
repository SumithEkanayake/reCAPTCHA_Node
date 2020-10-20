const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
    if (req.body.captcha === undefined || req.body.captcha === '' || req.body.captcha === null)
    {
        return res.json({"Sucess":false, "Message": "Please select captcha"});
    }
    //Secret Key
    const secretKey = '6LeONNkZAAAAABohgtCoNTK9tJTjNrKmlPq4aicl';

    //Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}
    &response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    //Make request to ferify url
    request(verifyUrl, (err, response, body)=>{
        body = JSON.parse(body);

        //if not succesful
        if(body.success != undefined && !body.success){
            return res.json({"success": false, "Message": "Failed Captcha Verification"});
        }
        //If Successfull
        return res.json({"success": true, "Message": "Captcha Verification Passed"});
    });
});

app.listen(3000, ()=> {
    console.log('Server strated on port 3000');
});