document.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
});

async function fetchProfile() {
    try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();
        const user = data.user;

        // Fill UI
        document.getElementById('user-full-name').textContent = user.full_name || 'غير متوفر';
        document.getElementById('user-email').textContent = user.email || 'غير متوفر';
        document.getElementById('user-phone').textContent = user.phone || 'غير متوفر';
        document.getElementById('user-city').textContent = user.city || 'غير متوفر';
        document.getElementById('user-address').textContent = user.delivery_address || 'غير متوفر';
        document.getElementById('user-postal').textContent = user.postal_code || 'غير متوفر';
        
        if (user.avatar_url) {
            document.getElementById('profile-avatar').src = user.avatar_url;
        }

        document.getElementById('profile-content').classList.remove('hidden');
        document.getElementById('profile-loader').classList.add('hidden');

    } catch (err) {
        console.error('Error fetching profile:', err);
    }
}

async function handleLogout() {
    if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) return;

    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = 'index.html';
    } catch (err) {
        alert('حدث خطأ أثناء تسجيل الخروج');
    }
}
