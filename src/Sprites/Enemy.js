import Phaser from 'phaser';
import Entity from './Entity';

export default class Enemy extends Entity {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key, type);
        this.body.velocity.y = Phaser.Math.Between(50, 100);
    }
    score = 10
}