export class AudioManager {
    constructor() {
        this.sounds = {};
        this.currentMusic = null;
        this.isMuted = false;
        
        // Create audio elements
        this.createAudio();
    }
    
    createAudio() {
        // Background music
        this.sounds.backgroundMusic = new Audio('./audio/background_music.mp3');
        this.sounds.backgroundMusic.loop = true;
        this.sounds.backgroundMusic.volume = 0.5;
        
        // Victory music
        this.sounds.victoryMusic = new Audio('./audio/victory_music.mp3');
        this.sounds.victoryMusic.loop = false;
        this.sounds.victoryMusic.volume = 0.6;
        
        // Lose music
        this.sounds.loseMusic = new Audio('./audio/lose_music.mp3');
        this.sounds.loseMusic.loop = false;
        this.sounds.loseMusic.volume = 0.6;
    }
    
    playMusic(type) {
        // Stop current music if any
        this.stopMusic();
        
        if (this.isMuted) return;
        
        if (this.sounds[type]) {
            this.sounds[type].currentTime = 0;
            this.sounds[type].play()
                .catch(e => console.error(`Error playing ${type}:`, e));
            this.currentMusic = type;
        } else {
            console.error(`Music type ${type} not found`);
        }
    }
    
    stopMusic() {
        if (this.currentMusic && this.sounds[this.currentMusic]) {
            this.sounds[this.currentMusic].pause();
            this.sounds[this.currentMusic].currentTime = 0;
        }
        this.currentMusic = null;
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Apply mute setting to all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.muted = this.isMuted;
        });
        
        return this.isMuted;
    }
    
    // Public methods to play specific music
    playBackgroundMusic() {
        this.playMusic('backgroundMusic');
    }
    
    playVictoryMusic() {
        this.playMusic('victoryMusic');
    }
    
    playLoseMusic() {
        this.playMusic('loseMusic');
    }
} 