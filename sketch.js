var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState,readState;
var bedroom,garden,washroom;


function preload(){
   dogImg=loadImage("Images/Dog.png");
   happyDog=loadImage("Images/happydog.png");
   sadDog=loadImage("images/Dog.png");
   
   milkbottleImg=loadImage("Images/Milk.png");
   garden=loadImage("Images/Garden.png");
   bedroom=loadImage("Images/BedRoom.png");
   washroom=loadImage("Images/WashRoom.png");
   livingroom=loadImage("Images/LivingRoom.png")


  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);

  foodObj=new Food();
  foodObj.getFoodStock();

  feed=createButton("Feed the dog");
  feed.position(650,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(780,95);
  addFood.mousePressed(addFoods);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  //console.log(gameState);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  foodStock.set(20);

  milkBotltle1 = createSprite(140,435,10,10);
  milkBotltle1.addImage(milkbottleImg);
  milkBotltle1.scale = 0.025;

  milkBotltle2 = createSprite(210,280,10,10);
  milkBotltle2.addImage(milkbottleImg);
  milkBotltle2.scale = 0.025;
  milkBotltle2.visible = false;

  

}

// function to display UI
function draw() {
  background(46,139,87);
 foodObj.display();
 writeStock(foodS);
 if(foodS == 0){
  dog.addImage(happyDog);
  milkBotltle2.visible=false;
}else{
  dog.addImage(sadDog);
  milkBotltle2.visible=true;
}

 var gameStateRef=database.ref('gameState');
 gameStateRef.on('value',function(data){
   gameState = data.val();
 });

 if(gameState===1){
   dog.addImage(happyDog);
   dog.scale=0.175;
   dog.y=250;
 }
 if(gameState===2){
   dog.addImage(sadDog);
   dog.scale=0.175;
   milkBotltle2.visible=false;
   dog.y=250;
 }

 var Bath=createButton("I want to take bath");
 Bath.position(580,125);
 if(Bath.mousePressed(function(){
   gameState=3;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===3){
   dog.addImage(washroom);
   dog.scale=1;
   milkBotltle2.visible=false;
 }

 var Sleep=createButton("I am very sleepy");
 Sleep.position(710,125);
 if(Sleep.mousePressed(function(){
   gameState=4;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===4){
   dog.addImage(bedroom);
   dog.scale=1;
   milkBotltle2.visible=false;
 }

 var Play=createButton("Lets play !");
 Play.position(500,160);
 if(Play.mousePressed(function(){
   gameState=5;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===5){
   dog.addImage(livingroom);
   dog.scale=1;
   milkBotltle2.visible=false;
 }

 var PlayInGarden=createButton("Lets play in park");
 PlayInGarden.position(585,160);
 if(PlayInGarden.mousePressed(function(){
   gameState=6;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===6){
   dog.y=175;
   dog.addImage(garden);
   dog.scale=1;
   milkBotltle2.visible=false;
 }




currentTime=hour();
/*
if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.visible=false;
  
  //dog.remove();
}else{
 feed.show();
 addFood.show();
 dog.visible=true;
 foodObj.display();
 
}



if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
update("Bathing");
  foodObj.washroom();
}
else{
update("Hungry")
foodObj.display();
}
*/

  drawSprites();
  textSize(17);
  fill("black");
  text("Milk Bottles Remaining  "+foodS,170,440);
 

 // text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20); 
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

function addFoods(){
  foodObj.foodStock+=1;
  
  database.ref('/').update({
    Food:foodObj.foodStock
  })

}


//function to update food stock and last fed time
function feedDog(){
  console.log(gameState);
  foodObj.display();
  dog.addImage(happyDog);
  foodObj.deductFood();
  foodObj.updateFoodStock(foodObj.foodStock);
  gameState=1;
   database.ref('/').update({'gameState':gameState});

  //foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  //database.ref('/').update({
    //Food:foodObj.getFoodStock(),
    //FeedTime:hour(),
    //gameState:"Hungry"
  //})

  
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}

function writeStock(x){
  database.ref('/').update({
    food:x
  })
}