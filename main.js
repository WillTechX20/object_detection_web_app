var canvas=null;
var img=null;
var newObjectDetector=null;
var statusH3=document.querySelector('#status');
var numberOfObjectsDetectedH3=document.querySelector('#number_of_objects_detected');
var statusBoolean=false;
var detectedObjectArray=[];
var video=null;

class RGBColor{
    red=null;
    green=null;
    blue=null;
    isWhite=false;
    isBlack=false;
    isGray=false;
    constructor(redNum=0, greenNum=0, blueNum=0){
        this.red=redNum;
        this.blue=blueNum;
        this.green=greenNum;
        if(this.red==255&&this.green==255&&this.blue==255){
            this.isWhite=true;
        }else if(this.red==0&&this.green==0&&this.blue==0){
            this.isBlack=true;
        }else if(this.red==128&&this.green==128&&this.blue==128){
            this.isGray=true;
        }
    }
}

var currentRGBColor=new RGBColor();

function preload(){
    img=loadImage('dog_cat.jpg');
}

function gotResult(results, error){
    if(error){
        console.log(error);
    }else{
        console.log(results);
        detectedObjectArray=results;
        statusBoolean=true;
    }
}

function onModelLoaded(){
    console.log('Model Loaded!');
}

function setup(){
    canvas=createCanvas(380, 380);
    canvas.center();
    video=createCapture(VIDEO);
    video.size(380, 380);
    video.hide();
    newObjectDetector=ml5.objectDetector('cocossd', onModelLoaded);
}    

Math.toFlooredPercent=function(num){
    return toString(this.floor(num*100))+'%';
}

function draw(){
    image(video, 0, 0, 380, 380);
    if(statusBoolean){
        currentRGBColor.red=random(255);
        currentRGBColor.green=random(255);
        currentRGBColor.blue=random(255);
        statusH3.innerText='Status: Detecting Objects';
        newObjectDetector.detect(video, gotResult);
        for(i=0; i<detectedObjectArray.length; i++){
            statusH3.innerText='Status: Objects Detected';
            numberOfObjectsDetectedH3.innerText='Number of Objects Detected: '+detectedObjectArray.length;
            fill(currentRGBColor.red, currentRGBColor.green, currentRGBColor.blue);
            stroke(currentRGBColor.red, currentRGBColor.green, currentRGBColor.blue);
            text(detectedObjectArray[i].label+' Percent: '+Math.toFlooredPercent(detectedObjectArray[i].confidence), detectedObjectArray[i].x+15, detectedObjectArray[i].y+15);
            noFill();
            rect(detectedObjectArray[i].x, detectedObjectArray[i].y, detectedObjectArray[i].width, detectedObjectArray[i].height);
        }
    }
}