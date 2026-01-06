const startBtn = document.getElementById("start-btn");
const captureBtn = document.getElementById("capture-btn");
const downloadBtn = document.getElementById("download-btn");
const video = document.getElementById("camera");
const photoStrip = document.getElementById("photo-strip");
const bgSelect = document.getElementById("bg-select");
const emojiSelect = document.getElementById("emoji-select");
const bgEmoji = document.getElementById("bg-emoji");

let stream;
let capturedImages = [];
let chosenEmoji = "💖";

/* 🎨 Change background */
bgSelect.addEventListener("change", () => {
  document.body.className = bgSelect.value;
});

/* 💫 Change floating emoji */
emojiSelect.addEventListener("change", () => {
  chosenEmoji = emojiSelect.value;
  bgEmoji.textContent = chosenEmoji;
});

/* 🎞️ Start camera */
startBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    captureBtn.disabled = false;
  } catch (err) {
    alert("Camera access denied or not available.");
  }
});

/* 📸 Capture up to 4 photos */
captureBtn.addEventListener("click", () => {
  if (capturedImages.length >= 4) {
    alert("You can only take 4 photos per session!");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL("image/png");

  const img = document.createElement("img");
  img.src = dataURL;
  photoStrip.appendChild(img);
  capturedImages.push(dataURL);

  if (capturedImages.length === 4) {
    downloadBtn.disabled = false;
  }
});

/* 💾 Download all 4 photos in one strip */
downloadBtn.addEventListener("click", () => {
  const stripCanvas = document.createElement("canvas");
  stripCanvas.width = 320;
  stripCanvas.height = 960; // 4 photos stacked
  const ctx = stripCanvas.getContext("2d");

  capturedImages.forEach((imgSrc, i) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      ctx.drawImage(img, 0, i * 240, 320, 240);
      if (i === capturedImages.length - 1) {
        const link = document.createElement("a");
        link.download = "photo_strip.png";
        link.href = stripCanvas.toDataURL("image/png");
        link.click();
      }
    };
  });
});
