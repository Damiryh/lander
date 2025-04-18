const LANDER_SIZE = 15;
const LANDER_COLOR = 'blue';

const LANDER_MAX_ACC = 80;


function Lander(pos, speed, heading) {
    this.pos = pos;
    this.heading = heading;
    this.speed = speed;
    this.thrust = true;

    this.turn = function(angle) {
        this.heading += angle;
        while (this.heading >= 360) { this.heading -= 360; }
        while (this.heading < 0) { this.heading += 360; }
    };

    this.update = function(dt) {
        let acceleration = new Vec2d(0, 0);
        if (this.thrust) { acceleration = direction(degToRad(this.heading)).scale(LANDER_MAX_ACC); }
        this.speed = this.speed.add(acceleration.scale(dt));
        this.pos = this.pos.add(this.speed.scale(dt));
    };

    this.draw = function(canvas) {
         if (this.thrust) { // Engine flame
            canvas.arrow(
                this.pos.add(direction(degToRad(this.heading - 180)).scale(0.6*LANDER_SIZE)),
                0.7*LANDER_SIZE,
                this.heading - 180,
                'yellow'
            );
        }

        const pointer = canvas.arrow(this.pos, LANDER_SIZE, this.heading, LANDER_COLOR);
        canvas.circle(pointer, 2, 'white');
    };
}
