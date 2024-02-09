const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoritoSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',    
    required: true,
    validate: {
      validator: function(value) {
        return value === null || mongoose.Types.ObjectId.isValid(value);
      },
      message: props => `El valor de "producto" no es un ObjectId válido: ${props.value}`
    }
 },
});

module.exports = mongoose.model('ProductosFavoritos', favoritoSchema);