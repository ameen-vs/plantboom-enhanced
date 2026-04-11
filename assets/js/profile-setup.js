document.addEventListener('DOMContentLoaded', () => {
    loadExistingProfile();
});

async function loadExistingProfile() {
    try {
        const res = await fetch('/api/user/profile');
        if (res.status === 401) {
            // Not authenticated, redirect to login
            window.location.href = 'login.html';
            return;
        }
        if (!res.ok) throw new Error('Failed to fetch profile');

        const { user } = await res.json();
        
        // Pre-fill
        if (user.full_name) document.getElementById('fullName').value = user.full_name;
        if (user.phone) document.getElementById('phone').value = user.phone;
        if (user.city) document.getElementById('city').value = user.city;
        if (user.postal_code) document.getElementById('postalCode').value = user.postal_code;
        if (user.delivery_address) document.getElementById('address').value = user.delivery_address;
        
        if (user.avatar_url) {
            document.getElementById('avatarPreview').src = user.avatar_url;
        } else if (user.full_name) {
            document.getElementById('avatarPreview').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=1a8a5a&color=fff`;
        }

    } catch (err) {
        console.error(err);
    }
}

function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
        // In a real app, you would upload this to Supabase Storage maybe
        // But since an avatar upload logic was optional/complex, we'll just mock local preview.
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarPreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

async function saveProfile(e) {
    e.preventDefault();
    
    const errorEl = document.getElementById('general-error');
    const submitBtn = document.getElementById('submitBtn');
    const btnIcon = document.getElementById('btn-icon');
    
    errorEl.style.display = 'none';
    
    // Toggle Loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'جاري الحفظ... <i class="fas fa-spinner fa-spin"></i>';

    const payload = {
        full_name: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        country: document.getElementById('country').value,
        city: document.getElementById('city').value.trim(),
        postal_code: document.getElementById('postalCode').value.trim(),
        delivery_address: document.getElementById('address').value.trim(),
    };

    try {
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to save profile');

        // Show Success Overlay
        document.getElementById('successOverlay').classList.add('show');
        
        // Redirect after animation
        setTimeout(() => {
            window.location.href = 'index.html'; // Go home or cart
        }, 2000);

    } catch (err) {
        errorEl.textContent = typeof err.message === 'string' ? err.message : 'حدث خطأ غير معروف';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'حفظ وإكمال <i class="fas fa-check-circle"></i>';
    }
}
