const express = require('express')
const bodyParser = require('body-parser')
const allowCors = require('./config/cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(allowCors)

require('./app/controllers/index')(app)

app.listen(3003)