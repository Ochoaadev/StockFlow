const mongoose = require('mongoose')

const ProductsSchemas = new mongoose.Schema(
    {
        nombre:{
            type: String
        },
        imagen:{
            type: String
        },
        descripcion:{
            type: Number
        },
        precio:{
            type: String
        },
        cantidad:{
            type: String
        },
        categoria:{
            type: Number
        },
    }
);

module.exports = mongoose.model('Producto', ProductsSchemas)