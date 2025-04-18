const canvas = new Canvas(document.getElementById("canvas"));
canvas.clear('black');


let targetPos = canvas.getBox().getRandomPoint();
let startPos = canvas.getBox().getRandomPoint();

const target = new Target(targetPos, 70, 10);
const population = initPopulation(200, startPos, new Vec2d(0, 0), 0);

function draw() {
    canvas.clear('black');
    canvas.draw(target);
    drawPopulation(population, canvas);
}

function update(dt) {
    updatePopulation(population, canvas, target, dt);
}

function end() {
    fitnessPopulation(population, target, startPos);
    population.sort((a, b) => {
        if (a.fitness > b.fitness) { return -1; }
        if (a.fitness < b.fitness) { return 1; }
        return 0;
    });

    selectionPopulation(population, 40);
    //startPos = canvas.getBox().getRandomPoint()
    resetPopulation(population, startPos, new Vec2d(0, 0), 0);
    //target.pos = canvas.getBox().getRandomPoint();

    gameLoop(draw, update, end, 20);
}

gameLoop(draw, update, end, 20);

