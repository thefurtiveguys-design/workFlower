// script.js

// État de l'application
let userIngredients = [];
const savedIngredients = localStorage.getItem('placard_ingredients');
if (savedIngredients) {
    userIngredients = JSON.parse(savedIngredients);
}

// Éléments DOM
const ingredientsList = document.getElementById('ingredients-list');
const emptyIngredientsMsg = document.getElementById('empty-ingredients');
const ingredientsCountBadge = document.getElementById('ingredients-count');
const manualIngredientInput = document.getElementById('manual-ingredient');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const generateMenuBtn = document.getElementById('generate-menu-btn');
const menuSection = document.getElementById('menu-section');
const daysContainer = document.getElementById('days-container');

// Jours de la semaine
const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    renderIngredients();
    
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', handleManualAdd);
    }
    
    if (manualIngredientInput) {
        manualIngredientInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleManualAdd();
        });
    }
    
    if (generateMenuBtn) {
        generateMenuBtn.addEventListener('click', generateMenu);
    }
    
    // Restaurer le menu s'il existe
    const savedMenu = localStorage.getItem('placard_menu');
    if (savedMenu && userIngredients.length > 0) {
        renderMenu(JSON.parse(savedMenu));
    }
});

// Appelé par vision.js
window.addIngredients = function(newIngredients) {
    let countAdded = 0;
    newIngredients.forEach(ing => {
        if (!userIngredients.includes(ing)) {
            userIngredients.push(ing);
            countAdded++;
        }
    });
    
    if(countAdded > 0) {
        saveIngredients();
        renderIngredients();
    }
};

function handleManualAdd() {
    const val = manualIngredientInput.value.trim();
    if (val) {
        // Ajouter un emoji par défaut si non fourni
        const hasEmoji = /\p{Emoji}/u.test(val);
        const formattedVal = hasEmoji ? val : `🛒 ${val.charAt(0).toUpperCase() + val.slice(1)}`;
        
        if (!userIngredients.includes(formattedVal)) {
            userIngredients.push(formattedVal);
            saveIngredients();
            renderIngredients();
        }
        manualIngredientInput.value = '';
    }
}

function removeIngredient(ing) {
    userIngredients = userIngredients.filter(i => i !== ing);
    saveIngredients();
    renderIngredients();
}

function saveIngredients() {
    localStorage.setItem('placard_ingredients', JSON.stringify(userIngredients));
}

function renderIngredients() {
    // Vider la liste
    ingredientsList.innerHTML = '';
    
    if (userIngredients.length === 0) {
        ingredientsList.appendChild(emptyIngredientsMsg);
        emptyIngredientsMsg.classList.remove('hidden');
        generateMenuBtn.disabled = true;
        ingredientsCountBadge.textContent = "0";
        ingredientsCountBadge.className = "badge badge-neutral";
        return;
    }
    
    // Mettre à jour le badge
    ingredientsCountBadge.textContent = userIngredients.length;
    if (userIngredients.length > 5) {
        ingredientsCountBadge.className = "badge badge-green";
    } else {
        ingredientsCountBadge.className = "badge badge-orange";
    }
    
    emptyIngredientsMsg.classList.add('hidden');
    generateMenuBtn.disabled = false;
    
    userIngredients.forEach(ing => {
        const li = document.createElement('li');
        li.className = 'ingredient-tag';
        
        const span = document.createElement('span');
        span.textContent = ing;
        
        const btn = document.createElement('button');
        btn.innerHTML = '<i data-lucide="x" style="width: 14px; height: 14px;"></i>';
        btn.onclick = () => removeIngredient(ing);
        
        li.appendChild(span);
        li.appendChild(btn);
        ingredientsList.appendChild(li);
    });
    
    // Refresh Lucide icons for newly added elements
    if(window.lucide) {
        lucide.createIcons();
    }
}

// Logique de génération de menu
function calculateMatchScore(recipeIngredients, userIngs) {
    let matchCount = 0;
    
    // Normalisation pour comparer (enlever emojis et mettre en minuscule)
    const normalize = str => str.toLowerCase().replace(/[\u1000-\uFFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]|\p{Emoji}/gu, '').trim();
    const normalizedUser = userIngs.map(normalize);
    
    recipeIngredients.forEach(reqIng => {
        const normalizedMatched = normalize(reqIng);
        
        // Vérifier si un des ingrédients de l'utilisateur correspond ou est contenu (ex: "Tomate" dans "Tomates cerises")
        const isMatch = normalizedUser.some(u => normalizedMatched.includes(u) || u.includes(normalizedMatched));
        if(isMatch) matchCount++;
    });
    
    return {
        score: matchCount / recipeIngredients.length, // Pourcentage de correspondance
        matches: matchCount,
        total: recipeIngredients.length
    };
}

function generateMenu() {
    if (userIngredients.length === 0) return;
    
    // Évaluer toutes les recettes
    const evaluatedRecipes = window.recipes.map(recipe => {
        const matchData = calculateMatchScore(recipe.ingredients, userIngredients);
        return {
            ...recipe,
            matchScore: matchData.score,
            matchCount: matchData.matches,
            ingredientCount: matchData.total
        };
    });
    
    // Trier par score (décroissant)
    evaluatedRecipes.sort((a, b) => b.matchScore - a.matchScore);
    
    // Prendre les 7 meilleures (ou moins si on n'a pas 7 recettes)
    // Pour varier, on prend parmi les 15 meilleures et on mélange un peu si on a beaucoup d'ingrédients
    const topCandidates = evaluatedRecipes.slice(0, Math.max(7, evaluatedRecipes.length));
    
    // Fisher-Yates shuffle pour ne pas toujours avoir exactement les mêmes repas les mêmes jours si le score est similaire
    for (let i = topCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [topCandidates[i], topCandidates[j]] = [topCandidates[j], topCandidates[i]];
    }
    
    // Prendre 7
    const finalMenu = topCandidates.slice(0, 7);
    
    saveMenu(finalMenu);
    renderMenu(finalMenu);
    
    // Scroll au menu
    menuSection.scrollIntoView({ behavior: 'smooth' });
}

function saveMenu(menu) {
    localStorage.setItem('placard_menu', JSON.stringify(menu));
}

function renderMenu(menu) {
    menuSection.classList.remove('hidden');
    daysContainer.innerHTML = '';
    
    const normalize = str => str.toLowerCase().replace(/[\u1000-\uFFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]|\p{Emoji}/gu, '').trim();
    
    menu.forEach((recipe, index) => {
        const dayName = joursSemaine[Math.min(index, 6)];
        
        // Formatter les ingrédients (barrés si manquants)
        const ingredientsHtml = recipe.ingredients.map(ing => {
            const normalizedIng = normalize(ing);
            const normalizedUser = userIngredients.map(normalize);
            
            const isMissing = !normalizedUser.some(u => normalizedIng.includes(u) || u.includes(normalizedIng));
            return `<span class="${isMissing ? 'ingredient-missing' : ''}">${ing}</span>`;
        }).join(', ');
        
        // Couleur du badge
        const percentage = Math.round((recipe.matchCount / recipe.ingredientCount) * 100) || 0;
        let badgeClass = 'badge-neutral';
        if (percentage >= 80) badgeClass = 'badge-green';
        else if (percentage >= 50) badgeClass = 'badge-orange';
        
        const cardHtml = `
            <div class="day-card" data-index="${index}">
                <div class="day-header">
                    <span>${dayName}</span>
                    <button class="regenerate-btn" onclick="regenerateDay(${index})" title="Changer de recette">
                        <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
                <div class="recipe-content">
                    <div class="recipe-image">${recipe.image}</div>
                    <div class="recipe-info">
                        <div class="recipe-title">${recipe.title}</div>
                        <div class="recipe-meta">
                            <span><i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${recipe.time}</span>
                            <span><i data-lucide="chef-hat" style="width: 14px; height: 14px;"></i> ${recipe.difficulty}</span>
                            <span class="badge ${badgeClass}">${recipe.matchCount}/${recipe.ingredientCount} poss.</span>
                        </div>
                        <div class="recipe-ingredients">
                            ${ingredientsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        daysContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
    
    if(window.lucide) {
        lucide.createIcons();
    }
}

// Global scope pour pouvoir être appelé depuis l'HTML
window.regenerateDay = function(index) {
    const currentMenu = JSON.parse(localStorage.getItem('placard_menu')) || [];
    if(currentMenu.length === 0) return;
    
    // Obtenir les IDs des recettes déjà dans le menu
    const currentIds = currentMenu.map(r => r.id);
    
    // Évaluer toutes les recettes
    const evaluatedRecipes = window.recipes.map(recipe => {
        const matchData = calculateMatchScore(recipe.ingredients, userIngredients);
        return {
            ...recipe,
            matchScore: matchData.score,
            matchCount: matchData.matches,
            ingredientCount: matchData.total
        };
    });
    
    // Filtrer celles qui ne sont pas dans le menu actuel
    const availableRecipes = evaluatedRecipes.filter(r => !currentIds.includes(r.id));
    
    if(availableRecipes.length > 0) {
        // Trier par score
        availableRecipes.sort((a, b) => b.matchScore - a.matchScore);
        
        // Prendre une des 3 meilleures aléatoirement
        const randomTopIndex = Math.floor(Math.random() * Math.min(3, availableRecipes.length));
        
        // Remplacer dans le menu
        currentMenu[index] = availableRecipes[randomTopIndex];
        
        saveMenu(currentMenu);
        renderMenu(currentMenu);
    } else {
        alert("Nous n'avons pas d'autres recettes disponibles dans la base de données !");
    }
};
