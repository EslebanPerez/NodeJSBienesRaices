import  bcrypt from 'bcrypt';

const usuario = [
    {
       username: 'Evan',
       email: 'evan@mail.com',
       password: await bcrypt.hash('123456789', 10),
       confirmado: true
    }
]

export default usuario;