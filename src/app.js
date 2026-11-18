// shae-javascript-browser-drawing — src/app.js
//
// HTML5 canvas drawing app with mouse and touch support, color picker,
// brush size, clear canvas, and save as PNG.
// Designed to the SHAE field manual: paper background, ink strokes, oxide
// accent UI, 0px radius, 1px borders, 44px touch targets, oxide focus rings.

(function () {
  "use strict";

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var colorInput = document.getElementById("color");
  var brushInput = document.getElementById("brush");
  var brushVal = document.getElementById("brush-val");
  var clearBtn = document.getElementById("clear");
  var saveBtn = document.getElementById("save");

  var PAPER = "#F2EEE5";
  var INK = "#191712";

  var drawing = false;
  var lastX = 0;
  var lastY = 0;

  // ------------------------------------------------------------------ setup

  function setupContext() {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colorInput.value || INK;
    ctx.lineWidth = parseInt(brushInput.value, 10) || 8;
    ctx.fillStyle = ctx.strokeStyle;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function positionOf(e, el) {
    var rect = el.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    return { x: x, y: y };
  }

  function positionOfTouch(e, el) {
    var rect = el.getBoundingClientRect();
    var touch = e.touches[0] || e.changedTouches[0];
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    return { x: x, y: y };
  }

  function draw(x, y) {
    if (!drawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function dot(x, y) {
    // A single click/tap still leaves a round dot.
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // ------------------------------------------------------------------ input

  brushInput.addEventListener("input", function () {
    brushVal.textContent = brushInput.value + " px";
    setupContext();
  });

  colorInput.addEventListener("input", function () {
    setupContext();
  });

  clearBtn.addEventListener("click", clearCanvas);

  saveBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "shae-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // ------------------------------------------------------------------ mouse

  canvas.addEventListener("mousedown", function (e) {
    setupContext();
    var pos = positionOf(e, canvas);
    drawing = true;
    lastX = pos.x;
    lastY = pos.y;
    dot(pos.x, pos.y);
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!drawing) return;
    var pos = positionOf(e, canvas);
    draw(pos.x, pos.y);
  });

  window.addEventListener("mouseup", function () {
    drawing = false;
  });

  canvas.addEventListener("mouseleave", function () {
    drawing = false;
  });

  // ------------------------------------------------------------------ touch

  // Prevent scrolling while drawing on touch devices.
  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      setupContext();
      var pos = positionOfTouch(e, canvas);
      drawing = true;
      lastX = pos.x;
      lastY = pos.y;
      dot(pos.x, pos.y);
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    function (e) {
      if (!drawing) return;
      e.preventDefault();
      var pos = positionOfTouch(e, canvas);
      draw(pos.x, pos.y);
    },
    { passive: false }
  );

  canvas.addEventListener("touchend", function () {
    drawing = false;
  });

  canvas.addEventListener("touchcancel", function () {
    drawing = false;
  });

  // ------------------------------------------------------------------ init

  clearCanvas();
  setupContext();
})();
