import { authForm, displayAlert, renderUserProfile } from "./profileComponents.js"; // Import shared components

export async function handleAuthentication() {
    document.body.innerHTML = `<noscript>Please enable JavaScript</noscript>`;
    const authContainer = authForm();
    document.body.append(authContainer);

    const form = document.getElementById("auth-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usernameOrEmail = document.getElementById("username-input").value;
        const pass = document.getElementById("pass-input").value;
        const remember = document.getElementById("remember-check").checked; // Dummy for now

        const creds = btoa(`${usernameOrEmail}:${pass}`);

        try {
            const response = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
                method: "POST",
                mode: "cors", // Explicit for cross-origin
                headers: {
                    "Content-Type": "application/json", // Keep, but no body
                    "Authorization": `Basic ${creds}`
                }
                // Removed body: JSON.stringify({ email: usernameOrEmail, password: pass })
            });

            if (!response.ok) {
                displayAlert("Invalid login details");
                console.error("Auth failed with status:", response.status); // Debug
                return;
            }

            // Use text() to handle plain JWT or JSON safely
            const jwtText = await response.text();
            let jwt;
            try {
                jwt = JSON.parse(jwtText); // If JSON, parse it
                jwt = jwt.jwt || jwt.token || jwt; // Extract token if object
            } catch {
                jwt = jwtText; // Plain text token
            }

            sessionStorage.setItem("jwtToken", jwt);
            await renderUserProfile();
            handleLogout();
            console.error("login successful:", jwt); // Debug: Check console for details (e.g., CORS)

        } catch (err) {
            displayAlert("Authentication failed. Try again.");
            console.error("Network/Auth error:", err.message); // Debug: Check console for details (e.g., CORS)
        }
    });
}
export function handleLogout() {
    const logoutLink = document.getElementById('signout-link');
    if (logoutLink) {
        logoutLink.addEventListener("click", () => {
            sessionStorage.clear();
            location.reload();
        });
    }
}

export async function queryProfileData() {
    const userDetailsQuery = `
    user {
      firstName
      lastName
      auditRatio
      campus
      attrs
    }
  `;

    const xpDetailsQuery = `
    xpTransactions: transaction(where: {
      type: { _eq: "xp" },
      eventId: { _eq: 41 }
    }) {
      amount
      type
      createdAt
      progress {
        path
      }
    }
  `;

    const totalXpSumQuery = `
    totalXpSum: transaction_aggregate(where: {
      type: { _eq: "xp" },
      eventId: { _eq: 41 }
    }) {
      aggregate {
        sum {
          amount
        }
      }
    }
  `;

    const maxLevelQuery = `
    maxLevels: transaction_aggregate(where: {
      type: { _eq: "level" },
      eventId: { _eq: 41 }
    }) {
      aggregate {
        max {
          amount
        }
      }
    }
  `;

    const skillsQuery = `
    skillsData: transaction(where: { type: { _regex: "skill" } }) {
      amount
      type
    }
  `;

    // Added for originality: Query audit count as third stat
    const auditsQuery = `
    auditsCount: audit_aggregate {
      aggregate {
        count
      }
    }
  `;
    const nestedQuery = `
    lastResult: result(limit: 1, order_by: { createdAt: desc }) {
      grade
      object { name }
      user { login }
    }
  `;

    const argumentQuery = `
    firstExercise: object(where: { id: { _eq: 1 } }) {
      name
      type
    }
  `;

    const passFailQuery = `
  passFail: result(
    where: { 
      isLast: { _eq: true },
      object: { type: { _eq: "project" } }
    }
  ) {
    grade
    object { name }
  }
`;


const fullQuery = `
  {
    ${userDetailsQuery}
    ${xpDetailsQuery}
    ${totalXpSumQuery}
    ${maxLevelQuery}
    ${skillsQuery}
    ${auditsQuery}
    ${nestedQuery}
    ${argumentQuery}
    ${passFailQuery}
  }
  `;

    try {
        const res = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwtToken")}`
            },
            body: JSON.stringify({ query: fullQuery })
        });

        const result = await res.json();
        if (result.errors) {
            document.body.innerHTML = "";
            await handleAuthentication();
            return;
        }
        return result;
    } catch (err) {
        return;
    }
}