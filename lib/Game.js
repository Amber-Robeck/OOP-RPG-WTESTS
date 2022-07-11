const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');
const { enemyCreator } = require('./enemyArray');

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;

}
Game.prototype.chooseDifficulty = function () {
    inquirer
        .prompt({
            type: 'list',
            name: 'difficulty',
            message: 'Choose a difficulty level',
            choices: ['easy', 'medium', 'hard']
        })
        .then(({ difficulty }) => {
            switch (difficulty) {
                case 'easy':
                    this.createEnemy(1);
                    break;
                case 'medium':
                    this.createEnemy(2);
                    break;
                case 'hard':
                    this.createEnemy(3);
                    break;
            }
            console.log(this.enemies);
            this.chooseName();
        });
};
Game.prototype.chooseName = function () {
    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        })
        // destructure name from the prompt object
        .then(({ name }) => {
            this.player = new Player(name);

            // test the object creation
            // console.log(this.currentEnemy, this.player);
            this.startNewBattle();
        })
}

Game.prototype.createEnemy = function (n) {
    for (let i = 0; i < n; i++) {
        const randEnemy = enemyCreator.randEnemy[Math.floor(Math.random() * enemyCreator.randEnemy.length)];
        const randWeapon = enemyCreator.weapons[Math.floor(Math.random() * enemyCreator.weapons.length)];
        this.enemies.push(new Enemy(randEnemy, randWeapon));
    };
    this.currentEnemy = this.enemies[this.enemies.length - 1];
};
Game.prototype.startNewBattle = function () {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }
    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());
    this.battle();
};

Game.prototype.battle = function () {
    if (this.isPlayerTurn) {
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use potion', 'Flee']
            })
            .then(({ action }) => {
                if (action === 'Use potion') {
                    if (!this.player.getInventory()) {
                        console.log("You don't have any potions!");
                        return this.checkEndOfBattle();
                    }

                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which potion would you like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then(({ action }) => {
                            const potionDetails = action.split(': ');

                            this.player.usePotion(potionDetails[0] - 1);
                            console.log(`You used a ${potionDetails[1]} potion.`);
                            this.checkEndOfBattle();
                        });
                }
                else if (action === 'Flee') {
                    console.log('You fled the battle!');
                    return;
                }
                else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);

                    console.log(`You attacked the ${this.currentEnemy.name}`);
                    console.log(this.currentEnemy.getHealth());
                    this.checkEndOfBattle();
                }
            });
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());
        this.checkEndOfBattle();
    }
};
Game.prototype.checkEndOfBattle = function () {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    }
    else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);

        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('You win!');
        }
    }
    else {
        console.log("You've been defeated!");
    }
};



module.exports = Game;