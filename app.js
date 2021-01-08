/* Common Tool */

        class Tool {
        // random number.
            static randomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            // random color rgb.
            static randomColorRGB() {
                return (
                "rgb(" +
                this.randomNumber(0, 255) +
                ", " +
                this.randomNumber(0, 255) +
                ", " +
                this.randomNumber(0, 255) +
                ")"
                );
            }
            // random color hsl.
            static randomColorHSL(hue, saturation, lightness) {
                return (
                "hsl(" +
                hue +
                ", " +
                saturation +
                "%, " +
                lightness +
                "%)"
                );
            }
            // gradient color.
            static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
                const col = cr + "," + cg + "," + cb;
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, "rgba(" + col + ", " + (ca * 1) + ")");
                g.addColorStop(0.5, "rgba(" + col + ", " + (ca * 0.5) + ")");
                g.addColorStop(1, "rgba(" + col + ", " + (ca * 0) + ")");
                return g;
            }
            // framerate
            static calcFPS() {
                const now = (+new Date());
                const fps = 1000 / (now - lastTime);
                lastTime = now;
                return fps.toFixed();
            }
        }

        /* When we want to use angle. */

        class Angle {
            constructor(angle) {
                this.a = angle;
                this.rad = this.a * Math.PI / 180;
            }

            incDec(num) {
                this.a += num;
                this.rad = this.a * Math.PI / 180;
                return this.rad;
            }
        }

        /* When we want to use vector. */

        class Vector2d {
            constructor(x, y) {
                this.vx = x;
                this.vy = y;
            }

            scale(scale) {
                this.vx *= scale;
                this.vy *= scale;
            }

            add(vec2) {
                this.vx += vec2.vx;
                this.vy += vec2.vy
            }

            sub(vec2) {
                this.vx -= vec2.vx;
                this.vy -= vec2.vy;
            }

            negate() {
                this.vx = -this.vx;
                this.vy = -this.vy;
            }

            length() {
                return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            }

            lengthSquared() {
                return this.vx * this.vx + this.vy * this.vy;
            }

            normalize() {
                let len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (len) {
                    this.vx /= len;
                    this.vy /= len;
                }
                return len;
            }

            rotate(angle) {
                let vx = this.vx;
                let vy = this.vy;
                let cosVal = Math.cos(angle);
                let sinVal = Math.sin(angle);
                this.vx = vx * cosVal - vy * sinVal;
                this.vy = vx * sinVal + vy * cosVal;
            }

            toString() {
                return '(' + this.vx.toFixed(3) + ',' + this.vy.toFixed(3) + ')';
            }
        }

        /* When we want to use time. */

        class Stopwatch {
            constructor(time) {
                this.startTime = 0;
                this.running = false;
                this.elapsed = undefined;
            }

            start() {
                this.startTime = +new Date();
                this.elapsedTime = null;
                this.running = true;
            }

            stop() {
                this.elapsed = (+new Date()) - this.startTime;
                this.running = false;
            }

            getElapsedTime() {
                if (this.running) {
                    return (+new Date()) - this.startTime;
                } else {
                    return this.elapsed;
                }
            }

            isRunning() {
                return this.running;
            }

            reset() {
                this.elapsed = 0;
            }
        }

        /* When we want to use collision detection. */

        class Collision {
            constructor(targetArr) {
                this.arr = targetArr;
            }

            collideAll() {
                let vec = new Vector2d(0, 0);
                let dist;
                let obj1;
                let obj2;
                let c;
                let i;
                for (c = 0; c < this.arr.length; c++) {
                    obj1 = this.arr[c];
                    for (i = c + 1; i < this.arr.length; i++) {
                            obj2 = this.arr[i];
                            vec.vx = obj2.x - obj1.x;
                            vec.vy = obj2.y - obj1.y;
                            dist = vec.length();
                            if (dist < obj1.r + obj2.r) {
                                vec.normalize();
                                vec.scale(obj1.r + obj2.r - dist);
                                vec.negate();
                                obj1.x += vec.vx;
                                obj1.y += vec.vy;
                                this.bounce(obj1, obj2);
                            }
                    }
                }
            }

            bounce(obj1, obj2) {
                let colnAngle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x);
                let length1 = obj1.v.length();
                let length2 = obj2.v.length();
                let dirAngle1 = Math.atan2(obj1.v.vy, obj1.v.vx);
                let dirAngle2 = Math.atan2(obj2.v.vy, obj2.v.vx);
                let newVX1 = length1 * Math.cos(dirAngle1 - colnAngle);
                let newVX2 = length2 * Math.cos(dirAngle2 - colnAngle);
                obj1.v.vy = length1 * Math.sin(dirAngle1 - colnAngle);
                obj2.v.vy = length2 * Math.sin(dirAngle2 - colnAngle);
                obj1.v.vx = ((obj1.r - obj2.r) * newVX1 + (2 * obj2.r) * newVX2) / (obj1.r + obj2.r);
                obj2.v.vx = ((obj2.r - obj1.r) * newVX2 + (2 * obj1.r) * newVX1) / (obj1.r + obj2.r);
                obj1.v.rotate(colnAngle);
                obj2.v.rotate(colnAngle);
            }
        }

        /*  When we want to use the controller. */

        class Controller {
            constructor(id) {
                this.id = document.getElementById(id);
            }
            getVal() {
                return this.id.value;
            }
        }

        let canvas;
        let lastTime = 0; // to use framerate.

        class Canvas {
            constructor(bool) {
                // create canvas.
                this.canvas = document.createElement("canvas");
                // if on screen.
                if (bool === true) {
                    this.canvas.style.position = 'fixed';
                    this.canvas.style.display = 'block';
                    this.canvas.style.top = '0';
                    this.canvas.style.left = '0';
                    document.getElementsByTagName("body")[0].appendChild(this.canvas);
                }
                this.ctx = this.canvas.getContext("2d");
                this.width = this.canvas.width = window.innerWidth;
                this.height = this.canvas.height = window.innerHeight;
                // mouse infomation.
                this.mouseX = null;
                this.mouseY = null;
                this.mouseZ = null;
                // shape
                this.shapeNum = 3;
                this.shapes = [];
                // glitch
                this.glitch;
                // Laughing
                this.laughingNum = 1;
                this.laughings = [];
            }
        
        // init, render, resize
        init() {
            for (let i = 0; i < this.shapeNum; i++) {
                const s = new Shape(this.ctx, this.width / 2, this.height / 2);
                this.shapes.push(s);
            }

            this.glitch = new Glitch(this.ctx);
        }

        render() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            for (let i = 0; i < this.shapes.length; i++) {
                this.shapes[i].render();
            }
            this.glitch.render();
            this.drawFPS();
        }

        drawFPS() {
            const ctx = this.ctx;
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.font = '16px sans-selif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(Tool.calcFPS() + ' FPS', this.width, this.height);
            ctx.restore();
        }
        
        resize() {
            this.shapes = [];
            this.laughings = [];
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
            this.init();
        }
        }

        /* Shape class. */

        class Shape {
        constructor(ctx, x, y) {
            this.ctx = ctx;
            this.init(x, y);
        }

        init(x, y) {
            this.a = new Angle(Tool.randomNumber(0, 360));
            this.x = x;
            this.y = y;
            this.r = 150;
            this.lw = this.r / 6;
            this.num = 3;
            this.rad = Math.PI * 2 / this.num;
        }

        draw() {
            const ctx = this.ctx;
            const dist = Math.cos(this.a.rad) * Math.random() * 10;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineWidth = this.lw;
            ctx.fillStyle = 'hsl(' + Math.sin(this.a.rad) * 360 + ', 80%, 60%)';
            ctx.translate(this.x + dist, this.y + dist);
            ctx.rotate(30 * Math.PI / 180);
            ctx.translate(-this.x - dist, -this.y - dist);
            ctx.beginPath();
            for (let i = 0; i < this.num; i++) {
            const x = Math.cos(this.rad * i) * this.r + this.x;
            const y = Math.sin(this.rad * i) * this.r + this.y;
            if (i === 0) ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.clip();
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            for (let i = 0; i < this.num + 1; i++) {
            let x = Math.cos(this.rad * i) * this.r / 2 + this.x;
            let y = Math.sin(this.rad * i) * this.r / 2 + this.y;
            if (i === this.num) {
                x = Math.cos(this.rad * i) * this.r * 2 + this.x;
                y = Math.sin(this.rad * i) * this.r * 2 + this.y + this.r;
            }
            if (i === 0) ctx.moveTo(x, y);
            ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = 'hsl(' + Math.sin(this.a.rad) * 360 + ', 80%, 60%)';
            ctx.font = '48px "Rajdhani", sans-selif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SECTION 9', this.x + dist, this.y + dist + this.r * 0.8);
            ctx.restore();
        }

        updateParams() {
            this.a.incDec(1);
        }

        render() {
            this.draw();
            this.updateParams();
        }
        }

        /* Laughing Man class. */

        class Laughing {
        constructor(ctx, x, y) {
            this.ctx = ctx;
            this.init(x, y);
        }

        init(x, y) {
            this.a = new Angle(Tool.randomNumber(0, 360));
            this.a1 = new Angle(0);
            this.x = x;
            this.y = y;
            this.r = 150;
            this.lw = this.r / 10;
            this.t = "    I thought what I'd do was, I'd pretend I was one of those deaf-mutes    ";
            this.rad = Math.PI * 2 / (this.t.length - 1);
            this.c = 'hsl(' + Math.sin(this.a.rad) * 360 + ', 10%, 10%)';
        }

        draw() {
            const ctx = this.ctx;
            let dist = Math.cos(this.a.rad) * Math.random() * 5;
            ctx.save();
            // outside circle
            ctx.translate(this.x + dist, this.y + dist);
            ctx.rotate(Math.cos(this.a1.rad));
            ctx.scale(Math.cos(this.a1.rad / 3), Math.sin(this.a1.rad / 5));
            ctx.translate(-this.x + dist, -this.y + dist);
            ctx.lineCap = 'square';
            ctx.lineWidth = this.lw / 1.5;
            ctx.strokeStyle = this.c;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 1.4, 0, Math.PI * 2, false);
            ctx.stroke();
            // text
            for (let i = 0; i < this.t.length; i++) {
            ctx.save();
            ctx.fillStyle = this.c;
            ctx.font = '24px "impact", sans-selif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let x = Math.cos(this.rad * i) * this.r * 1.2 + this.x;
            let y = Math.sin(this.rad * i) * this.r * 1.2 + this.y;
            ctx.translate(x, y);
            ctx.rotate(this.rad * i + 90 * Math.PI / 180);
            ctx.fillText(this.t[i], 0, 0);
            ctx.restore();
            }
            // face
            ctx.lineWidth = this.lw;
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.arc(this.x, this.y, this.r, Math.PI, -Math.PI * 0.92, true);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(this.x - this.r * 0.98, this.y - this.r * 0.2);
            ctx.lineTo(this.x + this.r * 1.5, this.y - this.r * 0.2);
            ctx.quadraticCurveTo(this.x + this.r * 1.7, this.y + this.r * 0.01, this.x + this.r * 1.5, this.y + this.r * 0.2);
            ctx.lineTo(this.x + this.r * 0.98, this.y + this.r * 0.2);
            ctx.fill();
            ctx.stroke();
            // eyes
            ctx.save();
            ctx.fillStyle = this.c;
            ctx.beginPath();
            ctx.arc(this.x - this.r / 2.8, this.y + this.r / 18, this.r / 6, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.clip();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x - this.r / 2.8, this.y + this.r / 30 + this.r / 10, this.r / 6, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.fillStyle = this.c;
            ctx.beginPath();
            ctx.arc(this.x + this.r / 2.8, this.y + this.r / 18, this.r / 6, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.clip();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + this.r / 2.8, this.y + this.r / 30 + this.r / 10, this.r / 6, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.restore();
            // mouth
            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.arc(this.x, this.y, this.r * 0.7, 0 + Math.PI / 10, Math.PI - Math.PI / 10, false);
            ctx.closePath();
            ctx.fill(); 
            ctx.stroke();
            ctx.restore();
        }

        updatePosition() {
            this.a.incDec(1);
            this.a1.incDec(1);
            this.c = 'hsl(' + Math.sin(this.a.rad) * 360 + ', 60%, 60%)';
            this.x = Math.cos(this.a1.rad / 5) * 50 + canvas.width / 2;
            this.y = Math.sin(this.a1.rad / 5) * 50 + canvas.height / 2;
        }

        render() {
            this.draw();
            this.updatePosition();
        }
        }

        /* Glitch class. */

        class Glitch {
        constructor(ctx) {
            this.a = new Angle(0);
            this.ctx = ctx;
            this.splitNum = 200;
            this.splitY =  canvas.height / this.splitNum;
            this.angles = [];
            this.anglesForRGB = [];
            this.dataArr = [];
            this.getAngles();
            this.getAnglesForRGB();
        }

        getAnglesForRGB() {
            for (let i = 0; i < 3; i++) {
            const a = Tool.randomNumber(0, 360);
            const r = a * Math.PI / 180;
            const arr = [a, r];
            this.anglesForRGB.push(arr);
            }
        }

        getAngles() {
            for (var i = 0; i < this.splitNum ; i++) {
            const angle = 0;
            const gap = 0;
            const arr = [angle, gap];
            this.angles.push(arr);
            }
        }

        getImageData() {
            for (let i = 0; i < this.splitNum ; i++) {
            let d = this.ctx.getImageData(0, this.splitY * i, canvas.width, this.splitY + 1);
            let data = d.data;
            
            this.dataArr.push(d);
            }
        }

        updateAnglesForRGB() {
            for (let i = 0; i < this.anglesForRGB.length; i++) {
            this.anglesForRGB[i][1] += Tool.randomNumber(-1, 1) * Math.random();
            }
        }

        addImage(){
            for (let i = 0; i < this.splitNum ; i++) {
            if (Math.random() > 0.01) {
                this.ctx.putImageData(
                this.dataArr[i],
                Math.sin(this.a.rad * 10 + i * 10 * Math.PI / 180) * Math.random() * Math.cos(this.a.rad) * 20,
                this.splitY * i
                );
            } else {
                this.ctx.putImageData(
                this.dataArr[Tool.randomNumber(0, this.splitNum - 1)],
                Math.sin(this.a.rad * 10 + i * 10 * Math.PI / 180) * Math.random() * canvas.width,
                this.splitY * i
                );
            }
            }
        }

        changeAngle() {
            for (var i = 0; i < this.angles.length; i++) {
            this.angles[i][0] += i;
            }
        }

        render() {
            this.a.incDec(1);
            this.dataArr = [];
            this.getImageData();
            this.addImage();
        }
    }

    (function () {
        "use strict";
        window.addEventListener("load", function () {
            canvas = new Canvas(true);
            canvas.init();
            
            function render() {
                window.requestAnimationFrame(function () {
                    canvas.render();
                    render();
                });
            }
            
            render();

            // event
            window.addEventListener("resize", function() {
                canvas.resize();
            }, false);
        });
    })
    ();
