import { queryProfileData } from "./authApi.js";


export function extraInfoCard(data) {
  const card = document.createElement("div");
  card.classList.add("stat-box");
  const last = data?.lastResult?.[0];
  const obj = data?.firstExercise?.[0];

  card.innerHTML = `
    <h3>Latest Result</h3>
    <p>${last ? `${last.object.name}: ${last.grade}m` : "—"}</p>
  `;
  return card;
}

export function topBar() {
  const header = document.createElement('header');
  header.className = 'top-bar';

  const brand = document.createElement('div');
  brand.className = 'brand';
  brand.innerHTML = '<i class="fas fa-user-circle"></i> <span>Z01 Dashboard</span>';

  const nav = document.createElement('nav');
  const list = document.createElement('ul');
  list.className = 'nav-list';

  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.style.cssText =
    'background:none;border:none;color:var(--text-color);cursor:pointer;font-size:1.2rem;';
  themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  themeBtn.title = 'Toggle dark / light';

  const logoutLi = document.createElement('li');
  logoutLi.innerHTML =
    '<a href="#" id="signout-link"><i class="fas fa-sign-out-alt"></i> Sign Out</a>';

  list.appendChild(themeBtn);
  list.appendChild(logoutLi);
  nav.appendChild(list);

  header.appendChild(brand);
  header.appendChild(nav);

  // theme toggle logic
  themeBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const icon = themeBtn.querySelector('i');
    if (html.hasAttribute('data-theme')) {
      html.removeAttribute('data-theme');
      icon.className = 'fas fa-moon';
    } else {
      html.setAttribute('data-theme', 'light');
      icon.className = 'fas fa-sun';
    }
  });

  return header;
}

export function bottomBar() {
  const footerElem = document.createElement("footer");
  footerElem.classList.add("bottom-bar");
  footerElem.innerHTML = `<p>&copy; ${new Date().getFullYear()} Z01 Dashboard. All rights reserved.</p>`;
  return footerElem;
}

export function authForm() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("auth-wrapper");

  const headerTitle = document.createElement("h1");
  headerTitle.classList.add("auth-header");
  headerTitle.innerHTML = "Sign In";

  const formElem = document.createElement("form");
  formElem.id = "auth-form";
  formElem.classList.add("auth-form");

  const userGroup = document.createElement("div");
  userGroup.classList.add("input-group");
  userGroup.innerHTML = `
    <i class="fas fa-user icon"></i>
    <input type="text" id="username-input" class="input-field" placeholder="Username or Email">
  `; // Added icon

  const passGroup = document.createElement("div");
  passGroup.classList.add("input-group");
  passGroup.innerHTML = `
    <i class="fas fa-lock icon"></i>
    <input type="password" id="pass-input" class="input-field" placeholder="Password">
  `; // Added icon

  const rememberGroup = document.createElement("div");
  rememberGroup.innerHTML = `
    <input type="checkbox" id="remember-check">
    <label for="remember-check">Remember Me</label>
  `;

  const submitBtn = document.createElement('button');
  submitBtn.type = "submit";
  submitBtn.classList.add("submit-button");
  submitBtn.textContent = 'Sign In';

  formElem.append(headerTitle, userGroup, passGroup, rememberGroup, submitBtn);
  wrapper.appendChild(formElem);
  return wrapper;
}

export function userStatsPanel(profileData = {}) {
  const grid = document.createElement("section");
  grid.classList.add("profile-stats-grid");

  const profileBox = document.createElement("div");
  profileBox.classList.add("user-profile");

  const greeting = document.createElement("h2");
  greeting.textContent = `Hello, ${profileData.user.firstName} ${profileData.user.lastName}!`;
  profileBox.appendChild(greeting);

  const details = [
    { label: "Phone", value: profileData.user.attrs.tel },
    { label: "Location", value: profileData.user.attrs.city },
    { label: "Email", value: profileData.user.attrs.email },
    { label: "Campus", value: profileData.user.campus }
  ];

  details.forEach(({ label, value }) => {
    const para = document.createElement("p");
    para.innerHTML = `<strong>${label}:</strong> ${value}`;
    profileBox.appendChild(para);
  });

  const auditBox = document.createElement("div");
  auditBox.classList.add("stat-box");
  auditBox.innerHTML = `<h3>Audit Ratio</h3><p>${Math.round(profileData.user.auditRatio * 10) / 10}</p>`;

  const levelBox = document.createElement("div");
  levelBox.classList.add("stat-box");
  levelBox.innerHTML = `<h3>Current Level</h3><p>${profileData.level}</p>`;

  const xpBox = document.createElement("div");
  xpBox.classList.add("stat-box");
  xpBox.innerHTML = `<h3>Total XP</h3><p>${Math.round(profileData.xp / 1000)} KB</p>`;

  // Added third stat for originality
  const auditsCountBox = document.createElement("div");
  auditsCountBox.classList.add("stat-box");
  auditsCountBox.innerHTML = `<h3>Audits Performed</h3><p>${profileData.auditsCount}</p>`;

  grid.append(profileBox, auditBox, levelBox, xpBox, auditsCountBox);
  return grid;
}

export function displayAlert(msg) {
  const alertElem = document.createElement("div");
  alertElem.id = "alert-message";
  alertElem.innerHTML = `<h2>${msg}</h2>`;
  document.body.appendChild(alertElem);

  setTimeout(() => alertElem.remove(), 3000);
}

export function xpProgressChart(dataPoints) {
  const box = document.createElement("div");
  box.classList.add("xp-chart-box");

  const titleElem = document.createElement("h3");
  titleElem.textContent = "XP Growth";
  box.appendChild(titleElem);

  const svgNamespace = "http://www.w3.org/2000/svg";
  const chartWidth = 850;
  const chartHeight = 300;
  const margins = { top: 20, right: 20, bottom: 40, left: 50 };

  const chartSvg = document.createElementNS(svgNamespace, "svg");
  chartSvg.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
  box.appendChild(chartSvg);

  const tooltipElem = document.createElement("div");
  tooltipElem.className = "tooltip-popup";
  document.body.appendChild(tooltipElem);

  // Process data
  const sortedData = dataPoints
    .map(d => ({
      date: new Date(d.createdAt),
      xp: d.amount || 0,
      path: (d.progress && d.progress.path) || "",
      original: d,
    }))
    .sort((a, b) => a.date - b.date);

  let cumulativeXp = 0;
  const chartData = sortedData.map(d => {
    cumulativeXp += d.xp;
    return { x: d.date, y: cumulativeXp, path: d.path, xpStep: d.xp };
  });

  if (!chartData.length) {
    box.appendChild(document.createTextNode("No XP data"));
    return box;
  }

  const xMinMax = [chartData[0].x, chartData.at(-1).x];
  const yMaxVal = chartData.at(-1).y;

  const xScale = date => margins.left + ((date - xMinMax[0]) / (xMinMax[1] - xMinMax[0])) * (chartWidth - margins.left - margins.right);
  const yScale = y => chartHeight - margins.bottom - (y / yMaxVal) * (chartHeight - margins.top - margins.bottom);

  // Axes
  const addLine = (xStart, yStart, xEnd, yEnd, color = "#bbb") => {
    const lineElem = document.createElementNS(svgNamespace, "line");
    lineElem.setAttribute("x1", xStart);
    lineElem.setAttribute("y1", yStart);
    lineElem.setAttribute("x2", xEnd);
    lineElem.setAttribute("y2", yEnd);
    lineElem.setAttribute("stroke", color);
    chartSvg.appendChild(lineElem);
  };

  addLine(margins.left, margins.top, margins.left, chartHeight - margins.bottom); // Y axis
  addLine(margins.left, chartHeight - margins.bottom, chartWidth - margins.right, chartHeight - margins.bottom); // X axis

  // Y ticks (fixed loop)
  for (let tick = 0; tick <= 5; tick++) {
    const yVal = (yMaxVal / 5) * tick;
    const yPos = yScale(yVal);
    addLine(margins.left, yPos, chartWidth - margins.right, yPos, "#eee");

    const tickLabel = document.createElementNS(svgNamespace, "text");
    tickLabel.setAttribute("x", margins.left - 8);
    tickLabel.setAttribute("y", yPos + 4);
    tickLabel.setAttribute("text-anchor", "end");
    tickLabel.setAttribute("font-size", "11");
    tickLabel.setAttribute("fill", "#555");
    tickLabel.textContent = Math.round(yVal);
    chartSvg.appendChild(tickLabel);
  }

  // X labels (fixed interval)
  // --- nicer horizontal labels ---
  const maxLabels = 4;
  const step = Math.max(1, Math.ceil(chartData.length / maxLabels));
  chartData.forEach((pt, idx) => {
    if (idx % step !== 0 && idx !== chartData.length - 1) return; // last one always shown

    const xPos = xScale(pt.x);
    const label = document.createElementNS(svgNamespace, "text");
    label.setAttribute("x", xPos);
    label.setAttribute("y", chartHeight - margins.bottom + 15);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "10");
    label.setAttribute("fill", "#555");
    label.setAttribute("transform", `rotate(-40 ${xPos} ${chartHeight - margins.bottom + 15})`);
    label.textContent = pt.x.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    chartSvg.appendChild(label);
  });
  // Chart path
  const pathString = chartData
    .map((pt, idx, arr) => {
      const xCoord = xScale(pt.x);
      const yCoord = yScale(pt.y);
      if (idx === 0) return `M ${xCoord} ${yCoord}`;
      const prevPt = arr[idx - 1];
      const prevX = xScale(prevPt.x);
      const prevY = yScale(prevPt.y);
      const ctrlX = (prevX + xCoord) / 2;
      return `C ${ctrlX} ${prevY}, ${ctrlX} ${yCoord}, ${xCoord} ${yCoord}`;
    })
    .join(" ");

  const pathElem = document.createElementNS(svgNamespace, "path");
  pathElem.setAttribute("d", pathString);
  pathElem.setAttribute("fill", "none");
  pathElem.setAttribute("stroke", "var(--accent-color)"); // Fixed quotes
  pathElem.setAttribute("stroke-width", "2");
  chartSvg.appendChild(pathElem);

  // Points with tooltips
  chartData.forEach(pt => {
    const cxVal = xScale(pt.x);
    const cyVal = yScale(pt.y);

    const point = document.createElementNS(svgNamespace, "circle");
    point.setAttribute("cx", cxVal);
    point.setAttribute("cy", cyVal);
    point.setAttribute("r", 4);
    point.setAttribute("fill", "var(--accent-color)"); // Fixed quotes
    point.style.cursor = "pointer";

    point.addEventListener("mouseenter", () => {
      tooltipElem.innerHTML = `
        <strong>Date:</strong> ${pt.x.toLocaleDateString()}<br>
        <strong>XP Added:</strong> ${pt.xpStep} B<br>
        <strong>Cumulative XP:</strong> ${pt.y} B<br>
        <strong>Path:</strong> <pre>${pt.path}</pre>
      `;
      tooltipElem.style.display = "block";
    });

    point.addEventListener("mousemove", e => {
      tooltipElem.style.left = `${e.clientX + 10}px`;
      tooltipElem.style.top = `${e.clientY + 10}px`;
    });

    point.addEventListener("mouseleave", () => {
      tooltipElem.style.display = "none";
    });

    chartSvg.appendChild(point);
  });

  box.cleanup = () => tooltipElem.remove();
  return box;
}

export function skillsRadarDiagram(skillsInput) {
  const box = document.createElement('div');
  box.classList.add('skills-diagram-box');

  const titleElem = document.createElement("h3");
  titleElem.textContent = 'Skills Overview';
  box.appendChild(titleElem);

  const svgNamespace = "http://www.w3.org/2000/svg";
  const viewSize = 500;
  const midPoint = viewSize / 2;
  const maxRad = 120;

  const diagramSvg = document.createElementNS(svgNamespace, "svg");
  diagramSvg.setAttribute("viewBox", `0 0 ${viewSize} ${viewSize}`);
  diagramSvg.style.overflow = "visible";
  box.appendChild(diagramSvg);

  // Aggregate skills (max per type)
  const skillAggregates = skillsInput.reduce((acc, sk) => {
    const typeClean = sk.type.replace('kill_', '');
    acc[typeClean] = Math.max(acc[typeClean] || 0, sk.amount);
    return acc;
  }, {});

  const skillKeys = Object.keys(skillAggregates);
  const maxSkillVal = 100;
  const angleIncrement = (2 * Math.PI) / skillKeys.length;

  // Grid circles (fixed loop)
  const levels = 8;
  for (let lv = 1; lv <= levels; lv++) {
    const circ = document.createElementNS(svgNamespace, "circle");
    circ.setAttribute("cx", midPoint);
    circ.setAttribute("cy", midPoint);
    circ.setAttribute("r", (maxRad * lv) / levels);
    circ.setAttribute("stroke", "#ddd");
    circ.setAttribute("fill", "none");
    diagramSvg.appendChild(circ);
  }

  // Radials
  skillKeys.forEach((_, idx) => {
    const ang = idx * angleIncrement;
    const endXCoord = midPoint + maxRad * Math.cos(ang);
    const endYCoord = midPoint + maxRad * Math.sin(ang);

    const radialLine = document.createElementNS(svgNamespace, "line");
    radialLine.setAttribute("x1", midPoint);
    radialLine.setAttribute("y1", midPoint);
    radialLine.setAttribute("x2", endXCoord);
    radialLine.setAttribute("y2", endYCoord);
    radialLine.setAttribute("stroke", "#bbb");
    diagramSvg.appendChild(radialLine);
  });

  // Data points
  const pointsData = skillKeys.map((sk, idx) => {
    const val = skillAggregates[sk];
    const scaledRad = (val / maxSkillVal) * maxRad;
    const ang = idx * angleIncrement;
    return {
      x: midPoint + scaledRad * Math.cos(ang),
      y: midPoint + scaledRad * Math.sin(ang),
      skill: sk
    };
  });

  // Polygon
  const poly = document.createElementNS(svgNamespace, "polygon");
  poly.setAttribute("points", pointsData.map(p => `${p.x},${p.y}`).join(' '));
  poly.setAttribute("fill", "var(--accent-color)"); // Fixed quotes
  poly.setAttribute("opacity", "0.4");
  diagramSvg.appendChild(poly);

  // Labels
  pointsData.forEach((pt, idx) => {
    const ang = idx * angleIncrement;
    const labelRad = maxRad + 25;
    const labelElem = document.createElementNS(svgNamespace, "text");
    labelElem.setAttribute("x", midPoint + labelRad * Math.cos(ang));
    labelElem.setAttribute("y", midPoint + labelRad * Math.sin(ang));
    labelElem.textContent = pt.skill;
    labelElem.setAttribute("font-size", "0.75rem");
    labelElem.setAttribute("fill", "var(--text-color)"); // Fixed quotes

    const anchor = ang <= Math.PI / 2 || ang > 3 * Math.PI / 2 ? "start" : "end"; // Fixed comparison
    labelElem.setAttribute("text-anchor", anchor);
    diagramSvg.appendChild(labelElem);
  });

  return box;
}

export function passFailDonut(results = []) {
  const box = document.createElement("div");
  box.classList.add("xp-chart-box");

  // ensure we always have an array
  const safeResults = Array.isArray(results) ? results : [];
  const pass = safeResults.filter(r => r.grade >= 1).length;
  const fail = safeResults.filter(r => r.grade < 1).length;
  const total = pass + fail;

  if (!total) {
    box.innerHTML = '<h3>Pass/Fail Ratio</h3><p>No finished projects yet</p>';
    return box;
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const size = 200;
  const radius = Math.min(size, size) / 2 - 10;
  const center = size / 2;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.style.width = "200px";
  svg.style.height = "200px";

  const arc = (startAngle, endAngle, color) => {
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const passAngle = (pass / total) * 2 * Math.PI;
  const passPath = document.createElementNS(svgNS, "path");
  passPath.setAttribute("d", arc(0, passAngle));
  passPath.setAttribute("fill", "#4ade80");
  svg.appendChild(passPath);

  const failPath = document.createElementNS(svgNS, "path");
  failPath.setAttribute("d", arc(passAngle, 2 * Math.PI));
  failPath.setAttribute("fill", "#f87171");
  svg.appendChild(failPath);

  const label = document.createElement("div");
  label.innerHTML = `<h3>Pass/Fail Ratio</h3><p>${pass} pass / ${fail} fail</p>`;

  box.append(label, svg);
  return box;
}
export async function renderUserProfile() {
  const bodyElem = document.body;
  bodyElem.innerHTML = `<noscript>Please enable JavaScript</noscript>`;

  const header = topBar();
  bodyElem.appendChild(header);

  const profileResult = await queryProfileData();
  const userInfo = profileResult.data.user[0];
  const currentLevel = profileResult.data.maxLevels.aggregate.max.amount;
  const totalXpVal = profileResult.data.totalXpSum.aggregate.sum.amount;
  const xpPoints = profileResult.data.xpTransactions;
  const skillsInput = profileResult.data.skillsData;
  const auditsTotal = profileResult.data.auditsCount.aggregate.count; // New stat

  const statsGrid = userStatsPanel({
    user: userInfo,
    level: currentLevel,
    xp: totalXpVal,
    auditsCount: auditsTotal
  });
  bodyElem.appendChild(statsGrid);
  const extraCard = extraInfoCard(profileResult.data);
  statsGrid.appendChild(extraCard);

  const chartsContainer = document.createElement("div");
  chartsContainer.classList.add("stats-container");

  const xpChart = await xpProgressChart(xpPoints);
  const skillsDiagram = await skillsRadarDiagram(skillsInput);

  chartsContainer.append(xpChart, skillsDiagram);
  bodyElem.append(chartsContainer);

  const passFailData = profileResult.data.passFail;
  const donut = passFailDonut(passFailData);
  chartsContainer.append(donut);

  const footer = bottomBar();
  bodyElem.append(footer);
}


