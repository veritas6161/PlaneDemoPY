// Plane model module
import * as THREE from 'three';

export class Plane {
    constructor() {
        // Create the 3D model
        this.object = this.createModel();
        
        // Flight physics parameters
        this.rotation = {
            pitch: 0,
            yaw: 0,
            roll: 0
        };
        
        this.speed = {
            current: 30,  // Initial speed (units/second)
            min: 10,
            max: 50
        };
        
        // Physics limits
        this.limits = {
            pitch: THREE.MathUtils.degToRad(60),  // Max pitch angle (radians)
            bankAngle: THREE.MathUtils.degToRad(45)  // Max bank angle (radians)
        };
        
        // Quaternion for rotation
        this.quaternion = new THREE.Quaternion();
        
        // Auto-level parameters
        this.autoLevelStrength = 0.5;
        
        // Last frame time for delta calculation
        this.lastTime = performance.now();
    }
    
    // Create the plane model
    createModel() {
        const planeGroup = new THREE.Group();
        
        // Using a cone for the nose and cylinder for the body to create a more pointed front
        const noseGeometry = new THREE.ConeGeometry(0.2, 0.4, 12);
        const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.rotation.x = -Math.PI / 2; // Point forward
        nose.position.z = 1.0; // Position at front
        nose.castShadow = true;
        planeGroup.add(nose);
        
        const fuselageGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.6, 12);
        const fuselageMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.rotation.x = Math.PI / 2; // Rotate to align with Z axis
        fuselage.position.z = 0.2; // Position behind the nose
        fuselage.castShadow = true;
        planeGroup.add(fuselage);
        
        // Wings - extending along X axis, more rectangular
        const wingGeometry = new THREE.BoxGeometry(3.5, 0.05, 0.8);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const wing = new THREE.Mesh(wingGeometry, wingMaterial);
        wing.position.y = 0; // Center through the fuselage
        wing.position.z = 0.2; // Position slightly forward for better balance
        wing.castShadow = true;
        planeGroup.add(wing);
        
        // Tail vertical stabilizer
        const tailVerticalGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.3);
        const tailVertical = new THREE.Mesh(tailVerticalGeometry, fuselageMaterial);
        tailVertical.position.set(0, 0.2, -0.7);
        tailVertical.castShadow = true;
        planeGroup.add(tailVertical);
        
        // Tail horizontal stabilizer
        const tailHorizontalGeometry = new THREE.BoxGeometry(0.9, 0.05, 0.3);
        const tailHorizontal = new THREE.Mesh(tailHorizontalGeometry, fuselageMaterial);
        tailHorizontal.position.set(0, 0, -0.7);
        tailHorizontal.castShadow = true;
        planeGroup.add(tailHorizontal);
        
        // Propeller
        const propellerGroup = new THREE.Group();
        
        // Propeller center
        const propellerCenterGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12);
        const propellerCenter = new THREE.Mesh(propellerCenterGeometry, new THREE.MeshPhongMaterial({ color: 0x222222 }));
        propellerCenter.rotation.x = Math.PI / 2;
        propellerCenter.castShadow = true;
        propellerGroup.add(propellerCenter);
        
        // Propeller blades
        const bladeGeometry = new THREE.BoxGeometry(0.7, 0.12, 0.02);
        const bladeMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        
        const blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade1.position.set(0, 0, 0);
        blade1.castShadow = true;
        propellerGroup.add(blade1);
        
        const blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade2.position.set(0, 0, 0);
        blade2.rotation.z = Math.PI / 2;
        blade2.castShadow = true;
        propellerGroup.add(blade2);
        
        propellerGroup.position.set(0, 0, 1.2); // At the front of the nose
        planeGroup.add(propellerGroup);
        
        // Position plane
        planeGroup.position.y = 100; // Start higher above the larger city
        planeGroup.position.z = -200; // Start farther away to approach the larger city
        
        // Apply initial nose-down attitude
        planeGroup.rotation.x = -0.1; // Slight nose-down attitude
        
        return planeGroup;
    }
    
    // Update method for animation and physics
    update(input, deltaTime) {
        // Rotate propeller
        const propeller = this.object.children[5]; // The propeller group
        if (propeller) {
            propeller.rotation.z += 0.3 * (this.speed.current / 30); // Rotate proportional to speed
        }
        
        // Update speed based on throttle input
        this.updateSpeed(input.throttle);
        
        // Update rotation based on input
        this.updateRotation(input, deltaTime);
        
        // Move the plane forward based on its orientation and speed
        this.updatePosition(deltaTime);
    }
    
    // Update speed based on throttle input
    updateSpeed(throttle) {
        // Scale throttle from 0-1 to min-max speed
        this.speed.current = this.speed.min + throttle * (this.speed.max - this.speed.min);
    }
    
    // Update rotation based on input
    updateRotation(input, deltaTime) {
        // Get pitch and roll inputs (-1 to 1)
        const pitchInput = input.pitch;
        const rollInput = input.roll;
        
        // Apply pitch (with limits)
        this.rotation.pitch += pitchInput * deltaTime * 0.8;
        this.rotation.pitch = THREE.MathUtils.clamp(
            this.rotation.pitch, 
            -this.limits.pitch, 
            this.limits.pitch
        );
        
        // Apply roll (with limits)
        this.rotation.roll += rollInput * deltaTime * 2.0;
        this.rotation.roll = THREE.MathUtils.clamp(
            this.rotation.roll,
            -this.limits.bankAngle,
            this.limits.bankAngle
        );
        
        // Calculate yaw from roll (bank-to-turn)
        // IMPORTANT: Negative roll produces positive yaw (left bank = left turn)
        this.rotation.yaw += -this.rotation.roll * deltaTime * 1.5;
        
        // Auto-level when no inputs
        if (Math.abs(rollInput) < 0.1) {
            // Auto-level roll
            if (Math.abs(this.rotation.roll) > 0.01) {
                const autoLevel = Math.sign(this.rotation.roll) * -1 * this.autoLevelStrength * deltaTime;
                
                // Don't overshoot zero
                if (Math.abs(autoLevel) > Math.abs(this.rotation.roll)) {
                    this.rotation.roll = 0;
                } else {
                    this.rotation.roll += autoLevel;
                }
            } else {
                this.rotation.roll = 0;
            }
        }
        
        // Apply rotations using quaternions (YXZ order)
        // 1. Create separate quaternions for each axis
        const quatYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.yaw);
        const quatPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.rotation.pitch);
        const quatRoll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.rotation.roll);
        
        // 2. Combine rotations in YXZ order
        this.quaternion.identity();
        this.quaternion.multiply(quatYaw);
        this.quaternion.multiply(quatPitch);
        this.quaternion.multiply(quatRoll);
        
        // 3. Apply to the plane object
        this.object.quaternion.copy(this.quaternion);
    }
    
    // Update position based on current orientation and speed
    updatePosition(deltaTime) {
        // Create forward vector (local Z-axis)
        const forward = new THREE.Vector3(0, 0, 1);
        
        // Rotate forward vector by object's current orientation
        forward.applyQuaternion(this.object.quaternion);
        
        // Scale by speed and delta time
        forward.multiplyScalar(this.speed.current * deltaTime);
        
        // Apply movement
        this.object.position.add(forward);
    }
    
    // Get current speed for UI
    getSpeed() {
        return {
            current: this.speed.current,
            min: this.speed.min,
            max: this.speed.max
        };
    }
} 