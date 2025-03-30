// Import modules
import { Plane } from './models/plane.js';
import { GameScene } from './core/scene.js';
import { InputController } from './core/input.js';
import { CameraController } from './core/camera.js';
import { GameUI } from './core/ui.js';
import { UFOManager } from './models/ufoManager.js';
import * as THREE from 'three';

console.log('Main script loaded');

// Game class
class Game {
    constructor() {
        console.log('Game initializing');
        try {
            // Get the container
            this.container = document.getElementById('game-container');
            
            // Create scene
            this.gameScene = new GameScene(this.container);
            console.log('Scene created');
            
            // Create plane
            this.plane = new Plane();
            console.log('Plane created');
            
            // Add plane to scene
            this.gameScene.add(this.plane.object);
            
            // Create UFO manager
            this.ufoManager = new UFOManager();
            console.log('UFO manager created');
            
            // Add UFOs to scene
            this.ufoManager.addToScene(this.gameScene.scene);
            
            // Create input controller
            this.inputController = new InputController();
            console.log('Input controller created');
            
            // Create camera controller
            this.cameraController = new CameraController(
                this.gameScene.camera,
                this.gameScene.renderer,
                this.plane.object
            );
            console.log('Camera controller created');
            
            // Create UI
            this.ui = new GameUI();
            console.log('UI created');
            
            // Initialize last input state for camera toggle detection
            this.lastCameraToggleState = false;
            
            // Update UI with initial camera mode
            this.ui.updateCameraMode(this.cameraController.currentMode);
            
            // Store last timestamp for delta time calculation
            this.lastTimestamp = performance.now();
            
            // Start animation loop
            this.animate(this.lastTimestamp);
            console.log('Animation started');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }
    
    // Animation loop with timestamp parameter
    animate(timestamp) {
        requestAnimationFrame(this.animate.bind(this));
        
        // Calculate delta time in seconds
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        
        // Update input controller
        this.inputController.update(deltaTime);
        
        // Get input state
        const input = this.inputController.getInput();
        
        // Check for camera toggle
        if (input.cameraToggle && !this.lastCameraToggleState) {
            this.cameraController.toggleMode();
            this.ui.updateCameraMode(this.cameraController.currentMode);
        }
        this.lastCameraToggleState = input.cameraToggle;
        
        // Update plane physics
        this.plane.update(input, deltaTime);
        
        // Update UFOs
        this.ufoManager.update(deltaTime);
        
        // Update camera
        this.cameraController.update(deltaTime);
        
        // Update UI with current speed
        const speed = this.plane.getSpeed();
        this.ui.updateSpeed(speed.current, speed.min, speed.max);
        
        // Render scene
        this.gameScene.render();
    }
}

// Initialize game when the window has loaded
window.onload = () => {
    console.log('Window loaded, starting game');
    new Game();
}; 