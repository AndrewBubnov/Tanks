
$('<div>').addClass('container').appendTo('body');

let keysData = [
    {x: -1,
        y: 0,
        direction: 'left',
        opposite: 'right',
        nextDir: 'up',
        number: 3,
        key: 37,
        fire: false},
    {x: 0,
        y: -1,
        direction: 'up',
        opposite: 'down',
        nextDir: 'right',
        number: 0,
        key: 38,
        fire: false},
    {x: 1,
        y: 0,
        direction: 'right',
        opposite: 'left',
        nextDir: 'down',
        number: 1,
        key: 39,
        fire: false},
    {x: 0,
        y: 1,
        direction: 'down',
        opposite: 'up',
        nextDir: 'left',
        number: 2,
        key: 40,
        fire: false},
    {x: 0,
        y: 0,
        direction: "",
        opposite: '',
        nextDir: '',
        number: undefined,
        key: 32,
        fire: true}];

let currentArray = [];

function getCounter() {
    let counter = 0;
    return function() {
        return counter++;
    }
}
let enemyCounter = getCounter();

class Tank {
    constructor (x, y){
        this.startX = x;
        this.startY = y;
        this.movesNumber = 0;
        this.locked = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.id = enemyCounter();
        if(!Tank.instances) Tank.instances = [];
        Tank.instances.push(this);

    }

    fireFun(){
        let x = (this.startX + this.offsetX);
        let y = (this.startY + this.offsetY);
        switch (this.direction){
            case 'down':
                x = x + 7;
                y = y + 17;
                this.bulletTrace([x, y], [x, 500]);
                break;
            case 'up':
                x = x + 7;
                this.bulletTrace([x, y], [x, 0]);
                break;
            case 'left':
                y = y + 7;
                this.bulletTrace([x, y], [0, y]);
                break;
            case 'right':
                x = x + 17;
                y = y + 7;
                this.bulletTrace([x, y], [500, y]);
                break;
        }
    }
    move(direction, moveArray, fire){
        this.locked = false;
        if (direction !== "") this.direction = direction;
        if (fire) this.fireFun();
        let tank = $('#' + this.id);
        if (this.offsetX + this.startX + moveArray[0]*2 >= 0 && this.offsetX + this.startX + moveArray[0]*2 <= 480) this.offsetX += moveArray[0]*2;
        else this.locked = true;
        if (this.offsetY + this.startY + moveArray[1]*2 >= 0 && this.offsetY + this.startY + moveArray[1]*2 <= 480) this.offsetY += moveArray[1]*2;
        else this.locked = true;
        let x = (this.startX + this.offsetX);
        let y = (this.startY + this.offsetY);
        if (collide([x, y], this.id)) {
            let back = keysData.find(element => element.direction === direction);
            this.offsetX -= moveArray[0]*2;
            this.offsetY -= moveArray[1]*2;
            this.move(back.opposite, [moveArray[0]*(-1), moveArray[1]*(-1)], fire);
        }

        let turn = "";
        switch (this.direction){
            case 'right':
                tank.css({'transform': 'rotate(90deg)'});
                turn = ' rotate(90deg)';
                break;
            case 'left':
                tank.css({'transform': 'rotate(-90deg)'});
                turn = ' rotate(-90deg)';
                break;
            case 'down':
                tank.css({'transform': 'rotate(180deg)'});
                turn = ' rotate(180deg)';
                break;
            case 'up':
                tank.css({'transform': ''});
                turn = '';
                break;
        }
        tank.css({'transform': 'translate(' + this.offsetX + 'px,' + this.offsetY + 'px)' + turn});
    }
}

class EnemyTank extends Tank{
    init(fire) {
        currentArray[this.id] = [this.startX, this.startY];
        if (this.direction === undefined) this.direction = 'up';
        if (fire) this.fireFun();
        $('<div>').addClass('tank enemy-tank').attr('id', this.id).css('top', this.startY + 'px').css('left', this.startX + 'px').appendTo($('.container'));
        this.randomMove();
    }
    randomMove(){
        let tank = this;
        let current;
        let direction;
        let fire = false;
        let moveArray = [];

        this.interval = setInterval(function () {
            let random = Math.floor(Math.random()*4);
            if (tank.movesNumber > 100) {
                current = keysData.find(element => element.number === random);
                direction = current.direction;
                moveArray = [current.x, current.y];
                tank.movesNumber = 0;
            } else {
                direction = tank.direction;
                tank.movesNumber++;
            }
            let data = keysData.find(element => element.direction === tank.direction);
            moveArray = [data.x, data.y];
            let fireRandom = Math.floor(Math.random()*100);
            if(fireRandom % 20 === 0) fire = true;
            tank.move(direction, moveArray, fire);
            if (tank.locked) {
                tank.direction = data.nextDir;
                tank.movesNumber = 0;
            }
            fire = false;
        }, 30);
    }

    bulletTrace(start, finish){

        let step;
        let current = start;
        let bulletInterval;
        let offset = 0;
        let bullet = 0;
        let myTank = currentArray[currentArray.length - 1];
        if (start[0] === finish[0]){
            start[1] < finish[1] ? step = 10 : step = -10;
            bullet = $('<div>').addClass('red').css('top', current[1] + step).css('left', current[0]).appendTo($('.container'));
            bulletInterval = setInterval(function () {
                current[1] += step;
                bullet.css({'transform': 'translate(0px, ' + offset + 'px)'});
                offset += step;
                if (current[1] > 500 || current[1] < 0) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                }
                if (current[0] - myTank[0] <= 21 && current[0] - myTank[0] >= 1 && current[1] - myTank[1] <= 21 && current[1] - myTank[1] >= 1){
                    $('.table').text('Game over');
                    $('<div>').addClass('burst').css('top', current[1] + 'px').css('left', current[0] + step + 'px').appendTo($('.container'));
                    setTimeout(function () {
                        gameOver(current, bulletInterval);
                        $('.burst').remove();
                    }, 500);

                }
            }, 30);
        } else {
            start[0] < finish[0] ? step = 10 : step = -10;
            bullet = $('<div>').addClass('red').css('top', current[1]).css('left', current[0] + step).appendTo($('.container'));
            bulletInterval = setInterval(function () {
                current[0] += step;
                bullet.css({'transform': 'translate(' + offset + 'px, 0px)'});
                offset += step;
                if (current[0] > 500 || current[0] < 0) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                }
                if (current[0] - myTank[0] <= 21 && current[0] - myTank[0] >= 1 && current[1] - myTank[1] <= 21 && current[1] - myTank[1] >= 1){
                    $('.table').text('Game over');
                    $('<div>').addClass('burst').css('top', current[1] + 'px').css('left', current[0] + step + 'px').appendTo($('.container'));
                    setTimeout(function () {
                        gameOver(current, bulletInterval);
                        $('.burst').remove();
                    }, 500);
                }
            }, 30);
        }
    }
}

class MyTank extends Tank{
    init(fire) {
        currentArray[this.id] = [this.startX, this.startY];
        if (this.direction === undefined) this.direction = 'up';
        if (fire) this.fireFun();
        $('<div>').addClass('tank my-tank').attr('id', this.id).css('top', this.startY + 'px').css('left', this.startX + 'px').appendTo($('.container'));

    }
    bulletTrace(start, finish){
        let step;
        let current = start;
        let bulletInterval;
        let bullet;
        let offset = 0;
        if (start[0] === finish[0]){
            start[1] < finish[1] ? step = 10 : step = -10;
            bullet = $('<div>').addClass('red').css('top', current[1] + step).css('left', current[0]).appendTo($('.container'));
            bulletInterval = setInterval(function () {
                current[1] += step;
                bullet.css({'transform': 'translate(0px, ' + offset + 'px)'});
                offset += step;
                if (current[1] > 500 || current[1] < 0) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                }
                isHit(current, bulletInterval);
            }, 30);
        } else {
            start[0] < finish[0] ? step = 10 : step = -10;
            bullet = $('<div>').addClass('red').css('top', current[1]).css('left', current[0]).appendTo($('.container'));
            bulletInterval = setInterval(function () {
                current[0] += step;
                bullet.css({'transform': 'translate(' + offset + 'px, 0px)'});
                offset += step;
                if (current[0] > 500 || current[0] < 0) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                }
                isHit(current, bulletInterval);
            }, 30);
        }
    }
}

function isHit(current, bulletInterval) {
    let hit = currentArray.findIndex(element => current[0] - element[0] <= 21 && current[0] - element[0] >= 1 && current[1] - element[1] <= 21 && current[1] - element[1] >= 1);
    if (hit !== -1){
        clearInterval(bulletInterval);
        $('<div>').addClass('burst').css('top', current[1] + 'px').css('left', current[0] + 'px').appendTo($('.container'));
        setTimeout(function () {
            $('#' + hit).remove();
            clearInterval(Tank.instances[hit].interval);
            Tank.instances[hit] = {};
            $('.red').remove();
            $('.burst').remove();
            let enemy = newEnemy();
            let newTank = new EnemyTank(enemy[0], enemy[1]);
            newTank.id = hit;
            currentArray.splice(hit, 1, enemy);
            Tank.instances.splice(hit, 1, newTank);
            Tank.instances.pop();
            newTank.init();
        }, 500);
    }
}

function newEnemy() {
    let x = 0;
    let y = 0;
    while (true){
        x = Math.floor(Math.random()*481);
        y = Math.floor(Math.random()*481);
        if (!currentArray.some(element => Math.abs(element[0] - x) < 50 && Math.abs(element[1] - y) < 50)) break;
    }
    return [x, y];
}

function collide(array, index) {
    let tempArray = currentArray.slice();
    tempArray.splice(index, 1);
    let result = tempArray.some(function (element) {
        return (element[0] - array[0]) * (element[0] - array[0]) + (element[1] - array[1]) * (element[1] - array[1]) < 800;
    });
    currentArray.splice(index, 1, array);
    return result;
}

function gameOver(current, bulletInterval){
    clearInterval(bulletInterval);
    Tank.instances.forEach(element => clearInterval(element.interval));
    $('<div>').addClass('burst').appendTo($('#' + current[0] + '_' + current[1]));
    $('body').off('keydown', keyDefine);
    $('.red').remove();
}


function keyDefine(e) {
    let current = keysData.find(element => element.key === parseInt(e.which));
    if (tank !== undefined) tank.move(current.direction, [current.x, current.y],current.fire);
}

$('body').on('keydown', keyDefine);



new EnemyTank(100, 100).init();
new EnemyTank(200, 200).init();
new EnemyTank(400, 100).init();
new EnemyTank(150, 150).init();
// new EnemyTank(250, 250).init();
// new EnemyTank(300, 400).init();

let tank = new MyTank(100, 200);
tank.init();






