let WASM_URL = "https://cdn.jsdelivr.net/npm/gazefilter/dist/gazefilter.wasm";

function addListeners() {
    gazefilter.tracker.addListener("change", device => {
        if (device) {
            console.assert(gazefilter.tracker.videoElement());

            let { id, width, height, label, frameRate } = device;

            console.log("connected", { id, width, height, label, frameRate });
        } else {
            console.log("disconnected");
        }
    });
}

async function setUp() {
    await gazefilter.init(WASM_URL);
    await connectDevice();
}

async function connectDevice() {
    if(gazefilter.tracker.isReady()) {
        await gazefilter.tracker.connect();
    }
}

function visualize() {
    let canvas= document.getElementById("tracker-canvas");
    console.log(canvas);
    gazefilter.visualizer.setCanvas(canvas);
}

function onMouseClick(event) {
    gazefilter.tracker.calibrate(
        event.timeStamp,  // relative to performance.timeOrigin
        event.screenX,  // in pixels
        event.screenY,  // in pixels
        1.0  // see note below
    );
}

function onCalib(response) {
    console.log("calibration error: ", response.errorValue);
    // if (response.errorCode === 0) {
    //     console.log("success");
    // }
}

function calibrate() {
    // enable mouse calibration
    window.addEventListener("click", onMouseClick);

    // listen calibration process
    gazefilter.tracker.addListener("calib", onCalib);
}

addListeners()
setUp()
// visualize()
calibrate()
