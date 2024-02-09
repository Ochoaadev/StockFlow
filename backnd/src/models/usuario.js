const mongoose = require('mongoose')

const users = new mongoose.Schema(
    {
        Nombre:{
            type: String,
            required: true
        },
        Apellio:{
            type: String,
            required: true
        },
        email:{
            type: String,
            unique: true,
            required: true
        },
        Contraseña:{
            type: String,
            required: true
        },
        Telefono:{
            type: String,
            unique: false,
            required: false,
        },
        rol:{
            type: String,
            required: true
        },
        username:{
            type: String,
            unique: true,
            required: true
        },
        género:{
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model('Usuarios', users)