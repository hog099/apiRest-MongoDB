const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log('captando Header:', authHeader)

    if(req.method === 'OPTIONS'){
        next()
    }

    if (!authHeader) {
        return res.status(401).send({ error: 'Não foi informado Token de Autenticação.' })
    }


    // Token tem padrao >Bearer dsfjdjfdkfdkf
    const parts = authHeader.split(' ')

    if (!parts.length === 2) {
        return res.status(401).send({ error: 'Token error, fora do padrão exigido.' })
    }



    // Se o token tiver 2 partes separará entre scheme e token
    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) { //validação de regex se possui a palavra em determinada string
        return res.status(401).send({ error: 'Token Mal formatado.' })
    }


    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err){
            return res.status(401).send({ error: 'Token inválido.' })
        }

        req.userId = decoded.id

        return next()

    })



};