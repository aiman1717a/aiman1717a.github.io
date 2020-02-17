

    const video = document.querySelector("#videoElement");
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    ]).then(startVideo);

    function startVideo() {
        navigator.getUserMedia(
            {video: {}},
            stream => video.srcObject = stream,
            error => console.log(error)
        )
    }
    video.addEventListener('play', function() {
        console.log('playing');
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = {width: video.width, height: video.height};
        faceapi.matchDimensions(canvas, displaySize);
        console.log('playing');
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video,
                new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
            console.log(detections);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
        }, 100)
    });

