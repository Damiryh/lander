function degToRad(degrees) {
    return (degrees * Math.PI) / 180.0;
}

function radToDeg(radians) {
    return (radians * 180) / Math.PI;
}

function sigm(x) {
    return 1.0/(1.0 + Math.exp(-x));
}
