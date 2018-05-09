// for phoenix_html support, including form and button helpers
// copy the following scripts into your javascript bundle:
// * https://raw.githubusercontent.com/phoenixframework/phoenix_html/v2.10.0/priv/static/phoenix_html.js

function performAfter(timeout, fun){
    window.setInterval(fun, timeout);
}

var canvas;
var ctx;

var photo;
var photo_returned = false;
var photos = [];
var PHOTOS_PER_CLICK=4;
function takePicture(){
    console.log("Click!");

    photo = new Image();
    photo.src = "./take_picture?frame=" + (Math.random() * Math.pow(2, 31));
    drawWhiteScreen();
    photo.addEventListener('load', function(){
        photo_returned = true;
        console.log("Picture taken!");
        photos.push(photo);
        drawPhoto();

        performAfter(3000, function(){
            photo = undefined;
            photo_returned = false;

            if(photos.length < PHOTOS_PER_CLICK){
                countDown();
            }else{
                photos = [];
            }
        });
    });
}

function takePictures(){
    // TODO, buggy.
    for(var index = 0; index < PHOTOS_PER_CLICK; ++index){
        performAfter(index * 6000, countDown);
    }
    performAfter(PHOTOS_PER_CLICK * 6000, function(){
        photos = [];
    });
}

var countdown_value;
var countdown_interval;
function countDown(){
    // early return if already in the process of doing this.
    if(countdown_interval || photo){
        return;
    }
    countdown_value = 3;
    drawCountdown();
    countdown_interval = window.setInterval(function(){
        --countdown_value;
        if(countdown_value == 0){
            window.clearInterval(countdown_interval);
            countdown_interval = undefined;
            takePicture();
            return;
        }
    }, 1000);
}

function drawHeader(){
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = "lighten";
    ctx.fillText("Nauticon Photobooth", canvas.width/2, 50);
    ctx.restore();
}

function drawCountdown(){
    ctx.save();
    ctx.font = "105pt sans-serif";
    ctx.globalAlpha = 0.5;
    ctx.globalCompositeOperation = "lighten";
    ctx.fillText(countdown_value, canvas.width/2, canvas.height/2);
    ctx.restore();
}

function drawWhiteScreen(){
    ctx.save();
    ctx.fillStyle="white";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.restore();
}

function drawPhoto(){
    try{
        // if(photo_returned){
            console.log("PHOTO: ", photo);
            // ctx.drawImage(photo, 0, 0, photo.width, photo.height, 0, 0, photo.width / canvas.width, photo.height / canvas.height);
        ctx.drawImage(photo, 0, 0);
        // }

        ctx.save();
        ctx.font = "105pt sans-serif";
        ctx.globalAlpha = 0.5;
        ctx.globalCompositeOperation = "lighten";
        ctx.fillText("CLICK " + photos.length + '/4', canvas.width/2, canvas.height/2);
        ctx.restore();
    } catch(err){
        console.log("Encountered error while drawing photo:", err, photo);
    }
}

function drawCurrentFrame(img){
    try{
        ctx.drawImage(img, 0, 0);
    } catch(err){
        console.log("Encountered error while drawing img:", err, img);
    }
}

function draw(img){
    // if(photo !== undefined){
    //     drawPhoto();
    // }else{
        drawCurrentFrame(img);
    // }


    drawHeader();

    if(countdown_interval){
        drawCountdown();
    }

    // if(photo !== undefined){
    //     drawPhoto();
    // }
}

document.addEventListener("DOMContentLoaded", function() {

    canvas = document.getElementById('video-canvas');
    ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1;
    ctx.font = "35pt sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    var TIMEOUT = 200;
    var imgelem = document.getElementById("videofeed");
    var refreshInterval = window.setInterval(function() {
        if(photo === undefined){
            var random = Math.floor(Math.random() * Math.pow(2, 31));
            var img = new Image();
            img.src="video_call?frame=" + random;
            img.addEventListener('load', function(){draw(img);});
        // }else{
        //     draw(img);
        }
    }, TIMEOUT);

    canvas.addEventListener("click", countDown);
});
