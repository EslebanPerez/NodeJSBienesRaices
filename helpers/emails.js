import nodemailer from 'nodemailer'

const emailRegistro = async (datos)=>{
    const  transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const { username , email, token } = datos;
    // Enviar email
    await transport.sendMail({
        from : ' bienesraices.com',
        to: email,
        subject: 'Confirma tu cuenta en bienes raices',
        text: 'Confirma tu cuenta en bienes raices',
        html:`
        <p> Hola ${username.cap}, compruba tu cuenta en bienesraices.com</p>
        <p> Tu cuenta ya esta lista, solo debes confirmala en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar cuenta</a></p>
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

    })
}

export {
    emailRegistro
}