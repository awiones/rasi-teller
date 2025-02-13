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

    // Generate positions array
    const positions = generateStarPositions(gridSize);

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < Math.min(numberOfStars, positions.length); i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const position = positions[i];
        
        // Generate shorter star name
        const starName = `${starNames[Math.floor(Math.random() * starNames.length)]}-${(i + 1).toString().padStart(2, '0')}`;
        const starType = starTypes[Math.floor(Math.random() * starTypes.length)];
        
        // Set star positioning and properties
        star.style.left = `${position.x}px`;
        star.style.top = `${position.y}px`;
        star.style.setProperty('--size', `${Math.random() * 3 + 1}px`);
        star.style.setProperty('--initial-opacity', Math.random() * 0.5 + 0.3);
        star.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);
        
        // Set data attributes
        star.setAttribute('data-name', starName);
        star.setAttribute('data-type', starType);
        
        // Add click handler for detailed info
        star.addEventListener('click', (e) => showStarInfo(e, star));
        
        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
}

function generateStarPositions(gridSize) {
    const positions = [];
    const columns = Math.floor(window.innerWidth / gridSize);
    const rows = Math.floor(window.innerHeight / gridSize);
    
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            positions.push({
                x: j * gridSize + (Math.random() * (gridSize - 4)),
                y: i * gridSize + (Math.random() * (gridSize - 4))
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

// Cookie handling functions
function setCookie(name, value, days) {
    try {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
        console.log(`Cookie set: ${name}=${value}`);
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length);
    }
    return null;
}

// Time-related functions
function getTimeUntilTomorrow() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow - now;
}

function updateCountdown() {
    const lastReadingTime = getCookie('lastFortuneTime');
    if (lastReadingTime) {
        const lastReadingDate = new Date(parseInt(lastReadingTime));
        const now = new Date();
        
        // Check if it's a new day
        if (lastReadingDate.getDate() !== now.getDate() || 
            lastReadingDate.getMonth() !== now.getMonth() || 
            lastReadingDate.getFullYear() !== now.getFullYear()) {
            // Clear the cookie and enable the button
            document.cookie = "lastFortuneTime=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.getElementById('countdownDisplay').innerHTML = '';
            document.getElementById('fortuneButton').disabled = false;
            return;
        }

        const timeLeft = getTimeUntilTomorrow();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById('countdownDisplay').innerHTML = 
            `✨ Next reading available in: ${hours}h ${minutes}m ✨`;
        document.getElementById('fortuneButton').disabled = true;
    } else {
        document.getElementById('countdownDisplay').innerHTML = '';
        document.getElementById('fortuneButton').disabled = false;
    }
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

function tellFortune() {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

    if (!day || !month || !year) {
        document.getElementById('errorDisplay').innerHTML = 'Please fill in all birthday fields!';
        return;
    }

    if (!validateDate(day, month, year)) {
        document.getElementById('errorDisplay').innerHTML = 'Please enter a valid date!';
        return;
    }

    const lastReadingTime = getCookie('lastFortuneTime');
    if (lastReadingTime) {
        document.getElementById('errorDisplay').innerHTML = 
            'You can only receive one fortune per day. Please come back tomorrow!';
        return;
    }

    // Show popup scanning animation
    const scanningPopup = document.getElementById('scanningPopup');
    const scanResults = document.getElementById('scanResults');
    const scanStatus = document.getElementById('scanStatus');
    
    scanningPopup.style.display = 'flex';
    document.getElementById('fortuneDisplay').style.display = 'none';
    document.getElementById('errorDisplay').innerHTML = '';

    // Extended scanning animation sequence with more varied messages
    const scanMessages = [
        { text: "🌟 Initializing quantum astrological scanner...", type: "system" },
        { text: "✨ Establishing connection to celestial database...", type: "system" },
        { text: "🌌 Calibrating cosmic resonance frequencies...", type: "system" },
        { text: "🎯 Located birth date signature: ${day}/${month}/${year}", type: "info" },
        { text: "🔮 Analyzing natal chart configurations...", type: "process" },
        { text: "⚡ Processing planetary alignments...", type: "process" },
        { text: "🌙 Calculating lunar phase impact...", type: "process" },
        { text: "💫 Detecting karmic pattern signals...", type: "process" },
        { text: "🌠 Scanning retrograde influences...", type: "process" },
        { text: "⭐ Reading ascendant node positions...", type: "process" },
        { text: "🎭 Evaluating zodiac compatibility...", type: "process" },
        { text: "🌍 Measuring earth element resonance...", type: "process" },
        { text: "🔥 Analyzing fire sign intensities...", type: "process" },
        { text: "💨 Calculating air sign influences...", type: "process" },
        { text: "💧 Processing water sign energies...", type: "process" },
        { text: "⚜️ Cross-referencing ancient prophecies...", type: "analysis" },
        { text: "🧮 Computing astrological algorithms...", type: "analysis" },
        { text: "📊 Synthesizing cosmic data streams...", type: "analysis" },
        { text: "⚖️ Balancing elemental forces...", type: "analysis" },
        { text: "🎪 Mapping celestial house positions...", type: "analysis" },
        { text: "🔍 Fine-tuning prediction accuracy...", type: "final" },
        { text: "✅ Astrological analysis complete!", type: "complete" }
    ];

    // Clear previous results
    scanResults.innerHTML = '';
    let messageCount = 0;

    // Function to add a new scanning message with type-based styling
    const addScanMessage = () => {
        if (messageCount < scanMessages.length) {
            const message = scanMessages[messageCount];
            const div = document.createElement('div');
            div.className = `scan-item scan-${message.type}`;
            
            // Replace any template literals in the message
            const formattedText = message.text.replace('${day}', day)
                                            .replace('${month}', month)
                                            .replace('${year}', year);
            
            div.innerHTML = formattedText;
            scanResults.appendChild(div);
            
            // Update status with current operation
            scanStatus.innerHTML = `<span class="scan-status-${message.type}">${formattedText}</span>`;
            messageCount++;
            
            // Scroll to the bottom
            const scanningBox = div.parentElement;
            scanningBox.scrollTop = scanningBox.scrollHeight;
        }
    };

    // Add initial messages
    for (let i = 0; i < 3; i++) {
        addScanMessage();
    }

    // Add new messages with varying delays
    const messageInterval = setInterval(() => {
        addScanMessage();
        if (messageCount >= scanMessages.length) {
            clearInterval(messageInterval);
        }
    }, 400 + Math.random() * 200); // Random delay between 400-600ms

    // Generate and display fortune after scanning
    setTimeout(() => {
        clearInterval(messageInterval);
        const today = new Date().toISOString().split('T')[0];
        const seed = `${day}-${month}-${year}-${today}`;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash = hash & hash;
        }
        
        const userAge = calculateAge(year);
        const fortuneIndex = getAgeAppropriateFortuneIndex(userAge, hash);
        const fortune = fortunes[fortuneIndex];

        // Check for duplicates in history
        const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
        const isDuplicate = historyData.some(entry => entry.fortune.message === fortune.message);
        
        // If duplicate and we have more fortunes, try to find a unique one
        if (isDuplicate && fortunes.length > 1) {
            let newIndex = (fortuneIndex + 1) % fortunes.length;
            let attempts = 0;
            while (newIndex !== fortuneIndex && attempts < fortunes.length) {
                const newFortune = fortunes[newIndex];
                if (!historyData.some(entry => entry.fortune.message === newFortune.message)) {
                    fortune = newFortune;
                    break;
                }
                newIndex = (newIndex + 1) % fortunes.length;
                attempts++;
            }
        }

        // Create formatted fortune display
        const fortuneHTML = `
            <div class="fortune-content">
                <div class="fortune-message">${fortune.emoji} ${fortune.message}</div>
                <div class="fortune-metadata">
                    <span class="fortune-category">${fortune.category}</span>
                    <span class="fortune-area">${fortune.area}</span>
                </div>
            </div>
        `;

        // Show the fortune
        document.getElementById('fortuneDisplay').style.display = 'block';
        document.getElementById('fortuneDisplay').innerHTML = fortuneHTML;
        scanningPopup.style.display = 'none';

        // Save to history if not duplicate
        if (!isDuplicate) {
            const timestamp = new Date().getTime();
            addFortuneToHistory(fortune, timestamp);  // Pass the complete fortune object
            setCookie('lastFortuneTime', timestamp, 1);
        }

        updateCountdown();

        setTimeout(() => {
            document.getElementById('fortuneDisplay').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }, 10500); // Increased delay to match longer scanning sequence
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
    
    // Create shooting stars at random intervals
    const createRandomShootingStar = () => {
        createShootingStars();
        const nextDelay = Math.random() * 8000 + 2000; // Random delay between 2-10 seconds
        setTimeout(createRandomShootingStar, nextDelay);
    };
    
    setTimeout(createRandomShootingStar, 2000);
    
    // Check every minute for countdown and midnight reset
    setInterval(updateCountdown, 60000);
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
    
    // Only show last 10 entries initially
    const initialEntries = historyData.slice(0, 10);
    initialEntries.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const historyEntry = createHistoryEntry(entry.fortune, date);
        
        // Add divider between entries
        if (index > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.appendChild(divider);
        }
        
        historyContainer.appendChild(historyEntry);
    });

    // Lazy load more entries when scrolling
    if (historyData.length > 10) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMoreHistory(historyData, 10);
                    observer.disconnect();
                }
            });
        });

        const sentinel = document.createElement('div');
        sentinel.className = 'history-sentinel';
        historyContainer.appendChild(sentinel);
        observer.observe(sentinel);
    }
}

function loadMoreHistory(historyData, count) {
    const historyContainer = document.getElementById('fortuneHistoryContainer');
    const currentEntries = historyContainer.getElementsByClassName('fortune-entry').length;
    const newEntries = historyData.slice(currentEntries, currentEntries + count);

    newEntries.forEach((entry, index) => {
        const date = new Date(entry.timestamp);
        const historyEntry = createHistoryEntry(entry.fortune, date);

        // Add divider between entries
        if (currentEntries + index > 0) {
            const divider = document.createElement('div');
            divider.className = 'fortune-divider';
            historyContainer.appendChild(divider);
        }

        historyContainer.appendChild(historyEntry);
    });

    // Re-observe sentinel if there are more entries to load
    if (currentEntries + newEntries.length < historyData.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMoreHistory(historyData, count);
                    observer.disconnect();
                }
            });
        });

        const sentinel = document.createElement('div');
        sentinel.className = 'history-sentinel';
        historyContainer.appendChild(sentinel);
        observer.observe(sentinel);
    }
}
