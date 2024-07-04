let WASM_URL = "https://cdn.jsdelivr.net/npm/gazefilter/dist/gazefilter.wasm";

function setPosition(element, x, y) {
    element.style.position = "absolute";
    element.style.left = x + "px";
    element.style.top = y + "px";
}

function addListeners() {
    gazefilter.tracker.addListener("change", device => {
        if (device) {
            console.assert(gazefilter.tracker.videoElement());

            let {id, width, height, label, frameRate} = device;

            console.log("connected", {id, width, height, label, frameRate});
        } else {
            console.log("disconnected");
        }
    });

    gazefilter.tracker.addListener("filter", event => {
        if (event.eventType === 2) {
            let gazePoint = event.bestGazePoint()
            document.getElementById("x").innerText = "x = " + gazePoint[0];
            document.getElementById("y").innerText = "y = " + gazePoint[1];
            setPosition(
                document.getElementById("target"),
                Math.round(gazePoint[0] - window.screenLeft),
                Math.round(gazePoint[1] - window.screenTop)
            );
        } else {
            console.log(event.timestamp, event.eventType, event.detected);
        }
    });
}

async function setUp() {
    await gazefilter.init(WASM_URL);
    await connectDevice();
}

async function connectDevice() {
    if (gazefilter.tracker.isReady()) {
        await gazefilter.tracker.connect();
    }
}

function visualize() {
    let canvas = document.getElementById("tracker-canvas");
    console.log(canvas);
    gazefilter.visualizer.setCanvas(canvas);
}

function onMouseClick(event) {
    gazefilter.tracker.calibrate(
        event.timeStamp,
        event.screenX,  // in pixels
        event.screenY,  // in pixels
        0.5
    )
}

function onCalib(response) {
    console.log("calibration error: ", response.errorValue);
    if (response.errorCode === 0) {
        console.log("calibration success");
    }
}

function calibrate() {
    // enable mouse calibration
    window.addEventListener("click", onMouseClick);

    // listen calibration process
    gazefilter.tracker.addListener("calib", onCalib);
}

addListeners();
setUp().then(() => {
    // visualize();
    calibrate();
})

