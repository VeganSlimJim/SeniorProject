const express = require("express");
const app = express();
const cors = require('cors');

const PORT = 4000;

app.get('/api/data/new', async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify({"data" : "received"}));
 

});


app.listen(PORT, '0.0.0.0');

