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

// Intervalles pour le temps réel
let detectionIntervalId = null;

// Analyser en temps réel via le flux vidéo
window.startRealTimeDetection = function(videoElement) {
    if (detectionIntervalId) clearInterval(detectionIntervalId);
    
    // On met à jour l'UI pour montrer que le scan est en cours
    loadingIndicator.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div><p style="font-size: 0.8rem;">Analyse fluide en continu...</p>';
    loadingIndicator.classList.remove('hidden');
    
    // Un booléen pour éviter d'empiler les scans si le téléphone rame
    let isProcessing = false;
    
    // 300ms au lieu de 1500ms pour une vraie sensation de temps réel fluide
    detectionIntervalId = setInterval(async () => {
        if (!mobileNetModel || !cocoSsdModel || isProcessing) return;
        
        isProcessing = true;
        
        try {
            const detectedIngredients = new Set();
            const promises = [];
            
            // 1. Analyse MobileNet
            if (mobileNetModel) {
                promises.push(
                    mobileNetModel.classify(videoElement).then(predictions => {
                        predictions.forEach(p => {
                            if (p.probability > 0.1) { // Lègèrement plus strict pour éviter les faux positifs du mouvement
                                if(window.translatePrediction) {
                                    const translation = window.translatePrediction(p.className);
                                    if (translation) detectedIngredients.add(translation);
                                }
                            }
                        });
                    }).catch(e => console.error("Erreur MobileNet:", e))
                );
            }
            
            // 2. Analyse COCO-SSD (Spécialisé pour attraper tout le contenu du frigo)
            if (cocoSsdModel) {
                promises.push(
                    cocoSsdModel.detect(videoElement).then(predictions => {
                        predictions.forEach(p => {
                            // On prend même les probabilités moyennes (25%) car en vidéo on bouge
                            if (p.score > 0.25) {
                                if(window.translatePrediction) {
                                    const translation = window.translatePrediction(p.class);
                                    if (translation) detectedIngredients.add(translation);
                                }
                            }
                        });
                    }).catch(e => console.error("Erreur COCO-SSD:", e))
                );
            }
            
            await Promise.all(promises);
            
            const ingredientsArray = Array.from(detectedIngredients);
            
            if (ingredientsArray.length > 0) {
                // Envoyer à script.js, qui s'occupe de ne pas ajouter de doublons
                if(window.addIngredients) {
                    window.addIngredients(ingredientsArray);
                }
            }
            
        } catch (error) {
            console.error("Erreur pendant le scan temps réel:", error);
        } finally {
            isProcessing = false;
        }
    }, 300); // Exécution rapide
};

window.stopRealTimeDetection = function() {
    if (detectionIntervalId) {
        clearInterval(detectionIntervalId);
        detectionIntervalId = null;
    }
    loadingIndicator.classList.add('hidden');
    // Remettre le texte original
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Analyse des ingrédients en cours...</p>';
};

// Analyser une image fixe (boutons ou upload)
window.analyzeImage = async function(imgElement) {
    if (!mobileNetModel && !cocoSsdModel) {
        alert("Les modèles d'IA sont en cours de chargement. Veuillez patienter un instant.");
        await loadModels();
        if(!mobileNetModel && !cocoSsdModel) {
            alert("Erreur de chargement des modèles. Veuillez vérifier votre connexion.");
            return;
        }
    }
    
    loadingIndicator.classList.remove('hidden');
    
    try {
        const detectedIngredients = new Set();
        const promises = [];
        
        if (mobileNetModel) {
            promises.push(
                mobileNetModel.classify(imgElement).then(predictions => {
                    predictions.forEach(p => {
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
        
        if (cocoSsdModel) {
            promises.push(
                cocoSsdModel.detect(imgElement).then(predictions => {
                    predictions.forEach(p => {
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
        
        await Promise.all(promises);
        
        loadingIndicator.classList.add('hidden');
        
        const ingredientsArray = Array.from(detectedIngredients);
        
        if (ingredientsArray.length > 0) {
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
