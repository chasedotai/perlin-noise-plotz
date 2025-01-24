class NoisySpiral {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // Create a new instance of SimplexNoise
        this.noise = SimplexNoise.createNoise2D();
        this.bindEvents();
        
        // Set initial canvas size
        this.canvas.style.width = '800px';
        this.canvas.style.height = '800px';
        // Set actual canvas resolution
        this.canvas.width = 800 * window.devicePixelRatio;
        this.canvas.height = 800 * window.devicePixelRatio;
    }

    bindEvents() {
        document.getElementById('generate').addEventListener('click', () => this.generate());
        document.getElementById('downloadSVG').addEventListener('click', () => this.downloadSVG());
    }

    generate() {
        const diameter = parseInt(document.getElementById('diameter').value);
        const turns = parseInt(document.getElementById('turns').value);
        const noiseAmplitude = parseInt(document.getElementById('noiseAmplitude').value);
        const noiseFrequency = parseInt(document.getElementById('noiseFrequency').value) / 100;

        // Update canvas size
        this.canvas.style.width = `${diameter}px`;
        this.canvas.style.height = `${diameter}px`;
        this.canvas.width = diameter * window.devicePixelRatio;
        this.canvas.height = diameter * window.devicePixelRatio;
        
        // Clear canvas with white background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Scale for high DPI displays
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // Generate spiral points
        this.points = this.generateSpiralPoints(diameter/2, turns, noiseAmplitude, noiseFrequency);
        
        // Draw spiral
        this.drawSpiral();
    }

    generateSpiralPoints(radius, turns, noiseAmplitude, noiseFrequency) {
        const points = [];
        const steps = turns * 200;
        const centerX = radius;
        const centerY = radius;

        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * turns * Math.PI * 2;
            const distance = (radius * i) / steps;
            
            const noiseValue = this.noise(
                t * noiseFrequency,
                t * noiseFrequency
            );
            
            const noisyDistance = distance + (noiseValue * noiseAmplitude);
            
            const x = centerX + Math.cos(t) * noisyDistance;
            const y = centerY + Math.sin(t) * noisyDistance;
            
            points.push([x, y]);
        }
        
        return points;
    }

    drawSpiral() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.points.forEach((point, i) => {
            if (i === 0) {
                this.ctx.moveTo(point[0], point[1]);
            } else {
                this.ctx.lineTo(point[0], point[1]);
            }
        });
        
        this.ctx.stroke();
    }

    downloadSVG() {
        if (!this.points) return;

        const svgString = this.generateSVG();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'noisy-spiral.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateSVG() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        let pathData = '';
        this.points.forEach((point, i) => {
            pathData += `${i === 0 ? 'M' : 'L'} ${point[0].toFixed(2)} ${point[1].toFixed(2)} `;
        });

        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
     xmlns="http://www.w3.org/2000/svg">
    <path d="${pathData}" fill="none" stroke="black" stroke-width="2"/>
</svg>`;
    }
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const app = new NoisySpiral(canvas);
    app.generate(); // Generate initial spiral
}); 