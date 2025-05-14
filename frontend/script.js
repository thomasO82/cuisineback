document.addEventListener('DOMContentLoaded', () => {
    const addRecetteBtn = document.getElementById('open-recette-modal');
    const recetteModal = document.getElementById('modal-recette');
    const editRecetteModal = document.getElementById('modal-edit-recette');
    const closeRecetteModal = document.querySelector('.close-modal[data-modal="recette"]');
    const closeEditRecetteModal = document.querySelector('.close-modal[data-modal="edit-recette"]');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const addIngredientBtnEdit = document.getElementById('edit-add-ingredient-btn');    
    const addIngredientRowBtn = document.getElementById('add-ingredient-row');
    const editAddIngredientRowBtn = document.getElementById('edit-add-ingredient-row');
    const ingredientModal = document.getElementById('modal-ingredient');
    const closeIngredientModal = document.querySelector('.close-modal[data-modal="ingredient"]');
    const formIngredient = document.getElementById('form-ingredient');
    const formRecette = document.getElementById('form-recette');
    const formEditRecette = document.getElementById('form-edit-recette');
    const ingredientsList = document.getElementById('ingredients-container');
    const editIngredientsList = document.getElementById('edit-ingredients-container');
    const recettesContainer = document.getElementById('recettes-container');
    

    // Ouvrir la modale de recette
    addRecetteBtn.addEventListener('click', () => {
        recetteModal.style.display = 'block';
    });

    // Fermer la modale de recette
    closeRecetteModal.addEventListener('click', () => {
        recetteModal.style.display = 'none';
    });

    // Fermer la modale de recette en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === recetteModal) {
            recetteModal.style.display = 'none';
        }
    });

    // Ouvrir la modale d'ingrédient
    addIngredientBtn.addEventListener('click', () => {
        ingredientModal.style.display = 'block';
    });

      
    addIngredientBtnEdit.addEventListener('click', () => {
        ingredientModal.style.display = 'block';
    });

    // Fermer la modale d'ingrédient
    closeIngredientModal.addEventListener('click', () => {
        ingredientModal.style.display = 'none';
    });

    // Fermer la modale d'ingrédient en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === ingredientModal) {
            ingredientModal.style.display = 'none';
        }
    });

    // Ajouter un ingrédient
    formIngredient.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nom = document.getElementById('nom-ingredient').value;

        try {
            const response = await fetch('http://localhost:3000/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nom, unite })
            });

            if (response.ok) {
                const ingredient = await response.json();
                // Mettre à jour tous les selects d'ingrédients
                document.querySelectorAll('select[name="ingredients[]"]').forEach(select => {
                    const option = document.createElement('option');
                    option.value = ingredient._id;
                    option.textContent = ingredient.nom;
                    select.appendChild(option);
                });
                ingredientModal.style.display = 'none';
                formIngredient.reset();
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });

    // Ajouter une ligne d'ingrédient
    addIngredientRowBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'ingredient-row';

        const select = document.createElement('select');
        select.name = 'ingredients[]';
        select.required = true;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionner un ingrédient';
        select.appendChild(defaultOption);

        const input = document.createElement('input');
        input.type = 'number';
        input.name = 'quantites[]';
        input.step = '0.01';
        input.required = true;
        input.placeholder = 'Quantité';

        const uniteSelect = document.createElement('select');
        uniteSelect.name = 'unites[]';
        uniteSelect.required = true;

        const uniteOptions = [
            { value: 'gramme', text: 'Grammes' },
            { value: 'litre', text: 'Litres' },
            { value: 'kg', text: 'Kilogrammes' }
        ];

        uniteOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            uniteSelect.appendChild(opt);
        });

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-ingredient-btn';
        removeBtn.textContent = 'Supprimer';

        row.appendChild(select);
        row.appendChild(input);
        row.appendChild(uniteSelect);
        row.appendChild(removeBtn);
        ingredientsList.appendChild(row);
        loadIngredients(select);
    });

    // Supprimer une ligne d'ingrédient
    ingredientsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-ingredient-btn')) {
            e.target.parentElement.remove();
        }
    });

    // Charger les ingrédients dans un select
    async function loadIngredients(select) {
        try {
            const response = await fetch('http://localhost:3000/api/ingredients');
            const ingredients = await response.json();
            ingredients.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient._id;
                option.textContent = ingredient.nom;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    // Ajouter une recette
    formRecette.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nom = document.getElementById('nom-recette').value;
        const description = document.getElementById('description').value;
        const ingredients = [];
        const ingredientRows = document.querySelectorAll('.ingredient-row');
        
        ingredientRows.forEach(row => {
            const ingredientId = row.querySelector('select[name="ingredients[]"]').value;
            const quantite = parseFloat(row.querySelector('input[name="quantites[]"]').value);
            const unite = row.querySelector('select[name="unites[]"]').value;
            ingredients.push({ ingredient: ingredientId, quantite, unite });
        });

        try {
            const response = await fetch('http://localhost:3000/api/recettes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nom, description, ingredients })
            });

            if (response.ok) {
                const recette = await response.json();
                displayRecette(recette);
                formRecette.reset();
                ingredientsList.innerHTML = '';
                addIngredientRow();
                recetteModal.style.display = 'none';
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });

    // Afficher une recette
    function displayRecette(recette) {
        console.log(recette);
        
        const div = document.createElement('div');
        div.className = 'recette-card';

        const titre = document.createElement('h3');
        titre.textContent = recette.titre;
        div.appendChild(titre);

        const ingredientsTitle = document.createElement('h4');
        ingredientsTitle.textContent = 'Ingrédients :';
        div.appendChild(ingredientsTitle);

        const ingredientsList = document.createElement('ul');
        recette.ingredients.forEach(i => {
            const li = document.createElement('li');
            li.textContent = `${i.qty} ${i.unite} de ${i.ingredient.nom}`;
            ingredientsList.appendChild(li);
        });
        div.appendChild(ingredientsList);

        const instructions = document.createElement('p');
        instructions.textContent = recette.instructions;
        div.appendChild(instructions);

        // Ajouter le bouton de modification
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-recette-btn';
        editBtn.textContent = 'Modifier';
        editBtn.addEventListener('click', () => openEditModal(recette));
        div.appendChild(editBtn);

        recettesContainer.appendChild(div);
    }

    // Charger les recettes existantes
    async function loadRecettes() {
        try {
            const response = await fetch('http://localhost:3000/api/recettes');
            const recettes = await response.json();
            recettes.forEach(recette => displayRecette(recette));
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    // Ajouter la première ligne d'ingrédient
    function addIngredientRow() {
        const row = document.createElement('div');
        row.className = 'ingredient-row';

        const select = document.createElement('select');
        select.name = 'ingredients[]';
        select.required = true;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionner un ingrédient';
        select.appendChild(defaultOption);

        const input = document.createElement('input');
        input.type = 'number';
        input.name = 'quantites[]';
        input.step = '0.01';
        input.required = true;
        input.placeholder = 'Quantité';

        const uniteSelect = document.createElement('select');
        uniteSelect.name = 'unites[]';
        uniteSelect.required = true;

        const uniteOptions = [
            { value: 'gramme', text: 'Grammes' },
            { value: 'litre', text: 'Litres' },
            { value: 'kg', text: 'Kilogrammes' }
        ];

        uniteOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            uniteSelect.appendChild(opt);
        });

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-ingredient-btn';
        removeBtn.textContent = 'Supprimer';

        row.appendChild(select);
        row.appendChild(input);
        row.appendChild(uniteSelect);
        row.appendChild(removeBtn);
        ingredientsList.appendChild(row);
        loadIngredients(select);
    }

    // Ouvrir la modale de modification
    function openEditModal(recette) {
        console.log('Recette à modifier:', recette);
        document.getElementById('edit-recette-id').value = recette._id;
        document.getElementById('edit-nom-recette').value = recette.titre;
        document.getElementById('edit-description').value = recette.instructions;
        
        // Vider le conteneur d'ingrédients
        editIngredientsList.innerHTML = '';
        
        // Ajouter les ingrédients existants
        recette.ingredients.forEach(ingredient => {
            console.log('Ingrédient:', ingredient);
            const row = document.createElement('div');
            row.className = 'ingredient-row';

            const select = document.createElement('select');
            select.name = 'ingredients[]';
            select.required = true;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner un ingrédient';
            select.appendChild(defaultOption);

            const input = document.createElement('input');
            input.type = 'number';
            input.name = 'quantites[]';
            input.step = '0.01';
            input.required = true;
            input.placeholder = 'Quantité';
            input.value = ingredient.qty;

            const uniteSelect = document.createElement('select');
            uniteSelect.name = 'unites[]';
            uniteSelect.required = true;

            const uniteOptions = [
                { value: 'gramme', text: 'Grammes' },
                { value: 'litre', text: 'Litres' },
                { value: 'kg', text: 'Kilogrammes' }
            ];

            uniteOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                uniteSelect.appendChild(opt);
            });

            // Définir la valeur de l'unité
            uniteSelect.value = ingredient.unite;
            console.log('Valeur de l\'unité définie:', ingredient.unite);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-ingredient-btn';
            removeBtn.textContent = 'Supprimer';

            row.appendChild(select);
            row.appendChild(input);
            row.appendChild(uniteSelect);
            row.appendChild(removeBtn);
            editIngredientsList.appendChild(row);

            // Charger les ingrédients et sélectionner celui actuel
            loadIngredients(select).then(() => {
                select.value = ingredient.ingredient._id;
            });
        });

        editRecetteModal.style.display = 'block';
    }

    // Fermer la modale de modification
    closeEditRecetteModal.addEventListener('click', () => {
        editRecetteModal.style.display = 'none';
    });

    // Fermer la modale de modification en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === editRecetteModal) {
            editRecetteModal.style.display = 'none';
        }
    });

    // Ajouter une ligne d'ingrédient dans la modale de modification
    editAddIngredientRowBtn.addEventListener('click', () => {
        const row = document.createElement('div');
        row.className = 'ingredient-row';

        const select = document.createElement('select');
        select.name = 'ingredients[]';
        select.required = true;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionner un ingrédient';
        select.appendChild(defaultOption);

        const input = document.createElement('input');
        input.type = 'number';
        input.name = 'quantites[]';
        input.step = '0.01';
        input.required = true;
        input.placeholder = 'Quantité';

        const uniteSelect = document.createElement('select');
        uniteSelect.name = 'unites[]';
        uniteSelect.required = true;

        const uniteOptions = [
            { value: 'gramme', text: 'Grammes' },
            { value: 'litre', text: 'Litres' },
            { value: 'kg', text: 'Kilogrammes' }
        ];

        uniteOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            uniteSelect.appendChild(opt);
        });

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-ingredient-btn';
        removeBtn.textContent = 'Supprimer';

        row.appendChild(select);
        row.appendChild(input);
        row.appendChild(uniteSelect);
        row.appendChild(removeBtn);
        editIngredientsList.appendChild(row);

        loadIngredients(select);
    });

    // Soumettre la modification de recette
    formEditRecette.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-recette-id').value;
        const nom = document.getElementById('edit-nom-recette').value;
        const description = document.getElementById('edit-description').value;
        const ingredients = [];
        const ingredientRows = document.querySelectorAll('#edit-ingredients-container .ingredient-row');
        
        ingredientRows.forEach(row => {
            const ingredientId = row.querySelector('select[name="ingredients[]"]').value;
            const quantite = parseFloat(row.querySelector('input[name="quantites[]"]').value);
            const unite = row.querySelector('select[name="unites[]"]').value;
            
            ingredients.push({ ingredient: ingredientId, qty :quantite, unite:unite });
        });

        try {
            console.log(ingredients);
            const response = await fetch(`http://localhost:3000/api/recettes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nom, description, ingredients })
            });

            if (response.ok) {
                const recette = await response.json();
                recettesContainer.innerHTML = '';
                loadRecettes();
                editRecetteModal.style.display = 'none';
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    });

    // Initialisation
    addIngredientRow();
    loadRecettes();
}); 