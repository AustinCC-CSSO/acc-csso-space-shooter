import Phaser from 'phaser';
import CarrierShip from '../Sprites/CarrierShip';
import ChaserShip from '../Sprites/ChaserShip';
import GunShip from '../Sprites/GunShip';
import Player from '../Sprites/Player';
import ScrollingBackground from '../Sprites/ScrollingBackground';

export const DEFAULT_VOLUME = 0.5;

export default class Main extends Phaser.Scene {
    player = null
    keyW = null
    keyS = null
    keyA = null
    keyD = null
    keySpace = null
    enemies = null
    enemyLasers = null
    playerLasers = null
    screenText = null
    score = null
    backgrounds = []
    mainTheme = null
    constructor() {
        super({ key: "Main" });
    }
    preload() {
        this.load.image("sprBg0", "assets/sprBg0.png");
        this.load.image("sprBg1", "assets/sprBg1.png");
        this.load.spritesheet("sprExplosion", "assets/sprExplosion.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("sprEnemy0", "assets/sprEnemy0.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprEnemy1", "assets/sprEnemy1.png");
        this.load.spritesheet("sprEnemy2", "assets/sprEnemy2.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image("sprLaserEnemy0", "assets/sprLaserEnemy0.png");
        this.load.image("sprLaserPlayer", "assets/sprLaserPlayer.png");
        this.load.spritesheet("sprPlayer", "assets/sprPlayer.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("sndExplode0", "assets/sndExplode0.wav");
        this.load.audio("sndExplode1", "assets/sndExplode1.wav");
        this.load.audio("sndLaser", "assets/sndLaser.wav");

        // Bitmap Fonts
        this.load.bitmapFont('scorefont', 'assets/scorefont.png', 'assets/scorefont.fnt');

        // Music
        this.load.audio('mainTheme', 'assets/music/mainTheme.wav');
    }
    create() {
        // Load audio as sound
        if(!this.sound.get('mainTheme')){
            this.mainTheme  = this.sound.add('mainTheme');
        } else {
            // Restore mainTheme settings
            this.mainTheme.setVolume(DEFAULT_VOLUME);
        }

        // Scene Events
        this.events.on('gameStart', () => {
            if(this.mainTheme && !this.mainTheme.isPlaying){
                this.mainTheme.play({
                    loop: true,
                    volume: DEFAULT_VOLUME
                });
            }
        });
        this.events.on('gameEnd', () => {
            this.scene.start("GameOver");
        });

        this.anims.create({
            key: "sprEnemy0",
            frames: this.anims.generateFrameNumbers("sprEnemy0"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "sprEnemy2",
            frames: this.anims.generateFrameNumbers("sprEnemy2"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "sprExplosion",
            frames: this.anims.generateFrameNumbers("sprExplosion"),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: "sprPlayer",
            frames: this.anims.generateFrameNumbers("sprPlayer"),
            frameRate: 20,
            repeat: -1
        });

        // Setup score
        this.score = this.add.bitmapText(0,0, 'scorefont', 0);
        this.score.scale = 0.7;

        this.screenText = this.add.group();
        this.screenText.add(this.score);
        this.screenText.setDepth(1);

        // Reset score
        this.registry.set('score', null);

        // Setup the Sound FX library
        this.sfx = {
            explosions: [
                this.sound.add("sndExplode0"),
                this.sound.add("sndExplode1")
            ],
            laser: this.sound.add("sndLaser")
        };

        for (let i = 0; i < 5; i++) { // create five scrolling backgrounds
            const bg = new ScrollingBackground(this, "sprBg0", i * 10);
            this.backgrounds.push(bg);
        }

        // Create the player
        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprPlayer"
        );

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.enemies = this.add.group();
        this.enemyLasers = this.add.group();
        this.playerLasers = this.add.group();

        // Spawn the enemies
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                let enemy = null;
                if (Phaser.Math.Between(0, 10) >= 3) {
                    enemy = new GunShip(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                }
                else if (Phaser.Math.Between(0, 10) >= 5) {
                    if (this.getEnemiesByType("ChaserShip").length < 5) {
                        enemy = new ChaserShip(
                            this,
                            Phaser.Math.Between(0, this.game.config.width),
                            0
                        );
                    }
                }
                else {
                    enemy = new CarrierShip(
                        this,
                        Phaser.Math.Between(0, this.game.config.width),
                        0
                    );
                }
                if (enemy !== null) {
                    enemy.setScale(Phaser.Math.Between(10, 20) * 0.1);
                    this.enemies.add(enemy);
                }
            },
            loop: true
        });

        // Setup the colliders
        this.physics.add.collider(this.playerLasers, this.enemies, (playerLaser, enemy) => {
            if (enemy) {
                if (enemy.onDestroy !== undefined) {
                    enemy.onDestroy();
                }
                enemy.explode(true);
                playerLaser.destroy();
            }
        });

        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            if (!player.getData("isDead") &&
                !enemy.getData("isDead")) {
                player.explode(false);
                player.onDestroy();
                enemy.explode(true);
            }
        });

        this.physics.add.overlap(this.player, this.enemyLasers, (player, laser) => {
            if (!player.getData("isDead") &&
                !laser.getData("isDead")) {
                player.explode(false);
                player.onDestroy();
                laser.destroy();
            }
        });

        this.events.emit('gameStart');
    }
    update(){
        if (!this.player.getData("isDead")) {
            this.player.update();

            // Keyboard Input
            if (this.keyW.isDown || this.keyUp.isDown) {
                this.player.moveUp();
            }
            else if (this.keyS.isDown || this.keyDown.isDown) {
                this.player.moveDown();
            }
            if (this.keyA.isDown || this.keyLeft.isDown) {
                this.player.moveLeft();
            }
            else if (this.keyD.isDown || this.keyRight.isDown) {
                this.player.moveRight();
            }

            if (this.keySpace.isDown) {
                this.player.setData("isShooting", true);
            }
            else {
                this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
                this.player.setData("isShooting", false);
            }
        }

        // Cull the frustrums! (Remove sprites after they've left the screen)
        this.enemies.getChildren().forEach((enemy) => {
            enemy.update();

            if (enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight) {
                if (enemy.onDestroy !== undefined) {
                    enemy.onDestroy();
                }
                enemy.destroy();
            }
        });
        this.enemyLasers.getChildren().forEach((laser) => {
            laser.update();
            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        });
        this.playerLasers.getChildren().forEach((laser) => {
            laser.update();
            if (laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight * 4 ||
                laser.y > this.game.config.height + laser.displayHeight) {
                if (laser) {
                    laser.destroy();
                }
            }
        });
        // Update the background game objects so that they continuously scroll
        this.backgrounds.forEach((background) => {
            background.update();
        });
    }
    getEnemiesByType(type) {
        let arr = [];
        this.enemies.getChildren().forEach((enemy) => {
            if (enemy.getData("type") === type) {
                arr.push(enemy);
            }
        });
        return arr;
    }
}