import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class CameraController {
    constructor(camera, renderer, targetObject) {
        this.camera = camera;
        this.renderer = renderer;
        this.targetObject = targetObject;
        
        // Camera modes
        this.MODE_FOLLOW = 'follow';
        this.MODE_ORBIT = 'orbit';
        this.currentMode = this.MODE_FOLLOW;
        
        // Camera follow parameters
        this.followOffset = new THREE.Vector3(0, 2, -6); // Behind and above
        this.followLerpFactor = 0.05; // Smoothing factor
        
        // Orbit controls for free camera mode
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.1;
        this.orbitControls.enabled = false; // Start with follow cam
    }
    
    // Toggle between camera modes
    toggleMode() {
        if (this.currentMode === this.MODE_FOLLOW) {
            // Switch to orbit mode
            this.currentMode = this.MODE_ORBIT;
            this.orbitControls.enabled = true;
            this.orbitControls.target.copy(this.targetObject.position);
        } else {
            // Switch to follow mode
            this.currentMode = this.MODE_FOLLOW;
            this.orbitControls.enabled = false;
        }
    }
    
    // Update camera position and orientation
    update(deltaTime) {
        if (this.currentMode === this.MODE_FOLLOW) {
            this.updateFollowCamera();
        } else {
            this.orbitControls.update();
        }
    }
    
    // Update follow camera position and orientation
    updateFollowCamera() {
        // Get target object world quaternion
        const targetQuat = this.targetObject.quaternion.clone();
        
        // Calculate offset position in world space
        const offsetPosition = new THREE.Vector3();
        offsetPosition.copy(this.followOffset);
        offsetPosition.applyQuaternion(targetQuat);
        offsetPosition.add(this.targetObject.position);
        
        // Smoothly move camera to new position
        this.camera.position.lerp(offsetPosition, this.followLerpFactor);
        
        // Make camera look at the target (slightly ahead)
        const lookAtPosition = new THREE.Vector3();
        const forwardVector = new THREE.Vector3(0, 0, 2); // Look ahead
        forwardVector.applyQuaternion(targetQuat);
        lookAtPosition.copy(this.targetObject.position).add(forwardVector);
        
        this.camera.lookAt(lookAtPosition);
    }
} 