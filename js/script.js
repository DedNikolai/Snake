function snake(i, j, direction) {
    this.curentTop = i;
    this.curentLeft = j;
    this.beforeTop = i;
    this.beforeLeft = j;
    this.direction = direction;
    this.beforeDirection = direction;
}

function apple(i, j) {
    this.curentTop = i;
    this.curentLeft = j;
}

let snakeHead = new snake(5, 3, 'right');
let snakeTail = new snake(5, 1, 'right');
let snakeBody = new snake(5, 2, 'right');
let newApple = new apple(-1, -1);

[...snakePoints] = [snakeHead, snakeBody, snakeTail];

createApple();

let stop = setInterval(() => {
    eatApple();
    moveHead();
    moveSnake();
    if (crash()) {
        $('.modal-game-over').addClass('game-over');
        clearInterval(stop);
        console.log($('.snake'))
        console.log(snakePoints)
    }
}, 200)


function moveHead() {
    let divHead = $($('.snake')[0]);
    let head = snakePoints[0];
    let rotate;
    head.beforeTop = head.curentTop;
    head.beforeLeft = head.curentLeft;
    switch (head.direction) {
        case 'right' :
            head.curentLeft += 1;
            rotate = 0;
            break
        case 'left' :
            head.curentLeft -= 1;
            rotate = -180;
            break
        case 'top' :
            head.curentTop -= 1;
            rotate = -90;
            break
        case 'bottom' :
            head.curentTop += 1;
            rotate = 90;
            break
    }
    divHead.css("transform", "rotate("+ rotate + "deg)")
    divHead.css({"top": `${head.curentTop*30}px`, "left": `${head.curentLeft*30}px`})
    // divHead.animate({
    //     top: `${head.curentTop*30}px`,
    //     left: `${head.curentLeft*30}px`,
    // }, 140)
}



function moveSnake() {
    for (let i = 1; i < snakePoints.length; i++) {
        let div = $($('.snake')[i]);
        let neibor = snakePoints[i-1];
        let current = snakePoints[i];
        let afterNeibor = snakePoints[i+1];
        current.beforeTop = current.curentTop;
        current.beforeLeft = current.curentLeft;
        current.curentTop = neibor.beforeTop;
        current.curentLeft = neibor.beforeLeft;
        current.beforeDirection = current.direction;
        current.direction = neibor.direction;
        div.css({"top": `${current.curentTop*30}px`, "left": `${current.curentLeft*30}px`})
        switch (true) {
                case current.curentTop == neibor.curentTop && current.curentLeft < neibor.curentLeft:
                    rotate = 0;
                    break
                case current.curentTop == neibor.curentTop && current.curentLeft > neibor.curentLeft:
                    rotate = -180;
                    break
                case current.curentTop > neibor.curentTop && current.curentLeft == neibor.curentLeft:
                    rotate = -90;
                    break
                case current.curentTop < neibor.curentTop && current.curentLeft == neibor.curentLeft:
                    rotate = 90;
                    break
         }

        div.css("transform", "rotate("+ rotate + "deg)")
        // if (i != snakePoints.length - 1) {
        //     snakePart(current, neibor, afterNeibor, div);
        // }

        // div.animate({
        //     top: `${current.curentTop*30}`,
        //     left: `${current.curentLeft*30}`,
        // }, 140);
    }

    for (let j = 1; j < snakePoints.length - 1; j++) {
        let div = $($('.snake')[j]);
        let neibor = snakePoints[j-1];
        let current = snakePoints[j];
        let afterNeibor = snakePoints[j+1];
        snakePart(current, neibor, afterNeibor, div);
    }
}

$(document).keydown((event) => {
    switch (event.keyCode) {
        case 37: snakePoints[0].direction = 'left';
         break
        case 38: snakePoints[0].direction = 'top';
            break
        case 39: snakePoints[0].direction = 'right';
            break
        case 40: snakePoints[0].direction = 'bottom';
            break
    }
})

$('.restart-btn').click(() => {
    location.reload();
})

function createApple() {
   while (true) {
        let temp = true;
        let appleTop = Math.round(Math.random()*12 + 1);
        let appleLeft = Math.round(Math.random()*12 + 1);
        for(let i = 0; i < snakePoints.length; i++) {
            if (appleTop == snakePoints[i].curentTop && appleLeft == snakePoints[i].curentLeft) {
                temp = false;
            }
        }

        if (temp) {
            $('.apple').css({"top": `${appleTop*30}px`, "left": `${appleLeft*30}px`})
            newApple.curentTop = appleTop;
            newApple.curentLeft = appleLeft;
            return;
        }
    }
}

function eatApple() {
    if (snakePoints[0].curentTop == newApple.curentTop && snakePoints[0].curentLeft == newApple.curentLeft) {
        let tail = snakePoints[snakePoints.length-1];
        let i;
        let j;
        switch (tail.direction) {
            case "right" :
                i = tail.curentTop;
                j = tail.curentLeft-1;
                snakePoints.push(new snake(i, j, "right"));
                break;
            case "left" :
                i = tail.curentTop;
                j = tail.curentLeft+1;
                snakePoints.push(new snake(i, j, "left"));
                break;
            case "top" :
                i = tail.curentTop+1;
                j = tail.curentLeft;
                snakePoints.push(new snake(i, j, "top"));
                break;
            case "bottom" :
                i = tail.curentTop-1;
                j = tail.curentLeft;
                snakePoints.push(new snake(i, j, "bottom"));
                break;
        }
        $('.part1').before(`<div class="snake"></div>`);
        let temp = $('.snake');
        $(temp[temp.length-1]).css({"top": `${i*30}px`, "left": `${j*30}px`})
        createApple()
        let points = +($('.points').text()) + 100;
        $('.points').text(points);
    }
}

function createSnakeContainer() {
    $('.game-container').append(`<div class="snake"></div>`);
}

function crash() {
    let headTop = snakePoints[0].curentTop;
    let headLeft = snakePoints[0].curentLeft;
    for(let i = 1; i < snakePoints.length; i++) {
        if (headTop == snakePoints[i].curentTop && headLeft == snakePoints[i].curentLeft || headTop < 1 || headLeft < 1 || headTop > 13 || headLeft > 13) {
            return true;
        }
    }
}

function snakePart(current, beforeNeibor, afterNeibor, div) {
    switch (true) {
        case current.curentLeft < beforeNeibor.curentLeft && current.curentTop == beforeNeibor.curentTop && current.curentLeft == afterNeibor.curentLeft && current.curentTop < afterNeibor.curentTop :
            div.removeClass('top-right-snake bottom-right-snake bottom-left-snake');
            div.addClass('top-left-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft == beforeNeibor.curentLeft && current.curentTop < beforeNeibor.curentTop && current.curentLeft < afterNeibor.curentLeft && current.curentTop == afterNeibor.curentTop :
            div.removeClass('top-right-snake bottom-right-snake bottom-left-snake');
            div.addClass('top-left-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft == beforeNeibor.curentLeft && current.curentTop < beforeNeibor.curentTop && current.curentLeft > afterNeibor.curentLeft && current.curentTop == afterNeibor.curentTop :
            div.removeClass('top-left-snake bottom-right-snake bottom-left-snake');
            div.addClass('top-right-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft > beforeNeibor.curentLeft && current.curentTop == beforeNeibor.curentTop && current.curentLeft == afterNeibor.curentLeft && current.curentTop < afterNeibor.curentTop :
            div.removeClass('top-left-snake bottom-right-snake bottom-left-snake');
            div.addClass('top-right-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft > beforeNeibor.curentLeft && current.curentTop == beforeNeibor.curentTop && current.curentLeft == afterNeibor.curentLeft && current.curentTop > afterNeibor.curentTop :
            div.removeClass('top-left-snake top-right-snake bottom-left-snake');
            div.addClass('bottom-right-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft == beforeNeibor.curentLeft && current.curentTop > beforeNeibor.curentTop && current.curentLeft > afterNeibor.curentLeft && current.curentTop == afterNeibor.curentTop :
            div.removeClass('top-left-snake top-right-snake bottom-left-snake');
            div.addClass('bottom-right-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft == beforeNeibor.curentLeft && current.curentTop > beforeNeibor.curentTop && current.curentLeft < afterNeibor.curentLeft && current.curentTop == afterNeibor.curentTop :
            div.removeClass('top-left-snake top-right-snake bottom-right-snake');
            div.addClass('bottom-left-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        case current.curentLeft < beforeNeibor.curentLeft && current.curentTop == beforeNeibor.curentTop && current.curentLeft == afterNeibor.curentLeft && current.curentTop > afterNeibor.curentTop :
            div.removeClass('top-left-snake top-right-snake bottom-right-snake');
            div.addClass('bottom-left-snake');
            div.css("transform", "rotate("+ 0 + "deg)");
            break;
        default :
            div.removeClass('top-left-snake top-right-snake bottom-right-snake bottom-left-snake');

    }
}

