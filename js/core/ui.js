export class GameUI {
    constructor() {
        this.createUI();
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
} 