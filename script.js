const API_BASE = 'https://3de2c14c-f445-4840-95ed-c9d6e3cc36fa-00-1hhu7ldthghwt.pike.replit.dev';

// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function toggleTheme() {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    themeToggle.textContent = body.classList.contains('dark-mode') ? '🌞 Light Mode' : '🌙 Dark Mode';
}

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '🌞 Light Mode';
}

themeToggle.addEventListener('click', toggleTheme);

// Animations
gsap.from('h1', { duration: 1, y: -50, opacity: 0 });
gsap.from('#shareSection', { duration: 1, x: -100, opacity: 0, delay: 0.3 });

// Share Content
document.getElementById('shareBtn').addEventListener('click', async () => {
    const content = document.getElementById('contentInput').value.trim();
    if (!content) return alert('Please enter some text or a link!');

    try {
        const response = await fetch(`${API_BASE}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: content })
        });

        if (!response.ok) throw new Error('Failed to generate code');
        
        const { code } = await response.json();
        
        document.getElementById('shareCode').textContent = code;
        document.getElementById('shareSection').classList.add('hidden');
        document.getElementById('resultSection').classList.remove('hidden');
        
        gsap.from('#shareCode', {
            duration: 0.5,
            scale: 0.5,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
    } catch (error) {
        alert('Error generating code. Please try again.');
    }
});

// Copy Code
document.getElementById('copyBtn').addEventListener('click', () => {
    const code = document.getElementById('shareCode').textContent;
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
});

// Retrieve Content
document.getElementById('retrieveBtn').addEventListener('click', async () => {
    const code = document.getElementById('retrieveInput').value.trim();
    if (!/^\d{4}$/.test(code)) return alert('Please enter a valid 4-digit code!');

    try {
        const response = await fetch(`${API_BASE}/get/${code}`);
        if (!response.ok) throw new Error('Content not found');
        
        const { text } = await response.json();
        showSharedContent(text);
    } catch (error) {
        showSharedContent('Content not found or expired!', true);
    }
});

// Modal Functions
function showSharedContent(content, isError = false) {
    const modal = document.getElementById('contentModal');
    const contentDiv = document.getElementById('sharedContent');
    
    contentDiv.textContent = content;
    contentDiv.classList.toggle('text-red-500', isError);
    modal.style.display = 'block';
    gsap.from(modal, { duration: 0.3, scale: 0.9, opacity: 0 });
}

function closeModal() {
    const modal = document.getElementById('contentModal');
    gsap.to(modal, {
        duration: 0.2,
        scale: 0.9,
        opacity: 0,
        onComplete: () => modal.style.display = 'none'
    });
}

function copySharedContent() {
    const content = document.getElementById('sharedContent').textContent;
    navigator.clipboard.writeText(content);
    alert('Content copied to clipboard!');
}

// Input validation for code
document.getElementById('retrieveInput').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contentModal');
    if (event.target === modal) {
        closeModal();
    }
}
