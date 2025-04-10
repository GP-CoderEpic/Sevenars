// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Store the user's preference in localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.style.transform = 'rotate(180deg)'; // Rotate for dark mode
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.style.transform = 'rotate(0deg)'; // Rotate for light mode
    }
});

// Check for the user's saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.style.transform = 'rotate(180deg)'; // Set initial rotation
} else {
    themeIcon.style.transform = 'rotate(0deg)'; // Set initial rotation
}

// Routing (Updated for Dynamic Nav Buttons)
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);

        navLinks.forEach(navLink => navLink.classList.remove('active'));
        pageContents.forEach(content => {
            content.classList.remove('active');
        });

        link.classList.add('active');
        document.getElementById(targetId).classList.add('active');
    });
});

// Set initial active nav button
function setActiveNav(targetId) {
    navLinks.forEach(link => {
        if (link.getAttribute('href').substring(1) === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set initial active nav button to home page
setActiveNav('home');

// User Data (Local Storage Simulation)
let userData = JSON.parse(localStorage.getItem('userData')) || {
    username: null,
    loggedIn: false
};

function updateUI() {
    if (userData.loggedIn) {
        document.querySelector('.log-out-btn').style.display = 'block';
        document.querySelector('.nav-link[href="#login"]').style.display = 'none';
    } else {
        document.querySelector('.log-out-btn').style.display = 'none';
        document.querySelector('.nav-link[href="#login"]').style.display = 'block';
    }
}

updateUI();

// Login Functionality (Placeholder)
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Simulate login (replace with actual login logic)
    userData.username = username;
    userData.loggedIn = true;
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUI();

    document.getElementById('login-status').textContent = 'Logged in successfully!';
    document.getElementById('home').classList.add('active');
    document.getElementById('login').classList.remove('active');
}

// Logout Functionality
function logout() {
    userData.username = null;
    userData.loggedIn = false;
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUI();
    document.getElementById('home').classList.remove('active');
    document.getElementById('login').classList.add('active');
}

// Encrypt File Functionality (Placeholder)
function encryptFile() {
    const file = document.getElementById('encrypt-file').files[0];
    const password = document.getElementById('encrypt-password').value;
    const progressBar = document.getElementById('encrypt-progress');
    const fileSizeDisplay = document.getElementById('encrypt-file-size');

    if (file) {
        fileSizeDisplay.textContent = `File Size: ${file.size} bytes`;
    }

    // Simulate encryption progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('encrypt-status').textContent = 'File encrypted!';
            addUploadRecord(file.name, 'Encrypted');
        }
    }, 200);
}

// Decrypt File Functionality (Updated for Link Input)
function decryptFile() {
    const encryptedFileLink = document.getElementById('decrypt-link').value;
    const password = document.getElementById('decrypt-password').value;
    const progressBar = document.getElementById('decrypt-progress');

    if (encryptedFileLink) {
        console.log(`Attempting to decrypt file from: ${encryptedFileLink}`);
        // In a real application, you would:
        // 1. Send the encryptedFileLink and password to your backend.
        // 2. Your backend would retrieve the encrypted file from the cloud storage.
        // 3. Your backend would perform the decryption.
        // 4. Your backend would send the decrypted file back to the user (or handle it as needed).

        // For this frontend simulation, we'll just simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                document.getElementById('decrypt-status').textContent = 'File decrypted (simulated)!';
                // In a real scenario, you might trigger a download here.
                const fileName = getFileNameFromLink(encryptedFileLink); // Try to extract a name
                addUploadRecord(fileName || 'File from Link', 'Decrypted');
            }
        }, 200);
    } else {
        document.getElementById('decrypt-status').textContent = 'Please provide a link to the encrypted file.';
    }
}

// Helper function to try and extract filename from a link
function getFileNameFromLink(link) {
    const parts = link.split('/');
    return parts[parts.length - 1];
}

// Upload History (Placeholder)
function addUploadRecord(fileName, status) {
    const table = document.getElementById('upload-history-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.textContent = fileName;
    cell2.textContent = new Date().toLocaleString();
    cell3.textContent = status;
}

// Welcome Alert
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        alert('Welcome to our File Encryption Service!');
    }, 2000); // 2000 milliseconds = 2 seconds
});




// BACKEND CONNECTION
async function encryptFile() {
    const fileInput = document.getElementById('encrypt-file');
    const passwordInput = document.getElementById('encrypt-text'); // Text input field
    const status = document.getElementById('encrypt-status');

    const file = fileInput.files[0];
    const text = passwordInput.value;

    // Check if file or text is provided
    if (!file && !text) {
        status.textContent = "❗ Please select a file or enter text.";
        return;
    }

    const formData = new FormData();

    // If file exists, append it
    if (file) {
        formData.append("file", file);
    }

    // If text is entered, append it too
    if (text) {
        formData.append("text", text);
    }

    try {
        const response = await fetch("http://localhost:3000/encrypt", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Encryption failed.");

        // 🧠 Decide how to display result based on whether file was uploaded
        if (file) {
            const blob = await response.blob();
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = "encrypted_file.aes";
            downloadLink.click();
            status.textContent = "✅ File encrypted and downloaded!";
        } else {
            const data = await response.json();
            status.textContent = `✅ Encrypted Text:\n${data.encrypted}`;
        }
    } catch (err) {
        console.error(err);
        status.textContent = "❌ Encryption failed.";
    }
}
