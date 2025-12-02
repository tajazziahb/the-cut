function generatePersona() {
    const personas = ["struggling", "stable", "thriving"];
    return personas[Math.floor(Math.random() * personas.length)];
}

function generateProfile(persona) {
    if (persona === "struggling") {
        return {
            income: 1700 + Math.floor(Math.random() * 600),
            housing: 900 + Math.floor(Math.random() * 350),
            groceries: 200 + Math.floor(Math.random() * 150),
            lifestyle: 150 + Math.floor(Math.random() * 200),
            debt: 200 + Math.floor(Math.random() * 300),
            savings: 0 + Math.floor(Math.random() * 100)
        };
    }

    if (persona === "stable") {
        return {
            income: 3200 + Math.floor(Math.random() * 1200),
            housing: 1200 + Math.floor(Math.random() * 400),
            groceries: 300 + Math.floor(Math.random() * 200),
            lifestyle: 250 + Math.floor(Math.random() * 300),
            debt: 50 + Math.floor(Math.random() * 300),
            savings: 100 + Math.floor(Math.random() * 500)
        };
    }

    return {
        income: 6000 + Math.floor(Math.random() * 3000),
        housing: 1800 + Math.floor(Math.random() * 400),
        groceries: 400 + Math.floor(Math.random() * 200),
        lifestyle: 400 + Math.floor(Math.random() * 400),
        debt: 0 + Math.floor(Math.random() * 150),
        savings: 2000 + Math.floor(Math.random() * 4000)
    };
}

function determinePressure(profile) {
    const essentials = profile.housing + profile.groceries;

    if (profile.debt > essentials * 0.6) {
        return "Heavy debt load";
    }
    if (profile.lifestyle > profile.groceries * 2) {
        return "Lifestyle creep";
    }
    if (profile.housing > profile.income * 0.45) {
        return "Housing & bills";
    }
    return "Balanced but watch spending";
}

function messageFromScore(score) {
    if (score >= 80) {
        return "Your finances are aligned. Keep moving with intention.";
    }
    if (score >= 60) {
        return "You’re holding things together. A few small adjustments could open more breathing room.";
    }
    if (score >= 40) {
        return "Your energy is split. Essentials are pulling at you — this is a moment to stabilize.";
    }
    return "You’re under financial strain. Slow down, breathe, and take things one step at a time.";
}

function calculateScore(profile) {
    const essentials = profile.housing + profile.groceries;
    const essentialsPercent = Math.round((essentials / profile.income) * 100);

    const mainPressure = determinePressure(profile);
    const runwayDays = profile.savings > 0
        ? Math.round(profile.savings / (essentials / 30))
        : 0;

    let score =
        100 -
        essentialsPercent +
        (runwayDays > 45 ? 10 : 0) +
        (runwayDays > 90 ? 10 : 0) -
        (profile.debt > 400 ? 15 : 0) -
        (profile.debt > 700 ? 10 : 0);

    score = Math.max(1, Math.min(99, score));

    return {
        score,
        essentialsPercent,
        mainPressure,
        runwayDays,
        message: messageFromScore(score)
    };
}

module.exports = {
    generatePersona,
    generateProfile,
    calculateScore
};
