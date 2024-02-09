const model = require("../models/productos");
const { UploadImage } = require("../config/cloudinary");
const fs = require('fs')
const path = require('path')

//Agregar
const ProductAgg = async (req, res) => {
  const image_url = await UploadImage(req.file.path);

  //Para comprobar funcionamiento, eliminar lienas 8, 15 y 24(json.imagen), sucesivamente correr código.

  try {
     const json = {
       nombre: req.body.nombre,
       imagen: image_url,
       descripcion: req.body.serial,
       precio: req.body.precio,
       cantidad: req.body.cantidad,
       categoria: req.body.categoria,
     };
 
     // Validamos que no falten datos en el objeto json
     if (!json.nombre || !json.descripcion || !json.precio || !json.cantidad || !json.categoria || !json.imagen ) {
       return res
         .status(400)
         .json({ message: "Faltan datos necesarios para agregar el item", status: 400 });
     }
 
     const data = new model(json);
     await data.save();
 
     res
       .status(200)
       .json({ message: "Producto Agregado Exitosamente", status: 200 });
  } catch (error) {
     console.log("Error", error);
     res
       .status(500)
       .json({ message: "Error al intentar agregar el item", status: 500 });
  }
 };

//Listar

const ProductList = async (req, res) => {
  try {
    const items = await model.find();
    res.status(200).json(items);
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Error al intentar listar los items", status: 500 });
  }
};

//Editar o Actualizar

const ProductUpdate = async (req, res) => {
  let image_url;
  if (req.file) {
    console.log(req.file.path);
    image_url = await UploadImage(req.file.path);
  }
  try {
    const itemId = req.params.id; // Obtén el ID del item que se desea editar
    const updatedData = {
        nombre: req.body.nombre,
        imagen: image_url,
        descripcion: req.body.serial,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
        categoria: req.body.categoria,
    };

    const updatedItem = await model.findByIdAndUpdate(itemId, updatedData, { new: true });
    // Encuentra y actualiza el item en la base de datos, y regresa el item actualizado

    if (updatedItem) {
      res.status(200).json({ message: "Item actualizado exitosamente", status: 200 });
    } else {
      res.status(404).json({ message: "No se encontró el item", status: 404 });
    }
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: "Error al intentar editar el item", status: 500 });
  }
};

//Eliminar

const ProductDelete = async (req, res) => {
  const id = req.params.id;
   
  try {
       const deleted = await model.findByIdAndDelete(id);
       
       if (!deleted) return res.status(404).send('Error: No se encontró el producto que se desea eliminar.');
       
       // Eliminar imagen del producto si existe
       const imagePath = path.join(__dirname, '../public/', deleted.imagen);
       if (fs.existsSync(imagePath)) {
           fs.unlinkSync(imagePath);
       }
       
       res.status(200).json({ message: "Producto eliminado exitosamente", status: 200, deleted: deleted });
  } catch (err) {
       if (err.name === 'CastError' && err.kind === 'ObjectId') {
          return res.status(400).send('Error: El ID del producto proporcionado no es válido.');
       } else {
          return res.status(500).send('Error al intentar eliminar el item.');
       }
  }
 };

module.exports = {ProductAgg, ProductList, ProductUpdate, ProductDelete};