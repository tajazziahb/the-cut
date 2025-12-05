document.addEventListener("DOMContentLoaded", () => {
    const brPercentEl = document.querySelector("#br-percent");
    const brLabelEl = document.querySelector("#br-label");
    const brMessageEl = document.querySelector("#br-message");
    const orb = document.querySelector("#br-orb");
    const orbWrap = document.querySelector("#orbWrap");
    const spendingCanvas = document.querySelector("#spendingChart");

    let breathingRoom = Number(window.initialBR || 0);

    const states = [
        {
            max: 35,
            label: "Tight orbit",
            message: "Essentials are pulling most of the weight. Slow down and stabilize.",
            className: "state-critical"
        },
        {
            max: 65,
            label: "Balancing",
            message: "You have some breathing room, but the orbit still needs attention.",
            className: "state-balancing"
        },
        {
            max: 85,
            label: "Expanding",
            message: "Your dollars have room to move. Keep directing them with intention.",
            className: "state-expanding"
        },
        {
            max: 101,
            label: "Abundant",
            message: "There’s healthy cushion here. This is what freedom feels like.",
            className: "state-abundant"
        }
    ];

    const stateClasses = states.map(state => state.className);

    const clamp = value => Math.max(0, Math.min(100, value));

    function applyStatus(value, overrideLabel) {
        const current = states.find(state => value < state.max) || states[0];
        brPercentEl.textContent = `${Math.round(value)}%`;
        brLabelEl.textContent = overrideLabel || current.label;
        brMessageEl.textContent = current.message;

        if (orbWrap) {
            orbWrap.classList.remove(...stateClasses);
            orbWrap.classList.add(current.className);
        }
    }

    applyStatus(clamp(breathingRoom)); 

    document.querySelectorAll(".life-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const shift = Number(btn.dataset.shift || 0);
            breathingRoom = clamp(breathingRoom + shift);
            applyStatus(breathingRoom, btn.dataset.label);
        });
    });

    if (spendingCanvas) {
        const chartData = window.ringData || { labels: [], values: [] };
        const labels = chartData.labels && chartData.labels.length ? chartData.labels : ["No data yet"];
        const values = chartData.values && chartData.values.length ? chartData.values : [1];

        const palette = ["#ffb38a", "#ff83a8", "#c084f5", "#8ec5ff", "#9ef7c3", "#ffd34f"];

        // Chart.js doughnut configuration modeled after official docs: https://www.chartjs.org/docs/latest/charts/doughnut.html
        new Chart(spendingCanvas, {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: values.map((_, idx) => palette[idx % palette.length]),
                    borderWidth: 0
                }]
            },
            options: {
                cutout: "62%",
                plugins: {
                    legend: {
                        labels: {
                            color: "#fff",
                            boxWidth: 12
                        },
                        position: "bottom"
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const total = context.dataset.data.reduce((sum, v) => sum + Number(v), 0);
                                const val = Number(context.parsed);
                                const pct = total ? Math.round((val / total) * 100) : 0;
                                return `${context.label}: $${val.toFixed(2)} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    document.querySelectorAll('form[action*="/delete"]').forEach(form => {
        form.addEventListener("submit", evt => {
            if (!confirm("Delete this manual transaction?")) {
                evt.preventDefault();
            }
        });
    });

    document.querySelectorAll(".edit-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            if (!targetId) return;
            const row = document.getElementById(targetId);
            if (!row) return;
            row.classList.toggle("open");
        });
    });

    const plaidBtn = document.querySelector("#connectPlaidBtn");
    if (plaidBtn) {
        plaidBtn.addEventListener("click", async () => {
            plaidBtn.disabled = true;
            plaidBtn.textContent = "Connecting...";
            try {
                if (!window.Plaid) throw new Error("Plaid SDK missing");
                // Rely on Fetch API promise flow to call our server endpoints (MDN Fetch guide: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
                const tokenRes = await fetch("/create_link_token");
                if (!tokenRes.ok) throw new Error("Token error");
                const { link_token } = await tokenRes.json();

                const handler = window.Plaid.create({
                    token: link_token,
                    onSuccess: async publicToken => {
                        await fetch("/exchange_public_token", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ public_token: publicToken })
                        });
                        window.location.reload();
                    },
                    onExit: () => {
                        plaidBtn.disabled = false;
                        plaidBtn.textContent = plaidBtn.dataset.hasPlaid === "true"
                            ? "Refresh Plaid"
                            : "Connect Bank";
                    }
                });

                handler.open();
            } catch (err) {
                console.error(err);
                alert("Unable to connect to Plaid right now.");
                plaidBtn.disabled = false;
                plaidBtn.textContent = plaidBtn.dataset.hasPlaid === "true"
                    ? "Refresh Plaid"
                    : "Connect Bank";
            }
        });
    }

    const plaidMoreBtn = document.querySelector("#plaidMoreBtn");
    if (plaidMoreBtn) {
        plaidMoreBtn.addEventListener("click", () => {
            const expanded = plaidMoreBtn.getAttribute("data-expanded") === "true";
            document.querySelectorAll(".plaid-extra").forEach(row => {
                row.style.display = expanded ? "none" : "table-row";
            });
            plaidMoreBtn.setAttribute("data-expanded", (!expanded).toString());
            plaidMoreBtn.textContent = expanded ? "View more activity" : "Show fewer";
        });
    }
});
