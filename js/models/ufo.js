// UFO model module
import * as THREE from 'three';

export class UFO {
    constructor(position = { x: 0, y: 100, z: 0 }) {
        // Create the 3D model
        this.object = this.createModel();
        
        // Set initial position
        this.object.position.set(position.x, position.y, position.z);
        
        // Movement parameters
        this.speed = 15;
        this.hoverAmplitude = 0.5;
        this.hoverFrequency = 0.5;
        this.rotationSpeed = 0.3;
        
        // Horizontal movement parameters
        this.horizontalSpeed = 10 + Math.random() * 5; // Speed varies between UFOs
        this.movingRight = true; // Direction flag
        this.boundsX = 120; // Maximum X coordinate before turning/wrapping
        
        // Each UFO has a unique movement pattern
        this.uniqueFrequency = 0.2 + Math.random() * 0.4; // 0.2 to 0.6
        
        // Track time for hover and rotation animation
        this.time = Math.random() * 1000; // Random start time for variety
        
        // Create a point light beneath the UFO
        this.addBeamLight();
    }
    
    // Create the UFO model based on the reference image
    createModel() {
        const ufoGroup = new THREE.Group();
        
        // Main saucer - using torus for the curved edge profile
        const torusGeometry = new THREE.TorusGeometry(4, 1.5, 16, 32);
        const torusMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x888888,
            shininess: 60
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.rotation.x = Math.PI / 2; // Rotate to be horizontal
        torus.castShadow = true;
        ufoGroup.add(torus);
        
        // Top dome
        const topDomeGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const topDomeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x999999,
            shininess: 70
        });
        const topDome = new THREE.Mesh(topDomeGeometry, topDomeMaterial);
        topDome.position.y = 0.5;
        topDome.castShadow = true;
        ufoGroup.add(topDome);
        
        // Bottom section - inverted dome
        const bottomDomeGeometry = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 4);
        const bottomDomeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x777777,
            shininess: 50
        });
        const bottomDome = new THREE.Mesh(bottomDomeGeometry, bottomDomeMaterial);
        bottomDome.position.y = -0.5;
        bottomDome.scale.y = 0.5; // Flatten it
        bottomDome.castShadow = true;
        ufoGroup.add(bottomDome);
        
        // Fill in the center of the saucer (top and bottom)
        const discTopGeometry = new THREE.CircleGeometry(4, 32);
        const discTopMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x999999,
            shininess: 70,
            side: THREE.DoubleSide
        });
        const discTop = new THREE.Mesh(discTopGeometry, discTopMaterial);
        discTop.rotation.x = -Math.PI / 2; // Horizontal
        discTop.position.y = 1.5; // Above the torus
        discTop.castShadow = true;
        ufoGroup.add(discTop);
        
        const discBottomGeometry = new THREE.CircleGeometry(4, 32);
        const discBottomMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x777777,
            shininess: 50,
            side: THREE.DoubleSide
        });
        const discBottom = new THREE.Mesh(discBottomGeometry, discBottomMaterial);
        discBottom.rotation.x = Math.PI / 2; // Horizontal, facing down
        discBottom.position.y = -1.5; // Below the torus
        discBottom.castShadow = true;
        ufoGroup.add(discBottom);
        
        // Add lights around the rim
        this.addRimLights(ufoGroup);
        
        return ufoGroup;
    }
    
    // Add small lights around the rim of the UFO
    addRimLights(ufoGroup) {
        const lightCount = 16;
        const radius = 4.5;
        
        for (let i = 0; i < lightCount; i++) {
            const angle = (i / lightCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Create a small light bulb
            const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const lightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x88ff88, 
                emissive: 0x88ff88,
                emissiveIntensity: 0.5,
                shininess: 100
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(x, 0, z);
            ufoGroup.add(light);
        }
    }
    
    // Add a beam light beneath the UFO
    addBeamLight() {
        // Add a downward-pointing light
        const beamLight = new THREE.PointLight(0x88ff88, 5, 30);
        beamLight.position.set(0, -3, 0);
        beamLight.castShadow = true;
        this.object.add(beamLight);
        
        // Store reference for animation
        this.beamLight = beamLight;
    }
    
    // Update method for animation
    update(deltaTime) {
        // Increment time counter
        this.time += deltaTime;
        
        // Hover motion - simple sine wave based on time
        const hoverOffset = Math.sin(this.time * this.hoverFrequency) * this.hoverAmplitude;
        this.object.position.y += hoverOffset * deltaTime;
        
        // Horizontal movement (left to right)
        if (this.movingRight) {
            this.object.position.x += this.horizontalSpeed * deltaTime;
            if (this.object.position.x > this.boundsX) {
                // Wrap around to the left side when reaching the right boundary
                this.object.position.x = -this.boundsX;
            }
        } else {
            // Optional: Uncomment this block if you want UFOs to move in both directions
            /*
            this.object.position.x -= this.horizontalSpeed * deltaTime;
            if (this.object.position.x < -this.boundsX) {
                // Wrap around to the right side when reaching the left boundary
                this.object.position.x = this.boundsX;
            }
            */
        }
        
        // Rotation - constant spin around Y axis
        this.object.rotation.y += this.rotationSpeed * deltaTime;
        
        // Animate beam light intensity
        if (this.beamLight) {
            const pulseIntensity = 3 + Math.sin(this.time * 2) * 2;
            this.beamLight.intensity = pulseIntensity;
        }
    }
} 