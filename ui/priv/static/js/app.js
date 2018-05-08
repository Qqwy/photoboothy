// for phoenix_html support, including form and button helpers
// copy the following scripts into your javascript bundle:
// * https://raw.githubusercontent.com/phoenixframework/phoenix_html/v2.10.0/priv/static/phoenix_html.js

var canvas;
var ctx;

var photo;
var photos = [];
function takePicture(){
    console.log("Click!");

    // var httpRequest = new XMLHttpRequest();
    // httpRequest.onreadystatechange = function(){
    //     if (httpRequest.readyState === XMLHttpRequest.DONE) {
    //         if (httpRequest.status === 200) {
    //             // var response = JSON.parse(httpRequest.responseText);
    //             var response = httpRequest.responseText;
    //             alert(response);
    //         } else {
    //             alert('There was a problem with the request.');
    //         }
    //     }
    // };
    // httpRequest.open('GET', 'take_picture', true);
    // httpRequest.send();

    photo = new Image();
    photo.src = "./take_picture?frame=" + (Math.random() * Math.pow(2, 31));
    photo.addEventListener('load', function(){
        console.log("Picture taken!");
        photos.push(photo);

        window.setTimeout(function(){
            photo = undefined;
        }, 3000);
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

function drawPhoto(){
    ctx.drawImage(photo, 0, 0, photo.width, photo.height, 0, 0, photo.width / canvas.width, photo.height / canvas.height);
}

function drawCurrentFrame(img){
    ctx.drawImage(img, 0, 0);
}

function draw(img){
    drawCurrentFrame(img);

    drawHeader();

    if(countdown_interval){
        drawCountdown();
    }

    if(photo !== undefined){
        drawPhoto();
    }
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
    var refreshInterval = setInterval(function() {
        var random = Math.floor(Math.random() * Math.pow(2, 31));
        var img = new Image();
        img.src="video_call?frame=" + random;
        img.addEventListener('load', function(){draw(img);});
        // img.onload = function(){
        //     ctx.drawImage(img, 0, 0);
        //     ctx.font = "25pt Verdana";
        //     ctx.fillText("Foobar", 50, 50);

        //     if(countdown_interval){
        //         ctx.font = "45pt Verdana";
        //         ctx.fillText(countdown_value, canvas.width/2, canvas.height/2);
        //     }
        // };
    }, TIMEOUT);

    canvas.addEventListener("click", countDown);
});
