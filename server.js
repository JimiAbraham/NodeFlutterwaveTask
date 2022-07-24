const express = require('express');

const fromLogic = require('./logic');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(5001);


app.post('/split-payments/compute', async function(req, res) {

    const response = await fromLogic.main(req.body);

    //console.log(response);

    res.status(200).json(fromLogic.finalApiResponse);




});