document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Hide loading indicator when everything is ready
    Promise.all([
        // Wait for initial rendering
        new Promise(resolve => setTimeout(resolve, 500)),
        // Add other async operations here if needed
    ]).then(() => {
        loadingIndicator.style.display = 'none';
    });
    
    // Load fortune history from localStorage
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    
    createBackgroundStars();
    createConstellations(historyData);
    initializeZoomAndPan();
    startLineUpdates(); // Add this line
    initializeMobileSupport();
    performanceOptimizations.init(); // Add this line
});

const starConnections = new Map();

function createBackgroundStars() {
    const starsContainer = document.getElementById('starsContainer');
    const isMobile = window.innerWidth <= 768;
    const numberOfStars = isMobile ? 50 : 100; // Fewer stars on mobile
    const starSize = isMobile ? 1 : 2; // Smaller stars on mobile
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'background-star'; // Changed from 'fortune-star' to 'background-star'
        star.style.width = `${starSize}px`;
        star.style.height = `${starSize}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.3 + 0.2; // Reduced opacity range
        starsContainer.appendChild(star);
    }
}

function createConstellations(historyData) {
    // Clear console for debugging
    console.clear();
    console.log(`Creating constellation with ${historyData.length} stars`);
    
    const container = document.getElementById('constellationContainer');
    const stars = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Get pattern configuration
    const pattern = getGeometricPattern(historyData.length);

    // For Star of David, we need to create two triangles
    const isStarOfDavid = historyData.length === 6;
    const sortedHistory = [...historyData].sort((a, b) => b.timestamp - a.timestamp);
    const latestFortune = sortedHistory[0];
    
    historyData.forEach((fortune, index) => {
        let position;
        if (isStarOfDavid) {
            // Calculate position for Star of David
            const isUpperTriangle = index < 3;
            const triangleIndex = isUpperTriangle ? index : index - 3;
            const baseAngle = (2 * Math.PI) / 3; // 120 degrees for triangles
            const startAngle = isUpperTriangle ? 0 : Math.PI / 3; // Rotate second triangle by 60 degrees
            const angle = startAngle + (triangleIndex * baseAngle);
            
            // Use different radii for upper and lower triangles
            const radius = pattern.radius * (isUpperTriangle ? 1 : 0.8);
            
            position = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        } else {
            position = calculateStarPosition(index, pattern, centerX, centerY);
        }
        
        // Create and style the star
        const star = document.createElement('div');
        star.className = 'fortune-star';
        star.setAttribute('data-category', `${fortune.fortune.category} • ${fortune.fortune.area}`);
        
        const hue = getHueForCategory(fortune.fortune.category);
        star.style.width = '8px';
        star.style.height = '8px';
        star.style.left = `${position.x}px`;
        star.style.top = `${position.y}px`;
        star.style.backgroundColor = `hsla(${hue}, 80%, 75%, 0.9)`;
        star.style.boxShadow = `0 0 ${10 + (pattern.complexity * 5)}px hsla(${hue}, 80%, 75%, 0.5)`;
        
        star.addEventListener('click', () => showFortuneDetails(fortune, star));
        container.appendChild(star);
        
        stars.push({
            element: star,
            x: position.x,
            y: position.y,
            category: fortune.fortune.category,
            isUpperTriangle: isStarOfDavid ? (index < 3) : false
        });

        if (fortune.timestamp === latestFortune.timestamp) {
            createLatestIndicator(star);
        }
    });

    // Create connections for Star of David or other patterns
    if (stars.length === 6) {
        createStarOfDavidConnections(stars, pattern.complexity);
    } else {
        createComplexConnections(stars, pattern);
    }
}

// Add new function for Star of David connections
function createStarOfDavidConnections(stars, complexity) {
    const container = document.getElementById('constellationContainer');
    
    // Connect upper triangle
    for (let i = 0; i < 3; i++) {
        const nextIndex = (i + 1) % 3;
        createEnhancedLine(
            stars[i],
            stars[nextIndex],
            stars[i].category === stars[nextIndex].category,
            complexity
        );
    }
    
    // Connect lower triangle
    for (let i = 3; i < 6; i++) {
        const nextIndex = ((i + 1 - 3) % 3) + 3;
        createEnhancedLine(
            stars[i],
            stars[nextIndex],
            stars[i].category === stars[nextIndex].category,
            complexity
        );
    }
}

function getGeometricPattern(starCount) {
    const baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.2; // 20% of screen size
    
    if (starCount === 6) {
        return {
            type: 'hexagram',
            angle: Math.PI / 3, // 60 degrees
            radius: baseRadius,
            complexity: 2.5,
            vertices: 6,
            innerRadius: baseRadius * 0.8, // For the inner triangle
            skipVertices: 1
        };
    }
    
    switch (starCount) {
        case 5:
            return {
                type: 'pentagram',
                angle: (2 * Math.PI) / 5,
                radius: baseRadius,
                complexity: 2,
                vertices: 5,
                innerRadius: baseRadius * 0.382, // Golden ratio for perfect pentagram
                skipVertices: 2 // Connect every 2nd vertex for pentagram
            };
        case 6:
            return {
                type: 'hexagram',
                angle: (2 * Math.PI) / 6,
                radius: baseRadius,
                complexity: 2.5,
                vertices: 6,
                innerRadius: baseRadius * 0.577, // For perfect hexagram (tan(30°))
                skipVertices: 2 // Creates Star of David pattern
            };
        case 7:
            return {
                type: 'heptagram',
                angle: (2 * Math.PI) / 7,
                radius: baseRadius,
                complexity: 3,
                vertices: 7,
                innerRadius: baseRadius * 0.692,
                skipVertices: 2 // Creates {7/2} heptagram
            };
        case 8:
            return {
                type: 'octagram',
                angle: (2 * Math.PI) / 8,
                radius: baseRadius,
                complexity: 3.5,
                vertices: 8,
                innerRadius: baseRadius * 0.707, // For perfect octagram (1/√2)
                skipVertices: 3 // Creates {8/3} octagram
            };
        default:
            if (starCount < 5) {
                return {
                    type: 'polygon',
                    angle: (2 * Math.PI) / starCount,
                    radius: baseRadius * 0.8,
                    complexity: 1.5,
                    vertices: starCount,
                    skipVertices: 1 // Regular polygon
                };
            } else {
                return {
                    type: 'spiral',
                    angle: Math.PI * 0.618033988749895, // Golden angle
                    radius: baseRadius * 0.3,
                    complexity: Math.min(starCount / 10, 5),
                    vertices: starCount,
                    spiralTightness: 15
                };
            }
    }
}

function calculateStarPosition(index, pattern, centerX, centerY) {
    let position;
    const padding = 100;
    
    switch (pattern.type) {
        case 'pentagram':
        case 'hexagram':
        case 'heptagram':
        case 'octagram': {
            // Calculate both inner and outer points
            const isOuter = index % 2 === 0;
            const radius = isOuter ? pattern.radius : pattern.innerRadius;
            const vertexCount = pattern.vertices * 2; // Double for inner points
            const baseAngle = (2 * Math.PI) / vertexCount;
            // Offset inner points
            const angle = (index * baseAngle) + (isOuter ? 0 : baseAngle);
            
            position = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
            break;
        }
        
        case 'polygon': {
            // Regular polygon
            const angle = index * pattern.angle;
            position = {
                x: centerX + pattern.radius * Math.cos(angle),
                y: centerY + pattern.radius * Math.sin(angle)
            };
            break;
        }
        
        case 'spiral': {
            // Fibonacci spiral with golden angle
            const t = index * pattern.angle;
            const r = pattern.radius + (index * pattern.spiralTightness);
            position = {
                x: centerX + r * Math.cos(t),
                y: centerY + r * Math.sin(t)
            };
            break;
        }
    }
    
    // Ensure position is within bounds
    return {
        x: Math.max(padding, Math.min(window.innerWidth - padding, position.x)),
        y: Math.max(padding, Math.min(window.innerHeight - padding, position.y))
    };
}

function findAvailableGridPosition(gridCells, gridSize, maxWidth, maxHeight) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        // Start from center and spiral outward
        const angle = attempts * Math.PI * 0.618033988749895;
        const radius = Math.sqrt(attempts) * gridSize;
        
        const x = (maxWidth / 2) + (Math.cos(angle) * radius);
        const y = (maxHeight / 2) + (Math.sin(angle) * radius);
        
        // Check if position is valid
        if (x >= 0 && x <= maxWidth && y >= 0 && y <= maxHeight) {
            const cellKey = getCellKey(x, y, gridSize);
            if (!gridCells.includes(cellKey)) {
                return { x, y };
            }
        }
        attempts++;
    }
    
    // Fallback to random position if no space found
    return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight
    };
}

function getCellKey(x, y, gridSize) {
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);
    return `${gridX},${gridY}`;
}

function markGridOccupied(gridCells, x, y, gridSize) {
    const key = getCellKey(x, y, gridSize);
    if (!gridCells.includes(key)) {
        gridCells.push(key);
        
        // Mark adjacent cells as occupied too for better spacing
        const adjacentOffsets = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
        adjacentOffsets.forEach(([offsetX, offsetY]) => {
            const adjacentX = x + (offsetX * gridSize);
            const adjacentY = y + (offsetY * gridSize);
            const adjacentKey = getCellKey(adjacentX, adjacentY, gridSize);
            if (!gridCells.includes(adjacentKey)) {
                gridCells.push(adjacentKey);
            }
        });
    }
}

function createComplexConnections(stars, pattern) {
    const container = document.getElementById('constellationContainer');

    switch (pattern.type) {
        case 'pentagram':
        case 'hexagram':
        case 'heptagram':
        case 'octagram': {
            // Create perfect star pattern
            const vertexCount = pattern.vertices;
            for (let i = 0; i < stars.length; i++) {
                // Connect to vertices based on skip pattern
                const nextIndex = (i + pattern.skipVertices) % stars.length;
                createEnhancedLine(
                    stars[i],
                    stars[nextIndex],
                    stars[i].category === stars[nextIndex].category,
                    pattern.complexity
                );
            }
            
            // Add optional circumference connections
            if (pattern.type === 'hexagram') {
                // Add outer hexagon connections
                for (let i = 0; i < stars.length; i += 2) {
                    const nextOuterIndex = (i + 2) % stars.length;
                    createEnhancedLine(
                        stars[i],
                        stars[nextOuterIndex],
                        true,
                        pattern.complexity * 0.7
                    );
                }
            }
            break;
        }
        
        default:
            // Use existing connection logic for other patterns
            const maxConnections = Math.floor(5 + (pattern.complexity * 2));
    
            stars.forEach((star) => {
                const connections = findOptimalConnections(star, stars, maxConnections);
                connections.forEach(target => {
                    if (Math.random() < 0.8) {
                        const line = createEnhancedLine(star, target, 
                            star.category === target.category,
                            pattern.complexity);
                        
                        // Store line references with correct initial position
                        star.element.connectedLines = star.element.connectedLines || [];
                        target.element.connectedLines = target.element.connectedLines || [];
                        
                        star.element.connectedLines.push({
                            line: line,
                            isStart: true,
                            target: target.element
                        });
                        
                        target.element.connectedLines.push({
                            line: line,
                            isStart: false,
                            target: star.element
                        });
                    }
                });
            });
            break;
    }
}

function findOptimalConnections(source, stars, maxConnections) {
    const minDistance = 100; // Minimum distance between connected stars
    const maxDistance = 300; // Maximum distance for connections
    
    return stars
        .filter(target => {
            // Filter out stars that are too close or too far
            const distance = Math.hypot(target.x - source.x, target.y - source.y);
            return target !== source && 
                   distance >= minDistance && 
                   distance <= maxDistance;
        })
        .map(target => ({
            target,
            distance: Math.hypot(target.x - source.x, target.y - source.y),
            categoryMatch: target.category === source.category,
            angle: Math.atan2(target.y - source.y, target.x - source.x)
        }))
        .sort((a, b) => {
            // Prioritize connections that form good angles and match categories
            const angleScore = Math.abs(Math.PI/2 - Math.abs(a.angle)) - 
                             Math.abs(Math.PI/2 - Math.abs(b.angle));
            const categoryScore = (b.categoryMatch - a.categoryMatch) * 2;
            const distanceScore = (a.distance - b.distance) * 0.01;
            
            return categoryScore + angleScore + distanceScore;
        })
        .slice(0, maxConnections)
        .map(conn => conn.target);
}

function createEnhancedLine(star1, star2, isSameCategory, complexity) {
    const container = document.getElementById('constellationContainer');
    
    // Calculate exact positions accounting for star sizes
    const star1Size = parseInt(star1.element.style.width);
    const star2Size = parseInt(star2.element.style.width);
    
    const star1Center = {
        x: star1.x + (star1Size / 2),
        y: star1.y + (star1Size / 2)
    };
    
    const star2Center = {
        x: star2.x + (star2Size / 2),
        y: star2.y + (star2Size / 2)
    };
    
    // Calculate line properties
    const dx = star2Center.x - star1Center.x;
    const dy = star2Center.y - star1Center.y;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    
    // Create main line
    const line = document.createElement('div');
    line.className = 'constellation-line';
    container.appendChild(line); // Move this up to ensure the line is added to DOM

    // Store star references
    line.star1 = star1.element;
    line.star2 = star2.element;

    // Update initial position
    updateLinePosition(line);

    // Add update method to line
    line.updatePosition = () => updateLinePosition(line);

    // Check if either star is a warning category
    const isWarningConnection = star1.category === 'warning' || star2.category === 'warning';
    
    if (isWarningConnection) {
        // Warning styling for the line
        const baseOpacity = 0.6;
        line.style.background = `
            linear-gradient(
                90deg, 
                rgba(255, 0, 0, ${baseOpacity}) 0%,
                rgba(255, 50, 50, ${baseOpacity * 1.2}) 50%,
                rgba(255, 0, 0, ${baseOpacity}) 100%
            )
        `;
        
        // Create simple arrow marker
        const arrow = document.createElement('div');
        arrow.className = 'warning-arrow';
        arrow.style.animation = 'arrowPulse 1.5s infinite';
        line.appendChild(arrow);
        
        // Store arrow reference
        line.warningArrow = arrow;

        // Update arrow position without rotation to keep it horizontal
        const originalUpdate = line.updatePosition;
        line.updatePosition = () => {
            originalUpdate.call(line);
            if (line.warningArrow) {
                // No rotation needed, arrow will stay horizontal
                line.warningArrow.style.transform = 'none';
            }
        };
    } else if (isSameCategory) {
        // Regular matching category styling
        const hue = getHueForCategory(star1.category);
        const baseOpacity = 0.3 + (Math.random() * 0.2);
        const gradientAngle = Math.random() * 360;
        
        line.style.background = `
            linear-gradient(
                ${gradientAngle}deg, 
                hsla(${hue}, 70%, 60%, ${baseOpacity}) 0%,
                hsla(${hue}, 70%, 70%, ${baseOpacity * 1.2}) 50%,
                hsla(${hue}, 70%, 60%, ${baseOpacity}) 100%
            )
        `;
        
        const glowIntensity = 4 + (complexity * 2);
        line.style.boxShadow = `
            0 0 ${glowIntensity}px 0 hsla(${hue}, 70%, 60%, 0.3),
            0 0 ${glowIntensity * 2}px 0 hsla(${hue}, 70%, 60%, 0.1)
        `;
    } else {
        // Non-matching category styling remains the same
        line.style.background = `
            linear-gradient(
                90deg,
                rgba(255,255,255,0.1),
                rgba(255,255,255,0.2) 50%,
                rgba(255,255,255,0.1)
            )
        `;
    }

    return line;
}

function updateLinePosition(line) {
    if (!line.star1 || !line.star2) return;

    const container = line.parentElement;
    const containerTransform = getComputedStyle(container).transform;
    const matrix = new DOMMatrix(containerTransform);
    const scale = matrix.a;  // Get current scale from transform matrix

    requestAnimationFrame(() => {
        const star1Rect = line.star1.getBoundingClientRect();
        const star2Rect = line.star2.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate positions relative to container and account for scale
        const x1 = (star1Rect.left + star1Rect.width/2 - containerRect.left) / scale;
        const y1 = (star1Rect.top + star1Rect.height/2 - containerRect.top) / scale;
        const x2 = (star2Rect.left + star2Rect.width/2 - containerRect.left) / scale;
        const y2 = (star2Rect.top + star2Rect.height/2 - containerRect.top) / scale;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        // Set line position and dimensions
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}rad) translateZ(0)`;
    });
}

function getHueForCategory(category) {
    // Map categories to different hues
    const categoryHues = {
        success: 120,    // Green
        warning: 30,     // Orange
        love: 330,       // Pink
        career: 200,     // Blue
        finance: 60,     // Yellow
        health: 280,     // Purple
        general: 180     // Cyan
    };
    return categoryHues[category] || 180; // Default to cyan if category not found
}

function showFortuneDetails(fortune, starElement) {
    const popup = document.getElementById('fortunePopup');
    const details = document.getElementById('fortuneDetails');
    const date = new Date(fortune.timestamp);
    
    // Remove active class from all stars
    document.querySelectorAll('.fortune-star').forEach(star => star.classList.remove('active'));
    starElement.classList.add('active');
    
    details.innerHTML = `
        <div class="fortune-content">
            <div class="fortune-message">
                <div class="fortune-emoji">${fortune.fortune.emoji}</div>
                ${fortune.fortune.message}
            </div>
            <div class="fortune-meta">
                <div class="meta-item">
                    <div class="meta-label">Category</div>
                    <div class="meta-value">${fortune.fortune.category}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Area</div>
                    <div class="meta-value">${fortune.fortune.area}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Received</div>
                    <div class="meta-value">${date.toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Time</div>
                    <div class="meta-value">${date.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                </div>
            </div>
        </div>
    `;

    // Show popup with animation
    popup.style.display = 'flex';
    const content = popup.querySelector('.popup-content');
    
    // Reset and trigger animation
    content.style.animation = 'none';
    content.offsetHeight;
    content.style.animation = null;

    // Handle touch events for mobile
    let startY = 0;
    let currentY = 0;

    function handleTouchStart(e) {
        if (window.innerWidth > 768) return;
        startY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (window.innerWidth > 768) return;
        const touch = e.touches[0];
        const deltaY = touch.clientY - startY;
        
        if (content.scrollTop <= 0 && deltaY > 0) {
            e.preventDefault();
        }
    }

    content.addEventListener('touchstart', handleTouchStart);
    content.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Close handlers
    const cleanup = () => {
        popup.style.display = 'none';
        starElement.classList.remove('active');
        content.removeEventListener('touchstart', handleTouchStart);
        content.removeEventListener('touchmove', handleTouchMove);
    };

    popup.querySelector('.close-popup').onclick = cleanup;
    popup.onclick = (e) => {
        if (e.target === popup) cleanup();
    };

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cleanup();
    }, { once: true });
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('constellationContainer');
    const indicator = container.querySelector('.latest-indicator');
    
    // Clean up old indicator
    if (indicator && indicator.cleanup) {
        indicator.cleanup();
    }
    if (indicator) {
        indicator.remove();
    }
    
    container.innerHTML = '';
    const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
    createConstellations(historyData);
    updateAllLines();
});

function initializeZoomAndPan() {
    const container = document.getElementById('constellationContainer');
    const initialScale = 1;
    const targetScale = 0.8; // Slightly zoomed out for better view
    const initialPointX = -window.innerWidth * 0.25;
    const initialPointY = -window.innerHeight * 0.25;

    let scale = targetScale;
    let panning = false;
    let pointX = initialPointX;
    let pointY = initialPointY;
    let startX = 0;
    let startY = 0;
    let lastScale = scale;

    // Initialize with proper center view
    centerView(false);

    // Improved zoom with cursor-based zooming
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.0007; // Reduced zoom speed
        const newScale = Math.min(Math.max(scale * (1 + delta), 0.3), 5); // Extended zoom range
        
        // Get mouse position relative to the page
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        
        // Get container bounds
        const containerRect = container.getBoundingClientRect();
        
        // Get cursor position relative to container in scaled coordinates
        const containerX = (mouseX - containerRect.left) / scale;
        const containerY = (mouseY - containerRect.top) / scale;
        
        // Calculate new position to zoom towards cursor
        if (Math.abs(newScale - scale) > 0.01) {
            // Calculate position adjustment
            pointX = mouseX - (containerX * newScale);
            pointY = mouseY - (containerY * newScale);
            
            scale = newScale;
            lastScale = scale;
            
            // Batch updates in a single animation frame
            cancelAnimationFrame(zoomAnimationFrame);
            zoomAnimationFrame = requestAnimationFrame(() => {
                updateTransform();
                updateAllLinesWithScale(scale);
            });
        }
    });

    // Add this variable at the top of initializeZoomAndPan
    let zoomAnimationFrame;

    // Enhanced pan with inertia
    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        panning = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        lastX = e.clientX;
        lastY = e.clientY;
        container.style.cursor = 'grabbing';
        stopInertia();
    });

    document.addEventListener('mousemove', (e) => {
        if (panning) {
            e.preventDefault();
            const currentTime = Date.now();
            const dt = (currentTime - lastTime) || 1;
            
            pointX = e.clientX - startX;
            pointY = e.clientY - startY;
            
            // Calculate velocity
            velocityX = (e.clientX - lastX) / dt;
            velocityY = (e.clientY - lastY) / dt;
            
            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = currentTime;
            
            updateTransform();
            updateLineVisibility();
        }
    });

    document.addEventListener('mouseup', () => {
        if (panning) {
            panning = false;
            container.style.cursor = 'grab';
            startInertia();
        }
    });

    let inertiaFrame;
    function startInertia() {
        const friction = 0.95;
        const animate = () => {
            if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) {
                pointX += velocityX * 16; // Assuming 60fps (16ms)
                pointY += velocityY * 16;
                velocityX *= friction;
                velocityY *= friction;
                
                updateTransform();
                updateLineVisibility();
                inertiaFrame = requestAnimationFrame(animate);
            }
        };
        animate();
    }

    function stopInertia() {
        if (inertiaFrame) {
            cancelAnimationFrame(inertiaFrame);
        }
        velocityX = 0;
        velocityY = 0;
    }

    function updateTransform() {
        // Add boundary limits
        const maxPan = 1000 * scale;
        pointX = Math.min(Math.max(pointX, -maxPan), maxPan);
        pointY = Math.min(Math.max(pointY, -maxPan), maxPan);
        
        container.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${pointX}, ${pointY})`;
        container.dataset.currentScale = scale; // Store current scale
        
        // Batch update all elements that need to respond to scale changes
        requestAnimationFrame(() => {
            const indicator = container.querySelector('.latest-indicator');
            if (indicator && indicator.targetStar) {
                updateLatestIndicator(indicator, indicator.targetStar);
            }
            updateLineVisibility();
        });
    }

    function updateLineVisibility() {
        const lines = document.querySelectorAll('.constellation-line');
        const viewportRect = container.parentElement.getBoundingClientRect();
        const margin = 100; // Add margin to prevent early disappearance
        
        lines.forEach(line => {
            const lineRect = line.getBoundingClientRect();
            const isVisible = !(
                lineRect.right < viewportRect.left - margin || 
                lineRect.left > viewportRect.right + margin || 
                lineRect.bottom < viewportRect.top - margin || 
                lineRect.top > viewportRect.bottom + margin
            );
            
            if (isVisible) {
                line.style.opacity = '1';
                line.style.display = 'block';
            } else {
                line.style.opacity = '0';
                line.style.display = 'none';
            }
        });
    }

    function centerView(animate = true) {
        // Calculate the bounding box of all stars
        const stars = document.querySelectorAll('.constellation-container .fortune-star');
        if (!stars.length) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const x = parseFloat(star.style.left);
            const y = parseFloat(star.style.top);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });

        // Calculate center and required scale
        const patternWidth = maxX - minX;
        const patternHeight = maxY - minY;
        const patternCenterX = minX + patternWidth / 2;
        const patternCenterY = minY + patternHeight / 2;

        // Calculate required scale to fit pattern with padding
        const padding = 100; // pixels of padding around pattern
        const scaleX = (window.innerWidth - padding * 2) / patternWidth;
        const scaleY = (window.innerHeight - padding * 2) / patternHeight;
        const newScale = Math.min(Math.min(scaleX, scaleY), 1.2); // Cap at 1.2x zoom

        // Calculate target position to center the pattern
        const targetX = (window.innerWidth / 2) - (patternCenterX * newScale);
        const targetY = (window.innerHeight / 2) - (patternCenterY * newScale);

        if (animate) {
            animateToPosition(targetX, targetY, newScale);
        } else {
            scale = newScale;
            pointX = targetX;
            pointY = targetY;
            updateTransform();
            updateAllLinesWithScale(scale);
        }
    }

    function animateToPosition(targetX, targetY, targetScale) {
        const startX = pointX;
        const startY = pointY;
        const startScale = scale;
        const startTime = performance.now();
        const duration = 1000; // 1 second animation

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function animateFrame(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);

            scale = startScale + (targetScale - startScale) * easeProgress;
            pointX = startX + (targetX - startX) * easeProgress;
            pointY = startY + (targetY - startY) * easeProgress;

            updateTransform();
            updateAllLinesWithScale(scale);

            if (progress < 1) {
                requestAnimationFrame(animateFrame);
            }
        }

        requestAnimationFrame(animateFrame);
    }

    // Add event listener for the center button
    const centerButton = document.getElementById('centerButton');
    if (centerButton) {
        centerButton.addEventListener('click', () => centerView(true));
    }

    // Add keyboard shortcut for centering (Space key)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            centerView(true);
        }
    });

    // Add keydown listener for additional shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.code === 'Space' || e.code === 'KeyC') && !e.target.matches('input, textarea')) {
            e.preventDefault();
            centerView(true);
        }
    });

    // Add double-click to center on point
    container.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const targetScale = scale * 1.5; // Zoom in a bit
        const targetX = pointX - (mouseX * (targetScale / scale - 1));
        const targetY = pointY - (mouseY * (targetScale / scale - 1));
        
        animateToPosition(targetX, targetY, targetScale);
    });

    // Add touch support
    let lastTouchDistance = 0;
    let initialTouchDistance = 0;
    let isMultiTouch = false;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            isMultiTouch = true;
            initialTouchDistance = getTouchDistance(e.touches);
            lastTouchDistance = initialTouchDistance;
        } else if (e.touches.length === 1) {
            isMultiTouch = false;
            panning = true;
            startX = e.touches[0].clientX - pointX;
            startY = e.touches[0].clientY - pointY;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (isMultiTouch && e.touches.length === 2) {
            const touchDistance = getTouchDistance(e.touches);
            const delta = touchDistance - lastTouchDistance;
            const zoomDelta = delta * 0.005; // Adjust zoom sensitivity
            
            const newScale = Math.min(Math.max(scale * (1 + zoomDelta), 0.3), 5);
            
            // Calculate zoom center point
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            
            if (Math.abs(newScale - scale) > 0.01) {
                pointX = centerX - (centerX - pointX) * (newScale / scale);
                pointY = centerY - (centerY - pointY) * (newScale / scale);
                scale = newScale;
                
                updateTransform();
                updateAllLinesWithScale(scale);
            }
            
            lastTouchDistance = touchDistance;
        } else if (panning && e.touches.length === 1) {
            pointX = e.touches[0].clientX - startX;
            pointY = e.touches[0].clientY - startY;
            
            updateTransform();
            updateLineVisibility();
        }
    }, { passive: true });

    container.addEventListener('touchend', () => {
        panning = false;
        isMultiTouch = false;
    }, { passive: true });

    function getTouchDistance(touches) {
        return Math.hypot(
            touches[1].clientX - touches[0].clientX,
            touches[1].clientY - touches[0].clientY
        );
    }
}

function updateAllLines() {
    if (performanceOptimizations.rafId) {
        cancelAnimationFrame(performanceOptimizations.rafId);
    }
    
    performanceOptimizations.rafId = requestAnimationFrame(() => {
        const lines = document.querySelectorAll('.constellation-line');
        const container = performanceOptimizations.elements.get('constellationContainer');
        const scale = parseFloat(container.dataset.currentScale) || 1;
        
        lines.forEach(line => {
            if (line.updatePosition) line.updatePosition(scale);
        });
    });
}

// Add new optimized line update function
function updateAllLinesWithScale(scale) {
    const container = document.getElementById('constellationContainer');
    const lines = document.querySelectorAll('.constellation-line');
    const containerRect = container.getBoundingClientRect();

    lines.forEach(line => {
        if (!line.star1 || !line.star2) return;

        const star1Rect = line.star1.getBoundingClientRect();
        const star2Rect = line.star2.getBoundingClientRect();

        // Calculate positions relative to container and account for scale
        const x1 = (star1Rect.left + star1Rect.width/2 - containerRect.left) / scale;
        const y1 = (star1Rect.top + star1Rect.height/2 - containerRect.top) / scale;
        const x2 = (star2Rect.left + star2Rect.width/2 - containerRect.left) / scale;
        const y2 = (star2Rect.top + star2Rect.height/2 - containerRect.top) / scale;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        // Apply all style changes at once
        Object.assign(line.style, {
            width: `${length}px`,
            left: `${x1}px`,
            top: `${y1}px`,
            transform: `rotate(${angle}rad) translateZ(0)`
        });
    });
}

// Add animation frame handler for smooth updates
let animationFrameId = null;

// Replace existing updateConnectedLines function
function updateConnectedLines(star) {
    if (!star.connectedLines) return;
    
    star.connectedLines.forEach(connection => {
        if (connection.line && typeof connection.line.updatePosition === 'function') {
            connection.line.updatePosition();
        }
    });
}

// Add mutation observer to track star position changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.target.classList.contains('fortune-star')) {
            updateConnectedLines(mutation.target);
        }
    });
});

// Observe star position changes
document.querySelectorAll('.fortune-star').forEach(star => {
    observer.observe(star, { 
        attributes: true, 
        attributeFilter: ['style', 'transform'] 
    });
});

// Add animation frame handler
function startLineUpdates() {
    let lastFrameTime = performance.now();
    const fpsInterval = 1000 / 30; // Reduced to 30fps for better performance
    let animationFrameId;

    const updateFrame = (currentTime) => {
        animationFrameId = requestAnimationFrame(updateFrame);
        const elapsed = currentTime - lastFrameTime;

        if (elapsed > fpsInterval) {
            lastFrameTime = currentTime - (elapsed % fpsInterval);
            const container = document.getElementById('constellationContainer');
            const scale = parseFloat(container.dataset.currentScale) || 1;
            updateAllLinesWithScale(scale);
        }
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    
    // Add cleanup method
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}

// Add this helper function for time formatting
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
}

// Add this new function for precise indicator positioning
function updateLatestIndicator(indicator, star) {
    if (!indicator || !star) return;
    
    const container = document.getElementById('constellationContainer');
    const containerTransform = getComputedStyle(container).transform;
    const matrix = new DOMMatrix(containerTransform);
    const scale = matrix.a;

    const updatePosition = () => {
        // Get the actual star's position in the container
        const starRect = star.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const starSize = parseFloat(star.style.width) || 8;

        // Calculate actual position relative to container accounting for transform
        const x = parseFloat(star.style.left) || 0;
        const y = parseFloat(star.style.top) || 0;

        // Position indicator directly above the star in container coordinates
        indicator.style.left = `${x + (starSize/2) - 20}px`; // Center the 40px wide indicator
        indicator.style.top = `${y - 40}px`; // Position above the star
        indicator.style.transform = `scale(${1/scale})`; // Counter-scale for zoom
        indicator.style.transformOrigin = 'bottom center'; // Set transform origin
    };

    // Initial position
    updatePosition();

    // Update on star position changes
    const starObserver = new MutationObserver(() => requestAnimationFrame(updatePosition));
    starObserver.observe(star, {
        attributes: true,
        attributeFilter: ['style']
    });

    // Update on container transform changes
    const containerObserver = new MutationObserver(() => requestAnimationFrame(updatePosition));
    containerObserver.observe(container, {
        attributes: true,
        attributeFilter: ['style', 'transform']
    });

    // Update on animation frames for smooth movement
    let animationFrame;
    function updateLoop() {
        updatePosition();
        animationFrame = requestAnimationFrame(updateLoop);
    }
    updateLoop();

    // Cleanup when indicator is removed
    indicator.cleanup = () => {
        starObserver.disconnect();
        containerObserver.disconnect();
        cancelAnimationFrame(animationFrame);
    };
}

// Add performance optimizations
const performanceOptimizations = {
    // Cache DOM elements
    elements: new Map(),
    
    // Debounce window resize
    resizeDebounce: null,
    
    // Use RequestAnimationFrame for smooth animations
    rafId: null,
    
    // Initialize optimizations
    init() {
        // Cache frequently used elements
        ['starsContainer', 'constellationContainer', 'fortunePopup'].forEach(id => {
            this.elements.set(id, document.getElementById(id));
        });
        
        // Optimize resize handler
        window.addEventListener('resize', () => {
            if (this.resizeDebounce) clearTimeout(this.resizeDebounce);
            this.resizeDebounce = setTimeout(() => {
                const container = this.elements.get('constellationContainer');
                container.innerHTML = '';
                const historyData = JSON.parse(localStorage.getItem('permanentFortuneHistory') || '[]');
                createConstellations(historyData);
                updateAllLines();
            }, 250);
        });

        // Use intersection observer for line visibility
        this.setupIntersectionObserver();
    },

    // Optimize line visibility checks
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const line = entry.target;
                    line.style.display = entry.isIntersecting ? 'block' : 'none';
                });
            },
            { threshold: 0.1 }
        );

        // Observe all lines
        document.querySelectorAll('.constellation-line').forEach(line => {
            observer.observe(line);
        });
    }
};

function createLatestIndicator(targetStar) {
    // Remove any existing indicator
    const existingIndicator = document.querySelector('.latest-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    const container = document.getElementById('constellationContainer');
    const indicator = document.createElement('div');
    indicator.className = 'latest-indicator';
    indicator.targetStar = targetStar; // Store reference to target star
    
    container.appendChild(indicator);

    // Initial position update
    const updatePosition = () => {
        const starRect = targetStar.getBoundingClientRect();
        const starX = parseFloat(targetStar.style.left) || 0;
        const starY = parseFloat(targetStar.style.top) || 0;
        const starSize = parseFloat(targetStar.style.width) || 8;

        indicator.style.left = `${starX + (starSize/2) - 20}px`;
        indicator.style.top = `${starY - 40}px`;
    };

    updatePosition();

    // Keep updating position during animations and transforms
    const observer = new MutationObserver(updatePosition);
    observer.observe(targetStar, {
        attributes: true,
        attributeFilter: ['style']
    });

    // Cleanup function
    indicator.cleanup = () => observer.disconnect();

    return indicator;
}

function initializeMobileSupport() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const container = document.getElementById('constellationContainer');
    
    // Adjust line visibility for mobile
    function updateMobileLines() {
        const lines = document.querySelectorAll('.constellation-line');
        lines.forEach(line => {
            // Force recalculation of line positions
            if (line.updatePosition) {
                line.style.opacity = '1';
                line.style.display = 'block';
                line.updatePosition();
            }
        });
    }

    // Add touch event handlers for better mobile interaction
    let lastTapTime = 0;
    container.addEventListener('touchstart', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 500 && tapLength > 0) {
            // Double tap detected - center view
            e.preventDefault();
            centerView(true);
        }
        lastTapTime = currentTime;

        // Update lines when user starts interacting
        updateMobileLines();
    });

    container.addEventListener('touchend', () => {
        // Update lines after interaction ends
        setTimeout(updateMobileLines, 100);
    });

    // Update lines during scroll/zoom
    container.addEventListener('scroll', () => {
        requestAnimationFrame(updateMobileLines);
    });

    // Force update lines periodically on mobile
    setInterval(updateMobileLines, 1000);
}

// Enhance the updateLinePosition function for better mobile support
function updateLinePosition(line) {
    if (!line.star1 || !line.star2) return;

    const container = line.parentElement;
    const containerTransform = getComputedStyle(container).transform;
    const matrix = new DOMMatrix(containerTransform);
    const scale = matrix.a;

    requestAnimationFrame(() => {
        const star1Rect = line.star1.getBoundingClientRect();
        const star2Rect = line.star2.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate positions with improved precision
        const x1 = (star1Rect.left + star1Rect.width/2 - containerRect.left) / scale;
        const y1 = (star1Rect.top + star1Rect.height/2 - containerRect.top) / scale;
        const x2 = (star2Rect.left + star2Rect.width/2 - containerRect.left) / scale;
        const y2 = (star2Rect.top + star2Rect.height/2 - containerRect.top) / scale;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);

        // Apply hardware acceleration and force visibility
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}rad) translateZ(0)`;
        line.style.display = 'block';
        line.style.opacity = '1';
        
        // Force GPU acceleration
        line.style.willChange = 'transform';
    });
}
