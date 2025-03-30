export class GameUI {
    constructor() {
        this.createUI();
        this.gameState = 'start'; // Possible values: 'start', 'playing', 'victory', 'lose'
    }
    
    createUI() {
        // Create UI container
        this.container = document.createElement('div');
        this.container.className = 'game-ui';
        document.body.appendChild(this.container);
        
        // Create control reference
        this.createControlReference();
        
        // Create speed indicator
        this.createSpeedIndicator();

        // Create game screens
        this.createStartScreen();
        this.createVictoryScreen();
        this.createLoseScreen();
        
        // Show the start screen by default
        this.showScreen('start');
    }
    
    createControlReference() {
        const controlRef = document.createElement('div');
        controlRef.className = 'control-reference';
        
        controlRef.innerHTML = `
            <h3>Controls</h3>
            <ul>
                <li><strong>↑/↓</strong>: Pitch up/down</li>
                <li><strong>←/→</strong>: Roll left/right</li>
                <li><strong>PgUp/PgDn</strong>: Increase/decrease speed</li>
                <li><strong>C</strong>: Toggle camera mode</li>
                <li><strong>M</strong>: Toggle music</li>
            </ul>
        `;
        
        this.container.appendChild(controlRef);
    }
    
    createSpeedIndicator() {
        this.speedIndicator = document.createElement('div');
        this.speedIndicator.className = 'speed-indicator';
        
        // Create speed display
        this.speedDisplay = document.createElement('div');
        this.speedDisplay.className = 'speed-display';
        this.speedIndicator.appendChild(this.speedDisplay);
        
        // Create speed gauge
        this.speedGauge = document.createElement('div');
        this.speedGauge.className = 'speed-gauge';
        
        this.speedBar = document.createElement('div');
        this.speedBar.className = 'speed-bar';
        this.speedGauge.appendChild(this.speedBar);
        
        this.speedIndicator.appendChild(this.speedGauge);
        
        this.container.appendChild(this.speedIndicator);
    }
    
    createStartScreen() {
        this.startScreen = document.createElement('div');
        this.startScreen.className = 'game-screen start-screen';
        
        const content = document.createElement('div');
        content.className = 'screen-content';
        content.innerHTML = `
            <h1>3D Plane Game</h1>
            <p>Navigate through the skies and avoid obstacles!</p>
            <button id="start-button">Start Game</button>
        `;
        
        this.startScreen.appendChild(content);
        this.container.appendChild(this.startScreen);
        
        // Add event listener to start button
        const startButton = this.startScreen.querySelector('#start-button');
        startButton.addEventListener('click', () => {
            // Dispatch custom event to be caught by the game
            const event = new CustomEvent('gameStart');
            document.dispatchEvent(event);
        });
    }

    createVictoryScreen() {
        this.victoryScreen = document.createElement('div');
        this.victoryScreen.className = 'game-screen victory-screen';
        
        const content = document.createElement('div');
        content.className = 'screen-content';
        content.innerHTML = `
            <h1>Victory!</h1>
            <p>Congratulations! You've completed the mission.</p>
            <button id="restart-button-victory">Play Again</button>
        `;
        
        this.victoryScreen.appendChild(content);
        this.container.appendChild(this.victoryScreen);
        
        // Add event listener to restart button
        const restartButton = this.victoryScreen.querySelector('#restart-button-victory');
        restartButton.addEventListener('click', () => {
            // Dispatch custom event to be caught by the game
            const event = new CustomEvent('gameRestart');
            document.dispatchEvent(event);
        });
    }

    createLoseScreen() {
        this.loseScreen = document.createElement('div');
        this.loseScreen.className = 'game-screen lose-screen';
        
        const content = document.createElement('div');
        content.className = 'screen-content';
        content.innerHTML = `
            <h1>Game Over</h1>
            <p>Your plane has crashed. Better luck next time!</p>
            <button id="restart-button-lose">Try Again</button>
        `;
        
        this.loseScreen.appendChild(content);
        this.container.appendChild(this.loseScreen);
        
        // Add event listener to restart button
        const restartButton = this.loseScreen.querySelector('#restart-button-lose');
        restartButton.addEventListener('click', () => {
            // Dispatch custom event to be caught by the game
            const event = new CustomEvent('gameRestart');
            document.dispatchEvent(event);
        });
    }
    
    // Update speed indicator with current speed
    updateSpeed(speedValue, minSpeed, maxSpeed) {
        // Calculate speed percentage
        const percentage = ((speedValue - minSpeed) / (maxSpeed - minSpeed)) * 100;
        
        // Update speed display
        this.speedDisplay.textContent = `${Math.round(speedValue)} units`;
        
        // Update speed bar
        this.speedBar.style.width = `${percentage}%`;
        
        // Update speed bar color based on speed
        if (percentage < 33) {
            this.speedBar.style.backgroundColor = '#4CAF50'; // Green for low speed
        } else if (percentage < 66) {
            this.speedBar.style.backgroundColor = '#FFC107'; // Yellow for medium speed
        } else {
            this.speedBar.style.backgroundColor = '#F44336'; // Red for high speed
        }
    }
    
    // Update camera mode indicator
    updateCameraMode(mode) {
        // Update the control reference to show current camera mode
        const cameraInfo = document.querySelector('.camera-mode');
        if (!cameraInfo) {
            const infoElement = document.createElement('div');
            infoElement.className = 'camera-mode';
            infoElement.textContent = `Camera Mode: ${mode}`;
            this.container.appendChild(infoElement);
        } else {
            cameraInfo.textContent = `Camera Mode: ${mode}`;
        }
    }

    // Update audio mute status
    updateMuteStatus(isMuted) {
        const muteInfo = document.querySelector('.mute-status');
        if (!muteInfo) {
            const infoElement = document.createElement('div');
            infoElement.className = 'mute-status';
            infoElement.textContent = `Sound: ${isMuted ? 'Off' : 'On'}`;
            this.container.appendChild(infoElement);
        } else {
            muteInfo.textContent = `Sound: ${isMuted ? 'Off' : 'On'}`;
        }
    }

    // Show specific screen
    showScreen(screenType) {
        // Hide all screens first
        this.hideAllScreens();
        
        // Show the requested screen
        this.gameState = screenType;
        
        switch (screenType) {
            case 'start':
                this.startScreen.style.display = 'flex';
                this.speedIndicator.style.display = 'none';
                break;
            case 'playing':
                this.speedIndicator.style.display = 'block';
                break;
            case 'victory':
                this.victoryScreen.style.display = 'flex';
                break;
            case 'lose':
                this.loseScreen.style.display = 'flex';
                break;
        }
    }
    
    // Hide all screens
    hideAllScreens() {
        this.startScreen.style.display = 'none';
        this.victoryScreen.style.display = 'none';
        this.loseScreen.style.display = 'none';
    }
} 