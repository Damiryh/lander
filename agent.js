function Agent(lander, genome) {
    this.lander = lander;
    this.model = new Model();

    this.thrust = false;
    this.turnLeft = false;
    this.turnRight = false;

    if (genome === undefined) { this.model.randomize(); }
    else { this.model.putGenome(genome); }

    this.update = function(dt) {
        this.lander.thrust = this.thrust;
        if (this.turnLeft) {
            this.lander.turn(-90 * dt);
        } else if (this.turnRight) {
            this.lander.turn(-90 * dt);
        }
        this.lander.update(dt);
    };

    this.ai = function(canvas, target) {
        const y = this.model.forward(canvas.getBox(), this.lander.pos, this.lander.speed, this.lander.heading, target);
        const thrust = y[0] >= 0.5;
        const turnLeft = y[1];
        const turnRight = y[2];

        this.thrust = thrust;
        this.turnLeft = (turnLeft >= 0.5) && (turnLeft > turnRight);
        this.turnRight = (turnRight >= 0.5) && (turnRight > turnLeft);
    }
}


/*input = {
    pos.x, pos.y,
    speed.x, speed.y,
    heading.x, heading.y,
    target.x, target.y
}

output = {
    thrust,    [0..1) >= 0.5
    turnLeft,  [0..1) >= 0.5
    turnRight, [0..1) >= 0.5
}*/


function forwardLayer(X, W, B, func) {
    return W.dot(X).add(B).map(func);
}

function Model() {
    this.input  = new Matrix2d(8, 1);
    this.output = new Matrix2d(3, 1);

    this.W12 = new Matrix2d(5, 8);
    this.B1  = new Matrix2d(5, 1);

    this.W23 = new Matrix2d(3, 5);
    this.B2  = new Matrix2d(3, 1);

    this.randomize = function() {
        this.W12 = this.W12.map(() => 10*Math.random() - 5);
        this.W23 = this.W23.map(() => 10*Math.random() - 5);
        this.B1  = this.B1.map(() => 10*Math.random() - 5);
        this.B2  = this.B2.map(() => 10*Math.random() - 5);
    };

    this.getGenome = function() {
        return new Genome(this.W12, this.W23, this.B1, this.B2);
    }

    this.putGenome = function(genome) {
        this.W12 = genome.W12;
        this.W23 = genome.W23;
        this.B1  = genome.B1;
        this.B2  = genome.B2;
    }

    this.feedInput = function(box, pos, speed, heading, target) {
        this.input.put(0, 0, pos.x);
        this.input.put(1, 0, pos.y);
        this.input.put(2, 0, speed.x);
        this.input.put(3, 0, speed.y);

        const dir = direction(degToRad(heading))
        this.input.put(4, 0, dir.x);
        this.input.put(5, 0, dir.y);

        this.input.put(6, 0, target.pos.x);
        this.input.put(7, 0, target.pos.y);
    };

    this.forward = function(box, pos, speed, heading, target) {
        this.feedInput(box, pos, speed, heading, target);

        const X1 = forwardLayer(this.input, this.W12, this.B1, sigm);
        this.output = forwardLayer(X1, this.W23, this.B2, sigm);

        const thrust  = this.output.get(0, 0);
        const turnLeft  = this.output.get(1, 0);
        const turnRight = this.output.get(2, 0);

        return [thrust, turnLeft, turnRight];
    };
}

function randRange(a, b) {
    return Math.floor(a + (b - a)*Math.random());
}

function cross(A, B, count, prob) {
    if (A.n !== B.n || A.m !== B.m) { throw new Error('Wrong matrix cross'); }

    for (let k = 0; k < count; k++) {
        if (Math.random() >= prob) { continue; }
        const i = randRange(0, A.m);
        const j = randRange(0, B.n);
        A.swap(B, i, j);
    }
}

function mutate(M, count, prob) {
    if (Math.random() >= prob) { return; }

    for (let k = 0; k < count; k++) {
        const i = randRange(0, M.m);
        const j = randRange(0, M.n);
        M.put(i, j, 10*Math.random() - 5);
    }
}

function Genome(W12, W23, B1, B2) {
    this.W12 = W12.copy();
    this.W23 = W23.copy();
    this.B1  = B1.copy();
    this.B2  = B2.copy();

    this.cross = function(other, prob) {
        cross(this.W12, other.W12, 5, prob);
        cross(this.W23, other.W23, 4, prob);
        cross(this.B1, other.B1, 3, prob);
        cross(this.B2, other.B2, 2, prob);
    };

    this.mutate = function(count, prob) {
        mutate(this.W12, 3, prob);
        mutate(this.W23, 2, prob);
        mutate(this.B1, 1, prob);
        mutate(this.B2, 1, prob);
    };

    this.log = function() {
        console.log('W12');
        this.W12.log();
        console.log();

        console.log('W23');
        this.W23.log();
        console.log()

        console.log('B1');
        this.B1.log();
        console.log()

        console.log('B2');
        this.B2.log();
        console.log()
    };
}


function test() {
    let a = new Model();
    let b = new Model();

    a.randomize();
    b.randomize();

    let ag = a.getGenome();
    let bg = b.getGenome();

    ag.cross(bg, 0.2);
    let c = new Model();
    c.putGenome(ag);
    ag.log();
}
