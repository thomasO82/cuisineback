const mongoose = require('mongoose');
const ingredients = require('./ingredients');
const recettes = require('./recettes');
const Ingredient = require('../models/Ingredient');
const Recette = require('../models/Recette');
require('dotenv').config();

async function loadFixtures() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cuisine');
        console.log('Connecté à MongoDB');

        // Suppression des données existantes
        await Ingredient.deleteMany({});
        await Recette.deleteMany({});
        console.log('Données existantes supprimées');

        // Chargement des ingrédients
        const savedIngredients = await Ingredient.insertMany(ingredients);
        console.log(`${savedIngredients.length} ingrédients chargés`);

        // Création d'un map des ingrédients par nom
        const ingredientMap = {};
        savedIngredients.forEach(ing => {
            ingredientMap[ing.nom] = ing._id;
        });

        // Préparation des recettes avec les IDs des ingrédients
        const preparedRecettes = recettes.map(recette => ({
            ...recette,
            ingredients: recette.ingredients.map(ing => ({
                ...ing,
                ingredient: ingredientMap[ing.ingredient]
            }))
        }));

        // Chargement des recettes
        const savedRecettes = await Recette.insertMany(preparedRecettes);
        console.log(`${savedRecettes.length} recettes chargées`);

        console.log('Fixtures chargées avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors du chargement des fixtures:', error);
        process.exit(1);
    }
}

loadFixtures(); 