let m;
let mySong;
let myImag, back, hat;
let analyzer;
let h, k;
let v;


function preload(){
  mySong = loadSound("./assets/sounds/The-Happy-Troll.mp3");
  // mySong = loadSound("./assets/sounds/party-troll.mp3");
  myImag = loadImage("./assets/images/troll_face.png");
  back = loadImage("./assets/images/palcoscenico3.jpg");
  hat = loadImage("./assets/images/magicianshat.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  fft = new p5.FFT();
  fft.setInput(mySong);

  analyzer = new p5.Amplitude();
  analyzer.setInput(mySong);

  v=0;

  m = new Man(45,20);
  m.drawMan(1);
}

function draw() {
  //background
  image(back,0,0,width,height)

  //volume
  let volume = analyzer.getLevel();
  if (mySong.isPlaying()==true){
    v = volume;
  }
  let d = map(v,0,1,1,2.5);

  //middle point of the track, useful for lights and text transparency
  fft.analyze();
  let mid = fft.getEnergy("mid");
  let mapMid = map(mid, 0, 255, 190, 400);
  let mapMid2 = map(mid, 0, 255, 19, 40);
  let mapMid3 = map(mid, 0 ,255, 255, 0)

  //text
  let myText = "Click and move your mouse";
  let myText2 = "I'll make you go wild";
  fill(255,255,255,mapMid3);
  textFont("Syne Tactile");
  textSize(20);
  textAlign(LEFT);
  text(myText,width*1/4,height*1/3);
  text(myText2,width*1/4+40,height*1/3+40);

  //let's dance!
  if(mouseX<=width/2){
    m.dance1(v);
  }else{
    m.dance2(v);
  }

  //lights
  push();
  noStroke();
  fill(255,255,255,150);
  translate(width/2, height*20/21);
  triangle(-mapMid/2,0,+mapMid/2,0,width/5,-height*5/4);
  fill(255);
  ellipse(0, 0, mapMid, mapMid2);
  pop();

  //troll man
  m.drawMan(d);

}

class Man{
  constructor(bodyLength, segmentLength){
    this.seglen = segmentLength;
    this.bodylen = bodyLength;

    this.y9 = 40;
    this.x9 = -20;
    this.x7 = -10
    this.y7 = missingEndPoint(this.x9,this.y9,this.x7,segmentLength,false);
    this.x6 = 0;
    this.y6 = missingEndPoint(this.x7,this.y7,this.x6,this.seglen,false);
    this.x8 = -this.x7;
    this.y8 = this.y7;
    this.x10 = -this.x9;
    this.y10 = this.y9;
    this.x1 = 0;
    this.y1 = this.y6 - bodyLength;
    this.start=this.y1;
    this.y2 = this.y1-15;
    this.x2 = missingEndPoint(this.x1,this.y1,this.y2,segmentLength,false,false);
    this.x3 = -this.x2;
    this.y3 = this.y1+15;
    this.y4 = this.y1;
    this.x4 = missingEndPoint(this.x2,this.y2,this.y4,segmentLength,false,false);
    this.x5 = -this.x4;
    this.y5 = this.y4;
  }

  drawMan(d){
    push();
    strokeWeight(5);
    stroke(0);
    translate(width/2,height*20/21-this.y9);
    line(this.x1,this.y1,this.x2,this.y2);
    line(this.x1,this.y1,this.x6,this.y6);
    line(this.x1,this.y1,this.x3,this.y3);
    line(this.x2,this.y2,this.x4,this.y4);
    line(this.x3,this.y3,this.x5,this.y5);
    line(this.x6,this.y6,this.x7,this.y7);
    line(this.x7,this.y7,this.x9,this.y9);
    line(this.x6,this.y6,this.x8,this.y8);
    line(this.x8,this.y8,this.x10,this.y10);
    image(myImag,-30+this.x1,this.y1-55,61.6*d,50*d);
    image(hat,-27+this.x1,this.y1-45-25*d,30*d,25*d)
    pop();
  }

  setArms(h){
    //left
    this.y2 = this.y1 - h;
    this.x2 = missingEndPoint(this.x1,this.y1,this.y2,this.seglen,false,false);
    this.x4 = missingEndPoint(this.x2,this.y2,this.y4,this.seglen,false,false);

    //right
    this.y3 = this.y1 + h;
    this.x3 = missingEndPoint(this.x1,this.y1,this.y3,this.seglen,true,false);
    this.x5 = missingEndPoint(this.x3,this.y3,this.y5,this.seglen,true,false);
  }

  setLegs(l){
    //left
    this.x7 = - l;
    this.y7 = missingEndPoint(this.x9,this.y9,this.x7,this.seglen,false);
    this.y6 = missingEndPoint(this.x7,this.y7,this.x6,this.seglen,false);
    this.y1 = this.y6 - this.bodylen;
    this.y2 = this.y2 + (this.y1 - this.y4);
    this.y4 = this.y1;
    this.y3 = this.y3 + (this.y1 - this.y5);
    this.y5 = this.y1;

    //right
    this.x8 = + l;
    this.y8 = missingEndPoint(this.x10,this.y10,this.x8,this.seglen,false);
  }

  dance1(vol){
    h = map(vol,0,0.2,0,30);
    k = map(vol,0,0.2,-6,+8);

    if(vol>0.2) {
      h=30;
      k=8;
    }

    this.setArms(-15+h);
    this.setLegs(10+k);

  }

  moveBody(s){
    this.x1 = -s;
    this.y1 = missingEndPoint(this.x6,this.y6,this.x1,this.bodylen,false);
    this.y2 = this.start - s;
    this.x2 = missingEndPoint(this.x1,this.y1,this.y2,this.seglen,false,false);
    this.y4 = this.start - 2*s;
    this.x4 = missingEndPoint(this.x2,this.y2,this.y4,this.seglen,false,false);
  }

  dance2(vol){
    let z = map(vol,0,0.4,-12,12);
    if (vol>0.4) z=12;

    this.moveBody(z)

      //left arm
      this.y2 = -42 - 0.7*z;
      this.x2 = missingEndPoint(this.x1,this.y1,this.y2,this.seglen,false,false);
      this.y4 = -40 - z;
      this.x4 = missingEndPoint(this.x2,this.y2,this.y4,this.seglen,false,false);

      //right arm
      this.y3=-42 + 0.7*z;
      this.x3 = missingEndPoint(this.x1,this.y1,this.y3,this.seglen,true,false);
      this.y5=-40 + z;
      this.x5 = missingEndPoint(this.x3,this.y3,this.y5,this.seglen,true,false);
  }
 }

function missingEndPoint(x1,y1,coord2,l,above, isY=true){
  if (isY==true){

    if (abs(x1-coord2)>l) {
      return
    }

    let y2;
    if (above==false) {
      y2 = y1 - sqrt(abs(l*l - (x1-coord2)*(x1-coord2)));
    } else {
      y2 = y1 + sqrt(abs(l*l - (x1-coord2)*(x1-coord2)));
    }
    return y2;

  } else {

    if (abs(y1-coord2)>l) {
      return
    }

    let x2;
    if (above==false){ //the new point is on the left
      x2 = x1 - sqrt(abs(l*l - (y1-coord2)*(y1-coord2)));
    } else{
      x2 = x1 + sqrt(abs(l*l - (y1-coord2)*(y1-coord2)));
    }
    return x2;
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked(){
  if(mySong.isPlaying() == false){
    mySong.play();
  } else {
    mySong.pause();
  }
}
