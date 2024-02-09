const model = require('../models/usuario');
const bcrypt = require ('../middlewares/bcrypt');

//Listar Usuarios
const List_User = async(req,res )=>{
    try{
     const List_User = await model.find();
     //Se valida la respuesta de la base de datos.
     res.status(200).json(List_User);
  } catch (error) {
     //En caso de error, lo visualizamos mediante la consola
     console.log("Error:", error);
     //Seguidamente, se devolvera status 500 de no cumplir algún parametro establecido
     res.status(500).json({ message: "Error al intentar consultar los usuarios, vuelvalo a intentar...", status: 500 });
    }
}

//Obtener UN usuario en especifico
const Get_User = async (req, res) => {
    try {
        //Se recibe el ID, y por el mismo se procede a realizar la busqueda correspondiente.
      const { id } = req.params;
      const user = await model.findById(id);
  
      if (!user) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado", status: 404 });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.log("Error:", error);
      res
        .status(500)
        .json({ message: "Error al intentar listar al usuario", status: 500 });
    }
  };

//Editar un usuario, a su vez, su contraseña.

const Edit_User = async (req, res) => {
  try {
    let user = await model.findById(req.params.id);
    //Se realiza la busqueda mediante ID, y sucesivamente verifica que el mismo exita en la base de datos
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    user.name = req.body.name;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.username = req.body.username;
    user.gender = req.body.gender;
    //Se guarda al nuevo usuario, si todo sale correctamente
    await user.save();

    res.status(200).json({ msg: "Usuario Actualizado Correctamente", status:200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error",status:500 });
  }
};

const Update_Password = async (req, res) => {
  try {
    //Se busca el ID del usuario editado anteriormente, y se trabaja con 2 parametros, su contraseña antigua, y la nueva.
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await model.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ msg: "Usuario no encontrado", status: 404 });
    }
    //El usuario debe introducir su antigua contraseña,de ser correcta, sigue el proceso. Caso contrario, muestra el mensaje
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña antigua incorrecta" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    //Actualiza la contraseña del usuario
    await user.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({
        msg: "Error al intentar actualizar la contraseña",
        status: 500,
      });
  }
};

//Eliminar un ususario

const Delete_User = async (req, res) => {
    const id = req.params.id;
    try {
       //Se utiliza findByIdAndDelete(id) transfiriendo id, para eliminar al usuario.
       const deleted = await model.findByIdAndDelete(id);
       //Se valida la respuesta del mismo.
       if (!deleted) return res.status(404).send('Error: No se encontró el Usuario a eliminar.');
       res.status(200).json({ message: "Usuario Eliminado Satisfactoriamente!", status: 200, deleted: deleted });
   } catch (err) {
       if (err.name === 'CastError' && err.kind === 'ObjectId') {
          return res.status(400).send('Error: El ID del Usuario proporcionado no es válido.');
       } else {
          return res.status(500).send('Error al intentar eliminar el Usuario.');
       }
   }
 };

module.exports = {List_User, Get_User, Edit_User, Update_Password, Delete_User};