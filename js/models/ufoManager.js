// UFO manager module
import * as THREE from 'three';
import { UFO } from './ufo.js';

export class UFOManager {
    constructor() {
        this.ufos = [];
        this.ufoCount = 5; // Number of UFOs to create
        this.scene = null;
        
        // Create UFOs at starting positions
        this.createUFOs();
        
        // For collision detection
        this.collisionDistance = 2; // Collision distance in units
    }
    
    // Create multiple UFOs at starting positions for horizontal movement
    createUFOs() {
        // Clear any existing UFOs
        this.ufos = [];
        
        // Define a boundary for UFOs to appear
        const leftBoundary = -100;
        
        // Create UFOs in a row at the left side of the game area at different heights
        // UFO 1
        this.addUFO({ x: leftBoundary, y: 60, z: 0 });
        
        // UFO 2
        this.addUFO({ x: leftBoundary - 20, y: 70, z: -40 });
        
        // UFO 3
        this.addUFO({ x: leftBoundary - 40, y: 80, z: 40 });
        
        // UFO 4
        this.addUFO({ x: leftBoundary - 60, y: 90, z: -20 });
        
        // UFO 5
        this.addUFO({ x: leftBoundary - 80, y: 100, z: 20 });
    }
    
    // Helper to add a UFO at a specific position
    addUFO(position) {
        const ufo = new UFO(position);
        this.ufos.push(ufo);
    }
    
    // Add UFOs to the scene
    addToScene(scene) {
        this.scene = scene;
        for (const ufo of this.ufos) {
            scene.add(ufo.object);
        }
    }
    
    // Update all UFOs
    update(deltaTime) {
        for (const ufo of this.ufos) {
            ufo.update(deltaTime);
        }
    }
    
    // Check for collision with player plane
    checkCollision(planeObject) {
        for (const ufo of this.ufos) {
            const distance = planeObject.position.distanceTo(ufo.object.position);
            if (distance < this.collisionDistance) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }
    
    // Reset all UFOs to initial positions
    reset() {
        // Remove UFOs from scene if needed
        if (this.scene) {
            for (const ufo of this.ufos) {
                this.scene.remove(ufo.object);
            }
        }
        
        // Create new UFOs
        this.createUFOs();
        
        // Add them back to the scene
        if (this.scene) {
            for (const ufo of this.ufos) {
                this.scene.add(ufo.object);
            }
        }
    }
} 