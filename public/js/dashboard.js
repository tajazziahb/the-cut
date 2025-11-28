console.log("dashboard.js loaded");

fetch("/plaid/create-link-token")
    .then(res => res.json())
    .then(data => {
        if (!data.link_token) {
            console.error("No link token returned:", data);
            return;
        }

        console.log("Link token:", data.link_token);

        const handler = Plaid.create({
            token: data.link_token,

            onSuccess: (public_token) => {
                console.log("Public token:", public_token);

                fetch("/plaid/exchange-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ public_token })
                })
                    .then(() => {
                        console.log("Exchanged — reloading");
                        window.location.reload();
                    });
            }
        });

        const btn = document.querySelector("#connectBtn");

        if (!btn) {
            console.error("Could not find #connectBtn");
        } else {
            btn.addEventListener("click", () => {
                console.log("Opening Plaid Link...");
                handler.open();
            });
        }
    })
    .catch(err => console.error("Plaid init error:", err));
