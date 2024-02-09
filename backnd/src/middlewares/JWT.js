const jwt = require("jsonwebtoken");

function GeneratorToken(payload) {
    const secret = process.env.TOKEN_SECRET;
    const options = {
    expiresIn: "1h",
  };
    return jwt.sign(payload, secret, options);
}

function Authenticate(req, res, next) {
  if (!req.headers.authorization) {
    //No hay token
    res.sendStatus(400);
    return;
  }

  //Se Extrae el token
  var token = req.headers.authorization.replace("Bearer ", "");
  try {
    //verificando que exista el token
    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
  console.log(error)

    //No tienes acceso
    res.sendStatus(400);
  }
}

function DecodeToken(token) {
  return new Promise((resolve, reject) => {
    let payload = jwt.decode(token);

    resolve(payload);
  });
}

const ValidateRol = async (req, res) => {
    var token = req.headers.authorization.replace("Bearer ", "");

  try {
    //Extrayendo el token
    const payload = await DecodeToken(token);
    //Se compara los roles
    if (payload) {
      res
        .status(200)
        .json({ payload, message: "Rol Validado de manera exitosa", status: 200 });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    //No tienes acceso
    res.sendStatus(400);
  }
};

module.exports = { GenerarToken: GeneratorToken, Authenticate, DecodeToken,ValidateRol};