// camera.js
let stream = null;
const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const cameraContainer = document.getElementById('camera-container');
const startCameraBtn = document.getElementById('start-camera-btn');
const closeCameraBtn = document.getElementById('close-camera-btn');
const captureBtn = document.getElementById('capture-btn');
const imageUpload = document.getElementById('image-upload');

if(startCameraBtn) {
    startCameraBtn.addEventListener('click', startCamera);
}
if(closeCameraBtn) {
    closeCameraBtn.addEventListener('click', stopCamera);
}
if(captureBtn) {
    captureBtn.addEventListener('click', captureImage);
}
if(imageUpload) {
    imageUpload.addEventListener('change', handleImageUpload);
}

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // Préférer la caméra arrière sur mobile
        });
        videoElement.srcObject = stream;
        cameraContainer.classList.remove('hidden');
        startCameraBtn.classList.add('hidden');
    } catch (err) {
        console.error("Erreur d'accès à la caméra: ", err);
        alert("Impossible d'accéder à la caméra. Veuillez autoriser l'accès ou utiliser le bouton d'importation de photo.");
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    videoElement.srcObject = null;
    cameraContainer.classList.add('hidden');
    startCameraBtn.classList.remove('hidden');
}

function captureImage() {
    if (!stream) return;
    
    // Définir la taille du canvas selon la vidéo
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Dessiner l'image courante
    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    // Arrêter la caméra on capture
    stopCamera();
    
    // Convertir en image et appeler l'analyse
    const imageData = canvasElement.toDataURL('image/jpeg');
    
    // Créer une image imgTag pour vision.js
    const imgElement = new Image();
    imgElement.src = imageData;
    imgElement.onload = () => {
        if(window.analyzeImage) {
            window.analyzeImage(imgElement);
        }
    };
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const imgElement = new Image();
        imgElement.src = event.target.result;
        imgElement.onload = () => {
            if(window.analyzeImage) {
                window.analyzeImage(imgElement);
            }
        };
    };
    reader.readAsDataURL(file);
}

