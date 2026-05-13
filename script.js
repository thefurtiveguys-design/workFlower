// Variables globales
let peer;
let connection;
let myPeerId;

// Éléments du DOM
const connectionScreen = document.getElementById('connection-screen');
const chatScreen = document.getElementById('chat-screen');
const myPeerIdElement = document.getElementById('my-peer-id');
const copyIdBtn = document.getElementById('copy-id-btn');
const idStatus = document.getElementById('id-status');
const remotePeerIdInput = document.getElementById('remote-peer-id');
const connectBtn = document.getElementById('connect-btn');
const connectedPeerIdElement = document.getElementById('connected-peer-id');
const disconnectBtn = document.getElementById('disconnect-btn');
const messagesList = document.getElementById('messages-list');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const connectionIndicator = document.getElementById('connection-indicator');
const messagesContainer = document.getElementById('messages-container');

// Initialisation de PeerJS avec le serveur gratuit
function initializePeer() {
    // Utilisation du serveur de signalisation gratuit de PeerJS
    peer = new Peer(undefined, {
        host: '0.peerjs.com',
        port: 443,
        secure: true,
        debug: 1
    });

    // Quand la connexion au serveur est établie
    peer.on('open', (id) => {
        myPeerId = id;
        myPeerIdElement.textContent = id;
        copyIdBtn.disabled = false;
        idStatus.textContent = '✅ Connecté au serveur - Partagez votre ID !';
        idStatus.className = 'id-status connected';
        console.log('Mon Peer ID:', id);
    });

    // Gestion des erreurs
    peer.on('error', (error) => {
        console.error('Erreur PeerJS:', error);
        let errorMessage = 'Erreur de connexion au serveur';
        
        switch(error.type) {
            case 'browser-incompatible':
                errorMessage = 'Navigateur incompatible';
                break;
            case 'disconnected':
                errorMessage = 'Déconnecté du serveur';
                break;
            case 'invalid-id':
                errorMessage = 'ID invalide';
                break;
            case 'network':
                errorMessage = 'Erreur réseau - Vérifiez votre connexion internet';
                break;
            case 'peer-unavailable':
                errorMessage = 'Le destinataire n\'est pas disponible';
                break;
            case 'server-error':
                errorMessage = 'Erreur du serveur de signalisation';
                break;
            case 'socket-error':
                errorMessage = 'Erreur de socket';
                break;
            case 'unavailable-id':
                errorMessage = 'Cet ID est déjà utilisé';
                break;
            case 'webrtc':
                errorMessage = 'Erreur WebRTC';
                break;
        }
        
        idStatus.textContent = `❌ ${errorMessage}`;
        idStatus.className = 'id-status';
        showSystemMessage(`Erreur: ${errorMessage}`);
    });

    // Reconnexion automatique
    peer.on('disconnected', () => {
        idStatus.textContent = '🔄 Reconnexion au serveur...';
        idStatus.className = 'id-status';
        peer.reconnect();
    });

    // Quand quelqu'un se connecte à nous
    peer.on('connection', (conn) => {
        if (connection) {
            // On refuse les connexions multiples
            conn.close();
            return;
        }
        
        setupConnection(conn);
        switchToChatScreen();
        showSystemMessage('Un utilisateur s\'est connecté à vous !');
    });

    // Fermeture propre
    window.addEventListener('beforeunload', () => {
        if (connection) {
            connection.close();
        }
        peer.destroy();
    });
}

// Configuration de la connexion
function setupConnection(conn) {
    connection = conn;

    conn.on('open', () => {
        console.log('Connexion établie avec:', conn.peer);
        connectedPeerIdElement.textContent = conn.peer;
        connectionIndicator.classList.remove('disconnected');
        showSystemMessage(`✅ Connecté à ${conn.peer.substring(0, 8)}...`);
    });

    // Réception des messages
    conn.on('data', (data) => {
        if (data.type === 'message') {
            addMessage(data.content, 'received', data.timestamp);
        }
    });

    conn.on('close', () => {
        handleDisconnection();
    });

    conn.on('error', (error) => {
        console.error('Erreur de connexion:', error);
        showSystemMessage('Erreur de connexion avec le pair');
    });
}

// Connexion à un pair
function connectToPeer() {
    const remoteId = remotePeerIdInput.value.trim();
    
    if (!remoteId) {
        alert('Veuillez entrer un ID de destinataire');
        return;
    }

    if (remoteId === myPeerId) {
        alert('Vous ne pouvez pas vous connecter à vous-même !');
        return;
    }

    if (connection) {
        alert('Vous êtes déjà connecté à quelqu\'un');
        return;
    }

    idStatus.textContent = '🔄 Tentative de connexion...';
    idStatus.className = 'id-status';
    connectBtn.disabled = true;

    const conn = peer.connect(remoteId, {
        reliable: true
    });

    conn.on('open', () => {
        setupConnection(conn);
        switchToChatScreen();
        showSystemMessage(`✅ Connecté à ${remoteId.substring(0, 8)}...`);
        connectBtn.disabled = false;
    });

    conn.on('error', (error) => {
        console.error('Erreur de connexion:', error);
        idStatus.textContent = '❌ Échec de la connexion - ID invalide ou utilisateur non disponible';
        idStatus.className = 'id-status';
        connectBtn.disabled = false;
        alert('Impossible de se connecter. Vérifiez l\'ID et assurez-vous que votre ami est connecté.');
    });
}

// Envoi de message
function sendMessage() {
    const content = messageInput.value.trim();
    
    if (!content || !connection) {
        return;
    }

    const messageData = {
        type: 'message',
        content: content,
        timestamp: new Date().toISOString()
    };

    connection.send(messageData);
    addMessage(content, 'sent', messageData.timestamp);
    messageInput.value = '';
    messageInput.focus();
}

// Ajout de message à l'interface
function addMessage(content, type, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date(timestamp);
    const timeString = time.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        ${content}
        <div class="message-time">${timeString}</div>
    `;
    
    messagesList.appendChild(messageDiv);
    scrollToBottom();
}

// Message système
function showSystemMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.textContent = content;
    messagesList.appendChild(messageDiv);
    scrollToBottom();
}

// Scroll automatique vers le bas
function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Changement d'écran
function switchToChatScreen() {
    connectionScreen.classList.remove('active');
    chatScreen.classList.add('active');
    messageInput.focus();
}

function switchToConnectionScreen() {
    chatScreen.classList.remove('active');
    connectionScreen.classList.add('active');
    messagesList.innerHTML = '';
}

// Gestion de la déconnexion
function handleDisconnection() {
    if (connection) {
        connection.close();
        connection = null;
    }
    
    connectionIndicator.classList.add('disconnected');
    connectedPeerIdElement.textContent = 'Personne';
    switchToConnectionScreen();
    idStatus.textContent = '✅ Connecté au serveur - Partagez votre ID !';
    idStatus.className = 'id-status connected';
}

// Déconnexion manuelle
function disconnect() {
    if (connection) {
        showSystemMessage('Vous vous êtes déconnecté');
        handleDisconnection();
    }
}

// Copie de l'ID
function copyPeerId() {
    if (!myPeerId) return;
    
    navigator.clipboard.writeText(myPeerId).then(() => {
        copyIdBtn.textContent = '✅ Copié !';
        copyIdBtn.classList.add('copied');
        
        setTimeout(() => {
            copyIdBtn.textContent = '📋 Copier';
            copyIdBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        // Fallback pour les navigateurs qui ne supportent pas clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = myPeerId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyIdBtn.textContent = '✅ Copié !';
        copyIdBtn.classList.add('copied');
        setTimeout(() => {
            copyIdBtn.textContent = '📋 Copier';
            copyIdBtn.classList.remove('copied');
        }, 2000);
    });
}

// Écouteurs d'événements
connectBtn.addEventListener('click', connectToPeer);
disconnectBtn.addEventListener('click', disconnect);
copyIdBtn.addEventListener('click', copyPeerId);
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

remotePeerIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        connectToPeer();
    }
});

// Empêcher la soumission du formulaire si présent
document.addEventListener('submit', (e) => e.preventDefault());

// Initialisation
initializePeer();
