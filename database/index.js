const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/noderest-2', {useNewUrlParser: true })
// mongoose.connect('mongodb://localhost/noderest-2', { useCreateIndex: true, useNewUrlParser: true })

mongoose.connect('mongodb+srv://masterdev:u624455316@cluster0-dzeci.gcp.mongodb.net/chat-api?retryWrites=true', { 
    useCreateIndex: true, 
    useNewUrlParser: true,
    useFindAndModify: false })

mongoose.Promise = global.Promise

module.exports = mongoose