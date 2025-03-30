export class InputController {
    constructor() {
        // Input states
        this.keys = {};
        this.pitch = 0;    // Up/Down: -1 to 1
        this.roll = 0;     // Left/Right: -1 to 1
        this.throttle = 0.6; // PageUp/PageDown: 0 to 1 (starts at 60%)
        
        // Keep track of keys that should only trigger once per press
        this.toggleKeys = {
            c: false,  // Camera toggle
            m: false   // Mute toggle
        };
        
        // Sensitivity parameters
        this.pitchSensitivity = 0.8;
        this.rollSensitivity = 2.0;
        this.turnSensitivity = 1.5;
        this.throttleSensitivity = 0.5;
        
        // Auto-centering
        this.autoCenterSpeed = 0.5;
        
        // Setup event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    // Handle key down events
    handleKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
    }
    
    // Handle key up events
    handleKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
        
        // Reset toggle states when key is released
        if (event.key.toLowerCase() in this.toggleKeys) {
            this.toggleKeys[event.key.toLowerCase()] = false;
        }
    }
    
    // Update input values based on key states
    update(deltaTime) {
        // Pitch control (Up/Down Arrow)
        if (this.keys['arrowup']) {
            this.pitch = Math.min(this.pitch + this.pitchSensitivity * deltaTime, 1);
        } else if (this.keys['arrowdown']) {
            this.pitch = Math.max(this.pitch - this.pitchSensitivity * deltaTime, -1);
        } else {
            // Auto-center pitch
            if (this.pitch > 0) {
                this.pitch = Math.max(this.pitch - this.autoCenterSpeed * deltaTime, 0);
            } else if (this.pitch < 0) {
                this.pitch = Math.min(this.pitch + this.autoCenterSpeed * deltaTime, 0);
            }
        }
        
        // Roll control (Left/Right Arrow)
        if (this.keys['arrowleft']) {
            this.roll = Math.min(this.roll + this.rollSensitivity * deltaTime, 1);
        } else if (this.keys['arrowright']) {
            this.roll = Math.max(this.roll - this.rollSensitivity * deltaTime, -1);
        } else {
            // Auto-level roll
            if (this.roll > 0) {
                this.roll = Math.max(this.roll - this.autoCenterSpeed * deltaTime, 0);
            } else if (this.roll < 0) {
                this.roll = Math.min(this.roll + this.autoCenterSpeed * deltaTime, 0);
            }
        }
        
        // Speed control (PageUp/PageDown)
        if (this.keys['pageup']) {
            this.throttle = Math.min(this.throttle + this.throttleSensitivity * deltaTime, 1);
        } else if (this.keys['pagedown']) {
            this.throttle = Math.max(this.throttle - this.throttleSensitivity * deltaTime, 0.2);
        }
        
        // Handle toggle keys
        if (this.keys['c'] && !this.toggleKeys['c']) {
            this.toggleKeys['c'] = true;  // Mark as toggled until key is released
        }
        
        if (this.keys['m'] && !this.toggleKeys['m']) {
            this.toggleKeys['m'] = true;  // Mark as toggled until key is released
        }
    }
    
    // Get normalized input values
    getInput() {
        return {
            pitch: this.pitch,
            roll: this.roll,
            throttle: this.throttle,
            cameraToggle: this.keys['c'] === true,
            muteToggle: this.keys['m'] === true && this.toggleKeys['m'] === true
        };
    }
} 