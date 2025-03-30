// Import modules
import { Plane } from './models/plane.js';
import { GameScene } from './core/scene.js';
import { InputController } from './core/input.js';
import { CameraController } from './core/camera.js';
import { GameUI } from './core/ui.js';
import { UFOManager } from './models/ufoManager.js';
import { AudioManager } from './core/audio.js';
import * as THREE from 'three';

console.log('Main script loaded');

// Game states
const GAME_STATE = {
    START: 'start',
    PLAYING: 'playing',
    VICTORY: 'victory',
    LOSE: 'lose'
};

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
            
            // Create audio manager
            this.audioManager = new AudioManager();
            console.log('Audio manager created');
            
            // Initialize last input state for camera toggle detection
            this.lastCameraToggleState = false;
            this.lastMuteToggleState = false;
            
            // Set initial game state
            this.gameState = GAME_STATE.START;
            
            // Update UI with initial camera mode
            this.ui.updateCameraMode(this.cameraController.currentMode);
            
            // Store last timestamp for delta time calculation
            this.lastTimestamp = performance.now();
            
            // Add event listeners for game start/restart
            document.addEventListener('gameStart', this.startGame.bind(this));
            document.addEventListener('gameRestart', this.restartGame.bind(this));
            
            // Start animation loop
            this.animate(this.lastTimestamp);
            console.log('Animation started');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }
    
    // Start the game
    startGame() {
        console.log('Game started');
        this.gameState = GAME_STATE.PLAYING;
        this.ui.showScreen(GAME_STATE.PLAYING);
        
        // Start background music
        this.audioManager.playBackgroundMusic();
    }
    
    // Restart the game
    restartGame() {
        console.log('Game restarted');
        
        // Reset the plane position and rotation
        this.plane.reset();
        
        // Reset UFOs
        this.ufoManager.reset();
        
        // Start the game
        this.startGame();
    }
    
    // Set game to victory state
    setVictory() {
        if (this.gameState === GAME_STATE.PLAYING) {
            console.log('Victory!');
            this.gameState = GAME_STATE.VICTORY;
            this.ui.showScreen(GAME_STATE.VICTORY);
            this.audioManager.playVictoryMusic();
        }
    }
    
    // Set game to lose state
    setLose() {
        if (this.gameState === GAME_STATE.PLAYING) {
            console.log('Game over!');
            this.gameState = GAME_STATE.LOSE;
            this.ui.showScreen(GAME_STATE.LOSE);
            this.audioManager.playLoseMusic();
        }
    }
    
    // Check for collisions
    checkCollisions() {
        // Check for UFO collisions
        if (this.ufoManager.checkCollision(this.plane.object)) {
            this.setLose();
        }
        
        // Check for ground collision
        if (this.plane.object.position.y < 0) {
            this.setLose();
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
        
        // Check for mute toggle
        if (input.muteToggle && !this.lastMuteToggleState) {
            const isMuted = this.audioManager.toggleMute();
            this.ui.updateMuteStatus(isMuted);
        }
        this.lastMuteToggleState = input.muteToggle;
        
        // Only update game logic if in PLAYING state
        if (this.gameState === GAME_STATE.PLAYING) {
            // Update plane physics
            this.plane.update(input, deltaTime);
            
            // Update UFOs
            this.ufoManager.update(deltaTime);
            
            // Check for collisions
            this.checkCollisions();
            
            // Update UI with current speed
            const speed = this.plane.getSpeed();
            this.ui.updateSpeed(speed.current, speed.min, speed.max);
        }
        
        // Always update camera
        this.cameraController.update(deltaTime);
        
        // Render scene
        this.gameScene.render();
    }
}

// Initialize game when the window has loaded
window.onload = () => {
    console.log('Window loaded, starting game');
    new Game();
}; 