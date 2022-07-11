class Character {
    constructor(name = '') {
        this.name = name;
        this.health = Math.floor(Math.random() * 10 + 95);
        this.strength = Math.floor(Math.random() * 5 + 7);
        this.agility = Math.floor(Math.random() * 5 + 7);
        this.critical = false;
    }

    isAlive() {

        if (this.health === 0) {
            return false;
        }
        return true;
    };

    getHealth() {
        return `${this.name}'s health is now ${this.health}!`;
    };

    getAttackValue() {
        this.criticalStrike();
        let min;
        let max;
        if (this.critical) {
            min = this.strength + 5;
            max = this.strength + 10;
            this.critical = false;
        } else {
            min = this.strength - 5;
            max = this.strength + 5;
        }
        return Math.floor(Math.random() * (max - min) + min);
    };

    reduceHealth(health) {
        this.health -= health;

        if (this.health < 0) {
            this.health = 0;
        };
    };

    criticalStrike() {
        //add critical hit chance
        let percentage = (Math.random() * 100);
        // console.log(percentage);
        if ((percentage + this.agility) > 90) {
            console.log(`${this.name} landed a critical strike!`);
            return this.critical = true;
        }
        return this.critical;
    };
};


module.exports = Character;