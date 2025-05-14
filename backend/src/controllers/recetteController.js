const Recette = require('../models/Recette');

// Créer une nouvelle recette
exports.createRecette = async (req, res) => {
    try {
        const recette = new Recette(req.body);
        await recette.save();
        res.status(201).json(recette);
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
};

// Obtenir toutes les recettes
exports.getAllRecettes = async (req, res) => {
    try {
        const recettes = await Recette.find().populate('ingredients.ingredient');
        res.status(200).json(recettes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir une recette par son ID
exports.getRecetteById = async (req, res) => {
    try {
        const recette = await Recette.findById(req.params.id).populate('ingredients.ingredient');
        if (!recette) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }
        res.status(200).json(recette);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une recette
exports.updateRecette = async (req, res) => {
    try {
        const recette = await Recette.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('ingredients.ingredient');
        console.log(recette);
        if (!recette) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }
        res.status(200).json(recette);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une recette
exports.deleteRecette = async (req, res) => {
    try {
        const recette = await Recette.findByIdAndDelete(req.params.id);
        if (!recette) {
            return res.status(404).json({ message: 'Recette non trouvée' });
        }
        res.status(200).json({ message: 'Recette supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 