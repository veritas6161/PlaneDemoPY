# PlaneDemoPY

A browser-based 3D game where players control a plane to shoot down UFOs hovering over a city.

## Requirements

- 3D environment with a city landscape
- Controllable plane that can fly around the environment
- Multiple UFO enemies hovering over the city
- Shooting mechanics to eliminate UFOs
- Collision detection for projectiles and objects
- Explosions and visual effects
- Game states (start screen, gameplay, victory, and defeat)
- Background music and sound effects

## Tech Stack

- **Three.js** - 3D rendering library
- **JavaScript/TypeScript** - Core programming language
- **HTML/CSS** - Basic structure and styling
- **Webpack/Vite** - Build tools and development environment
- **Howler.js** - Audio library for sound effects and music

## Milestones

### 1. Create Plane Model
- Design and implement the 3D model for the player's plane
- Set up camera positioning and perspective
- Implement basic rendering of the plane in a test environment

### 2. Build City Environment
- Create a 3D city landscape with buildings
- Implement skybox and lighting
- Add terrain and environmental details

### 3. Set Up Plane Controls
- Implement keyboard/mouse controls for flying the plane
- Add physics for realistic movement (speed, turning, altitude)
- Create boundaries for the playable area

### 4. Add UFOs, Shooting, and Explosions
- Design and implement UFO models and behavior patterns
- Add shooting mechanics and projectile physics
- Implement collision detection
- Create explosion effects when UFOs are destroyed
- Add scoring system

### 5. Add Music, Sound Effects, and Game Screens
- Implement background music during gameplay
- Add sound effects for shooting, explosions, and flight
- Create start screen with instructions
- Design victory and defeat screens
- Implement game state management

## Audio Integration

The game uses custom music generated with [Suno.ai](https://suno.com/). To use custom music:

1. Generate the following music tracks using Suno.ai:
   - Background music: An upbeat, adventure-themed track for gameplay
   - Victory music: A triumphant, celebratory track
   - Lose music: A somber, dramatic track

2. Download the generated MP3 files and replace the placeholder files in the `/audio` directory:
   - `background_music.mp3`
   - `victory_music.mp3`
   - `lose_music.mp3`

## Controls

- **Arrow Up/Down**: Pitch up/down
- **Arrow Left/Right**: Roll left/right
- **Page Up/Page Down**: Increase/decrease speed
- **C**: Toggle camera mode
- **M**: Toggle music/sound

## Running the Game

Start a local web server in the project directory:

```
npm start
```

Then access the game at [http://localhost:8080](http://localhost:8080)
