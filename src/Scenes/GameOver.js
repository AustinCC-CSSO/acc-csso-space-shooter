import Phaser, {Math} from 'phaser';
import ScrollingBackground from '../Sprites/ScrollingBackground';

export default class GameOver extends Phaser.Scene {
    title = null
    btnRestart = null
    screenText = null
    score = null
    backgrounds = []
    mainTheme = null
    constructor() {
        super({ key: "GameOver" });
    }
    preload(){
        this.load.image("sprBg0", "assets/sprBg0.png");
        this.load.image("sprBg1", "assets/sprBg1.png");
    }
    create() {
        this.mainTheme = this.sound.get('mainTheme');
        if(this.mainTheme){
            let timerCallback = () => {
                if(this.mainTheme.volume <= 0){
                    this.mainTheme.stop();
                    timer.remove();
                }

                this.mainTheme.setVolume(Math.MinSub(this.mainTheme.volume, 0.1, 0));
            }

            let timer = this.time.addEvent({
                delay: 1000,
                callback: timerCallback,
                loop: true
            })

        }
        this.sfx = {
            btnOver: this.sound.add("sndBtnOver"),
            btnDown: this.sound.add("sndBtnDown")
        };

        this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        // Show score if available
        let highScore = this.registry.get('score');
        if(!isNaN(highScore)){
            this.score = this.add.bitmapText(0,0, 'scorefont', highScore);
            this.score.scale = 0.7;

            this.screenText = this.add.group();
            this.screenText.add(this.score);
            this.screenText.setDepth(1);
        }


        for (let i = 0; i < 5; i++) {
            let keys = ["sprBg0", "sprBg1"];
            let key = keys[Phaser.Math.Between(0, keys.length - 1)];
            let bg = new ScrollingBackground(this, key, i * 10);
            this.backgrounds.push(bg);
        }

        this.btnRestart = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnRestart"
        );
        this.btnRestart.setInteractive();
        this.btnRestart.on("pointerover", () => {
            this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
            this.sfx.btnOver.play(); // play the button over sound
        });
        this.btnRestart.on("pointerout", () => {
            this.btnRestart.setTexture("sprBtnRestart");
        });
        this.btnRestart.on("pointerdown", () => {
            this.btnRestart.setTexture("sprBtnRestartDown");
            this.sfx.btnDown.play();
        });
        this.btnRestart.on("pointerup", () => {
            this.btnRestart.setTexture("sprBtnRestart");
            this.scene.start("Main");
        });
    }
    update() {
        this.backgrounds.forEach((background) => {
            background.update();
        });
    }
}