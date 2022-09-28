import { exit } from 'node:process'
import categorias from './categorias.js'
import categoria from '../models/Categoria.js'
import db from '../config/db.js'

const impotarDatos = async () => {
    try {
        // Autenticar
        await db.autenticate;

        // Generar las columnas
        await db.sync();

        // Insertar los datos
        await Categoria.bulkCreate(categorias);
        console.log('Datos importados correctamente');
        exit(0); // exit();
        
    } catch (error) {
        console.log(error);
        //process.exit(1);
        exit(1);
    }
}