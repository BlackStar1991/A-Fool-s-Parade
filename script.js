const img = document.querySelector("#displacementFilter feTurbulence");
let frames = 0;
const rad = Math.PI / 180;

function animateBaseFrequency() {
    let bfx = 0.01;
    let bfy = 0.05;
    frames += 0.4;
    bfx += 0.01 * Math.cos(frames * rad);
    bfy += 0.01 * Math.sin(frames * rad);

    const bf = bfx.toString() + ' ' + bfy.toString();
    img.setAttributeNS(null, 'baseFrequency', bf);

    window.requestAnimationFrame(animateBaseFrequency);
}

window.requestAnimationFrame(animateBaseFrequency);

const playButton = document.querySelector('.button--play');
const audio = document.getElementById('player');
const wrapperEqualizer = document.querySelector(".wrapper_equalizer");
const canvas = document.getElementById('canvas');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioContext;
let analyzer;

playButton.addEventListener('click', () => {
    if (audio.paused) {
        playButton.classList.add('button--active');
        wrapperEqualizer.classList.add('active');
        audio.play();

        // Создаем AudioContext только при первом нажатии на кнопку
        if (!audioContext) {
            audioContext = new AudioContext();
            analyzer = audioContext.createAnalyser();
            const audioSource = audioContext.createMediaElementSource(audio);
            audioSource.connect(analyzer);
            analyzer.connect(audioContext.destination);
            analyzer.fftSize = 128;
        }

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const barWidth = (canvas.width / 2) / bufferLength;
        let barHeight;
        let x = 0;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyzer.getByteFrequencyData(dataArray);
            drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
            x = 0;
            requestAnimationFrame(animate);
        }
        animate();

        function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2;
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight/2, 0, canvas.height);
                gradient.addColorStop(1, "rgb(0,0,0)");
                gradient.addColorStop(0.8, "rgb(255,0,0)");
                gradient.addColorStop(0, "rgb(181,0,0)");
                ctx.fillStyle = gradient;
                ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
            }
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 2;
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight/2, 0, canvas.height);
                gradient.addColorStop(1, "rgb(0,0,0)");
                gradient.addColorStop(0.8, "rgb(255,0,0)");
                gradient.addColorStop(0, "rgb(181,0,0)");
                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
            }
        }




    } else {
        playButton.classList.remove('button--active');
        wrapperEqualizer.classList.remove('active');
        audio.pause();
    }
});


