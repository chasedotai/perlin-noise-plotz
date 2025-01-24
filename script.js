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

        // Set canvas size
        this.canvas.width = diameter;
        this.canvas.height = diameter;
        
        // Clear canvas with white background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Generate spiral points
        this.points = this.generateSpiralPoints(diameter/2, turns, noiseAmplitude, noiseFrequency);
        
        // Draw spiral
        this.drawSpiral();
    }

    generateSpiralPoints(radius, turns, noiseAmplitude, noiseFrequency) {
        const points = [];
        const steps = turns * 200;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < steps; i++) {
            const t = (i / steps) * turns * Math.PI * 2;
            // Calculate base spiral radius
            const spiralRadius = (radius * i) / steps;
            
            // Add noise to the radius
            const noiseValue = this.noise(
                Math.cos(t) * noiseFrequency,
                Math.sin(t) * noiseFrequency
            );
            
            // Apply noise to radius
            const noisyRadius = spiralRadius + (noiseValue * noiseAmplitude);
            
            // Calculate final position
            const x = centerX + Math.cos(t) * noisyRadius;
            const y = centerY + Math.sin(t) * noisyRadius;
            
            points.push([x, y]);
        }
        
        return points;
    }

    drawSpiral() {
        // Clear any previous transformations
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
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