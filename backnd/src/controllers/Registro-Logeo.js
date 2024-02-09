const model = require("../models/usuario");
const { Encrypt, Compare } = require("../middlewares/bcrypt");
const { GenerarToken } = require("../middlewares/JWT");

const Registro = async (req, res) => {
  console.log(req.body);
  let rol = "";
  //Se verifica los roles
  if (req.body.rol == "Admin") {
    rol = "Admin";
  } else {
    rol = "User";
  }
  try {
    const { name, lastname, email, password, username, gender } = req.body;
      //Se valida que el usuario ingrese todo los datos
    if (
      !name ||
      !email ||
      !password ||
      !lastname ||
      !username ||
      !gender
    ) {
      return res.status(400).json({ message: "Ingresa los datos correctamente!", status: 400 });
    }

    const hash = await Encrypt(password);

    const user = {
      name,
      lastname,
      email,
      password: hash,
      rol,
      username,
      gender,
    };
    const data = new model(user);

    try {
      //Se guardan los nuevos datos
      await data.save();
      //En tal caso todo haya salido bien

      const datas = async (dato) => {
        const documents = await model.find({ username: username });
        return documents;
      };

      const getdata = await datas(username);

      const payload = {
        userId: getdata[0]._id,
        username,
        email,
        rol,
      };
      const token = GenerarToken(payload);

      if (!data) {
        return res
          .status(404)
          .json({ message: "Usuario o contraseña incorrectos", status: 404 });
      }

      res
        .status(200)
        .json({ payload, message: "Registro Exitoso", token, status: 200 });
    } catch (error) {
      //Caso contrario
      console.log("Error", error);
      res.status(500).json({ message: "Error al registrarse, vuelve a intentarlo", status: 500 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Inicio = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Ingresa los datos correctamente", status: 400 });
    }

    const datas = async (dato) => {
      const documents = await model.find({ username: dato });
      return documents;
    };

    const data = await datas(username);

    if (!data) {
      return res
        .status(404)
        .json({ message: "Usuario o contraseña incorrectos", status: 404 });
    }

    const user = { username, password };

    const match = await Compare(user.password, data[0].password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Contraseña o Usuario incorrecto", status: 401 });
    }
    const payload = {
      userId: data[0]._id,
      username: data[0].username,
      email: data[0].email,
      rol: data[0].rol,
    };
    const token = await GenerarToken(payload);

    res.status(200).json({
      token,
      payload,
      message: "Inicio de Sección correctamente",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Contraseña o Usuario incorrecto",
      message1: error.message,
      status: 500,
    });
  }
};

module.exports = { register: Registro, login: Inicio };