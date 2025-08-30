import {
    Header,
    sectiondata,
    Footer
} from "./profileComponents.js";
import { fetchdata } from "./authApi.js";

export async function HomePage() {
    const body = document.body;
    body.innerHTML = `<noscript>Please enable JavaScript</noscript>`;

    // Header
    const header = Header();
    body.appendChild(header);

    // Fetch Data
    const data = await fetchdata();

    if (!data) {
        console.error("Failed to fetch data");
        return;
    }

    const userData = data.data.user[0];
    const userLevel = data.data.levels.aggregate.max.amount;
    const totalXp = data.data.totalxpamount.aggregate.sum.amount;
    const xpData = data.data.xp;
    const skillData = data.data.skil;

    // User Info Section
    const section = sectiondata({
        user: userData,
        level: userLevel,
        xp: totalXp,
    });
    body.appendChild(section);

    // Statistics Section Container
    const statsContainer = document.createElement("div");
    statsContainer.id = "shart";
    body.appendChild(statsContainer);

    // For now, we'll add placeholders for the graphs
    // We'll implement the actual SVG graphs in the next step
    const graphPlaceholder1 = document.createElement("div");
    graphPlaceholder1.innerHTML = "<h3>XP Progress Graph (Coming Next)</h3>";
    graphPlaceholder1.style.padding = "2rem";
    graphPlaceholder1.style.textAlign = "center";
    graphPlaceholder1.style.backgroundColor = "var(--card-bg)";
    graphPlaceholder1.style.margin = "2rem";
    graphPlaceholder1.style.borderRadius = "var(--border-radius)";

    const graphPlaceholder2 = document.createElement("div");
    graphPlaceholder2.innerHTML = "<h3>Skills Radar Graph (Coming Next)</h3>";
    graphPlaceholder2.style.padding = "2rem";
    graphPlaceholder2.style.textAlign = "center";
    graphPlaceholder2.style.backgroundColor = "var(--card-bg)";
    graphPlaceholder2.style.margin = "2rem";
    graphPlaceholder2.style.borderRadius = "var(--border-radius)";

    statsContainer.append(graphPlaceholder1, graphPlaceholder2);

    // Footer
    const footer = Footer();
    body.appendChild(footer);
}