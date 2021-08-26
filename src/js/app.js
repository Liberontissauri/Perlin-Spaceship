import '../scss/app.scss';
import p5 from 'p5';
import Victor from 'victor';

function toDegrees (angle) {
    return angle * (180 / Math.PI);
};
function toRadians (angle) {
    return angle / (180 / Math.PI);
};
function getBaseSize(line_height, triangle_size, s, time) {
    return s.noise(line_height * 0.001, time * 0.015) * triangle_size * 0.4 + triangle_size * 0.3;
}

let width = window.innerWidth;
let height = window.innerHeight;
const BOTTOM_BASE_COLOR = "hsla(242, 45%, 62%, 1)";
const TOP_BASE_COLOR = "hsla(219, 46%, 74%, 1)";
let triangle_size = 300 *  0.7;
let time = 0;
let particles = [];

if (window.innerWidth < 1000) {
    width = window.innerWidth*0.7;
    height = window.innerHeight*0.7;
    triangle_size = 300*0.5;
}


class Particle {
    constructor(position, speed, length, color, s) {
        this.position = position;
        this.speed = speed;
        this.length = length;
        this.color = color;
        this.s = s;
    }
    draw() {
        this.s.stroke(this.color);
        this.s.line(this.position.x, this.position.y, this.position.x, this.position.y + this.length);
    }
    update() {
        this.position.add(this.speed);
        this.draw();
    }
}

const sketch = (s) => {
    s.setup = () => {
        s.createCanvas(width, height);
        s.frameRate(22)
    };

    s.draw = () => {
        s.background("hsla(228, 17%, 11%, 1)");
        const center_x = width / 2;
        const center_y = height / 2;
        s.stroke("#ffffff00")
        s.fill("hsla(228, 17%, 92%, 1)")
        s.triangle(
            center_x - triangle_size/2 - 50, center_y + triangle_size/2,
            center_x + triangle_size/2 + 50, center_y + triangle_size/2,
            center_x, center_y - triangle_size/2
        )
        for (let i = center_y + triangle_size/2; i < height; i++) {
            const line_number = i - (center_y + triangle_size/2);
            const length = getBaseSize(line_number, triangle_size+100, s, time);
            const color = s.lerpColor(s.color(TOP_BASE_COLOR), s.color(BOTTOM_BASE_COLOR), line_number / (height - center_y - triangle_size/2))
            s.stroke(color)
            s.line(center_x - length/2, i, center_x + length/2, i)
        }
        if(s.noise(time) > 0.3) {
            particles.push(new Particle(new Victor(s.random(width), 0), new Victor(0, 100), 500, "#ffffff70", s))
        }
        particles.forEach(particle => {
            particle.update();
        });
        
        time += 2
    };
    s.windowResized = () => {
        width = window.innerWidth;
        height = window.innerHeight;

        if (window.innerWidth < 1000) {
            width = window.innerWidth*0.7;
            height = window.innerHeight*0.7;
            triangle_size = 300*0.5;
        }

        s.resizeCanvas(width, height);
    }
};

const sketchInstance = new p5(sketch);