const { Schema, model } = require('mongoose');

const itemSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    imagen: {
        type: String
    },
    categoria: {
        type: String,
        required: [true, 'La categoria es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    distribuidores: {
        type: Array,
        required: [true, 'Los distribuidores son obligatorios']
    },
    referencias: {
        type: String,
        required: [true, 'Las referencias son obligatorias']
    },
    autor: {
        type: String,
        required: [true, 'El autor es obligatorio']
    },
    aceptado: {
        type: Boolean,
        default: false
    },
    editado: {
        type: Boolean,
        default: false
    },
    origin: {
        type: Schema.Types.ObjectId
    },
    visitas: {
        type: Number,
        default: 0
    },
});

itemSchema.methods.toJSON = function() {
    const { __v, ...item } = this.toObject();
    return item;
}

module.exports = model( 'Item', itemSchema );