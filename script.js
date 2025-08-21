const inputGambar = document.getElementById('input-gambar');
const gambarPreview = document.getElementById('gambar-preview');
const canvasOverlay = document.getElementById('canvas-overlay');
const status = document.getElementById('status');
const ctx = canvasOverlay.getContext('2d');

async function jalankan() {
    status.innerText = 'Memuat model AI...';
    const model = await cocoSsd.load();
    status.innerText = 'Model siap. Silakan unggah gambar.';

    inputGambar.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            gambarPreview.src = e.target.result;
            gambarPreview.classList.remove('hidden');
            gambarPreview.onload = async () => {
                status.innerText = 'Mendeteksi objek...';
                const predictions = await model.detect(gambarPreview);
                gambarObjek(predictions);
                status.innerText = `Terdeteksi ${predictions.length} objek.`;
            };
        };
        reader.readAsDataURL(file);
    });
}

function gambarObjek(predictions) {
    // Menyesuaikan ukuran canvas dengan gambar
    canvasOverlay.width = gambarPreview.clientWidth;
    canvasOverlay.height = gambarPreview.clientHeight;
    ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;

        // Menggambar kotak
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Menggambar label
        ctx.fillStyle = '#00FFFF';
        ctx.font = '16px Arial';
        ctx.fillText(text, x, y > 10 ? y - 5 : 10);
    });
}

jalankan();