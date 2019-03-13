import Enemy from './Enemy';
import EnemyLaser from './EnemyLaser';

export default class GunShip extends Enemy {
    shootTimer = null
    constructor(scene, x, y) {
        super(scene, x, y, "sprEnemy0", "GunShip");
        this.play("sprEnemy0");

        this.shootTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                const laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y
                );
                laser.setScale(this.scaleX);
                this.scene.enemyLasers.add(laser);
            },
            loop: true
        });
    }
    onDestroy() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
                this.shootTimer.remove(false);
            }
        }
    }
}