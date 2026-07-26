document.addEventListener("DOMContentLoaded", async () => {
  const template = document.getElementById("project-card-template");
  const grid = document.getElementById("projects-grid");

  if (!template || !grid) return;

  let projectEntries = [];

  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error(`Hiba: ${response.status}`);

    projectEntries = await response.json();
  } catch (error) {
    console.warn("Nem sikerült a projektek listáját betölteni:", error);

    projectEntries = [
      {
        folder: "Daniai_Kisokos",
        file: "Daniai_kisokos_index.html",
        path: "/Portfolio_projects/Daniai_Kisokos/Daniai_kisokos_index.html"
      }
    ];
  }

  const projects = await Promise.all(
    projectEntries.map(async (entry) => {
      const projectFilePath = entry.path || `/Portfolio_projects/${entry.folder}/${entry.file}`;

      try {
        const response = await fetch(projectFilePath);
        if (!response.ok) throw new Error(`Nem található: ${projectFilePath}`);

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const titleEl = doc.getElementById("project_title");
        const imageEl = doc.getElementById("project_image");
        const statusEl = doc.getElementById("project_status");
        const techEl = doc.getElementById("project_tech");

        const title = titleEl?.textContent?.trim() || entry.folder.replace(/_/g, " ");
        const imageSrc = imageEl?.getAttribute("src") || "";
        const status = statusEl?.textContent?.trim() || "Planned";

        const tech = techEl
          ? Array.from(techEl.children)
              .map(node => node.textContent.trim())
              .filter(Boolean)
          : [];

        return {
          title,
          image: resolveUrl(imageSrc, projectFilePath),
          status,
          tech,
          link: projectFilePath
        };
      } catch (error) {
        console.warn(error);

        return {
          title: entry.folder.replace(/_/g, " "),
          image: "https://placehold.co/600x600/ee6352/ffffff?text=Project",
          status: "Planned",
          tech: [],
          link: projectFilePath
        };
      }
    })
  );

  projects.forEach(project => {
    const card = template.content.firstElementChild.cloneNode(true);

    card.href = project.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.querySelector(".project-title").textContent = project.title;

    const img = card.querySelector(".project-preview img");
    img.src = project.image;
    img.alt = `${project.title} preview`;

    card.querySelector(".status-label").textContent = project.status;

    const techList = card.querySelector(".tech-list");
    project.tech.forEach(tech => {
      const pill = document.createElement("span");
      pill.className = "tech-pill";
      pill.textContent = tech;
      techList.appendChild(pill);
    });

    grid.appendChild(card);
  });
});

function resolveUrl(value, projectFilePath) {
  if (!value) {
    return "https://placehold.co/600x600/ee6352/ffffff?text=Project";
  }

  if (/^https?:\/\//.test(value) || value.startsWith("data:")) {
    return value;
  }

  return new URL(value, `${window.location.origin}${projectFilePath}`).href;
}
