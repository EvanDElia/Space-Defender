var paused = false;
var enemiesSpawned = 0;
var enemyArray = [];
var position = 0;
var hearts = 5;
var finished = false;
var currentLevel = 1;
var score = 0;
var vid = document.getElementById("audio");
var bombArray = [];
var positionX = [20, 70, 120, 170, 220, 270];
var map = []; // Or you could call it "key"
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
}
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#E0BB7B";
ctx.fillRect(0, 0, 500, 250);
ctx.fillStyle = "#FF0000";
ctx.fillRect(positionX[0], 20, 10, 10);
document.addEventListener('click', function(event) {
	paused = !paused;
	if (vid.paused) vid.play();
	else vid.pause();
	
});
document.addEventListener('keydown', function(event) {
  if (hearts != 0){
    
    if(map[82] && map[68] && map[86]) {
	position = position - 1;
	if (position < 0)
		position = 0;
	changePosition(position);
    }
    else if(map[85] && map[75] && map[66]) {
	position = position + 1;
	if (position > 5)
		position = 5;
	changePosition(position);
    }
    else if(map[32]){
	bombArray[bombArray.length] = new Bomb(positionX[position] + 5, 40);
	ctx.beginPath();
        ctx.arc(positionX[position] + 5,40,5,0,2*Math.PI);
	ctx.fill();
        ctx.stroke();
    }
  }
});

function init(){
    vid.autoplay = true;
    vid.load();
    for (var i = 1; i < 6; i++){
	ctx.clearRect(positionX[i], 20, 10, 10);
    }
    var timer = setInterval(draw, 11);
    return timer;
};

function changePosition(position){
    ctx.fillStyle = "#FF0000";
    if(position == 0) {
        ctx.fillRect(positionX[0], 20, 10, 10);
	ctx.clearRect(positionX[1], 20, 10, 10);
    }
    else if(position == 1) {
        ctx.fillRect(positionX[1],20,10,10);
	ctx.clearRect(positionX[0], 20, 10, 10);
	ctx.clearRect(positionX[2], 20, 10, 10);
    }
    else if(position == 2) {
        ctx.fillRect(positionX[2],20,10,10);
	ctx.clearRect(positionX[1], 20, 10, 10);
	ctx.clearRect(positionX[3], 20, 10, 10);
    }
    else if(position == 3) {
        ctx.fillRect(positionX[3],20,10,10);
	ctx.clearRect(positionX[2], 20, 10, 10);
	ctx.clearRect(positionX[4], 20, 10, 10);
    }
    else if(position == 4) {
        ctx.fillRect(positionX[4],20,10,10);
	ctx.clearRect(positionX[3], 20, 10, 10);
	ctx.clearRect(positionX[5], 20, 10, 10);
    }
    else if(position == 5) {
        ctx.fillRect(positionX[5],20,10,10);
	ctx.clearRect(positionX[4], 20, 10, 10);
    }
};

function draw(){
if (!paused){
	ctx.clearRect(0, 32, c.width, c.height);

	checkCollisions();

	ctx.fillStyle = "#000000";
	ctx.fillRect(0,32, c.width, c.height);

	for (var i = 0; i < bombArray.length; i++){
		ctx.fillStyle = "#FF0000";
		bombArray[i].y += 2;
		ctx.beginPath();
        	ctx.arc(bombArray[i].x, bombArray[i].y,5,0,2*Math.PI);
		ctx.fill();
        	ctx.stroke();
		if (bombArray[i].y > 160) bombArray.pop();
		for (var y = 0; y < enemyArray.length; y++){
		    if (enemyArray[y].y < bombArray[i].y && bombArray[i].x - enemyArray[y].x < 3 && bombArray[i].x - enemyArray[y].x > 0){
			bombArray.splice(i, 1);
			enemyArray.splice(y, 1);
			score += 15;
		    }
		}
	}
	for (var i = 0; i < enemyArray.length; i++){
		ctx.fillStyle = "#FF00FF";
		enemyArray[i].y -= 0.1 * ((currentLevel + 1) / 2);
		if (enemyArray[i].y < 32){ 
			enemyArray.splice(i, 1);
			if (hearts != 0) hearts--;
		}
		ctx.fillRect(enemyArray[i].x, enemyArray[i].y, 5, 5);

	}
	ctx.font="18px Georgia";
	ctx.fillText("Hearts: " + hearts,10,130);
	ctx.fillText("Level: " + currentLevel, 200, 130);
	ctx.font="12px Georgia";
	ctx.fillText("Score: " + score,200, 148); 
}
if (hearts == 0){
	ctx.font="33px Georgia";
	ctx.fillText("Game Over",80, 100); 
}
else if (finished){
	ctx.font="33px Georgia";
	ctx.fillText("You win",80, 100);
}
else if (paused){
	ctx.font="33px Georgia";
	ctx.fillText("Paused",80, 100); 
}
};

function checkCollisions(){
	if (enemiesSpawned == 20 && enemyArray.length == 0){
	   if (hearts != 0) currentLevel++;
	   enemiesSpawned = 0;
	}
	while (enemiesSpawned < 20){
	   spawnNewEnemy();
	   enemiesSpawned++;
	}
};
function win(){
	finished = true;	
};
function spawnNewEnemy(){
	var randX = Math.floor(Math.random()*6);
	randX = randX + 20 + randX * 50 + (3 - randX);
	var randY = Math.floor(Math.random()*500) + 200;
	enemyArray[enemyArray.length] = new Enemy(randX, randY);
};
