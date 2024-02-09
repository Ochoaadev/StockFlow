var express = require('express');
var router = express.Router();

//Importando
const {ProductAgg, ProductList, ProductUpdate, ProductDelete} = require('../controllers/peticiones')

//Rutas
router.get("/Producto", ProductList);

router.post("/AggProducto", ProductAgg);

router.put("/Producto/:id", ProductUpdate);

router.delete("/Producto/:id", ProductDelete);

module.exports = router