let fortunes = [];

const starNames = [
    "Al Ghozali Ramadhan", // Add your name as the first star
    "Sirius", "Canopus", "Rigil Kentaurus", "Arcturus", "Vega", 
    "Capella", "Rigel", "Procyon", "Achernar", "Betelgeuse",
    "Hadar", "Altair", "Acrux", "Aldebaran", "Antares",
    "Spica", "Pollux", "Fomalhaut", "Deneb", "Mimosa"
];

const starTypes = ["White Dwarf", "Red Giant", "Blue Giant", "Yellow Dwarf", "Binary Star"];

// Performance optimizations
const perfOptimizations = {
    debounceTimeout: null,
    throttleTimeout: null,
    cachedFortuneData: null
};

// Debounce function for input handlers
function debounce(func, wait) {
    return (...args) => {
        clearTimeout(perfOptimizations.debounceTimeout);
        perfOptimizations.debounceTimeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Star-related functions
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    starsContainer.innerHTML = '';
    const numberOfStars = 150;
    const gridSize = 50;
    
    // Create info panel if it doesn't exist
    if (!document.querySelector('.star-info')) {
        const infoPanel = document.createElement('div');
        infoPanel.className = 'star-info';
        document.body.appendChild(infoPanel);
    }

    const positions = generateStarPositions(gridSize);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < Math.min(numberOfStars, positions.length); i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const position = positions[i];
        
        // Use percentage-based positioning
        star.style.left = `${position.x}vw`;
        star.style.top = `${position.y}vh`;
        star.style.setProperty('--size', `${Math.random() * 3 + 1}px`);
        star.style.setProperty('--initial-opacity', Math.random() * 0.5 + 0.3);
        star.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);
        
        const starName = `${starNames[Math.floor(Math.random() * starNames.length)]}-${(i + 1).toString().padStart(2, '0')}`;
        const starType = starTypes[Math.floor(Math.random() * starTypes.length)];
        
        star.setAttribute('data-name', starName);
        star.setAttribute('data-type', starType);
        
        star.addEventListener('click', (e) => showStarInfo(e, star));
        
        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
    
    // Add resize handler
    window.addEventListener('resize', debounce(() => {
        // Only recreate stars if window size changes significantly
        if (Math.abs(window.innerWidth - lastWidth) > 100 || 
            Math.abs(window.innerHeight - lastHeight) > 100) {
            lastWidth = window.innerWidth;
            lastHeight = window.innerHeight;
            createStars();
        }
    }, 250));
}

// Add these variables at the top with other constants
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

function generateStarPositions(gridSize) {
    const positions = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const columns = Math.floor(viewportWidth / gridSize);
    const rows = Math.floor(viewportHeight / gridSize);
    
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            const x = (j * gridSize + (Math.random() * (gridSize - 4)));
            const y = (i * gridSize + (Math.random() * (gridSize - 4)));
            
            // Calculate percentage-based positions
            const xPercent = (x / viewportWidth) * 100;
            const yPercent = (y / viewportHeight) * 100;
            
            positions.push({
                x: xPercent,
                y: yPercent
            });
        }
    }
    
    return shuffle(positions);
}

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showStarInfo(event, star) {
    const infoPanel = document.querySelector('.star-info');
    const rect = star.getBoundingClientRect();
    
    // Check for easter egg star
    if (star.getAttribute('data-name').includes('Al Ghozali Ramadhan')) {
        showEasterEggPopup();
        return;
    }
    
    infoPanel.innerHTML = `
        <strong>${star.getAttribute('data-name')}</strong><br>
        Type: ${star.getAttribute('data-type')}<br>
        Position: (${Math.round(rect.left)}, ${Math.round(rect.top)})
    `;
    
    infoPanel.style.display = 'block';
    const x = Math.min(event.clientX, window.innerWidth - infoPanel.offsetWidth - 20);
    const y = Math.min(event.clientY, window.innerHeight - infoPanel.offsetHeight - 20);
    infoPanel.style.left = `${x}px`;
    infoPanel.style.top = `${y}px`;
}

function showEasterEggPopup() {
    const popup = document.createElement('div');
    popup.className = 'easter-egg-popup';
    popup.innerHTML = `
        <div class="easter-egg-content">
            <h3>🌟 You found me! 🌟</h3>
            <p>Hi! I'm Al Ghozali Ramadhan, the creator of this fortune teller.</p>
            <div class="social-links">
                <a href="https://github.com/awiones" target="_blank">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>" alt="GitHub">
                </a>
                <a href="https://instagram.com/oja_tp" target="_blank">
                    <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg>" alt="Instagram">
                </a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Close ✨</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.classList.add('show'), 10);
}

function createShootingStars() {
    const starsContainer = document.getElementById('starsContainer');
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    // Random shooting star properties
    const size = Math.random() * 3 + 2;
    const duration = Math.random() * 2 + 6;
    const topPosition = Math.random() * 30;
    
    shootingStar.style.setProperty('--size', `${size}px`);
    shootingStar.style.setProperty('--duration', `${duration}s`);
    shootingStar.style.top = `${topPosition}%`;
    
    starsContainer.appendChild(shootingStar);

    // Create stardust effect
    const createStardust = setInterval(() => {
        if (!shootingStar.parentElement) {
            clearInterval(createStardust);
            return;
        }
        
        const stardust = document.createElement('div');
        stardust.className = 'stardust';
        stardust.style.left = `${shootingStar.offsetLeft + Math.random() * 100}px`;
        stardust.style.top = `${shootingStar.offsetTop + Math.random() * 10 - 5}px`;
        starsContainer.appendChild(stardust);
        
        setTimeout(() => stardust.remove(), 1000);
    }, 50);

    setTimeout(() => {
        shootingStar.remove();
        clearInterval(createStardust);
    }, duration * 1000);
}

// Date validation functions
function validateDate(day, month, year) {
    const currentYear = new Date().getFullYear();
    
    // Fun validation for unrealistic years
    if (year > currentYear) {
        showFunPopup("What are you? From the future? 🚀", "time-traveler");
        return false;
    }
    
    if (year < 1900) {
        showFunPopup("If you're that old, please take a break! Go to the hospital, not playing with your phone! 👴👵", "ancient-one");
        return false;
    }

    // Regular validation continues...
    if (!day || !month || !year) {
        document.getElementById('errorDisplay').innerHTML = 'Please fill in all birthday fields';
        return false;
    }

    // Check basic ranges
    if (day < 1 || day > 31) {
        document.getElementById('errorDisplay').innerHTML = 'Day must be between 1 and 31';
        return false;
    }
    if (month < 1 || month > 12) {
        document.getElementById('errorDisplay').innerHTML = 'Month must be between 1 and 12';
        return false;
    }
    // More lenient year validation
    if (year < 1900) {
        document.getElementById('errorDisplay').innerHTML = 'Birth year must be 1900 or later';
        return false;
    }
    if (year > new Date().getFullYear()) {
        document.getElementById('errorDisplay').innerHTML = 'Birth year cannot be in the future';
        return false;
    }

    // Check if date actually exists
    const date = new Date(year, month - 1, day);
    const isValid = date.getDate() == day && 
                   date.getMonth() == month - 1 && 
                   date.getFullYear() == year;
    
    if (!isValid) {
        document.getElementById('errorDisplay').innerHTML = 'Please enter a valid date';
    }
    return isValid;
}

function showFunPopup(message, type) {
    const popup = document.createElement('div');
    popup.className = 'fun-popup';
    popup.innerHTML = `
        <div class="fun-popup-content ${type}">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK, my bad! 😅</button>
        </div>
    `;
    document.getElementById('funPopupContainer').appendChild(popup);
    
    // Also show in error display
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.innerHTML = message;
    errorDisplay.style.color = type === 'time-traveler' ? '#00a8ff' : '#ffa500';
    
    // Add some fun animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
                errorDisplay.innerHTML = '';
                errorDisplay.style.color = '#ff6b6b';
            }, 300);
        }
    }, 5000);
}

// Enhanced cookie handling functions
function setCookie(name, value, days) {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        
        // Validate and secure the cookie value
        if (name === 'lastFortuneTime') {
            const now = new Date().getTime();
            if (parseInt(value) > now) {
                console.error('Invalid future timestamp detected');
                value = now.toString();
            }
            
            // Add a hash to prevent tampering
            const hash = CryptoJS.SHA256(value + navigator.userAgent).toString();
            value = `${value}|${hash}`;
        }
        
        // Set cookie with secure flags
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Strict; secure`;
        
        // Always use local storage as backup
        localStorage.setItem(`cookie_backup_${name}`, JSON.stringify({
            value: value,
            expires: date.getTime()
        }));
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
}

function getCookie(name) {
    try {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        
        // Try to get from cookies first
        for(let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                const value = decodeURIComponent(cookie.substring(nameEQ.length));
                
                // Validate hash for lastFortuneTime
                if (name === 'lastFortuneTime') {
                    const [timestamp, hash] = value.split('|');
                    const expectedHash = CryptoJS.SHA256(timestamp + navigator.userAgent).toString();
                    
                    if (hash !== expectedHash) {
                        console.error('Cookie tampering detected');
                        clearCookie(name);
                        return null;
                    }
                    return timestamp;
                }
                return value;
            }
        }
        
        // If cookie not found, try backup
        const backup = localStorage.getItem(`cookie_backup_${name}`);
        if (backup) {
            const data = JSON.parse(backup);
            if (data.expires > Date.now()) {
                // Restore cookie from backup if not expired
                setCookie(name, data.value.split('|')[0], 1);
                return data.value.split('|')[0];
            } else {
                localStorage.removeItem(`cookie_backup_${name}`);
            }
        }
    } catch (error) {
        console.error('Error reading cookie:', error);
    }
    return null;
}

function clearCookie(name) {
    try {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; secure`;
        localStorage.removeItem(`cookie_backup_${name}`);
    } catch (error) {
        console.error('Error clearing cookie:', error);
    }
}

// Add new helper function for cookie management
function checkCookieSupport() {
    try {
        const testKey = '__cookie_test__';
        const testValue = 'test';
        setCookie(testKey, testValue, 1);
        const hasSupport = getCookie(testKey) === testValue;
        clearCookie(testKey);
        return hasSupport;
    } catch (e) {
        return false;
    }
}

// Add these helper functions after the cookie handling functions
function encryptTimestamp(timestamp) {
    try {
        // Add a random salt and combine with timestamp
        const salt = Math.random().toString(36).substring(2, 15);
        const dataToEncrypt = `${salt}:${timestamp}`;
        
        // Create a simple encryption key based on user agent and date
        const browserKey = navigator.userAgent + new Date().toDateString();
        const key = CryptoJS.SHA256(browserKey).toString().substring(0, 32);
        
        // Encrypt the data
        const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
}

function decryptTimestamp(encrypted) {
    try {
        if (!encrypted) return null;
        
        // Recreate the same key used for encryption
        const browserKey = navigator.userAgent + new Date().toDateString();
        const key = CryptoJS.SHA256(browserKey).toString().substring(0, 32);
        
        // Decrypt the data
        const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
        
        // Extract timestamp from salt:timestamp format
        const [, timestamp] = decrypted.split(':');
        
        // Validate the timestamp
        const timestampNum = parseInt(timestamp);
        const now = Date.now();
        
        // Check if timestamp is valid and not in the future
        if (isNaN(timestampNum) || timestampNum > now) {
            return null;
        }
        
        return timestampNum;
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

// Add after cookie handling functions
function saveBirthday(day, month, year) {
    try {
        const birthdayData = { day, month, year };
        localStorage.setItem('userBirthday', JSON.stringify(birthdayData));
    } catch (error) {
        console.error('Error saving birthday:', error);
    }
}

function loadBirthday() {
    try {
        const birthdayData = localStorage.getItem('userBirthday');
        if (birthdayData) {
            return JSON.parse(birthdayData);
        }
    } catch (error) {
        console.error('Error loading birthday:', error);
    }
    return null;
}

function autoFillBirthday() {
    const birthdayData = loadBirthday();
    if (birthdayData) {
        document.getElementById('day').value = birthdayData.day;
        document.getElementById('month').value = birthdayData.month;
        document.getElementById('year').value = birthdayData.year;
    }
}

// Time-related functions
function getTimeUntilTomorrow() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
}

function updateCountdown() {
    const fortuneButton = document.getElementById('fortuneButton');
    const countdownDisplay = document.getElementById('countdownDisplay');
    
    const lastFortuneTime = localStorage.getItem('lastFortuneTime');
    
    if (!lastFortuneTime) {
        fortuneButton.disabled = false;
        countdownDisplay.classList.remove('show');
        return;
    }

    const now = new Date();
    const lastDate = new Date(parseInt(lastFortuneTime));
    
    // If it's a new day, reset everything
    if (now.toDateString() !== lastDate.toDateString()) {
        localStorage.removeItem('lastFortuneTime');
        fortuneButton.disabled = false;
        countdownDisplay.classList.remove('show');
        return;
    }

    // Calculate time until midnight
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeLeft = tomorrow - now;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    countdownDisplay.innerHTML = `
        <span>Next fortune available in:</span><br>
        <strong>${hours}h ${minutes}m ${seconds}s</strong>
    `;
    countdownDisplay.classList.add('show');
    fortuneButton.disabled = true;
}

// Main fortune telling function
function calculateAge(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

function getAgeAppropriateFortuneIndex(userAge, hash) {
    const adultCategories = ['career', 'business', 'work', 'finance', 'investment'];
    
    while (true) {
        const index = Math.abs(hash) % fortunes.length;
        const fortune = fortunes[index];
        
        // If user is under 18, skip adult-oriented fortunes
        if (userAge < 18 && (
            adultCategories.includes(fortune.category) || 
            adultCategories.includes(fortune.area)
        )) {
            hash = (hash + 1) | 0; // Move to next fortune
            continue;
        }
        
        return index;
    }
}

async function tellFortune() {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

    const fortuneButton = document.getElementById('fortuneButton');
    const errorDisplay = document.getElementById('errorDisplay');

    // Check if user already got a fortune today
    const lastFortuneTime = localStorage.getItem('lastFortuneTime');
    if (lastFortuneTime) {
        const lastDate = new Date(parseInt(lastFortuneTime));
        const now = new Date();
        
        if (lastDate.toDateString() === now.toDateString()) {
            errorDisplay.innerHTML = 'You\'ve already received your fortune today! Come back tomorrow!';
            fortuneButton.disabled = true;
            updateCountdown();
            return;
        }
    }

    // Disable the button immediately after clicking
    fortuneButton.disabled = true;

    if (!day || !month || !year) {
        document.getElementById('errorDisplay').innerHTML = 'Please fill in all birthday fields!';

        // Re-enable the button if validation fails
        fortuneButton.disabled = false;
        return;
    }

    if (!validateDate(day, month, year)) {
        // Re-enable the button if validation fails
        fortuneButton.disabled = false;
        return; // validateDate already shows error message
    }

    // Show popup scanning animation
    const scanningPopup = document.getElementById('scanningPopup');
    const scanResults = document.getElementById('scanResults');
    const scanStatus = document.getElementById('scanStatus');
    const fortuneDisplay = document.getElementById('fortuneDisplay');
    
    scanningPopup.style.display = 'flex';
    fortuneDisplay.style.display = 'none';
    document.getElementById('errorDisplay').innerHTML = '';

    // Clear previous results
    scanResults.innerHTML = '';
    let messageCount = 0;

    // Simplified scanning messages for faster display
    const scanMessages = [
        { text: "🌟 Initializing fortune scanner", type: "system" },
        { text: "✨ Analyzing birth date: ${day}/${month}/${year}", type: "info" },
        { text: "🔮 Processing celestial alignments", type: "process" },
        { text: "⭐ Calculating fortune parameters", type: "process" },
        { text: "✅ Analysis complete!", type: "complete" }
    ];

    // Function to add scanning messages
    const addScanMessage = () => {
        if (messageCount < scanMessages.length) {
            const message = scanMessages[messageCount];
            const div = document.createElement('div');
            div.className = `scan-item scan-${message.type}`;
            const formattedText = message.text.replace('${day}', day)
                                            .replace('${month}', month)
                                            .replace('${year}', year);
            div.innerHTML = formattedText;
            scanResults.appendChild(div);
            scanStatus.innerHTML = `<span class="scan-status-${message.type}">${formattedText}</span>`;
            messageCount++;
            scanResults.scrollTop = scanResults.scrollHeight;
        }
    };

    // Add messages with shorter delays
    const messageInterval = setInterval(() => {
        addScanMessage();
        if (messageCount >= scanMessages.length) {
            clearInterval(messageInterval);
            displayFinalFortune();
        }
    }, 600);

    // Function to display the final fortune
    const displayFinalFortune = async () => {
        try {
            if (!fortunes || fortunes.length === 0) {
                await loadFortunes();
            }

            const today = new Date().toISOString().split('T')[0];
            const seed = `${day}-${month}-${year}-${today}-${Date.now()}`; // Add current timestamp for more randomness
            
            // Add random factor to prevent same fortune after reset
            const randomSalt = Math.floor(Math.random() * 1000000);
            
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i);
                hash = hash & hash;
            }
            
            // Combine hash with random salt
            hash = (hash + randomSalt) & hash;

            // Get previous fortune to avoid repetition
            const prevFortune = localStorage.getItem('lastFortuneMessage');
            let fortuneIndex;
            let fortune;
            
            // Keep trying until we get a different fortune
            do {
                fortuneIndex = Math.abs(hash) % fortunes.length;
                fortune = fortunes[fortuneIndex];
                // If same as previous, modify hash and try again
                if (prevFortune === fortune.message) {
                    hash = (hash + 1) | 0;
                }
            } while (prevFortune === fortune.message && fortunes.length > 1);

            // Store this fortune message for future comparison
            localStorage.setItem('lastFortuneMessage', fortune.message);

            // Create fortune display HTML
            const fortuneHTML = `
                <div class="fortune-content">
                    <div class="fortune-message">${fortune.emoji} ${fortune.message}</div>
                    <div class="fortune-metadata">
                        <span class="fortune-category">${fortune.category}</span>
                        <span class="fortune-area">${fortune.area}</span>
                    </div>
                </div>
            `;

            // Hide scanning popup and show fortune
            setTimeout(() => {
                scanningPopup.style.display = 'none';
                fortuneDisplay.style.display = 'block';
                fortuneDisplay.innerHTML = fortuneHTML;

                // Save to history
                const timestamp = new Date().getTime();
                const encryptedTimestamp = encryptTimestamp(timestamp);
                if (encryptedTimestamp) {
                    setCookie('lastFortuneTime', encryptedTimestamp, 1);
                }
                addFortuneToHistory(fortune, timestamp);

                // Update countdown and scroll to fortune
                updateCountdown();
                fortuneDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);

        } catch (error) {
            console.error('Error displaying fortune:', error);
            scanningPopup.style.display = 'none';
            document.getElementById('errorDisplay').innerHTML = 'Unable to generate fortune. Please try again.';
        }
    };

    // After successfully showing fortune, save timestamp and update button state
    const timestamp = new Date().getTime();
    localStorage.setItem('lastFortuneTime', timestamp.toString());
    updateCountdown();
}

// Input handling functions
function updateDayInput() {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    
    const month = parseInt(monthInput.value);
    const year = parseInt(yearInput.value);
    
    if (month && year) {
        const daysInMonth = new Date(year, month, 0).getDate();
        dayInput.max = daysInMonth;
        
        if (parseInt(dayInput.value) > daysInMonth) {
            dayInput.value = daysInMonth;
        }
    }
}

// Add this function to update the current date
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = `(${dateStr})`;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    updateCurrentDate();
    await loadFortunes();
    createStars();
    
    // Add auto-fill on page load
    autoFillBirthday();
    
    // Create shooting stars at random intervals
    const createRandomShootingStar = () => {
        createShootingStars();
        const nextDelay = Math.random() * 8000 + 2000; // Random delay between 2-10 seconds
        setTimeout(createRandomShootingStar, nextDelay);
    };
    
    setTimeout(createRandomShootingStar, 2000);
    
    // Check every minute for countdown and midnight reset
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Input validation setup
    const inputs = ['day', 'month', 'year'];
    inputs.forEach((id, index) => {
        const element = document.getElementById(id);
        
        // Input validation
        element.addEventListener('input', function() {
            let value = this.value;
            
            // Remove non-numeric characters
            value = value.replace(/[^\d]/g, '');
            
            // Only apply max/min constraints to day and month, not year
            if (id !== 'year') {
                const max = parseInt(this.max);
                const min = parseInt(this.min);
                if (parseInt(value) > max) value = max.toString();
                if (parseInt(value) > 0 && parseInt(value) < min) value = min.toString();
            }
            
            this.value = value;

            // Auto-focus next field only for day and month
            if (id !== 'year' && value.length >= 2 && index < inputs.length - 1) {
                document.getElementById(inputs[index + 1]).focus();
            }
        });

        // Blur validation
        element.addEventListener('blur', function() {
            const value = this.value;
            // Only show error for invalid year if user has entered something
            if (id === 'year') {
                if (value && (parseInt(value) < 1900 || parseInt(value) > new Date().getFullYear())) {
                    document.getElementById('errorDisplay').innerHTML = 'Please enter a valid birth year';
                }
            } else if (value && (parseInt(value) < parseInt(this.min) || parseInt(value) > parseInt(this.max))) {
                document.getElementById('errorDisplay').innerHTML = `Please enter a valid ${id}`;
            }
        });

        // Keydown handling
        element.addEventListener('keydown', function(e) {
            // Allow backspace to previous field only if current field is empty
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                document.getElementById(inputs[index - 1]).focus();
            }
            
            // Only allow numbers and navigation keys
            if (!(/^\d$/.test(e.key) || 
                e.key === 'Backspace' || 
                e.key === 'Tab' || 
                e.key === 'Enter' || 
                e.key === 'ArrowLeft' || 
                e.key === 'ArrowRight' || 
                e.key === 'Delete')) {
                e.preventDefault();
            }
        });
    });

    // Date validation events
    document.getElementById('month').addEventListener('change', updateDayInput);
    document.getElementById('year').addEventListener('change', updateDayInput);

    // Button hover effect
    document.getElementById('fortuneButton').addEventListener('mouseover', function() {
        if (!this.disabled) {
            createShootingStars();
        }
    });

    // Load fortune history
    const history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    history.forEach(entry => {
        addFortuneToHistory(entry.fortune, entry.timestamp);
    });

    // Load and display fortune history
    displayFortuneHistory();

    // Command input handler
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !e.target.matches('input')) {
            e.preventDefault();
            showCommandInput();
        } else if (e.key === 'Escape') {
            hideCommandInput();
        }
    });

    // Command input setup
    setupCommandInput();
});

async function loadFortunes() {
    if (perfOptimizations.cachedFortuneData) {
        fortunes = perfOptimizations.cachedFortuneData;
        return;
    }

    try {
        const response = await fetch('fortunes.json');
        const data = await response.json();
        fortunes = data.fortunes;
        perfOptimizations.cachedFortuneData = fortunes;
        console.log(`Loaded ${fortunes.length} fortunes`);
    } catch (error) {
        console.error('Error loading fortunes:', error);
        fortunes = [{
            emoji: "🌟",
            message: "The stars are slightly obscured today. Try again when the cosmic connection is stronger...",
            category: "error",
            area: "system"
        }];
    }
}

function addFortuneToHistory(fortune, timestamp) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const date = new Date(timestamp);
    
    // Get existing history from local storage
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    // Check for duplicates
    if (!historyData.some(entry => entry.fortune.message === fortune.message)) {
        // Add new fortune to history data
        historyData.unshift({ 
            fortune: {
                emoji: fortune.emoji,
                message: fortune.message,
                category: fortune.category,
                area: fortune.area
            }, 
            timestamp 
        });
        
        // Save updated history
        localStorage.setItem('permanentFortuneHistory', JSON.stringify(historyData));
        
        // Create and display the new entry
        const entry = createHistoryEntry(fortune, date);
        
        // Add divider if not first entry
        if (historyContainer.children.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.insertBefore(divider, historyContainer.firstChild);
        }
        
        historyContainer.insertBefore(entry, historyContainer.firstChild);
    }
}

function createHistoryEntry(fortune, date) {
    const entry = document.createElement('div');
    entry.className = 'fortune-entry';
    
    entry.innerHTML = `
        <div class="timestamp">
            ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, 
            ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}
        </div>
        <div class="fortune-content">
            <div class="fortune-message">${fortune.emoji} ${fortune.message}</div>
            <div class="fortune-metadata">
                <span class="fortune-category">${fortune.category}</span>
                <span class="fortune-area">${fortune.area}</span>
            </div>
        </div>
    `;
    
    return entry;
}

function displayFortuneHistory() {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    historyContainer.innerHTML = ''; // Clear current display
    
    // Initially show only 2 entries
    const initialEntries = historyData.slice(0, 2);
    initialEntries.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const historyEntry = createHistoryEntry(entry.fortune, date);
        
        if (index > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.appendChild(divider);
        }
        
        historyContainer.appendChild(historyEntry);
    });

    // Add "Read More" button if there are more entries
    if (historyData.length > 2) {
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'read-more-button';
        readMoreBtn.innerHTML = 'Read More History';
        readMoreBtn.onclick = () => showPaginatedHistory(historyData);
        historyContainer.appendChild(readMoreBtn);
    }
}

function showPaginatedHistory(historyData) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const itemsPerPage = 5;
    let currentPage = 1;
    const totalPages = Math.ceil(historyData.length / itemsPerPage);

    function displayPage(page) {
        historyContainer.innerHTML = '';
        
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, historyData.length);
        
        const pageEntries = historyData.slice(start, end);
        pageEntries.forEach((entry, index) => {
            const date = new Date(entry.timestamp);
            const historyEntry = createHistoryEntry(entry.fortune, date);
            
            if (index > 0) {
                const divider = document.createElement('div');
                divider.className = 'fortune-divider';
                historyContainer.appendChild(divider);
            }
            
            historyContainer.appendChild(historyEntry);
        });

        // Add pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        
        // Previous button
        if (page > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '← Previous';
            prevBtn.onclick = () => displayPage(page - 1);
            paginationControls.appendChild(prevBtn);
        }
        
        // Page indicator
        const pageIndicator = document.createElement('span');
        pageIndicator.className = 'page-indicator';
        pageIndicator.innerHTML = `Page ${page} of ${totalPages}`;
        paginationControls.appendChild(pageIndicator);
        
        // Next button
        if (page < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = 'Next →';
            nextBtn.onclick = () => displayPage(page + 1);
            paginationControls.appendChild(nextBtn);
        }

        // Back to minimal view button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-minimal';
        backBtn.innerHTML = '← Show Less';
        backBtn.onclick = () => displayFortuneHistory();
        
        historyContainer.appendChild(paginationControls);
        historyContainer.appendChild(backBtn);
    }

    displayPage(currentPage);
}

// Command input handler
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.target.matches('input')) {
        e.preventDefault();
        showCommandInput();
    } else if (e.key === 'Escape') {
        hideCommandInput();
    }
});

// Command input setup
setupCommandInput();

async function loadFortunes() {
    if (perfOptimizations.cachedFortuneData) {
        fortunes = perfOptimizations.cachedFortuneData;
        return;
    }

    try {
        const response = await fetch('fortunes.json');
        const data = await response.json();
        fortunes = data.fortunes;
        perfOptimizations.cachedFortuneData = fortunes;
        console.log(`Loaded ${fortunes.length} fortunes`);
    } catch (error) {
        console.error('Error loading fortunes:', error);
        fortunes = [{
            emoji: "🌟",
            message: "The stars are slightly obscured today. Try again when the cosmic connection is stronger...",
            category: "error",
            area: "system"
        }];
    }
}

function addFortuneToHistory(fortune, timestamp) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const date = new Date(timestamp);
    
    // Get existing history from local storage
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    // Check for duplicates
    if (!historyData.some(entry => entry.fortune.message === fortune.message)) {
        // Add new fortune to history data
        historyData.unshift({ 
            fortune: {
                emoji: fortune.emoji,
                message: fortune.message,
                category: fortune.category,
                area: fortune.area
            }, 
            timestamp 
        });
        
        // Save updated history
        localStorage.setItem('permanentFortuneHistory', JSON.stringify(historyData));
        
        // Create and display the new entry
        const entry = createHistoryEntry(fortune, date);
        
        // Add divider if not first entry
        if (historyContainer.children.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.insertBefore(divider, historyContainer.firstChild);
        }
        
        historyContainer.insertBefore(entry, historyContainer.firstChild);
    }
}

function createHistoryEntry(fortune, date) {
    const entry = document.createElement('div');
    entry.className = 'fortune-entry';
    
    entry.innerHTML = `
        <div class="timestamp">
            ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, 
            ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}
        </div>
        <div class="fortune-content">
            <div class="fortune-message">${fortune.emoji} ${fortune.message}</div>
            <div class="fortune-metadata">
                <span class="fortune-category">${fortune.category}</span>
                <span class="fortune-area">${fortune.area}</span>
            </div>
        </div>
    `;
    
    return entry;
}

function displayFortuneHistory() {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    historyContainer.innerHTML = ''; // Clear current display
    
    // Initially show only 2 entries
    const initialEntries = historyData.slice(0, 2);
    initialEntries.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const historyEntry = createHistoryEntry(entry.fortune, date);
        
        if (index > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.appendChild(divider);
        }
        
        historyContainer.appendChild(historyEntry);
    });

    // Add "Read More" button if there are more entries
    if (historyData.length > 2) {
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'read-more-button';
        readMoreBtn.innerHTML = 'Read More History';
        readMoreBtn.onclick = () => showPaginatedHistory(historyData);
        historyContainer.appendChild(readMoreBtn);
    }
}

function showPaginatedHistory(historyData) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const itemsPerPage = 5;
    let currentPage = 1;
    const totalPages = Math.ceil(historyData.length / itemsPerPage);

    function displayPage(page) {
        historyContainer.innerHTML = '';
        
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, historyData.length);
        
        const pageEntries = historyData.slice(start, end);
        pageEntries.forEach((entry, index) => {
            const date = new Date(entry.timestamp);
            const historyEntry = createHistoryEntry(entry.fortune, date);
            
            if (index > 0) {
                const divider = document.createElement('div');
                divider.className = 'fortune-divider';
                historyContainer.appendChild(divider);
            }
            
            historyContainer.appendChild(historyEntry);
        });

        // Add pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        
        // Previous button
        if (page > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '← Previous';
            prevBtn.onclick = () => displayPage(page - 1);
            paginationControls.appendChild(prevBtn);
        }
        
        // Page indicator
        const pageIndicator = document.createElement('span');
        pageIndicator.className = 'page-indicator';
        pageIndicator.innerHTML = `Page ${page} of ${totalPages}`;
        paginationControls.appendChild(pageIndicator);
        
        // Next button
        if (page < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = 'Next →';
            nextBtn.onclick = () => displayPage(page + 1);
            paginationControls.appendChild(nextBtn);
        }

        // Back to minimal view button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-minimal';
        backBtn.innerHTML = '← Show Less';
        backBtn.onclick = () => displayFortuneHistory();
        
        historyContainer.appendChild(paginationControls);
        historyContainer.appendChild(backBtn);
    }

    displayPage(currentPage);
}

// Command input handler
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.target.matches('input')) {
        e.preventDefault();
        showCommandInput();
    } else if (e.key === 'Escape') {
        hideCommandInput();
    }
});

// Command input setup
setupCommandInput();

async function loadFortunes() {
    if (perfOptimizations.cachedFortuneData) {
        fortunes = perfOptimizations.cachedFortuneData;
        return;
    }

    try {
        const response = await fetch('fortunes.json');
        const data = await response.json();
        fortunes = data.fortunes;
        perfOptimizations.cachedFortuneData = fortunes;
        console.log(`Loaded ${fortunes.length} fortunes`);
    } catch (error) {
        console.error('Error loading fortunes:', error);
        fortunes = [{
            emoji: "🌟",
            message: "The stars are slightly obscured today. Try again when the cosmic connection is stronger...",
            category: "error",
            area: "system"
        }];
    }
}

function addFortuneToHistory(fortune, timestamp) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const date = new Date(timestamp);
    
    // Get existing history from local storage
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    // Check for duplicates
    if (!historyData.some(entry => entry.fortune.message === fortune.message)) {
        // Add new fortune to history data
        historyData.unshift({ 
            fortune: {
                emoji: fortune.emoji,
                message: fortune.message,
                category: fortune.category,
                area: fortune.area
            }, 
            timestamp 
        });
        
        // Save updated history
        localStorage.setItem('permanentFortuneHistory', JSON.stringify(historyData));
        
        // Create and display the new entry
        const entry = createHistoryEntry(fortune, date);
        
        // Add divider if not first entry
        if (historyContainer.children.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.insertBefore(divider, historyContainer.firstChild);
        }
        
        historyContainer.insertBefore(entry, historyContainer.firstChild);
    }
}

function createHistoryEntry(fortune, date) {
    const entry = document.createElement('div');
    entry.className = 'fortune-entry';
    
    entry.innerHTML = `
        <div class="timestamp">
            ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, 
            ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}
        </div>
        <div class="fortune-content">
            <div class="fortune-message">${fortune.emoji} ${fortune.message}</div>
            <div class="fortune-metadata">
                <span class="fortune-category">${fortune.category}</span>
                <span class="fortune-area">${fortune.area}</span>
            </div>
        </div>
    `;
    
    return entry;
}

function displayFortuneHistory() {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    historyContainer.innerHTML = ''; // Clear current display
    
    // Initially show only 2 entries
    const initialEntries = historyData.slice(0, 2);
    initialEntries.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const historyEntry = createHistoryEntry(entry.fortune, date);
        
        if (index > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.appendChild(divider);
        }
        
        historyContainer.appendChild(historyEntry);
    });

    // Add "Read More" button if there are more entries
    if (historyData.length > 2) {
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'read-more-button';
        readMoreBtn.innerHTML = 'Read More History';
        readMoreBtn.onclick = () => showPaginatedHistory(historyData);
        historyContainer.appendChild(readMoreBtn);
    }
}

function showPaginatedHistory(historyData) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const itemsPerPage = 5;
    let currentPage = 1;
    const totalPages = Math.ceil(historyData.length / itemsPerPage);

    function displayPage(page) {
        historyContainer.innerHTML = '';
        
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, historyData.length);
        
        const pageEntries = historyData.slice(start, end);
        pageEntries.forEach((entry, index) => {
            const date = new Date(entry.timestamp);
            const historyEntry = createHistoryEntry(entry.fortune, date);
            
            if (index > 0) {
                const divider = document.createElement('div');
                divider.className = 'fortune-divider';
                historyContainer.appendChild(divider);
            }
            
            historyContainer.appendChild(historyEntry);
        });

        // Add pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        
        // Previous button
        if (page > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '← Previous';
            prevBtn.onclick = () => displayPage(page - 1);
            paginationControls.appendChild(prevBtn);
        }
        
        // Page indicator
        const pageIndicator = document.createElement('span');
        pageIndicator.className = 'page-indicator';
        pageIndicator.innerHTML = `Page ${page} of ${totalPages}`;
        paginationControls.appendChild(pageIndicator);
        
        // Next button
        if (page < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = 'Next →';
            nextBtn.onclick = () => displayPage(page + 1);
            paginationControls.appendChild(nextBtn);
        }

        // Back to minimal view button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-minimal';
        backBtn.innerHTML = '← Show Less';
        backBtn.onclick = () => displayFortuneHistory();
        
        historyContainer.appendChild(paginationControls);
        historyContainer.appendChild(backBtn);
    }

    displayPage(currentPage);
}

function showCommandInput() {
    const commandInput = document.getElementById('commandInput');
    const input = commandInput.querySelector('input');
    commandInput.classList.add('show');
    input.value = '/';
    input.focus();
}

function hideCommandInput() {
    const commandInput = document.getElementById('commandInput');
    commandInput.classList.remove('show');
    commandInput.querySelector('input').value = '';
}

const ALLOWED_COMMANDS = {
    '/hide main-section': {
        action: () => toggleMainSection(false),
        description: 'Hides all main content'
    },
    '/show main-section': {
        action: () => toggleMainSection(true),
        description: 'Shows all main content'
    },
    '/help': {
        action: () => showCommandHelp(),
        description: 'Shows available commands'
    }
};

function setupCommandInput() {
    const commandInput = document.getElementById('commandInput');
    const input = commandInput.querySelector('input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideCommandInput();
            return;
        }

        if (e.key === 'Enter') {
            const command = sanitizeCommand(input.value);
            executeCommand(command);
            hideCommandInput();
        }
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!commandInput.contains(e.target) && !e.target.matches('input')) {
            hideCommandInput();
        }
    });
}

function sanitizeCommand(input) {
    // Remove any HTML tags and special characters
    return input.replace(/<[^>]*>?/gm, '')
                .replace(/[^\w\s/-]/g, '')
                .trim()
                .toLowerCase();
}

function executeCommand(command) {
    // Check if command exists in allowed commands
    if (ALLOWED_COMMANDS.hasOwnProperty(command)) {
        ALLOWED_COMMANDS[command].action();
    } else {
        showError(`Unknown command: ${command}. Type /help for available commands.`);
    }
}

function toggleMainSection(show) {
    const elements = [
        document.querySelector('.container'),
        document.querySelector('.fortune-container'),
        document.querySelector('.fortune-history')
    ];

    elements.forEach(el => {
        if (el) {
            if (show) {
                el.classList.remove('hidden-section');
            } else {
                el.classList.add('hidden-section');
            }
        }
    });
}

function showCommandHelp() {
    const helpContent = Object.entries(ALLOWED_COMMANDS)
        .map(([cmd, info]) => `${cmd}: ${info.description}`)
        .join('\n');
    
    showNotification(
        '📝 Available Commands',
        helpContent,
        'command-help'
    );
}

function showError(message) {
    showNotification('❌ Error', message, 'error');
}

function showNotification(title, message, type = 'info') {
    const popup = document.createElement('div');
    popup.className = `notification ${type}`;
    popup.innerHTML = `
        <div class="notification-content">
            <h3>${title}</h3>
            <p>${message.split('\n').join('<br>')}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }, 5000);
}
