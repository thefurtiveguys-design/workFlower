const recipes = [
    // RECETTES BASIQUES ET FRUITS
    {
        id: 101,
        title: "Compote de pommes",
        image: "🍎",
        time: "15 min",
        difficulty: "Facile",
        ingredients: ["🍎 Pomme", "🍚 Sucre"],
        instructions: "Éplucher et couper les pommes. Faire chauffer dans une casserole avec le sucre et un peu d'eau jusqu'à ce que les pommes ramollissent."
    },
    {
        id: 102,
        title: "Pomme au four",
        image: "🍎",
        time: "30 min",
        difficulty: "Facile",
        ingredients: ["🍎 Pomme", "🧈 Beurre", "🍚 Sucre"],
        instructions: "Creuser les pommes, mettre une noix de beurre et du sucre au centre. Enfourner 25 min à 180°C."
    },
    {
        id: 103,
        title: "Salade de fruits express",
        image: "🍌",
        time: "5 min",
        difficulty: "Très facile",
        ingredients: ["🍌 Banane", "🍎 Pomme", "🍊 Orange"],
        instructions: "Couper les fruits en dés et mélanger le tout. Déguster frais."
    },
    {
        id: 104,
        title: "Banane flambée ou poêlée",
        image: "🍌",
        time: "5 min",
        difficulty: "Facile",
        ingredients: ["🍌 Banane", "🧈 Beurre", "🍚 Sucre"],
        instructions: "Faire fondre le beurre. Couper la banane en deux, saupoudrer de sucre et faire dorer."
    },
    {
        id: 105,
        title: "Limonade maison",
        image: "🍋",
        time: "5 min",
        difficulty: "Très facile",
        ingredients: ["🍋 Citron", "🍚 Sucre", "💧 Bouteille d'eau"],
        instructions: "Presser les citrons, ajouter l'eau et le sucre. Bien mélanger."
    },

    // RECETTES TRÈS SIMPLES (Sur le pouce)
    {
        id: 201,
        title: "Oeuf sur le plat",
        image: "🍳",
        time: "5 min",
        difficulty: "Très facile",
        ingredients: ["🥚 Oeuf", "🫒 Huile", "🧂 Sel"],
        instructions: "Chauffer l'huile, casser l'oeuf. Cuire 3 min, saler et servir."
    },
    {
        id: 202,
        title: "Tartine Fromage",
        image: "🧀",
        time: "5 min",
        difficulty: "Très facile",
        ingredients: ["🍞 Pain", "🧀 Fromage"],
        instructions: "Couper le pain, mettre le fromage dessus. Manger froid ou griller 5 min."
    },
    {
        id: 203,
        title: "Pain Perdu",
        image: "🍞",
        time: "10 min",
        difficulty: "Facile",
        ingredients: ["🍞 Pain", "🥛 Lait", "🥚 Oeuf", "🍚 Sucre"],
        instructions: "Tremper le pain dans l'oeuf battu et le lait. Faire dorer à la poêle avec du sucre."
    },
    {
        id: 204,
        title: "Yaourt au Miel",
        image: "🥛",
        time: "2 min",
        difficulty: "Très facile",
        ingredients: ["🥛 Yaourt", "🍯 Miel"],
        instructions: "Verser du miel dans le yaourt et mélanger."
    },
    {
        id: 205,
        title: "Pâtes au Beurre",
        image: "🍝",
        time: "12 min",
        difficulty: "Très facile",
        ingredients: ["🍝 Pâtes", "🧈 Beurre", "🧂 Sel"],
        instructions: "Cuire les pâtes. Égoutter et mélanger avec une bonne noix de beurre."
    },
    {
        id: 206,
        title: "Pâtes au Fromage",
        image: "🧀",
        time: "12 min",
        difficulty: "Très facile",
        ingredients: ["🍝 Pâtes", "🧀 Fromage"],
        instructions: "Cuire les pâtes, rajouter le fromage fondant par-dessus."
    },
    
    // CLASSIQUES
    {
        id: 1,
        title: "Pâtes à la sauce tomate",
        image: "🍝",
        time: "15 min",
        difficulty: "Facile",
        ingredients: ["🍝 Pâtes", "🍅 Tomate", "🧅 Oignon", "🧄 Ail", "🫒 Huile", "🧂 Sel"],
        instructions: "Faire cuire les pâtes. Faire revenir l'oignon et l'ail dans l'huile. Ajouter les tomates coupées. Mélanger avec les pâtes égouttées."
    },
    {
        id: 2,
        title: "Omelette au fromage",
        image: "🍳",
        time: "10 min",
        difficulty: "Facile",
        ingredients: ["🥚 Oeuf", "🧀 Fromage", "🧈 Beurre"],
        instructions: "Battre les oeufs. Faire fondre le beurre dans une poêle. Verser les oeufs, ajouter le fromage râpé et plier."
    },
    {
        id: 3,
        title: "Poulet rôti et pommes de terre",
        image: "🍗",
        time: "45 min",
        difficulty: "Moyen",
        ingredients: ["🍗 Poulet", "🥔 Pomme de terre", "🫒 Huile", "🧄 Ail"],
        instructions: "Préchauffer le four à 200°C. Placer le poulet et les pommes de terre. Ajouter l'huile et l'ail. Enfourner."
    },
    {
        id: 4,
        title: "Salade fraîcheur",
        image: "🥗",
        time: "10 min",
        difficulty: "Facile",
        ingredients: ["🥬 Laitue", "🍅 Tomate", "🥒 Concombre", "🫒 Huile"],
        instructions: "Laver et couper les légumes. Mélanger le tout avec de l'huile et un filet de jus de citron."
    },
    {
        id: 5,
        title: "Riz sauté aux légumes",
        image: "🍚",
        time: "20 min",
        difficulty: "Moyen",
        ingredients: ["🍚 Riz", "🥕 Carotte", "🧅 Oignon", "🥚 Oeuf"],
        instructions: "Faire cuire le riz. Faire sauter les légumes dans une poêle. Ajouter le riz cuit et un oeuf brouillé."
    },
    {
        id: 6,
        title: "Gratin de brocolis",
        image: "🥘",
        time: "40 min",
        difficulty: "Moyen",
        ingredients: ["🥦 Brocoli", "🧀 Fromage", "🥛 Lait", "🌾 Farine", "🧈 Beurre"],
        instructions: "Cuire le brocoli. Préparer béchamel. Placer le brocoli dans un plat, recouvrir de béchamel et de fromage. Gratiner."
    },
    {
        id: 7,
        title: "Steak frites",
        image: "🥩",
        time: "25 min",
        difficulty: "Facile",
        ingredients: ["🥩 Boeuf", "🥔 Pomme de terre", "🫒 Huile"],
        instructions: "Couper les pommes de terre en frites et les faire frire. Faire cuire le steak à la poêle."
    },
    {
        id: 8,
        title: "Sandwich express",
        image: "🥪",
        time: "5 min",
        difficulty: "Très facile",
        ingredients: ["🍞 Pain", "🧈 Beurre", "🍖 Porc", "🧀 Fromage"],
        instructions: "Couper le pain en deux. Tartiner de beurre. Ajouter jambon et fromage."
    },
    {
        id: 9,
        title: "Soupe à la tomate",
        image: "🥣",
        time: "30 min",
        difficulty: "Facile",
        ingredients: ["🍅 Tomate", "🧅 Oignon", "🧄 Ail", "🫒 Huile"],
        instructions: "Faire revenir l'oignon et l'ail. Ajouter les tomates. Laisser mijoter puis mixer."
    },
    {
        id: 10,
        title: "Poisson au four",
        image: "🐟",
        time: "20 min",
        difficulty: "Facile",
        ingredients: ["🐟 Poisson", "🍋 Citron", "🧈 Beurre"],
        instructions: "Mettre le poisson dans un plat. Ajouter le beurre et le citron. Cuire 15 min à 180°C."
    },
    {
        id: 12,
        title: "Pancakes",
        image: "🥞",
        time: "20 min",
        difficulty: "Moyen",
        ingredients: ["🌾 Farine", "🥛 Lait", "🥚 Oeuf", "🍚 Sucre", "🧈 Beurre"],
        instructions: "Mélanger farine, sucre, lait, oeuf. Cuire des portions dans une poêle beurrée."
    },
    {
        id: 13,
        title: "Purée maison",
        image: "🥔",
        time: "25 min",
        difficulty: "Facile",
        ingredients: ["🥔 Pomme de terre", "🥛 Lait", "🧈 Beurre"],
        instructions: "Cuire les pommes de terre. Écraser en ajoutant le lait chaud et le beurre."
    },
    {
        id: 15,
        title: "Poêlée paysanne",
        image: "🍳",
        time: "25 min",
        difficulty: "Facile",
        ingredients: ["🥔 Pomme de terre", "🧅 Oignon", "🥓 Bacon", "🫒 Huile"],
        instructions: "Couper les pommes de terre en dés. Rissoler avec l'oignon et les lardons (bacon)."
    },
    {
        id: 16,
        title: "Fondant au chocolat",
        image: "🍫",
        time: "30 min",
        difficulty: "Moyen",
        ingredients: ["🍫 Chocolat", "🧈 Beurre", "🍚 Sucre", "🥚 Oeuf", "🌾 Farine"],
        instructions: "Faire fondre chocolat et beurre. Ajouter sucre, oeufs et farine. Cuire 12 min à 200°C."
    },
    {
        id: 19,
        title: "Pizza Marguerita",
        image: "🍕",
        time: "30 min",
        difficulty: "Moyen",
        ingredients: ["🍞 Pain/Viennoiserie", "🍅 Tomate", "🧀 Fromage"],
        instructions: "Étaler pâte, garnir de sauce tomate et fromage. Cuire à four très chaud."
    },
    {
        id: 20,
        title: "Salade César",
        image: "🥗",
        time: "15 min",
        difficulty: "Facile",
        ingredients: ["🥬 Laitue", "🍗 Poulet", "🍞 Pain", "🧀 Fromage"],
        instructions: "Griller le poulet et les croûtons. Mélanger avec salade et fromage."
    },
    {
        id: 21,
        title: "Champignons sautés",
        image: "🍄",
        time: "10 min",
        difficulty: "Facile",
        ingredients: ["🍄 Champignon", "🧄 Ail", "🧈 Beurre"],
        instructions: "Rissoler l'ail dans le beurre, ajouter les champignons 5 min."
    },
    {
        id: 22,
        title: "Soupe à l'oignon",
        image: "🥣",
        time: "40 min",
        difficulty: "Moyen",
        ingredients: ["🧅 Oignon", "🍞 Pain", "🧀 Fromage", "🧈 Beurre"],
        instructions: "Caraméliser oignons. Ajouter eau. Recouvrir de pain et fromage, gratiner."
    },
    {
        id: 23,
        title: "Carottes râpées",
        image: "🥕",
        time: "5 min",
        difficulty: "Très facile",
        ingredients: ["🥕 Carotte", "🫒 Huile", "🍋 Citron"],
        instructions: "Râper la carotte, assaisonner d'huile et de citron."
    },
    {
        id: 24,
        title: "Gâteau simple",
        image: "🍰",
        time: "40 min",
        difficulty: "Moyen",
        ingredients: ["🌾 Farine", "🥚 Oeuf", "🍚 Sucre", "🧈 Beurre", "🥛 Lait"],
        instructions: "Mélanger oeufs et sucre. Ajouter beurre fondu, farine, lait. Enfourner 30 min."
    }
];
