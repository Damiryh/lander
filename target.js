function Target(pos, radius, score) {
    this.pos = pos;
    this.radius = radius;
    this.score = score;


    this.draw = function(canvas) {
        canvas.strokeCircle(this.pos, this.radius, 'red');
    };

    this.isIntersects = function(pos) {
        const distance = this.pos.sub(pos).length();
        return distance <= this.radius;
    };
}

function spawnTarget(box, radius, score) {
    const pos = box.getRandomPoint();
    return new Target(pos, radius, score);
}
