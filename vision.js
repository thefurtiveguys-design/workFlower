// vision.js

let mobileNetModel = null;
let cocoSsdModel = null;
const loadingIndicator = document.getElementById('loading-indicator');

// Précharger les modèles
async function loadModels() {
    try {
        console.log('Chargement des modèles IA en cours...');
        
        // Chargement en parallèle de MobileNet (version 2 pour plus de précision) et COCO-SSD (pour détecter plusieurs objets)
        const loadPromises = [];
        
        if (!mobileNetModel && typeof mobilenet !== 'undefined') {
            loadPromises.push(
                mobilenet.load({version: 2, alpha: 1.0}).then(model => {
                    mobileNetModel = model;
                    console.log('MobileNet v2 chargé.');
                })
            );
        }
        
        if (!cocoSsdModel && typeof cocoSsd !== 'undefined') {
            loadPromises.push(
                cocoSsd.load().then(model => {
                    cocoSsdModel = model;
                    console.log('COCO-SSD chargé.');
                })
            );
        }
        
        await Promise.all(loadPromises);
        
        if (!mobileNetModel && !cocoSsdModel) {
            console.warn("TensorFlow.js n'a pas pu charger les modèles.");
        } else {
            console.log('Modèles d\'I.A. prêts !');
        }
    } catch (error) {
        console.error("Erreur de chargement des modèles:", error);
    }
}

// Initialisation au chargement
window.addEventListener('DOMContentLoaded', loadModels);

// Analyser une image
window.analyzeImage = async function(imgElement) {
    if (!mobileNetModel && !cocoSsdModel) {
        alert("Les modèles d'IA sont en cours de chargement. Veuillez patienter un instant.");
        await loadModels();
        if(!mobileNetModel && !cocoSsdModel) {
            alert("Erreur de chargement des modèles. Veuillez vérifier votre connexion 인터넷.");
            return;
        }
    }
    
    loadingIndicator.classList.remove('hidden');
    
    try {
        const detectedIngredients = new Set(); // Utiliser un Set pour éviter les doublons automatiquement
        const promises = [];
        
        // 1. Analyse avec MobileNet (Bon pour l'objet dominant)
        if (mobileNetModel) {
            promises.push(
                mobileNetModel.classify(imgElement).then(predictions => {
                    console.log("Prédictions MobileNet:", predictions);
                    predictions.forEach(p => {
                        // On abaisse un peu le seuil pour capter plus de choses
                        if (p.probability > 0.05) {
                            if(window.translatePrediction) {
                                const translation = window.translatePrediction(p.className);
                                if (translation) detectedIngredients.add(translation);
                            }
                        }
                    });
                })
            );
        }
        
        // 2. Analyse avec COCO-SSD (Bon pour les frigos avec de multiples objets)
        if (cocoSsdModel) {
            promises.push(
                cocoSsdModel.detect(imgElement).then(predictions => {
                    console.log("Prédictions COCO-SSD:", predictions);
                    predictions.forEach(p => {
                        // COCO-SSD est généralement très confiant quand il trouve quelque chose
                        if (p.score > 0.3) {
                            if(window.translatePrediction) {
                                const translation = window.translatePrediction(p.class);
                                if (translation) detectedIngredients.add(translation);
                            }
                        }
                    });
                })
            );
        }
        
        // Attendre que les deux modèles aient terminé
        await Promise.all(promises);
        
        loadingIndicator.classList.add('hidden');
        
        const ingredientsArray = Array.from(detectedIngredients);
        
        if (ingredientsArray.length > 0) {
            // Envoyer à script.js
            if(window.addIngredients) {
                window.addIngredients(ingredientsArray);
            }
        } else {
            alert("L'IA n'a pas pu identifier d'aliments avec certitude. N'hésitez pas à les ajouter manuellement !");
        }
        
    } catch (error) {
        loadingIndicator.classList.add('hidden');
        console.error("Erreur lors de l'analyse:", error);
        alert("Une erreur est survenue lors de l'analyse de l'image.");
    }
};
