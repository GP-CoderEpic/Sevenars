// ========== Theme Toggle ==========
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)';
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.style.transform = 'rotate(180deg)';
} else {
    themeIcon.style.transform = 'rotate(0deg)';
}

// ========== Navigation ==========
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');

function setActiveNav(targetId) {
    navLinks.forEach(link => {
        const id = link.getAttribute('href').substring(1);
        link.classList.toggle('active', id === targetId);
    });
    pageContents.forEach(page => {
        page.classList.toggle('active', page.id === targetId);
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        setActiveNav(targetId);
    });
});

setActiveNav('home');

// ========== User Login/Logout ==========
let userData = JSON.parse(localStorage.getItem('userData')) || {
    username: null,
    loggedIn: false
};

function updateUI() {
    const logoutBtn = document.getElementById("logout-btn");
    const loginLink = document.querySelector('a[href="#login"]');

    if (userData && userData.loggedIn) {
        logoutBtn.style.display = "inline-block";
        loginLink.style.display = "none";
    } else {
        logoutBtn.style.display = "none";
        loginLink.style.display = "inline-block";
    }
}


async function login() {
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const status = document.getElementById('login-status');

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        userData = { username: email, loggedIn: true };
        localStorage.setItem('userData', JSON.stringify(userData));
        updateUI();

        // localStorage.setItem("token", data.token);  // optional for protected routes
        status.textContent = "✅ Logged in successfully!";
        if (userData.loggedIn) {
            setActiveNav('home');
        }
    } catch (err) {
        status.textContent = err.message || "❌ Login failed";
    }
}


// signup page
async function signup() {
    const fullName = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const status = document.getElementById('signup-status');

    try {
        const res = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        status.textContent = data.message;
        setTimeout(() => showLogin(), 2000);
    } catch (err) {
        status.textContent = err.message || "❌ Signup failed";
    }
}



function showLogin() {
    document.querySelector('.login-container').style.display = 'block';
    document.querySelector('.signup-container').style.display = 'none';
}

function showSignup() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.signup-container').style.display = 'block';
}

function logout() {
    userData = { username: null, loggedIn: false };
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUI();
    setActiveNav('login');
}

updateUI();

// ========== Encrypt File/Text ==========
// function encryptFile() {
//     const file = document.getElementById('encrypt-file').files[0];
//     const password = document.getElementById('encrypt-password')?.value || "defaultkey";
//     const progressBar = document.getElementById('encrypt-progress');
//     const fileSizeDisplay = document.getElementById('encrypt-file-size');

//     if (fileSizeDisplay && file) {
//         fileSizeDisplay.textContent = File Size: ${file.size} bytes;
//     }

//     let progress = 0;
//     const interval = setInterval(() => {
//         progress += 10;
//         if (progressBar) progressBar.style.width = ${progress}%;
//         if (progress >= 100) {
//             clearInterval(interval);
//             document.getElementById('encrypt-status').textContent = '✅ File encrypted!';
//             addUploadRecord(file.name, 'Encrypted');
//         }
//     }, 200);
// }

// ========== Upload History ==========
function addUploadRecord(fileName, status) {
    const table = document.getElementById('upload-history-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = fileName;
    newRow.insertCell(1).textContent = new Date().toLocaleString();
    newRow.insertCell(2).textContent = status;
}

// ========== Welcome Message ==========
// window.addEventListener('load', () => {
//     setTimeout(() => {
//         alert('👋 Welcome to our File Encryption Service!');
//     }, 1500);
// });

// ========== Optional: Decryption Animation Fix ==========
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.decrypt-animation');
    if (title) {
        title.setAttribute('data-text', 'Blockchain Encryption');
    }
});




// BACKEND CONNECTION
async function encryptFile() {
    const warningEl = document.getElementById("encrypt-warning");
    warningEl.textContent = ""; // Clear previous warning

    if (!userData || !userData.loggedIn) {
        warningEl.textContent = "Please log in to use the encryption service.";
        return;
    }
    const fileInput = document.getElementById('encrypt-file');
    const passwordInput = document.getElementById('encrypt-text'); // Text input field
    const status = document.getElementById('encrypt-status');

    const file = fileInput.files[0];
    const text = passwordInput.value;

    if (!file && !text) {
        status.textContent = "❗ Please select a file or enter text.";
        return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("text", text);

    try {
        const response = await fetch("http://localhost:3000/hash", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Encryption failed");

        const data = await response.json();

        if (data.type === "file") {
            const fileBlob = new Blob([data.encrypted], { type: "text/plain" });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(fileBlob);
            downloadLink.download = "encrypted_file.aes";
            downloadLink.click();
            status.textContent = `✅ File encrypted!\nSecret Key: ${data.secretKey}`;
        } else if (data.type === "text") {
            status.textContent = `✅ Text hashed!\nHash: ${data.hash}\nSecret Key: ${data.secretKey}`;
        }

        // ✅ Add upload record after encryption
        addUploadRecord(file?.name || 'Text Input', 'Encrypted');

    } catch (err) {
        console.error(err);
        status.textContent = "❌ Encryption failed.";
    }
}



async function decryptFile() {
    const warningEl = document.getElementById("decrypt-warning");
    warningEl.textContent = ""; // Clear previous warning

    if (!userData || !userData.loggedIn) {
        warningEl.textContent = "Please log in to use the decryption service.";
        return;
    }
    const linkInput = document.getElementById('decrypt-link');
    const keyInput = document.getElementById('decrypt-key');
    const status = document.getElementById('decrypt-status');

    const encryptedHex = linkInput.value.trim();
    const secretKey = keyInput.value.trim();

    if (!encryptedHex || !secretKey) {
        status.textContent = "❗ Please provide both encrypted text and secret key.";
        return;
    }

    try {
        status.textContent = "🔄 Decrypting...";

        const res = await fetch("http://localhost:3000/decrypt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                encrypted: encryptedHex,
                secretKey: secretKey
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "❌ Decryption failed");

        // Show or download decrypted content
        const blob = new Blob([data.decrypted], { type: "text/plain" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "decrypted_file.txt";
        downloadLink.click();

        status.textContent = "✅ File decrypted and downloaded!";
    } catch (err) {
        console.error(err);
        status.textContent = "❌ Decryption failed.";
    }
}

updateUI();