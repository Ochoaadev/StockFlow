var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dbconnection = require('./src/config/conexion')
var indexRouter = require('./src/routes/routes');
var fs = require('fs')
var multer = require('multer')
var cors = require('cors')
var { swaggerDocs } = require('./swagger')


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//

app.use('/', indexRouter);

//Verificación de .ENV, en caso que no exista, se detiene el servidor
const CheckEnv = () => {
    try {
       fs.accessSync('.env', fs.constants.F_OK);
       //Si lo encuentra devuelve el console.log
       console.log('Archivo .env encontrado');
    } catch (err) {
       //Caso contrario, devuelve el error(Dicho error se visualiza en la consola, antes del [Running]-PORT)
       console.error('Error: Archivo .env no encontrado');
       process.exit(1)
    }
   };

const storage = multer.diskStorage({
     destination: path.join(__dirname, "src/public"),
     filename: (req, file, cb) => {
       cb(null, new Date().getTime() + path.extname(file.originalname));
     },
   });
   
app.use(multer({ storage: storage }).single("image"));

//Realiza conexión con la base de datos.
dbconnection();
//Verifica la existencia del archivo .env con la respectiva información.
CheckEnv()

app.listen(4000, () => {
  console.log(`[Running] - PORT: 4000`);
  console.log("[Link]    " + "http://localhost:4000");
  swaggerDocs(app, 4000);
});

module.exports = app;
