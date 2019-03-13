import Phaser from 'phaser';
import ScrollingBackground from '../Sprites/ScrollingBackground';

export default class MainMenu extends Phaser.Scene {
    btnPlay = null
    title = null
    backgrounds = []
    constructor() {
        super({ key: "MainMenu" });
    }
    preload() {
        this.load.image("sprBg0", "assets/sprBg0.png");
        this.load.image("sprBg1", "assets/sprBg1.png");
        this.load.image("sprBtnPlay", "assets/sprBtnPlay.png");
        this.load.image("sprBtnPlayHover", "assets/sprBtnPlayHover.png");
        this.load.image("sprBtnPlayDown", "assets/sprBtnPlayDown.png");
        this.load.image("sprBtnRestart", "assets/sprBtnRestart.png");
        this.load.image("sprBtnRestartHover", "assets/sprBtnRestartHover.png");
        this.load.image("sprBtnRestartDown", "assets/sprBtnRestartDown.png");
        this.load.audio("sndBtnOver", "assets/sndBtnOver.wav");
        this.load.audio("sndBtnDown", "assets/sndBtnDown.wav");
    }
    create() {
        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };

        this.title = this.add.text(this.game.config.width * 0.5, 128, this.game.config.gameTitle, {
            fontFamily: 'monospace',
            fontSize: 32,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        // Show the scrolling background
        for (let i = 0; i < 5; i++) {
            const keys = ["sprBg0", "sprBg1"];
            const key = keys[Phaser.Math.Between(0, keys.length - 1)];
            const bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }

        // Manage the Play button
        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        );
        this.btnPlay.setInteractive();
        this.btnPlay.on("pointerover", () => {
            this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
            this.sfx.btnOver.play(); // play the button over sound
        });
        this.btnPlay.on("pointerout", function() {
            this.setTexture("sprBtnPlay");
        });
        this.btnPlay.on("pointerdown", () => {
            this.btnPlay.setTexture("sprBtnPlayDown");
            this.sfx.btnDown.play();
            this.scene.start("Main");
        });
    }
    update() {
        this.backgrounds.forEach((background) => {
            background.update();
        });
    }
}