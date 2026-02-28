document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('jwt');

    if (username && token) {
        renderProfileHeader(username);
    }
});

function renderProfileHeader(username) {
    const header = document.createElement('div');
    header.id = 'user-profile-widget';
    header.style = `
        position: absolute; top: 20px; right: 20px;
        display: flex; align-items: center; cursor: pointer;
        padding: 10px; border-radius: 30px; z-index: 1000;
    `;
    header.className = 'glass-panel';
    
    // Using the avatar we saved or a default
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
    
    header.innerHTML = `
        <span style="margin-right: 15px; font-weight: bold;">${username.toUpperCase()}</span>
        <img src="${avatarUrl}" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--neon-blue);">
        <div id="profile-dropdown" class="glass-panel" style="display: none; position: absolute; top: 60px; right: 0; width: 200px; padding: 20px; text-align: left;">
            <p style="font-size: 0.8em; color: var(--neon-pink);">RANK: NOVICE</p>
            <hr style="border: 0.5px solid rgba(255,255,255,0.1);">
            <p>Levels: <span id="stat-levels">0</span></p>
            <p>Total Moves: <span id="stat-moves">0</span></p>
            <button class="btn-neon" style="font-size: 0.7em; width: 100%;" onclick="logout()">LOGOUT</button>
        </div>
    `;

    header.onclick = () => {
        const dropdown = document.getElementById('profile-dropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    };

    document.body.appendChild(header);
}

function logout() {
    localStorage.clear();
    location.href = '/login';
}