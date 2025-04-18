function Canvas(element) {
    const el = element;
    const ctx = el.getContext("2d");
    const width = el.getAttribute("width");
    const height = el.getAttribute("height");

    this.getBox = function() {
        return new Box(0, 0, width, height);
    };

    this.clear = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    };

    this.rect = function(pos, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(pos.x, pos.y, size.x, size.y, color);
    };

    this.line = function(a, b, color) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    this.circle = function(pos, radius, color) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.fill();
        ctx.stroke();
    };

    this.strokeCircle = function(pos, radius, color) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    this.triangle = function(a, b, c, color) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.fill();
        ctx.stroke();
    };

    this.arrow = function(pos, size, heading, color) {
        const a = pos.add(direction(degToRad(heading)).scale(size));
        const b = pos.add(direction(degToRad(heading + 120)).scale(size));
        const c = pos.add(direction(degToRad(heading - 120)).scale(size));
        this.triangle(a, b, c, color);
        return a;
    };

    this.draw = function(obj) {
        obj.draw(this);
    };
}
