import Phaser from 'phaser';

export default class ScrollingBackground {
    scene = null
    key = null
    velocityY = null
    layers = null
    constructor(scene, key, velocityY) {
        this.scene = scene;
        this.key = key;
        this.velocityY = velocityY;
        this.layers = this.scene.add.group();

        this.createLayers();
    }
    createLayers(){
        for (let i = 0; i < 2; i++) {
            // creating two backgrounds will allow a continuous scroll
            const layer = this.scene.add.sprite(0, 0, this.key);
            layer.y = (layer.displayHeight * i);
            const flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            const flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            layer.setScale(flipX * 2, flipY * 2);
            layer.setDepth(-5 - (i - 1));
            this.scene.physics.world.enableBody(layer, Phaser.Physics.Arcade.DYNAMIC_BODY);
            layer.body.velocity.y = this.velocityY;
            this.layers.add(layer);
        }
    }
    update(){
        if (this.layers.children && this.layers.getChildren()[0].y > 0) {
            this.layers.getChildren().forEach((layer, index) => {
                layer.y = (-layer.displayHeight) + (layer.displayHeight * parseInt(index));
            });
        }
    }
}