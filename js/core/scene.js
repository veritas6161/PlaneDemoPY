// Scene setup module
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { City } from '../models/city.js';

export class GameScene {
    constructor(container) {
        this.container = container;
        
        // Set up the scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Remove fog for debugging
        // this.scene.fog = new THREE.FogExp2(0xCCCCFF, 0.0025);
        
        // Set up camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        // Initialize clock for delta time calculation
        this.clock = new THREE.Clock();
        
        // Create environment
        this.createEnvironment();
        
        // Add lights
        this.addLights();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
    
    // Create the environment (ground, city, sky)
    createEnvironment() {
        // Create ground plane (3x larger)
        const groundSize = 300;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4CAF50, // Green
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Create city with 3x larger size
        this.city = new City(150, 12);
        console.log("Creating city object:", this.city);
        
        // Add city to scene
        this.scene.add(this.city.object);
        console.log("City added to scene, children count:", this.city.object.children.length);
        
        // Add axes helper for debugging
        const axesHelper = new THREE.AxesHelper(60);
        this.scene.add(axesHelper);
        
        // Create a simple skybox
        this.createSkybox();
    }
    
    // Create a skybox with simple sky gradient
    createSkybox() {
        const skyboxSize = 800;
        
        // Create a large sphere for the sky
        const skyGeometry = new THREE.SphereGeometry(skyboxSize, 32, 32);
        
        // Create a gradient material for the sky
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) }, // Blue at the top
                bottomColor: { value: new THREE.Color(0xffffff) }, // White at the horizon
                offset: { value: 150 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }
    
    // Add lights to the scene
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(150, 200, 150);
        directionalLight.castShadow = true;
        
        // Set up shadow properties
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -200;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        
        this.scene.add(directionalLight);
    }
    
    // Handle window resize
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Add an object to the scene
    add(object) {
        this.scene.add(object);
    }
    
    // Set camera position and target
    setupCamera(position, target) {
        this.camera.position.copy(position);
        this.camera.lookAt(target);
    }
    
    // Get delta time
    getDeltaTime() {
        return this.clock.getDelta();
    }
    
    // Render the scene
    render() {
        this.renderer.render(this.scene, this.camera);
    }
} 