// City model module
import * as THREE from 'three';

export class City {
    constructor(size = 150, gridSize = 12) {
        this.size = size; // Total size of the city
        this.gridSize = gridSize; // Number of city blocks in each direction
        this.blockSize = size / gridSize; // Size of each city block
        this.streetWidth = 3; // Width of streets (increased for larger city)
        this.maxBuildingHeight = 45; // 3x the previous maximum building height
        
        this.object = this.createModel();
    }
    
    // Create the city model
    createModel() {
        const cityGroup = new THREE.Group();
        
        // Create buildings
        this.createBuildings(cityGroup);
        
        // Create ground/streets
        this.createStreets(cityGroup);
        
        return cityGroup;
    }
    
    // Create buildings for the city
    createBuildings(cityGroup) {
        // Building materials with different colors for variety
        const buildingMaterials = [
            new THREE.MeshPhongMaterial({ color: 0x555555 }), // Dark gray
            new THREE.MeshPhongMaterial({ color: 0x666666 }), // Medium gray
            new THREE.MeshPhongMaterial({ color: 0x777777 }), // Light gray
            new THREE.MeshPhongMaterial({ color: 0x888888 }), // Very light gray
            new THREE.MeshPhongMaterial({ color: 0x445566 }), // Blue-gray
            new THREE.MeshPhongMaterial({ color: 0x665544 })  // Brown-gray
        ];
        
        // Create buildings across the grid
        for (let x = 0; x < this.gridSize; x++) {
            for (let z = 0; z < this.gridSize; z++) {
                // Calculate position
                const posX = (x * this.blockSize) - (this.size / 2) + (this.blockSize / 2);
                const posZ = (z * this.blockSize) - (this.size / 2) + (this.blockSize / 2);
                
                // Generate more buildings - only skip some on the outskirts
                if (x === 0 || z === 0 || x === this.gridSize-1 || z === this.gridSize-1) {
                    if (Math.random() < 0.5) continue; // 50% chance to skip buildings on edges
                }
                
                // Random building sizes
                const buildingWidth = this.blockSize * (0.6 + Math.random() * 0.3);
                const buildingDepth = this.blockSize * (0.6 + Math.random() * 0.3);
                
                // More varied building heights - taller toward center
                const distanceFromCenter = Math.sqrt(
                    Math.pow((x - this.gridSize/2), 2) + 
                    Math.pow((z - this.gridSize/2), 2)
                );
                const centerFactor = 1 - (distanceFromCenter / (this.gridSize/2));
                
                // Height increases toward center
                const buildingHeight = 5 + (centerFactor * this.maxBuildingHeight * Math.random());
                
                // Create building
                const buildingGeometry = new THREE.BoxGeometry(
                    buildingWidth, 
                    buildingHeight, 
                    buildingDepth
                );
                
                // Select random material
                const materialIndex = Math.floor(Math.random() * buildingMaterials.length);
                const building = new THREE.Mesh(buildingGeometry, buildingMaterials[materialIndex]);
                
                // Position building
                building.position.set(posX, buildingHeight / 2, posZ);
                building.castShadow = true;
                building.receiveShadow = true;
                
                cityGroup.add(building);
            }
        }
        
        // Add several skyscrapers near the center
        this.addSkyscrapers(cityGroup);
    }
    
    // Add skyscrapers to the city center
    addSkyscrapers(cityGroup) {
        // Add a central skyscraper for reference
        const centralSkyscraperGeometry = new THREE.BoxGeometry(15, 70, 15);
        const centralSkyscraper = new THREE.Mesh(
            centralSkyscraperGeometry,
            new THREE.MeshPhongMaterial({ color: 0x0088ff })
        );
        centralSkyscraper.position.set(0, 35, 0);
        centralSkyscraper.castShadow = true;
        centralSkyscraper.receiveShadow = true;
        cityGroup.add(centralSkyscraper);
        
        // Add additional tall buildings around center
        const skyscraperPositions = [
            { x: 25, z: 15, height: 60, color: 0x008866 },
            { x: -20, z: 25, height: 50, color: 0x886600 },
            { x: 15, z: -30, height: 55, color: 0x660088 },
            { x: -25, z: -20, height: 45, color: 0x880000 }
        ];
        
        for (const pos of skyscraperPositions) {
            const width = 10 + Math.random() * 5;
            const depth = 10 + Math.random() * 5;
            
            const skyscraperGeometry = new THREE.BoxGeometry(width, pos.height, depth);
            const skyscraper = new THREE.Mesh(
                skyscraperGeometry,
                new THREE.MeshPhongMaterial({ color: pos.color })
            );
            skyscraper.position.set(pos.x, pos.height/2, pos.z);
            skyscraper.castShadow = true;
            skyscraper.receiveShadow = true;
            cityGroup.add(skyscraper);
        }
    }
    
    // Create streets
    createStreets(cityGroup) {
        // Street material
        const streetMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 10
        });
        
        // Create horizontal and vertical streets
        for (let i = 0; i <= this.gridSize; i++) {
            // Position for this street
            const pos = (i * this.blockSize) - (this.size / 2);
            
            // Horizontal street (along X axis)
            const horizontalStreetGeometry = new THREE.PlaneGeometry(this.size, this.streetWidth);
            const horizontalStreet = new THREE.Mesh(horizontalStreetGeometry, streetMaterial);
            horizontalStreet.rotation.x = -Math.PI / 2; // Rotate to lay flat
            horizontalStreet.position.set(0, 0.02, pos); // Slightly above ground to prevent z-fighting
            horizontalStreet.receiveShadow = true;
            cityGroup.add(horizontalStreet);
            
            // Vertical street (along Z axis)
            const verticalStreetGeometry = new THREE.PlaneGeometry(this.streetWidth, this.size);
            const verticalStreet = new THREE.Mesh(verticalStreetGeometry, streetMaterial);
            verticalStreet.rotation.x = -Math.PI / 2; // Rotate to lay flat
            verticalStreet.position.set(pos, 0.02, 0); // Slightly above ground to prevent z-fighting
            verticalStreet.receiveShadow = true;
            cityGroup.add(verticalStreet);
        }
    }
} 