import React, { useRef, useState } from "react";
import styles from "./App.scss";
import recognizeDigit from "./Recognizer";

function App() {
    const [mouseDown, setMouseDown] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const canvasEl = useRef(null);

    function handleMouseStart(e) {
        setMouseDown(true);
        const ctx = canvasEl.current.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.strokeStyle = styles.primaryColor;
    }

    function handleMouseStop(e) {
        setMouseDown(false);

        const ctx = canvasEl.current.getContext("2d");
        const imageData = ctx.getImageData(
            0,
            0,
            canvasEl.current.width,
            canvasEl.current.height
        );
        // recognize digit
        recognizeDigit(
            imageData.data,
            canvasEl.current.width,
            canvasEl.current.height
        ).then((newPrediction) => {
            setPrediction(newPrediction);
        });
    }

    function handleMouseMove(e) {
        if (mouseDown) {
            const canvasBounds = canvasEl.current.getBoundingClientRect();

            const mouseX = e.clientX - canvasBounds.left;
            const mouseY = e.clientY - canvasBounds.top;

            const ctx = canvasEl.current.getContext("2d");
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
        }
    }

    function handleClear() {
        setMouseDown(false);
        setPrediction(null);
        const ctx = canvasEl.current.getContext("2d");

        ctx.clearRect(0, 0, canvasEl.current.width, canvasEl.current.height);
    }

    let status;
    if (prediction != null) {
        status = (
            <h1 id="prediction">
                Did you draw a{prediction == 8 ? "n " : " "}
                <span id="number">{prediction}</span>?
            </h1>
        );
    } else status = <h1 id="prediction">Draw a number!</h1>;

    return (
        <div className="app">
            <h1 id="title">MNIST Digit Recognizer</h1>
            <canvas
                ref={canvasEl}
                width={200}
                height={200}
                onMouseDown={handleMouseStart}
                onMouseUp={handleMouseStop}
                onMouseLeave={handleMouseStop}
                onMouseMove={handleMouseMove}
            />
            <button onClick={handleClear}>Clear</button>
            {status}
            <a id="github" href="https://github.com/jinayjain/">
                <svg
                    role="img"
                    width="2em"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>GitHub icon</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
            </a>
        </div>
    );
}

export default App;
