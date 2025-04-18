function Vec2d(x, y) {
    this.x = x;
    this.y = y;

    this.add = function(other) { return new Vec2d(this.x + other.x, this.y + other.y); };
    this.sub = function(other) { return new Vec2d(this.x - other.x, this.y - other.y); };
    this.mul = function(other) { return new Vec2d(this.x * other.x, this.y * other.y); };

    this.scale = function(k) { return new Vec2d(k*this.x, k*this.y); };
    this.dot = function(other) { return this.x * other.x + this.y * other.y; };
    this.length = function() { return Math.sqrt(this.dot(this)); };

    this.norm = function() { return this.scale(1.0/this.length()); };
}

function direction(angle) {
    return new Vec2d(Math.cos(angle), Math.sin(angle));
}

function getRandomPointNear(vec, radius) {
    const dir = new Vec2d(2*Math.random() - 1.0, 2*Math.random() - 1.0).norm().scale(radius);
    return vec.add(dir);
}


function Box(x, y, width, height) {
    this.pos = new Vec2d(x, y);
    this.size = new Vec2d(width, height);
    this.a = this.pos;
    this.b = this.pos.add(this.size);

    this.intersectsWithPoint = function(point) {
        return (point.x >= this.a.x) &&
            (point.y >= this.a.y) &&
            (point.x < this.b.x) &&
            (point.y < this.b.y);
    };

    this.getRandomPoint = function() {
        const x = this.a.x + (this.b.x - this.a.x) * Math.random();
        const y = this.a.y + (this.b.y - this.a.y) * Math.random();
        return new Vec2d(x, y);
    };
}


function Matrix2d(m, n) {
    this.body = [];
    this.m = m;
    this.n = n;

    for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < n; j++) { row.push(0); }
        this.body.push(row);
    }

    this.get = function(i, j) { return this.body[i][j]; };
    this.put = function(i, j, value) { this.body[i][j] = value; };

    this.dot = function(other) {
        if (this.n !== other.m) { throw new Error('Wrong matrix multiplication'); }
        const result = new Matrix2d(this.m, other.n);

        for (let i = 0; i < result.m; i++) {
            for (let j = 0; j < result.n; j++) {
                let item = 0;
                for (let k = 0; k < this.n; k++) { item += this.get(i, k) * other.get(k, j); }
                result.put(i, j, item);
            }
        }

        return result;
    }

    this.add = function(other) {
        if (this.n !== other.n || this.m !== other.m) { throw new Error('Wrong matrix sum'); }
        const result = new Matrix2d(this.m, this.n);

        for (let i = 0; i < result.m; i++) {
            for (let j = 0; j < result.n; j++) {
                result.put(i, j, this.get(i, j) + other.get(i, j));
            }
        }

        return result;
    };

    this.sub = function(other) {
        if (this.n !== other.n || this.m !== other.m) { throw new Error('Wrong matrix sub'); }
        const result = new Matrix2d(this.m, this.n);

        for (let i = 0; i < result.m; i++) {
            for (let j = 0; j < result.n; j++) {
                result.put(i, j, this.get(i, j) - other.get(i, j));
            }
        }

        return result;
    };

    this.scale = function(k) {
        const result = new Matrix2d(this.m, this.n);

        for (let i = 0; i < result.m; i++) {
            for (let j = 0; j < result.n; j++) {
                result.put(i, j, k * this.get(i, j));
            }
        }

        return result;
    };

    this.T = function(other) {
        const result = new Matrix2d(this.n, this.m);

        for (let i = 0; i < result.m; i++) {
            for (let j = 0; j < result.n; j++) {
                result.put(j, i, this.get(i, j));
            }
        }

        return result;
    };

    this.map = function(func) {
        const result = new Matrix2d(this.m, this.n);

        for (let i = 0; i < result.m; i++) {
            for (let j = 0; j < result.n; j++) {
                result.put(i, j, func(this.get(i, j), i, j));
            }
        }

        return result;
    };

    this.log = function() {
        for (let i = 0; i < this.m; i++) {
            let row = '';
            for (let j = 0; j < this.n; j++) { row += String(this.get(i, j)) + ' '; }
            console.log(row);
        }
    };

    this.copy = function() {
        return this.map(item => item);
    };

    this.swap = function(other, i, j) {
        const a = this.get(i, j);
        const b = other.get(i, j);
        this.put(i, j, b);
        other.put(i, j, a);
    };
}
