var express = require('express');
var router = express.Router();

//Importando
    //<-------------------Producto----------->
const {ProductAgg, ProductList, ProductUpdate, ProductDelete} = require('../controllers/peticiones')

//<----------- Validar token-------------->
const { Authenticate, ValidateRol } = require("../middlewares/JWT");

//<-----------Login y Registro-------------->
const {Inicio, Registro } = require("../controllers/Registro-Logeo");

//Rutas
    //<----------------Inicio y Registro------------->
router.post("/registro", Registro);

router.post("/login", Inicio);

    //<-----------Productos------------>
router.get("/Producto", ProductList);

router.post("/AggProducto", ProductAgg);

router.put("/Producto/:id", ProductUpdate);

router.delete("/Producto/:id", ProductDelete);

    //<-----------Validar Token------------>
router.post("/Validate", Authenticate, ValidateRol);

    //<----------Usuario----------->
router.get("/User", user_list);

router.get("/User/:id/get", GetUser);

router.delete('/User/:id', deleteUser);

router.put('/User/:id/edit', editUser);

router.put('/User/:id/Password', updatePassword);

module.exports = router