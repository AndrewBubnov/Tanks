function fill() {
    $('<div>').addClass('container').appendTo('body');

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            $('<div>').addClass('cell').attr('id', (j + 1) + '_' + (i + 1)).appendTo($('.container'));
        }
    }
}
fill();
class Tank {
    constructor (){
        this.x = 10;
        this.y = 10;
        this.direction = undefined;
    }
    init(fire) {
        let array = [];
        if (this.direction === undefined) this.direction = 'down';
        if (fire) {
            this.fireFun();
        }
        else {
        switch (this.direction) {
            case 'up':
            array = [[this.x + 1, this.y + 1], [this.x + 3, this.y + 1], [this.x + 5, this.y + 1],
            [this.x + 1, this.y + 2], [this.x + 2, this.y + 2], [this.x + 3, this.y + 2], [this.x + 4, this.y + 2], [this.x + 5, this.y + 2],
            [this.x + 1, this.y + 3], [this.x + 2, this.y + 3], [this.x + 3, this.y + 3], [this.x + 4, this.y + 3], [this.x + 5, this.y + 3],
            [this.x + 1, this.y + 4], [this.x + 2, this.y + 4], [this.x + 3, this.y + 4], [this.x + 4, this.y + 4], [this.x + 5, this.y + 4],
            [this.x + 1, this.y + 5], [this.x + 5, this.y + 5]];
            break;
            case 'right':
            array = [[this.x + 1, this.y + 1], [this.x + 2, this.y + 1], [this.x + 3, this.y + 1], [this.x + 4, this.y + 1],[this.x + 5, this.y + 1],
            [this.x + 2, this.y + 2], [this.x + 3, this.y + 2], [this.x + 4, this.y + 2],
            [this.x + 2, this.y + 3], [this.x + 3, this.y + 3], [this.x + 4, this.y + 3], [this.x + 5, this.y + 3],
            [this.x + 2, this.y + 4], [this.x + 3, this.y + 4], [this.x + 4, this.y + 4],
            [this.x + 1, this.y + 5], [this.x + 2, this.y + 5], [this.x + 3, this.y + 5], [this.x + 4, this.y + 5],[this.x + 5, this.y + 5]];
            break;
            case 'down':
            array = [[this.x + 1, this.y + 1], [this.x + 5, this.y + 1],
            [this.x + 1, this.y + 2], [this.x + 2, this.y + 2], [this.x + 3, this.y + 2], [this.x + 4, this.y + 2], [this.x + 5, this.y + 2],
            [this.x + 1, this.y + 3], [this.x + 2, this.y + 3], [this.x + 3, this.y + 3], [this.x + 4, this.y + 3], [this.x + 5, this.y + 3],
            [this.x + 1, this.y + 4], [this.x + 2, this.y + 4], [this.x + 3, this.y + 4], [this.x + 4, this.y + 4], [this.x + 5, this.y + 4],
            [this.x + 1, this.y + 5], [this.x + 3, this.y + 5], [this.x + 5, this.y + 5]];
            break;
            case 'left':
            array = [[this.x + 1, this.y + 1], [this.x + 2, this.y + 1], [this.x + 3, this.y + 1], [this.x + 4, this.y + 1],[this.x + 5, this.y + 1],
            [this.x + 2, this.y + 2], [this.x + 3, this.y + 2], [this.x + 4, this.y + 2],
            [this.x + 1, this.y + 3], [this.x + 2, this.y + 3], [this.x + 3, this.y + 3], [this.x + 4, this.y + 3],
            [this.x + 2, this.y + 4], [this.x + 3, this.y + 4], [this.x + 4, this.y + 4],
            [this.x + 1, this.y + 5], [this.x + 2, this.y + 5], [this.x + 3, this.y + 5], [this.x + 4, this.y + 5],[this.x + 5, this.y + 5]];
            break;
        }
        array.forEach((element)=>
            $('<div>').addClass('green').appendTo($('#' + element[0] + '_' + element[1])));
        }
        this.randomMove();
    }
    bulletTrace(start, finish){
        let step;
        let current = start;
        if (start[0] === finish[0]){
            start[1] < finish[1] ? step = 1 : step = -1;
            let interval = setInterval(function () {
                $('#' + current[0]+ '_' + current[1]).empty();
                current[1] > 100 || current[1] < 0 ? clearInterval(interval) : current[1] += step;
                $('<div>').addClass('red').appendTo($('#' + current[0] + '_' + current[1]));
            }, 50);
        } else {
            start[0] < finish[0] ? step = 1 : step = -1;
            let interval = setInterval(function () {
                $('#' + current[0]+ '_' + current[1]).empty();
                current[0] > 100 || current[0] < 0 ? clearInterval(interval) : current[0] += step;
                $('<div>').addClass('red').appendTo($('#' + current[0] + '_' + current[1]));
            }, 50);
        }
    }
    fireFun(){
        let x = 0;
        let y = 0;
        switch (this.direction){
            case 'down':
               x = this.x + 3;
               y = this.y + 6;
               this.bulletTrace([x, y], [x, 100]);
               break;
            case 'up':
                x = this.x + 3;
                y = this.y;
                this.bulletTrace([x, y], [x, 0]);
                break;
            case 'left':
                x = this.x;
                y = this.y + 3;
                this.bulletTrace([x, y], [0, y]);
                break;
            case 'right':
                x = this.x + 6;
                y = this.y + 3;
                this.bulletTrace([x, y], [100, y]);
                break;
        }
    }
    clear(){
        $('.green').remove();
    }
    move(direction, moveArray, fire){
        if (direction !== "") this.direction = direction;
        if (!fire) this.clear();
        if (this.x >= 0 && this.x <= 95) this.x += moveArray[0];
        if (this.y >= 0 && this.y <= 95) this.y += moveArray[1];
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x > 95) this.x = 95;
        if (this.y > 95) this.y = 95;
        this.init(fire);
        }

    randomMove(){

        let direction;
        let x = 0;
        let y = 0;
        let tank = this;
        setInterval(function () {
            let random = Math.floor(Math.random()*4);
            switch (random){
                case 0:
                    direction = 'up';
                    y = -1;
                    break;
                case 1:
                    direction = 'right';
                    x = 1;
                    break;
                case 2:
                    direction = 'down';
                    y = 1;
                    break;
                case 3:
                    direction = 'left';
                    x = -1;
                    break;
            }
            console.log(direction);
            tank.move(direction, [x, y]);
        }, 1000);


    }
}



$('body').on('keydown', keyDefine);

function keyDefine(e) {
    let x = 0;
    let y = 0;
    let direction = "";
    let fire = false;
    switch (e.which){
        case 37:
            x = -1;
            direction = 'left';
            break;
        case 38:
            y = -1;
            direction = 'up';
            break;
        case 39:
            x = 1;
            direction = 'right';
            break;
        case 40:
            y = 1;
            direction = 'down';
            break;
        case 32:
            fire = true;
            break;
    }
  if (tank !== undefined) tank.move(direction, [x, y], fire);
}

let tank = new Tank();
tank.init();
