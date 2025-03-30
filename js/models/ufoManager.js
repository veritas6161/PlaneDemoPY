// UFO manager module
import * as THREE from 'three';
import { UFO } from './ufo.js';

export class UFOManager {
    constructor() {
        this.ufos = [];
        this.ufoCount = 5; // Number of UFOs to create
        
        // Create UFOs at random positions
        this.createUFOs();
    }
    
    // Create multiple UFOs at random positions
    createUFOs() {
        // Define a reasonable area for UFOs to appear
        const spawnArea = {
            minX: -100,
            maxX: 100,
            minY: 50,
            maxY: 120,
            minZ: -100,
            maxZ: 100
        };
        
        // Create UFOs at strategic positions
        // UFO 1 - Near the center of the city
        this.addUFO({ x: 0, y: 60, z: 0 });
        
        // UFO 2 - To the north of the city
        this.addUFO({ x: 0, y: 70, z: -80 });
        
        // UFO 3 - To the east of the city
        this.addUFO({ x: 80, y: 90, z: 0 });
        
        // UFO 4 - To the south of the city
        this.addUFO({ x: 0, y: 110, z: 80 });
        
        // UFO 5 - To the west of the city
        this.addUFO({ x: -80, y: 80, z: 0 });
    }
    
    // Helper to add a UFO at a specific position
    addUFO(position) {
        const ufo = new UFO(position);
        this.ufos.push(ufo);
    }
    
    // Add UFOs to the scene
    addToScene(scene) {
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
} 