var bg,bgImg;
var redWall, invisibleWall;
var player, shooterAnimation, shooter_shooting, waitingPlayerImage, deadPlayerImage;
var bulletGroup, bulletImage;
var enemyBulletGroup1, enemyBulletGroup2, enemyBulletGroup3, enemyBulletImage;
var zombiesGroup1, zombiesGroup2, zombiesGroup3, zombiesImage;
var lifeSprite, life_3Image, life_2Image, life_1Image;
var playIcon, playIconImage;
var restartIcon, restartIconImage;
var gameFont;
var shootSound, killSound, failSound, endSound;
var score = 0;
var totalLives = 3;
var gameState = "wait";

localStorage = ["highestScore"];
localStorage[0] = 0;

function preload(){
gameFont = loadFont("spookyHill.otf");
bgImg = loadImage("bg.jpeg");
playIconImage = loadImage("playButton.png");
restartIconImage = loadImage("restartButton.png");
waitingPlayerImage = loadImage("shooter_2.png");
shooterAnimation = loadAnimation("shooter_2.png", "assets/shooter_1.png");
shooter_shooting = loadImage("shooter_3.png");
deadPlayerImage = loadImage("shooter_1.png");
life_3Image = loadImage("heart_3.png");
life_2Image = loadImage("heart_2.png");
life_1Image = loadImage("heart_1.png");
bulletImage = loadImage("bullet.png");
enemyBulletImage = loadImage("enemyBullet.png");
zombiesImage = loadImage("zombie.gif");
shootSound = loadSound("shoot.mp3");
killSound = loadSound("kill.mp3");
failSound = loadSound("fail.mp3");
endSound = loadSound("end.mp3");
}

function setup() {
createCanvas(windowWidth,windowHeight);

bulletGroup = createGroup();
enemyBulletGroup1 = createGroup();
enemyBulletGroup2 = createGroup();
enemyBulletGroup3 = createGroup();
zombiesGroup1 = createGroup();
zombiesGroup2 = createGroup();
zombiesGroup3 = createGroup();

bg = createSprite(windowWidth/2-20,windowHeight/2-40,20,20);
bg.addImage(bgImg);
bg.scale = 1.1;

playIcon = createSprite(windowWidth / 2, windowHeight / 2, 512, 512);
playIcon.addImage("playButton", playIconImage);

restartIcon = createSprite(windowWidth / 2, windowHeight / 2, 600, 600);
restartIcon.addImage("again", restartIconImage);
restartIcon.scale = 0.2;

lifeSprite = createSprite( windowWidth / 2, 30, 593, 141);
lifeSprite.addImage("3lives", life_3Image);
lifeSprite.addImage("2lives", life_2Image);
lifeSprite.addImage("1life", life_1Image);
lifeSprite.scale = 0.4;

redWall = createSprite(1250, windowHeight / 2, 50, windowHeight);
redWall.shapeColor = "red";

invisibleWall = createSprite(windowWidth - 5, windowHeight / 2, 10, windowHeight);
invisibleWall.visible = false;
  
player = createSprite(1150, windowHeight-300, 50, 50);
player.addImage("inWait", waitingPlayerImage);
player.addAnimation("waiting", shooterAnimation);
player.addImage("shoot", shooter_shooting);
player.addImage("dead", deadPlayerImage);
player.changeAnimation("waiting");
player.scale = 0.3;
player.setCollider("rectangle",0,0,260,475);
player.debug = false;
}

function draw() {
background(0); 

if (gameState === "wait"){
lifeSprite.visible = false;
restartIcon.visible = false;
if (mouseIsOver(playIcon)){
playIcon.scale = 0.25;
}else{
playIcon.scale = 0.2;
}
player.changeImage("inWait");
if (mousePressedOver(playIcon)){
playIcon.destroy();
gameState = "play";
}
}

if (gameState === "play"){
lifeSprite.visible = true;
restartIcon.visible = false;
if (!keyDown("space")){
player.changeAnimation("waiting");
}
if(keyDown("UP_ARROW") && player.y >= 100){
player.y = player.y-30;
}
if(keyDown("DOWN_ARROW") && player.y <= windowHeight - 100){
player.y = player.y+30;
}

if(keyWentDown("space")){
player.changeImage("shoot");
shootBullets();
shootSound.play();
}
else if(keyWentUp("space")){
player.changeAnimation("waiting");
}

if (score <= 10 && score >= 0){
activateZombies1();
}
if (score <= 25 && score > 10){
activateZombies2();
}
if (score > 25){
activateZombies3();
}

if (bulletGroup.isTouching(zombiesGroup1)){
bulletGroup.destroyEach();
zombiesGroup1.destroyEach();
score = score + 1;
killSound.play();
}
if (bulletGroup.isTouching(zombiesGroup2)){
bulletGroup.destroyEach();
zombiesGroup2.destroyEach();
score = score + 1;
killSound.play();
}
if (bulletGroup.isTouching(zombiesGroup3)){
bulletGroup.destroyEach();
zombiesGroup3.destroyEach();
score = score + 1;
killSound.play();
}
if (zombiesGroup1.isTouching(player) || zombiesGroup1.isTouching(invisibleWall)){
zombiesGroup1.destroyEach();
totalLives = totalLives - 1;
failSound.play();
}
if (zombiesGroup2.isTouching(player) || zombiesGroup2.isTouching(invisibleWall)){
zombiesGroup2.destroyEach();
totalLives = totalLives - 1;
failSound.play();
}
if (zombiesGroup3.isTouching(player) || zombiesGroup3.isTouching(invisibleWall)){
zombiesGroup3.destroyEach();
totalLives = totalLives - 1;
failSound.play();
}
if (enemyBulletGroup1.isTouching(player)){
enemyBulletGroup1.destroyEach();
totalLives = totalLives - 1;
failSound.play();
}
if (enemyBulletGroup2.isTouching(player)){
enemyBulletGroup2.destroyEach();
totalLives = totalLives - 1;
failSound.play();
}
if (enemyBulletGroup3.isTouching(player)){
enemyBulletGroup3.destroyEach();
totalLives = totalLives - 1;
failSound.play();
}
if (totalLives === 3){
lifeSprite.changeImage("3lives");
}
if (totalLives === 2){
lifeSprite.changeImage("2lives");
}
if (totalLives === 1){
lifeSprite.changeImage("1life");
}
if (totalLives === 0){
lifeSprite.visible = false;
player.rotation = 90;
player.changeImage("dead");
gameState = "end";
endSound.play();
}
}

if (gameState === "end"){
restartIcon.visible = true;
if (mousePressedOver(restartIcon)){
restart();
}
}

drawSprites();
textFont(gameFont);
textSize(35);
textAlign(CENTER, CENTER);
fill("white");
text("D", 1250, 20.95);
text("O", 1250, 51.9);
text("N", 1250, 102.8);
text("O", 1250, 134.75);
text("T", 1250, 165.7);
text("L", 1250, 217.6);
text("E", 1250, 248.55);
text("T", 1250, 269.5);
text("T", 1250, 331.4);
text("H", 1250, 362.35);
text("E", 1250, 392.3);
text("M", 1250, 420.25);
text("C", 1250, 473.15);
text("R", 1250, 504.1);
text("O", 1250, 535.05);
text("S", 1250, 566);
text("S", 1250, 599.95)
if (gameState === "wait"){
textFont(gameFont);
textSize(55);
textAlign(CENTER, CENTER);
fill("white");
text("ZOMBIE SHOOTER", windowWidth / 2, 400);
}
if (gameState === "play"){
fill("black");
textFont("Copperplate Gothic");
textSize(40);
textAlign(CENTER, CENTER);
text("Score : "+score, windowWidth / 2 - 150, 75);
fill("white");
text("High : "+localStorage[0], windowWidth / 2 + 150, 75);
}
if (gameState === "end"){
fill("white");
textFont("Copperplate Gothic");
textSize(40);
textAlign(CENTER, CENTER);
text("Game Score : "+score, windowWidth / 2, 450);
text("Highest Score : "+localStorage[0], windowWidth / 2, 550);
}
}

function shootBullets(){
bullet = createSprite(1135, width/2, 50,20);
bullet.y= player.y-24;
bullet.addImage(bulletImage);
bullet.scale=0.08;
bullet.velocityX= -10;
bulletGroup.add(bullet);
}

function activateZombies1(){
if (frameCount % 160 === 0){
var random_y = Math.round(random(100, 550));
var zombie = createSprite(-50, random_y, 256, 256);
zombie.addImage("enemy", zombiesImage);
zombie.scale = 0.5;
zombie.velocityX = 10;
zombie.setCollider("rectangle", 0, 0, 175, 260);
zombie.debug = false;
zombie.lifetime = 200;
zombiesGroup1.add(zombie);
setTimeout(function(){
var enemyBullet = createSprite(zombie.x + 30, zombie.y - 20, 1224, 1050);
enemyBullet.addImage("enemyWeapon", enemyBulletImage);
enemyBullet.scale = 0.02;
enemyBullet.velocityX = 14;
enemyBullet.lifetime = 200;
enemyBulletGroup1.add(enemyBullet);
shootSound.play();
}, 500);
}
}

function activateZombies2(){
if (frameCount % 130 === 0){
var random_y = Math.round(random(100, 550));
var zombie = createSprite(-50, random_y, 256, 256);
zombie.addImage("enemy", zombiesImage);
zombie.scale = 0.5;
zombie.velocityX = 12;
zombie.setCollider("rectangle", 0, 0, 175, 260);
zombie.debug = false;
zombie.lifetime = 200;
zombiesGroup2.add(zombie);
setTimeout(function(){
var enemyBullet = createSprite(zombie.x + 30, zombie.y - 20, 1224, 1050);
enemyBullet.addImage("enemyWeapon", enemyBulletImage);
enemyBullet.scale = 0.02;
enemyBullet.velocityX = 16;
enemyBullet.lifetime = 200;
enemyBulletGroup2.add(enemyBullet);
shootSound.play();
}, 500);
}
}

function activateZombies3(){
if (frameCount % 100 === 0){
var random_y = Math.round(random(100, 550));
var zombie = createSprite(-50, random_y, 256, 256);
zombie.addImage("enemy", zombiesImage);
zombie.scale = 0.5;
zombie.velocityX = 14;
zombie.setCollider("rectangle", 0, 0, 175, 260);
zombie.debug = false;
zombie.lifetime = 200;
zombiesGroup2.add(zombie);
setTimeout(function(){
var enemyBullet = createSprite(zombie.x + 30, zombie.y - 20, 1224, 1050);
enemyBullet.addImage("enemyWeapon", enemyBulletImage);
enemyBullet.scale = 0.02;
enemyBullet.velocityX = 18;
enemyBullet.lifetime = 200;
enemyBulletGroup3.add(enemyBullet);
shootSound.play();
}, 500);
}
}

function restart(){
if (localStorage[0]<score){
localStorage[0] = score;
}
gameState = "play";
restartIcon.visible = false;
score = 0;
totalLives = 3;
zombiesGroup1.destroyEach();
zombiesGroup2.destroyEach();
zombiesGroup3.destroyEach();
enemyBulletGroup1.destroyEach();
enemyBulletGroup2.destroyEach();
enemyBulletGroup3.destroyEach();
player.rotation = 0;
player.changeAnimation("waiting");
}
