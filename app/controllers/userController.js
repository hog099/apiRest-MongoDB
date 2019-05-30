const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth')
const User = require('../models/user/User');

const router = express.Router();


const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

function generaterToken(params = {}){
    return jwt.sign(params, authConfig.secret, {expiresIn: 86400 })
}

router.post('/register', async (req, res) => {
    const {email} = req.body

    try {
        if(await User.findOne({email})){
            return res.status(400).send({error: 'Usuário já cadastrado!'})
        }

        if (!email.match(emailRegex)) {
            return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
        }

        const user = await User.create(req.body)
        user.password = undefined

        return res.send({ 
            user,
            token: generaterToken({id: user.id})        
        })

    } catch (err) {
        return res.status(400).send({error: 'Falha ao cadastrar usuário!'})
    }

});


router.post('/authenticate', async (req, res) => {
    const {email, password} = req.body
    
    const user = await User.findOne({email}).select('+password')

    if(!user){
        res.status(400).send({error:'Usuário não encontrado para Autenticação!'})
    }

    if(!await bcrypt.compare(password, user.password)){
        res.status(400).send({error:'Senha Incorreta para Autenticação!'})
    }

    user.password = undefined

    res.send({ 
        user, 
        token: generaterToken({id: user.id})
    })

});


// router.post('/validateToken', async (req, res) => {
//     const token = req.body.token || ''

//     jwt.verify(token, authConfig.secret, function (err, decoded) {
//         return res.status(200).send({ valid: !err })
//     })


// })







router.post('/forgot_password', async (req, res) => {
    const {email} = req.body
    // console.log(req.body)

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).send({error: 'Usuário não Encontrado.'})
        }

        // Gerar um token para recuperação de senha com time para expirar
        const token = crypto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setHours(now.getHours()+1)

        await User.findByIdAndUpdate(user.id, {
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        // console.log(token, now)

        mailer.sendMail({
            to: email,
            from: 'corporate099@gmail.com',
            template: 'auth/forgot_password',
            context: {token}
        }, (err)=>{
            if(err){
                return res.status(400).send({error: 'Não foi possível enviar, recuperação de senha.'})                
            }
            return res.send()
        })

        
    } catch (err) {
        // console.log(err)
        return res.status(400).send({error: 'Falha recuperar senha.'})
    }


})


router.post('/reset_password', async (req, res) => {
    const {email, token, password} = req.body
    try{    
        const user = await User.findOne({email}).select('+passwordResetToken passswordResetExpires')
        if(!user){
            return res.status(400).send({error: 'Usuário não Encontrado.'})
        }
        
        if(token !== user.passwordResetToken){
            return res.status(400).send({error: 'Token de Recuperação inválido.'})
        }
        
        const now= new Date();
        if(now > user.passwordResetExpires){
            return res.status(400).send({error: 'Token expirado, gere um novo para recuperação.'})
        }

        user.password = password

        await user.save();

        res.send();


    }catch(err){
        res.status(400).send({error: 'Não foi possível resetar senha, tente novamente.'})
    }

})





router.get('/list', async (req, res) => {
    try {
        let users = await User.find()
        return res.send(users)
    } catch (err) {
        return res.status(400).send({error: 'Falha ao Listar Usuários'})
    }

});

router.put('/update/:id', async (req, res)=>{
    try{
        User.findOneAndUpdate({"_id": req.body.id}, {$set: req.body}, (err, doc) => {
            if (err) {
                console.log("Algo deu errado ao atualizar dados do usuário!")
            }
        
            return res.send(doc)
        });
    }catch(err){
        return res.status(400).send({error:'Falha ao realizar Atulização de usuário'})
    }
});



module.exports = app => app.use('/user', router)