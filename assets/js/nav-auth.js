document.addEventListener('DOMContentLoaded', () => {
    checkNavAuth();
});

async function checkNavAuth() {
    const userBtn = document.getElementById('user-nav-btn');
    if (!userBtn) return;

    try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
            const data = await res.json();
            if (data.user) {
                // User is logged in
                userBtn.setAttribute('onclick', "window.location.href='profile.html'");
                userBtn.style.borderColor = 'var(--primary-green)';
                userBtn.setAttribute('title', `مرحباً ${data.user.full_name || 'بكم'}`);
                
                // Optional: Change icon to something that says 'Logged In' or shows picture
                if (data.user.avatar_url) {
                    userBtn.innerHTML = `<img src="${data.user.avatar_url}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">`;
                } else {
                    userBtn.innerHTML = `<i class="fas fa-user-check" style="color: var(--primary-green);"></i>`;
                }
            }
        } else {
            // Not logged in, defaults already set in HTML to login.html
            userBtn.setAttribute('onclick', "window.location.href='login.html'");
        }
    } catch (err) {
        console.error('Auth check failed:', err);
    }
}
