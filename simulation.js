function gameLoop(onDraw, onUpdate, onEnd, duration) {
    let oldTime = 0;

    window.requestAnimationFrame(function(startTime) {
        oldTime = startTime;
        beginTime = startTime;

        function frame(time) {
            const dt = (time - oldTime)/1000;
            oldTime = time;
            onUpdate(dt);
            onDraw();

            if ((time - startTime)/1000 >= duration) {
                onEnd();
            } else {
                window.requestAnimationFrame(frame);
            }
        };

        window.requestAnimationFrame(frame);
    });
}


function initPopulation(size, pos, speed, heading) {
    const population = [];

    for (let k = 0; k < size; k++) {
        population.push(new Agent(new Lander(pos, speed, heading)));
    }

    return population;
}

function resetPopulation(population, pos, speed, heading) {
    for (let k = 0; k < population.length; k++) {
        population[k].lander.pos = pos;
        population[k].lander.speed = speed;
        population[k].lander.heading = heading;
    }
}

function updatePopulation(population, canvas, target, dt) {
    for (let k = 0; k < population.length; k++) {
        population[k].ai(canvas, target);
        population[k].update(dt);
    }
}

function fitnessAgent(agent, target, startPos) {
    const targetDistance = population[k].lander.pos.sub(target.pos).length();
    const startDistance = population[k].lander.pos.sub(startPos).length();
    return 100 * (1.0 / (targetDistance + 0.01)) + (startDistance < 50 ? -100 : 100);
}

function fitnessPopulation(population, target, startPos) {
    for (let k = 0; k < population.length; k++) {
        population[k].fitness = agentFitness(population[k], target, startPos);
    }
}

function selectionPopulation(population, count) {
    const mostFit = [];

    for (let k = 0; k < count; k++) {
        mostFit.push(population[k]);
    }

    for (let k = 0; k < population.length; k++) {
        const parentA = mostFit[randRange(0, count)].model.getGenome();
        const parentB = mostFit[randRange(0, count)].model.getGenome();
        parentA.cross(parentB, 0.9);
        parentA.mutate(0.3);
        parentB.mutate(0.3);
        const choice = (Math.random() > 0.5) ? parentA : parentB;
        population[k].model.putGenome(choice);
    }
}

function drawPopulation(population, canvas) {
    for (let k = 0; k < population.length; k++) {
        canvas.draw(population[k].lander);
    }
}
