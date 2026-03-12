// js/app.js

// Configuration Supabase
const SUPABASE_URL = 'https://ylrseemuvxogyopwqrnr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscnNlZW11dnhvZ3lvcHdycW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDA1MzIsImV4cCI6MjA4ODExNjUzMn0.Bc1yhbVNbLGU_bMQBjecXe0Is-WtZMWXALcW-oWYkPA';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// État global
let currentUser = null;
let allPosts = [];
let allContributions = [];
let isLoginMode = true;

// Éléments DOM
const mainContent = document.getElementById('main-content');
const authModal = document.getElementById('auth-modal');
const createModal = document.getElementById('create-project-modal');
const loginIcon = document.getElementById('login-icon');
const userIcon = document.getElementById('user-icon');
const userDropdown = document.getElementById('user-dropdown');
const logoutLink = document.getElementById('logout-link');
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const authToggle = document.getElementById('auth-toggle');
const authSubmit = document.getElementById('auth-submit');
const authForm = document.getElementById('auth-form');
const authMessage = document.getElementById('auth-message');
const createForm = document.getElementById('create-project-form');
const createMessage = document.getElementById('create-message');
const closeAuth = document.getElementById('close-auth-modal');
const closeCreate = document.getElementById('close-create-modal');
const bottomNavIcons = document.querySelectorAll('.bottom-nav i');
const navLinks = document.querySelectorAll('.nav-links a');

// ===== INITIALISATION =====
async function init() {
    await checkUser();
    loadData();
    setupRealtime();
    setupEventListeners();
    renderHomePage();
}

// Vérifier session
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    updateUIForUser();
}

function updateUIForUser() {
    if (currentUser) {
        loginIcon.classList.add('hidden');
        userIcon.classList.remove('hidden');
    } else {
        loginIcon.classList.remove('hidden');
        userIcon.classList.add('hidden');
        userDropdown.classList.add('hidden');
    }
}

// ===== CHARGEMENT DES DONNÉES =====
async function loadData() {
    // Projets
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) console.error(error);
    else allPosts = posts;

    // Contributions
    const { data: contribs } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });
    if (contribs) allContributions = contribs;

    // Calculer totaux par projet
    allPosts = allPosts.map(post => {
        const postContribs = allContributions.filter(c => c.post_id === post.id);
        const total = postContribs.reduce((acc, c) => acc + parseFloat(c.amount), 0);
        return { ...post, total, contributors: postContribs };
    });
}

// ===== REALTIME =====
function setupRealtime() {
    supabase
        .channel('public:contributions')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contributions' }, payload => {
            const newContrib = payload.new;
            allContributions.unshift(newContrib);
            // Mise à jour du ticker, des top donateurs, et de la page courante
            updateTicker();
            updateTopDonors();
            if (document.querySelector('.feed')) {
                renderFeed(); // rafraîchir le feed si on est sur l'accueil
            }
            showNotification(newContrib);
        })
        .subscribe();
}

function showNotification(contrib) {
    const project = allPosts.find(p => p.id === contrib.post_id);
    if (!project) return;
    const name = contrib.contributor_name || 'Anonyme';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-gift"></i> <span>${name} a soutenu ${project.title} avec ${contrib.amount}€</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== RENDU ACCUEIL =====
function renderHomePage() {
    const storiesHtml = renderStories();
    const tickerHtml = renderTicker();
    const topDonorsHtml = renderTopDonors();
    const feedHtml = renderFeed();

    mainContent.innerHTML = `
        <div class="stories-section">
            <div class="stories-container">${storiesHtml}</div>
        </div>
        <div class="live-ticker">
            <div class="ticker-content">${tickerHtml}</div>
        </div>
        <div class="top-donors-mobile">${topDonorsHtml.mobile}</div>
        <div class="main-layout">
            <div class="feed">${feedHtml}</div>
            <aside class="sidebar-right">
                <div class="top-donors-desktop">
                    <div class="top-donors-title">🏆 TOP DONATEURS</div>
                    ${topDonorsHtml.desktop}
                </div>
            </aside>
        </div>
    `;

    // Attacher événements sur les cartes et boutons
    document.querySelectorAll('.feed-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('support-btn')) return;
            const postId = card.dataset.id;
            showProjectPage(postId);
        });
    });

    document.querySelectorAll('.support-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const postId = btn.closest('.feed-card').dataset.id;
            // Ouvrir modal de don ou rediriger vers page projet avec formulaire
            alert('Fonctionnalité de don à implémenter avec PayPal');
        });
    });
}

function renderStories() {
    return allPosts.slice(0, 8).map(post => {
        const progress = post.target_amount ? Math.min((post.total / post.target_amount) * 100, 100) : 0;
        return `
            <div class="story" data-id="${post.id}">
                <div class="story-avatar">
                    <div class="story-avatar-inner">${post.title.charAt(0)}</div>
                </div>
                <div class="story-progress">${Math.round(progress)}%</div>
                <div class="story-title">${post.title}</div>
            </div>
        `;
    }).join('');
}

function renderTicker() {
    const recent = allContributions.slice(0, 20);
    // On duplique pour l'animation
    return recent.map(c => {
        const name = c.contributor_name || 'Anonyme';
        return `<span class="ticker-item"><i class="fas fa-bolt"></i> ${name} • ${c.amount}€</span>`;
    }).join('') + recent.map(c => {
        const name = c.contributor_name || 'Anonyme';
        return `<span class="ticker-item"><i class="fas fa-bolt"></i> ${name} • ${c.amount}€</span>`;
    }).join('');
}

function renderTopDonors() {
    // Calculer totaux par contributeur
    const totals = {};
    allContributions.forEach(c => {
        const name = c.contributor_name || 'Anonyme';
        totals[name] = (totals[name] || 0) + parseFloat(c.amount);
    });
    const sorted = Object.entries(totals)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    const desktop = sorted.map((d, i) => `
        <div class="donor-item">
            <span class="donor-rank">${i+1}</span>
            <span class="donor-name">${d.name}</span>
            <span class="donor-amount">${d.total.toFixed(0)}€</span>
            ${i === 0 ? '<i class="fas fa-crown crown"></i>' : ''}
        </div>
    `).join('');

    const mobile = sorted.slice(0, 5).map((d, i) => `
        <div class="donor-card">
            <span class="donor-rank">#${i+1}</span>
            <span class="donor-name">${d.name}</span>
            <span class="donor-amount">${d.total.toFixed(0)}€</span>
            ${i === 0 ? '<i class="fas fa-crown crown"></i>' : ''}
        </div>
    `).join('');

    return { desktop, mobile };
}

function renderFeed() {
    return allPosts.map(post => {
        const progress = post.target_amount ? Math.min((post.total / post.target_amount) * 100, 100) : 0;
        const daysLeft = post.created_at ? Math.max(0, 30 - Math.floor((new Date() - new Date(post.created_at)) / (1000*3600*24))) : '∞';
        const donorsCount = allContributions.filter(c => c.post_id === post.id).length;
        return `
            <div class="feed-card" data-id="${post.id}">
                <div class="card-media">
                    <div class="card-media-inner">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                <div class="card-overlay">
                    <div class="card-header">
                        <span class="card-title">${post.title}</span>
                        <span class="card-creator"><i class="fas fa-user"></i> @créateur</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="card-stats">
                        <span class="donors-count"><i class="fas fa-heart"></i> ${donorsCount} donateurs</span>
                        <span class="time-left"><i class="fas fa-hourglass-half"></i> ${daysLeft} jours</span>
                    </div>
                    <div class="card-stats">
                        <span>${post.total.toFixed(0)}€ / ${post.target_amount}€</span>
                    </div>
                    <button class="support-btn"><i class="fas fa-hand-holding-heart"></i> SOUTENIR</button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== PAGE PROJET =====
function showProjectPage(postId) {
    const post = allPosts.find(p => p.id == postId);
    if (!post) return;

    const projectContribs = allContributions.filter(c => c.post_id == postId);
    const progress = post.target_amount ? (post.total / post.target_amount) * 100 : 0;
    const daysLeft = post.created_at ? Math.max(0, 30 - Math.floor((new Date() - new Date(post.created_at)) / (1000*3600*24))) : '∞';

    const donorsList = projectContribs.slice(0, 10).map(c => `
        <div class="donor-item">
            <span class="donor-name">${c.contributor_name || 'Anonyme'}</span>
            <span class="donor-amount">${c.amount}€</span>
        </div>
    `).join('');

    mainContent.innerHTML = `
        <div class="project-page">
            <div class="project-header">
                <i class="fas fa-arrow-left" id="back-home"></i>
                <h2>${post.title}</h2>
            </div>
            <div class="project-cover">
                <div class="card-media-inner"><i class="fas fa-image"></i></div>
            </div>
            <div class="project-info">
                <h1 class="project-title">${post.title}</h1>
                <div class="project-creator">Par @créateur</div>

                <div class="progress-bar" style="margin:20px 0;">
                    <div class="progress-fill" style="width:${progress}%"></div>
                </div>
                <div class="card-stats">
                    <span><i class="fas fa-heart"></i> ${projectContribs.length} donateurs</span>
                    <span><i class="fas fa-hourglass-half"></i> ${daysLeft} jours</span>
                </div>
                <div class="card-stats">
                    <span>${post.total.toFixed(0)}€ / ${post.target_amount}€</span>
                </div>

                <div class="project-section">
                    <div class="section-title">Description</div>
                    <p class="project-description">${post.description || 'Aucune description'}</p>
                </div>

                <div class="project-section">
                    <div class="section-title">Derniers donateurs</div>
                    ${donorsList || '<p>Aucun don pour le moment</p>'}
                </div>

                <button class="support-btn"><i class="fas fa-hand-holding-heart"></i> SOUTENIR CE PROJET</button>
            </div>
        </div>
    `;

    document.getElementById('back-home').addEventListener('click', () => {
        renderHomePage();
    });
}

// ===== AUTH =====
loginIcon.addEventListener('click', () => {
    authModal.classList.remove('hidden');
    isLoginMode = true;
    document.getElementById('auth-modal-title').textContent = 'Connexion';
    authSubmit.textContent = 'Se connecter';
    authMessage.textContent = '';
});

userIcon.addEventListener('click', () => {
    userDropdown.classList.toggle('hidden');
});

logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    currentUser = null;
    updateUIForUser();
    renderHomePage();
});

closeAuth.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

authToggle.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        document.getElementById('auth-modal-title').textContent = 'Connexion';
        authSubmit.textContent = 'Se connecter';
    } else {
        document.getElementById('auth-modal-title').textContent = 'Inscription';
        authSubmit.textContent = 'S\'inscrire';
    }
    authMessage.textContent = '';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    let result;
    if (isLoginMode) {
        result = await supabase.auth.signInWithPassword({ email, password });
    } else {
        result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
        authMessage.textContent = result.error.message;
        authMessage.style.color = 'var(--danger)';
    } else {
        if (isLoginMode) {
            currentUser = result.data.user;
            authModal.classList.add('hidden');
            updateUIForUser();
            renderHomePage();
        } else {
            authMessage.textContent = 'Inscription réussie ! Vérifiez votre email.';
            authMessage.style.color = 'var(--success)';
        }
    }
});

// ===== CRÉATION PROJET =====
document.querySelectorAll('[data-page="create"]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentUser) {
            authModal.classList.remove('hidden');
            return;
        }
        createModal.classList.remove('hidden');
    });
});

closeCreate.addEventListener('click', () => {
    createModal.classList.add('hidden');
});

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;
    const target = parseFloat(document.getElementById('project-target').value);
    const paypal = document.getElementById('project-paypal').value;

    const { error } = await supabase.from('posts').insert([
        {
            user_id: currentUser.id,
            title,
            description,
            target_amount: target,
            paypal_email: paypal,
        }
    ]);

    if (error) {
        createMessage.textContent = error.message;
        createMessage.style.color = 'var(--danger)';
    } else {
        createMessage.textContent = 'Projet créé avec succès !';
        createMessage.style.color = 'var(--success)';
        setTimeout(() => {
            createModal.classList.add('hidden');
            loadData().then(() => renderHomePage());
        }, 1500);
    }
});

// ===== RECHERCHE =====
searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle('expanded');
    if (searchInput.classList.contains('expanded')) searchInput.focus();
});

searchInput.addEventListener('input', () => {
    // Filtrage à implémenter
});

// ===== NAVIGATION =====
bottomNavIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        bottomNavIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        const page = icon.dataset.page;
        if (page === 'home') renderHomePage();
        else if (page === 'create') {
            if (!currentUser) authModal.classList.remove('hidden');
            else createModal.classList.remove('hidden');
        }
        // Autres pages...
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const page = link.dataset.page;
        if (page === 'home') renderHomePage();
        else if (page === 'create') {
            if (!currentUser) authModal.classList.remove('hidden');
            else createModal.classList.remove('hidden');
        }
    });
});

// Démarrer
init();

