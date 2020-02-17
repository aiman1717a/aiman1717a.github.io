    var video = document.getElementById("videoElement");
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ]).then(function () {
        console.log('yeahh');
        startVideo();
    });

    function startVideo() {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log(err0r);
                });
        }
    }
    video.addEventListener('loadeddata', function() {
        var canvas = faceapi.createCanvasFromMedia(video);
        // var container = document.querySelector(".container");
        document.body.append(canvas);
        const displaySize = {width: video.videoWidth, height: video.videoHeight};
        faceapi.matchDimensions(canvas, displaySize);
        setInterval(async () =>  {
            const detections = await faceapi.detectAllFaces(video,
                new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            console.log(detections);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100)
    });
    // video.addEventListener('loadeddata', function() {
    //
    // });
