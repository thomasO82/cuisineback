const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ingredient', ingredientSchema); 