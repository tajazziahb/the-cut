function simulate(breathingScore, impact) {
    let newScore = breathingScore + impact;

    if (newScore > 100) newScore = 100;
    if (newScore < 0) newScore = 0;

    return newScore;
}

module.exports = simulate;
