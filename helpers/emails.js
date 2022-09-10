import nodemailer from 'nodemailer'

const  transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

const emailRegistro = async (datos)=>{
    const { username , email, token } = datos;
    // Enviar email
    await transport.sendMail({
        from : ' bienesraices.com',
        to: email,
        subject: 'Confirma tu cuenta en bienes raices',
        text: 'Confirma tu cuenta en bienes raices',
        html:`
        <p> Hola ${username}, comprueba tu cuenta en bienesraices.com</p>
        <p> Tu cuenta ya esta lista, solo debes confirmala en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar cuenta</a></p>
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

    })
}


const emailOlvidePassword = async (datos)=>{
    const { username, email, token } = datos;
    // Enviar email
    await transport.sendMail({
        from : ' bienesraices.com',
        to: email,
        subject: 'Restablece tu contraseña en bienes raices',
        text: 'Retablece tu contraseña en bienes raices',
        html:`
        <p> Hola ${username}, has solicitado reestablecer tu password en bienesraices.com</p>
        <p> Sigue el enlace para generar una nueva contraseña:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}"> Restablecer contraseña</a></p>
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

    })
}

export {
    emailRegistro,
    emailOlvidePassword
}