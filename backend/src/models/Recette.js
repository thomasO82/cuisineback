const mongoose = require('mongoose');

const ingredientRecetteSchema = new mongoose.Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    unite: {
        type: String,
        enum: ['gramme', 'litre', 'kg'],
        required: true
    }
});

const recetteSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    ingredients: [ingredientRecetteSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Recette', recetteSchema); 