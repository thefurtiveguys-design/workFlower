const recipes = [
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
        id: 11,
        title: "Salade de fruits",
        image: "🍎",
        time: "10 min",
        difficulty: "Très facile",
        ingredients: ["🍎 Pomme", "🍌 Banane", "🍊 Orange"],
        instructions: "Peler et couper tous les fruits. Mélanger et servir frais."
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
        id: 14,
        title: "Avocado toast (ou variante)",
        image: "🥑",
        time: "15 min",
        difficulty: "Facile",
        ingredients: ["🍞 Pain", "🥚 Oeuf", "🍋 Citron"],
        instructions: "Cuire l'oeuf mollet ou dur. Griller le pain. Ajouter garniture et oef."
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
        id: 17,
        title: "Gratin dauphinois",
        image: "🥘",
        time: "1h15",
        difficulty: "Difficile",
        ingredients: ["🥔 Pomme de terre", "🥛 Lait", "🧄 Ail", "🧀 Fromage"],
        instructions: "Disposer les rondelles de patates dans un plat. Noyer de lait. Ajouter fromage et cuire 1h à 180°C."
    },
    {
        id: 18,
        title: "Tomates farcies",
        image: "🍅",
        time: "50 min",
        difficulty: "Moyen",
        ingredients: ["🍅 Tomate", "🥩 Boeuf", "🧅 Oignon", "🍚 Riz"],
        instructions: "Creuser les tomates. Mélanger boeuf, oignon. Farcir et cuire sur le riz."
    },
    {
        id: 19,
        title: "Pizza express",
        image: "🍕",
        time: "30 min",
        difficulty: "Moyen",
        ingredients: ["🌾 Farine", "🫒 Huile", "🍅 Tomate", "🧀 Fromage"],
        instructions: "Faire la pâte. Étaler, garnir de sauce tomate et fromage. Cuire à four très chaud."
    },
    {
        id: 20,
        title: "Salade César",
        image: "🥗",
        time: "15 min",
        difficulty: "Facile",
        ingredients: ["🥬 Laitue", "🍗 Poulet", "🍞 Pain", "🧀 Fromage"],
        instructions: "Griller le poulet et les croûtons. Mélanger avec salade et fromage."
    }
];

