import Main from '../Scenes/Main';
import MainMenu from '../Scenes/MainMenu';
import GameOver from '../Scenes/GameOver';
import Phaser from 'phaser';
import React, { Component } from 'react';

export const config = {
    type: Phaser.WEBGL,
    width: 480,
    height: 640,
    backgroundColor: "black",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
        }
    },
    scene: [MainMenu, Main, GameOver],
    pixelArt: true,
    roundPixels: true,
    parent: 'game',
    title: 'A Simple Space Shooter',
}


export default class Game extends Component {
    componentWillMount(){
        this.props.initializeGame(new Phaser.Game(config));
    }
    render(){
        return <div id="game"></div>;
    }
}