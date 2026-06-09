// Auth Guard
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) window.location.href = 'login.html';

// Populate navbar
document.getElementById('navUserName').textContent = user.name;
document.getElementById('navUserEmail').textContent = user.email;
document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();

// Show role badge & correct nav
const role = user.role || 'Traveler';
document.getElementById('roleBadge').textContent = role;
document.getElementById('navTraveler').style.display = role === 'Traveler' ? '' : 'none';
document.getElementById('navAgent').style.display    = role === 'Agent'    ? '' : 'none';
document.getElementById('navAdmin').style.display    = role === 'Admin'    ? '' : 'none';

// Signout
document.getElementById('signoutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});

// Active link & iframe navigation
const frame = document.getElementById('dashFrame');
const links = document.querySelectorAll('.sidebar-nav a');

// Restore last page
const lastPage = sessionStorage.getItem('dashPage');
if (lastPage) {
    frame.src = 'dashboard/' + lastPage + '.html';
    links.forEach(a => {
        a.classList.toggle('active', a.dataset.page === lastPage);
    });
}

links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        frame.src = link.href;
        sessionStorage.setItem('dashPage', page);
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        if (window.innerWidth < 992) closeSidebar();
    });
});

// Mobile sidebar toggle
const sidebar = document.getElementById('dashSidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);

// Pass user to iframe pages via postMessage when frame loads
frame.addEventListener('load', () => {
    try {
        frame.contentWindow.postMessage({ type: 'DASH_USER', user }, '*');
    } catch(e) {}
});
