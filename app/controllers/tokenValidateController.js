const express = require('express')
const authMiddleware = require('../middlewares/auth')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
   
    res.send({msg: 'token validado'})

});

// router.post('/valid', async (req, res) => {
//         const token = req.body.token || ''
//         const token = req.body.token || req.query.token || req.headers['authorization'] || ''
    
//         jwt.verify(token, authConfig.secret, function (err, decoded) {
//             return res.status(200).send({ valid: !err })
//         })
    
    
//     })

router.post('/valid', async (req, res) => {
           
        return res.status(200).send({valid: true})
    
    })


module.exports = app => app.use('/validate-token', router)