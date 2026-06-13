let records = JSON.parse(localStorage.getItem("records")) || [];
let profile = JSON.parse(localStorage.getItem("profile")) || {};

function saveProfile() {
  profile = {
    name: document.getElementById("name").value,
    contact: document.getElementById("contact").value,
    education: document.getElementById("education").value,
    role: document.getElementById("role").value
  };

  localStorage.setItem("profile", JSON.stringify(profile));
  alert("Profile saved successfully!");
  displayRecords();
}

function loadProfile() {
  document.getElementById("name").value = profile.name || "";
  document.getElementById("contact").value = profile.contact || "";
  document.getElementById("education").value = profile.education || "";
  document.getElementById("role").value = profile.role || "";
}

function addTask() {
  const data = {
    date: document.getElementById("date").value,
    task: document.getElementById("task").value,
    project: document.getElementById("project").value,
    skills: document.getElementById("skills").value,
    tools: document.getElementById("tools").value,
    prompt: document.getElementById("prompt").value,
    website: document.getElementById("website").value,
    client: document.getElementById("client").value,
    achievement: document.getElementById("achievement").value
  };

  if (!data.date || !data.task || !data.project) {
    alert("Please enter Date, Task and Project Name.");
    return;
  }

  records.push(data);
  localStorage.setItem("records", JSON.stringify(records));

  document.querySelectorAll("section input").forEach(input => {
    if (!["name", "contact", "education", "role"].includes(input.id)) {
      input.value = "";
    }
  });

  displayRecords();
}

function displayRecords() {
  const recordsBox = document.getElementById("records");
  const portfolioBox = document.getElementById("portfolio");

  recordsBox.innerHTML = "";
  portfolioBox.innerHTML = "";

  let projects = new Set();
  let skills = new Set();
  let achievements = [];
  let websites = new Set();

  records.forEach((item, index) => {
    projects.add(item.project);

    if (item.website) websites.add(item.website);
    if (item.achievement) achievements.push(item.achievement);

    item.skills.split(",").forEach(skill => {
      if (skill.trim()) skills.add(skill.trim());
    });

    recordsBox.innerHTML += `
      <div class="record-card">
        <h3>${item.project}</h3>
        <p><b>Date:</b> ${item.date}</p>
        <p><b>Task:</b> ${item.task}</p>
        <p><b>Skills Used:</b> ${item.skills}</p>
        <p><b>Tools Used:</b> ${item.tools}</p>
        <p><b>AI Prompt Used:</b> ${item.prompt}</p>
        <p><b>Website/Product:</b> ${item.website}</p>
        <p><b>Client/Project Experience:</b> ${item.client}</p>
        <p><b>Achievement:</b> ${item.achievement}</p>
        <button onclick="deleteRecord(${index})">Delete</button>
      </div>
    `;
  });

  projects.forEach(project => {
    portfolioBox.innerHTML += `
      <div class="record-card">
        <h3>${project}</h3>
        <p>Project added to portfolio successfully.</p>
      </div>
    `;
  });

  document.getElementById("taskCount").innerText = records.length;
  document.getElementById("projectCount").innerText = projects.size;
  document.getElementById("skillCount").innerText = skills.size;
  document.getElementById("achievementCount").innerText = achievements.length;

  updateResume(projects, skills, achievements, websites);
}

function updateResume(projects, skills, achievements, websites) {
  document.getElementById("resumePreview").innerHTML = `
    <div class="resume-box" id="resumeContent">
      <h1>${profile.name || "Your Name"}</h1>
      <p><b>Contact:</b> ${profile.contact || "Not added"}</p>
      <p><b>Education:</b> ${profile.education || "Not added"}</p>
      <p><b>Leadership Role:</b> ${profile.role || "Not added"}</p>

      <h2>Skills</h2>
      <p>${Array.from(skills).join(", ") || "Not added yet"}</p>

      <h2>Tools Used</h2>
      <p>${getAllTools()}</p>

      <h2>Projects Completed</h2>
      <ul>${Array.from(projects).map(p => `<li>${p}</li>`).join("")}</ul>

      <h2>Websites / Products Created</h2>
      <ul>${Array.from(websites).map(w => `<li>${w}</li>`).join("")}</ul>

      <h2>Achievements</h2>
      <ul>${achievements.map(a => `<li>${a}</li>`).join("")}</ul>

      <h2>AI Prompts Used</h2>
      <ul>${records.map(r => r.prompt ? `<li>${r.prompt}</li>` : "").join("")}</ul>

      <h2>Daily Work Records</h2>
      <ul>${records.map(r => `<li>${r.date} - ${r.task} (${r.project})</li>`).join("")}</ul>

      <h2>Client / Project Experience</h2>
      <ul>${records.map(r => r.client ? `<li>${r.client}</li>` : "").join("")}</ul>
    </div>
  `;
}

function getAllTools() {
  let tools = new Set();

  records.forEach(record => {
    record.tools.split(",").forEach(tool => {
      if (tool.trim()) tools.add(tool.trim());
    });
  });

  return Array.from(tools).join(", ") || "Not added yet";
}

function deleteRecord(index) {
  records.splice(index, 1);
  localStorage.setItem("records", JSON.stringify(records));
  displayRecords();
}

function generatePDF() {
  const resume = document.getElementById("resumeContent");

  if (!resume) {
    alert("Please add some work records first.");
    return;
  }

  const printWindow = window.open("", "", "width=900,height=700");

  printWindow.document.write(`
    <html>
    <head>
      <title>Resume PDF</title>
      <style>
        body {
          font-family: Arial;
          padding: 35px;
          line-height: 1.7;
        }
        h1 {
          color: #d35400;
          border-bottom: 2px solid #d35400;
          padding-bottom: 10px;
        }
        h2 {
          color: #d35400;
          margin-top: 25px;
        }
        li {
          margin-bottom: 6px;
        }
      </style>
    </head>
    <body>
      ${resume.innerHTML}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
}

function clearAll() {
  if (confirm("Are you sure you want to delete all data?")) {
    localStorage.clear();
    records = [];
    profile = {};
    loadProfile();
    displayRecords();
  }
}

loadProfile();
displayRecords();
