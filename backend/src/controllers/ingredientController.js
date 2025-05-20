const Ingredient = require('../models/Ingredient');

exports.createIngredient = async (req, res) => {
    try {
        const ingredient = new Ingredient(req.body);
        await ingredient.save();
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getIngredientById = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingrédient non trouvé' });
        }
        res.status(200).json({ message: 'Ingrédient supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 