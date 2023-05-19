// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//ball object
function Ball(x, y, velX, velY, color, size,ballNum) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.ballNum = ballNum;
  balls.push(this);
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if((this.x+this.size>width)){
    this.velX = -Math.abs(this.velX)
    this.x = width-this.size
  }
  if((this.x-this.size<0)){
    this.velX = Math.abs(this.velX);
    this.x = this.size;
  }
  if((this.y+this.size>height)){
    this.velY = -Math.abs(this.velY)
    this.y = height-this.size
  }
  if((this.y-this.size<0)){
    this.velY = Math.abs(this.velY);
    this.y = this.size;
  }
  this.colide();
  this.gravit();
}

Ball.prototype.velocify = function() {
  this.x+=this.velX/3
  this.y+=this.velY/3
}

Ball.prototype.colide = function() {
  for(let coliddeBall of balls){
    if(coliddeBall.ballNum!=this.ballNum){
      let dist = Math.sqrt(Math.pow(this.x-coliddeBall.x,2)+Math.pow(this.y-coliddeBall.y,2))
      let compoundDiam = this.size+coliddeBall.size;
      if(dist<this.size+coliddeBall.size){
        //color colide
        // this.color = 'rgb(' + random(0,255) + ',' + random(0,120) + ',' + random(0,120) +')';

        //basic colide
        // this.velX = -this.velX
        // this.velY = -this.velY

        //angle colide test
        let velMag = Math.sqrt(Math.pow(this.velX,2)+Math.pow(this.velY,2))
        let colideVectorang = Math.atan2(coliddeBall.y-this.y,coliddeBall.x-this.x);
        let vectorVelang = Math.atan2(this.velY,this.velX);
        let resultVelang = vectorVelang-colideVectorang
        let resultXvel = -velMag*Math.cos(resultVelang);
        let resultYvel = velMag*Math.sin(resultVelang);
        let resultVelMag = Math.sqrt(Math.pow(resultXvel,2)+Math.pow(resultYvel,2))
        let resulterVelAng = Math.atan2(resultYvel,resultXvel);
        let finalVelAng = resulterVelAng+colideVectorang;
        this.velX = resultVelMag*Math.cos(finalVelAng);
        this.velY = resultVelMag*Math.sin(finalVelAng);

        let ColvelMag = Math.sqrt(Math.pow(coliddeBall.velX,2)+Math.pow(coliddeBall.velY,2))
        let ColcolideVectorang = Math.atan2(this.y-coliddeBall.y,this.x-coliddeBall.x);
        let ColvectorVelang = Math.atan2(coliddeBall.velY,coliddeBall.velX);
        let ColresultVelang = ColvectorVelang-ColcolideVectorang
        let ColresultXvel = -ColvelMag*Math.cos(ColresultVelang);
        let ColresultYvel = ColvelMag*Math.sin(ColresultVelang);
        let ColresultVelMag = Math.sqrt(Math.pow(ColresultXvel,2)+Math.pow(ColresultYvel,2))
        let ColresulterVelAng = Math.atan2(ColresultYvel,ColresultXvel);
        let ColfinalVelAng = ColresulterVelAng+ColcolideVectorang;
        coliddeBall.velX = ColresultVelMag*Math.cos(ColfinalVelAng);
        coliddeBall.velY = ColresultVelMag*Math.sin(ColfinalVelAng);



        this.x = coliddeBall.x-compoundDiam*Math.cos(colideVectorang);
        this.y = coliddeBall.y-compoundDiam*Math.sin(colideVectorang);

        //momentum colide

      }
      
    }
  }
}

Ball.prototype.gravit = function() {
  for(let coliddeBall of balls){
    let dist = Math.sqrt(Math.pow(this.x-coliddeBall.x,2)+Math.pow(this.y-coliddeBall.y,2))
    if(dist>0){
      let angle = Math.atan2(coliddeBall.y-this.y,coliddeBall.x-this.x);
      let gAccel = 0.6*(coliddeBall.size)/(dist^2)
      let gXAccel = gAccel*Math.cos(angle);
      let gYAccel = gAccel*Math.sin(angle);
      this.velX += gXAccel; 
      this.velY += gYAccel;
    }
  }
  
}

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

let balls = [];

while (balls.length < 4) {
  let size = random(20,60);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,120) + ',' + random(0,120) +')',
    size,
    balls.length
  );
}

function doUpdates(){
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  for(let thisBall of balls){
    thisBall.update();
    thisBall.velocify();
    thisBall.draw();
  }
  // console.log(balls[1])
  requestAnimationFrame(doUpdates);
}

doUpdates();
