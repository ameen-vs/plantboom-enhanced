document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initOtpInputs();
    initGoogleAuth();
});

// --- State ---
let isSignupMode = false;
let currentPhone = '';
let timerInterval = null;

// --- Tab Switching ---
function initTabs() {
    const tabs = document.querySelectorAll('.segment-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            e.target.classList.add('active');

            // Hide all views
            document.querySelectorAll('.auth-view').forEach(view => {
                view.classList.add('hidden');
            });

            // Show target view
            const targetId = e.target.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
}

// --- Email Auth Logic ---
function toggleSignupMode() {
    isSignupMode = !isSignupMode;
    const nameGroup = document.getElementById('name-group');
    const submitBtn = document.getElementById('btn-email-submit');
    const toggleText = document.getElementById('email-toggle-text');
    const forgotLink = document.getElementById('forgot-password-link');

    if (isSignupMode) {
        nameGroup.style.display = 'block';
        submitBtn.textContent = 'إنشاء حساب جديد';
        toggleText.innerHTML = 'لديك حساب بالفعل؟ <a href="javascript:void(0)" onclick="toggleSignupMode()">تسجيل الدخول</a>';
        forgotLink.style.display = 'none';
        document.getElementById('email-name').required = true;
    } else {
        nameGroup.style.display = 'none';
        submitBtn.textContent = 'تسجيل الدخول';
        toggleText.innerHTML = 'ليس لديك حساب؟ <a href="javascript:void(0)" onclick="toggleSignupMode()">إنشاء حساب جديد</a>';
        forgotLink.style.display = 'inline';
        document.getElementById('email-name').required = false;
    }
}

function togglePasswordVisibility() {
    const pwdInput = document.getElementById('email-password');
    const icon = document.getElementById('toggle-password');
    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        pwdInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

async function handleEmailAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('email-password').value;
    const errorEl = document.getElementById('general-error');
    errorEl.classList.add('hidden');

    const endpoint = isSignupMode ? '/api/auth/register' : '/api/auth/login';
    const payload = { email, password };

    if (isSignupMode) {
        payload.fullName = document.getElementById('email-name').value;
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Authentication failed');
        }

        // Success - Handle redirect
        handleLoginSuccess(data.user);
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
    }
}

// --- Phone Auth Logic ---
function validatePhone(phone) {
    const clean = phone.replace(/[\s\-\+]/g, '');
    return clean.length >= 8;
}

async function sendOTP(method) {
    const phoneInput = document.getElementById('phone-input').value;
    const errorEl = document.getElementById('phone-error');
    errorEl.style.display = 'none';

    if (!validatePhone(phoneInput)) {
        errorEl.style.display = 'block';
        return;
    }

    // Standardize phone
    currentPhone = '+212' + phoneInput.replace(/^0+/, ''); // remove leading 0 if user enters 06...

    try {
        // Toggle buttons to loading state (optional UI improvement)
        const res = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: currentPhone, method })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

        // Show step 2
        document.getElementById('phone-step-1').classList.add('hidden');
        document.getElementById('phone-step-2').classList.remove('hidden');
        document.getElementById('display-phone').textContent = currentPhone;

        startTimer();

        // Focus first OTP input
        setTimeout(() => document.querySelector('.otp-input').focus(), 100);

    } catch (err) {
        const genErr = document.getElementById('general-error');
        genErr.textContent = err.message;
        genErr.classList.remove('hidden');
    }
}

function resetPhoneStep() {
    document.getElementById('phone-step-2').classList.add('hidden');
    document.getElementById('phone-step-1').classList.remove('hidden');
    clearInterval(timerInterval);
    // clear otp inputs
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
}

async function verifyOTP() {
    const inputs = document.querySelectorAll('.otp-input');
    let code = '';
    inputs.forEach(input => code += input.value);

    if (code.length !== 6) return; // Wait until fully typed

    try {
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: currentPhone, code })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid OTP code');

        handleLoginSuccess(data.user);
    } catch (err) {
        const genErr = document.getElementById('general-error');
        genErr.textContent = err.message;
        genErr.classList.remove('hidden');
    }
}

function initOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // allow only numbers
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            // Auto submit if last input filled
            if (index === inputs.length - 1 && e.target.value) {
                verifyOTP();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            if (!pastedData) return;

            for (let i = 0; i < inputs.length; i++) {
                if (i >= index && pastedData[i - index]) {
                    inputs[i].value = pastedData[i - index];
                    if (i < inputs.length - 1) inputs[i + 1].focus();
                }
            }
            if (pastedData.length === 6) verifyOTP();
        });
    });
}

function startTimer() {
    let timeLeft = 60;
    const timerSpan = document.getElementById('timer');
    const countdownText = document.getElementById('countdown-text');
    const resendBtn = document.getElementById('resend-btn');

    countdownText.classList.remove('hidden');
    resendBtn.classList.add('hidden');
    resendBtn.classList.add('disabled');

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            countdownText.classList.add('hidden');
            resendBtn.classList.remove('hidden');
            resendBtn.classList.remove('disabled');
        }
    }, 1000);
}

// --- Google Auth Logic ---
function initGoogleAuth() {
    // Note: To make this robust, the Client ID should come from environment / backend config endpoint.
    // Assuming standard injection here based on typical GSI.
    // If process.env.GOOGLE_CLIENT_ID isn't exposed to frontend easily, we often inject it.
    // Since this is static HTML, we create the element manually or expect it to be handled via backend template.
    // For now, we will render the standard Google Identity button.

    // We will simulate the google.accounts.id initialization
    window.onload = function () {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: "607464268087-bve1bjv1c3oo2c75bph762b231iu4gfu.apps.googleusercontent.com", // Will be replaced in real env
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("google-btn-wrapper"),
                { theme: "outline", size: "large", width: "100%" }  // customization attributes
            );
        }
    };
}

async function handleCredentialResponse(response) {
    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.credential })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Google Auth Failed');

        handleLoginSuccess(data.user);
    } catch (err) {
        const errorEl = document.getElementById('general-error');
        errorEl.textContent = err.message;
        errorEl.classList.remove('hidden');
    }
}

// --- Success Handler ---
function handleLoginSuccess(user) {
    // If the user hasn't set up your profile fully, or is new
    // We redirect to profile-setup, otherwise index or cart
    // Currently, let's redirect to profile setup so they can fill details.

    // Simplistic routing logic:
    if (!user.full_name || !user.city) {
        window.location.href = 'profile-setup.html';
    } else {
        window.location.href = 'index.html'; // or cart based on referer
    }
}
