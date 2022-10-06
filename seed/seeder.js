import { exit } from 'node:process'
import categorias from './categorias.js'
import precios from './precios.js'
import usuario from './usuario.js'
import db from '../config/db.js'
import {Categoria, Precio, Usuario} from '../models/index.js' // Importa las relaciones

const importarDatos = async () => {
    try {
        // Autenticar
        await db.autenticate;

        // Generar las columnas
        await db.sync();

        // Insertar los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuario)
        ]);
        console.log('Datos importados correctamente');
        exit(0); // exit();
        
    } catch (error) {
        console.log(error);
        //process.exit(1);
        exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({force: true})
        console.log("Datos eliminados correctamente");
        exit();
    } catch (error) {
        console.log(error);
        //process.exit(1);
        exit(1);
    }
}

if(process.argv[2] == "-i"){
    importarDatos();
}

if(process.argv[2] == "-e"){
    eliminarDatos();
}