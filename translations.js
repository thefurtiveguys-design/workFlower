/**
 * Dictionnaire très enrichi pour mapper les classes ImageNet (MobileNet) 
 * et COCO-SSD vers des ingrédients français avec emojis.
 */
const foodTranslations = {
    // ---- FRUITS ----
    'apple': '🍎 Pomme',
    'granny smith': '🍎 Pomme',
    'macadamia nut': '🌰 Noix',
    'banana': '🍌 Banane',
    'orange': '🍊 Orange',
    'lemon': '🍋 Citron',
    'fig': '🫐 Figue',
    'pineapple': '🍍 Ananas',
    'strawberry': '🍓 Fraise',
    'grape': '🍇 Raisin',
    'watermelon': '🍉 Pastèque',
    'peach': '🍑 Pêche',
    'pear': '🍐 Poire',
    'pomegranate': '🍎 Grenade',
    'jackfruit': '🍈 Fruit du jacquier',
    
    // ---- LÉGUMES ----
    'tomato': '🍅 Tomate',
    'cherry tomato': '🍅 Tomate',
    'potato': '🥔 Pomme de terre',
    'mashed potato': '🥔 Purée de pomme de terre',
    'carrot': '🥕 Carotte',
    'onion': '🧅 Oignon',
    'garlic': '🧄 Ail',
    'broccoli': '🥦 Brocoli',
    'cauliflower': '🥦 Chou-fleur',
    'cucumber': '🥒 Concombre',
    'zucchini': '🥒 Courgette',
    'spaghetti squash': '🎃 Courge',
    'acorn squash': '🎃 Courge',
    'butternut squash': '🎃 Courge butternut',
    'artichoke': '🥬 Artichaut',
    'bell pepper': '🫑 Poivron',
    'head cabbage': '🥬 Chou',
    'cabbage': '🥬 Chou',
    'lettuce': '🥬 Laitue',
    'spinach': '🥬 Épinard',
    'mushroom': '🍄 Champignon',
    'eggplant': '🍆 Aubergine',
    'radish': '🫕 Radis',
    'corn': '🌽 Maïs',
    'ear': '🌽 Maïs', // ImageNet class for corn matching 'ear'
    
    // ---- PROTÉINES ----
    'egg': '🥚 Oeuf',
    'cheese': '🧀 Fromage',
    'yogurt': '🥛 Yaourt',
    'chicken': '🍗 Poulet',
    'hen': '🍗 Poulet', // ImageNet
    'cock': '🍗 Volaille', // ImageNet
    'fish': '🐟 Poisson',
    'meat': '🥩 Viande',
    'beef': '🥩 Boeuf',
    'pork': '🍖 Porc',
    'bacon': '🥓 Bacon',
    'sausage': '🌭 Saucisse',
    'steak': '🥩 Steak',
    'meat loaf': '🥩 Viande',
    'crab': '🦀 Crabe',
    'lobster': '🦞 Homard',
    
    // ---- FÉCULENTS & PAIN ----
    'bread': '🍞 Pain',
    'french loaf': '🥖 Baguette',
    'bagel': '🥯 Bagel',
    'pretzel': '🥨 Bretzel',
    'dough': '🍞 Pâte à pain',
    'bakery': '🍞 Pain/Viennoiserie',
    'rice': '🍚 Riz',
    'pasta': '🍝 Pâtes',
    'spaghetti': '🍝 Spaghetti',
    'noodle': '🍜 Nouilles',
    'pizza': '🍕 Pizza',
    
    // ---- CONTENANTS (Souvent détectés dans un frigo) ----
    'can': '🥫 Conserve',
    'bottle': '🧴 Bouteille',
    'water bottle': '💧 Bouteille d\'eau',
    'wine bottle': '🍾 Bouteille de vin',
    'beer bottle': '🍺 Bouteille de bière',
    'pop bottle': '🥤 Soda',
    'milk can': '🥛 Lait',
    'water jug': '🥛 Carafe d\'eau',
    'jug': '🫙 Bocal/Carafe',
    'pitcher': '🫙 Pichet',
    'jar': '🫙 Bocal',
    'cup': '☕ Tasse',
    'coffee mug': '☕ Tasse',
    'bowl': '🥣 Bol',
    
    // ---- PRODUITS LAITIERS ----
    'milk': '🥛 Lait',
    'butter': '🧈 Beurre',
    'cream': '🥛 Crème',
    'ice cream': '🍨 Glace',
    
    // ---- BOISSONS & AUTRES ----
    'espresso': '☕ Café',
    'coffee': '☕ Café',
    'tea': '🍵 Thé',
    'teapot': '🍵 Thé',
    'red wine': '🍷 Vin rouge',
    'wine glass': '🍷 Verre de vin',
    'beer': '🍺 Bière',
    'cocktail shaker': '🍹 Boisson',
    
    // ---- ASSAISONNEMENTS & DESSERTS ----
    'salt': '🧂 Sel',
    'sugar': '🍚 Sucre',
    'flour': '🌾 Farine',
    'oil': '🫒 Huile',
    'honey': '🍯 Miel',
    'chocolate': '🍫 Chocolat',
    'chocolate sauce': '🍫 Chocolat',
    'nut': '🥜 Noix',
    'peanut': '🥜 Cacahuète',
    'sweet': '🍬 Confiserie',
    'donut': '🍩 Donut',
    'cake': '🍰 Gâteau',
    
    // ---- PLATS PRÉPARÉS ----
    'soup': '🥣 Soupe',
    'consomme': '🥣 Bouillon/Soupe',
    'hot pot': '🍲 Ragoût',
    'salad': '🥗 Salade',
    'plate': '🍽️ Plat',
    'sandwich': '🥪 Sandwich',
    'burger': '🍔 Hamburger',
    'cheeseburger': '🍔 Hamburger',
    'hotdog': '🌭 Hot-dog',
    'burrito': '🌯 Burrito',
    'taco': '🌮 Taco',
    'potpie': '🥧 Tourte'
};

/**
 * Nettoie et traduit les classes fournies par les modèles.
 * Recherche d'abord une correspondance exacte, puis une correspondance partielle.
 */
function translatePrediction(className) {
    if (!className) return null;
    
    // Les modèles retournent souvent des noms en minuscules séparés par des virgules
    const terms = className.toLowerCase().split(',');
    
    for (let term of terms) {
        term = term.trim();
        
        // 1. Correspondance exacte
        if (foodTranslations[term]) {
            return foodTranslations[term];
        }
        
        // 2. Correspondance partielle : vérifie si le terme de l'IA contient un de nos mots clés
        for (const [key, value] of Object.entries(foodTranslations)) {
            // Pour éviter les faux positifs courts (ex: 'can' dans 'pecan'), on divise en mots
            const termWords = term.split(/[\s-]+/);
            if (termWords.includes(key) || term.includes(` ${key}`) || term.includes(`${key} `)) {
                return value;
            }
        }
    }
    
    return null; // Ignore les éléments non alimentaires ou inconnus
}
