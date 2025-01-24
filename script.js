class NoisySpiral {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.noise = SimplexNoise.createNoise2D();
        this.bindEvents();
        this.generate(); // Generate initial spiral
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
        
        // Draw spiral
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        
        const centerX = diameter / 2;
        const centerY = diameter / 2;
        const maxRadius = diameter / 2;
        
        for (let angle = 0; angle < turns * Math.PI * 2; angle += 0.1) {
            const radius = (angle / (turns * Math.PI * 2)) * maxRadius;
            const noiseValue = this.noise(angle * noiseFrequency, angle * noiseFrequency) * noiseAmplitude;
            
            const x = centerX + (radius + noiseValue) * Math.cos(angle);
            const y = centerY + (radius + noiseValue) * Math.sin(angle);
            
            if (angle === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        
        // Store points for SVG export
        this.points = Array.from(this.ctx.getPathPoints?.() || []);
    }

    downloadSVG() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Create SVG path data directly from last drawn spiral
        const pathData = `M ${width/2} ${height/2} ` + Array.from({length: 360}, (_, i) => {
            const angle = (i / 360) * Math.PI * 2;
            const radius = (i / 360) * (width/2);
            const x = width/2 + radius * Math.cos(angle);
            const y = height/2 + radius * Math.sin(angle);
            return `L ${x} ${y}`;
        }).join(' ');

        const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
     xmlns="http://www.w3.org/2000/svg">
    <path d="${pathData}" fill="none" stroke="black" stroke-width="2"/>
</svg>`;

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
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const app = new NoisySpiral(canvas);
}); 