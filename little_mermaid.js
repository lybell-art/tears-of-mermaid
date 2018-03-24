var bg;
var blops=[];
var player;
var prince;
var startms;

function setup() {
  createCanvas(500,500);
	bg=createGraphics(width,height);
	blops_make();
	prince=new Prince();
	player=new Mermaid(prince);
	sea_bg(bg);
	startms=millis();
}

function draw() {
  image(bg,0,0);
	blops_control();
	player.execute();
	player.render();
}

function sea_bg(canvas)
{
	var c1=color(171,254,246);
	var c2=color(12,104,215);
	canvas.strokeWeight(1);
	canvas.noFill();
	for(var i=0;i<height;i++)
	{
		canvas.stroke(lerpColor(c1, c2, i/height));
		canvas.line(0,i,width,i);
	}
}

function blops_make()
{
	for(var i=0;i<12;i++)
	{
		blops[i]=new blop(i*1500);
	}
}

function blops_control()
{
	for(var i=0;i<12;i++)
	{
		blops[i].newCheck();
		if(blops[i].isRun)
		{
			blops[i].move();
			blops[i].render();
			blops[i].destroyCheck();
		}
	}
}

//====================class=====================//

function blop(delay)
{
	this.x=0; this.y=0;
	this.size=0; this.Yvel=2; this.Xdif=0;
	this.delaySec=delay;
	this.isRun=false;
	this.create=function()
	{
		var std=min(width,height)/12;
		this.size=random(0.8,1.2)*std;
		this.Xdif=random(1,2)*width/1366;
		this.Yvel=2;
		this.x=random(this.size,width-this.size);
		this.y=height+std*2;
	};
	this.newCheck=function()
	{
		if(this.delaySec<millis()&&this.isRun==false)
		{
			this.create();
			this.isRun=true;
		}
	}
	this.move=function()
	{
		this.x+=sin((height-this.y)*PI/120)*this.Xdif;
		this.y-=this.Yvel;
	};
	this.render=function()
	{
		noStroke();
		fill(255,32);
		push();
		translate(this.x,this.y);
		ellipse(0,0,this.size,this.size);
		ellipse(this.size/5,-this.size/5,this.size/4,this.size/4);
		pop();
	};
	this.destroyCheck=function()
	{
		if(this.y<-this.size)
		{
			this.create();
		}
	}
}

function Mermaid(Prince)
{
	this.hp=60000;
	this.x=width*2/3;
	this.y=height*2/3;
	this.opponent=Prince;
	this.execute=function()
	{
		var pos=createVector(mouseX,mouseY);
		var cen=createVector(width/2,height/2);
		var diff=p5.Vector.sub(pos,cen);
		var barrierRadius=this.opponent.barrierRadius;
		if(diff.mag()>barrierRadius)
		{
			this.x=mouseX;
			this.y=mouseY;
		}
		else
		{
			diff.setMag(barrierRadius);
			cen.add(diff);
			this.x=cen.x;
			this.y=cen.y;
		}
		this.hp=60000-(millis()-startms);
	}
	this.render=function()
	{
		var std=min(width,height)/10*(this.hp/60000);
		var sw=2*min(width,height)/768;
		noFill();
		stroke(255);
		strokeWeight(sw);
		rectMode(CENTER);
		push();
		translate(this.x,this.y);
		ellipse(0,0,std,std);
		push();
		rotate(radians(45));
		rect(0,0,std*0.8,std*0.8);
		pop();
		rect(0,0,std*0.4*sqrt(2),std*0.4*sqrt(2));
		pop();
		rectMode(CORNER);
	}
}

function Prince()
{
	this.barrierRadius=100;
}
