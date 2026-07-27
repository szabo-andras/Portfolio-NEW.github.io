"""Helyi portfóliószerver automatikus projektlista- és feltöltési API-val."""

from email.parser import BytesParser
from email.policy import default
from html import escape
import json
import os
import re
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECTS_ROOT = os.path.join(ROOT_DIR, "Portfolio_projects")
MAX_UPLOAD_SIZE = 10 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {".gif", ".jpeg", ".jpg", ".png", ".webp"}


def project_folder_name(value):
    """A projekt címéből mappa- és fájlnévhez használható nevet készít."""
    name = re.sub(r"\s+", "_", value.strip())
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", name).strip("._")
    return name or "uj_projekt"


def unique_project_folder(project_name):
    base_name = project_folder_name(project_name)
    folder_name = base_name
    suffix = 2

    while os.path.exists(os.path.join(PROJECTS_ROOT, folder_name)):
        folder_name = f"{base_name}_{suffix}"
        suffix += 1

    return folder_name


def create_project_page(title, description, status, technologies, image_path):
    tech_html = "\n".join(f"            <span>{escape(tech)}</span>" for tech in technologies)
    if not tech_html:
        tech_html = "            <span>Nincs megadva</span>"

    return f"""<!DOCTYPE html>
<html lang=\"hu\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <link rel=\"stylesheet\" href=\"/CSS/styles.css\">
    <title>{escape(title)}</title>
</head>
<body>
    <header><div id=\"navbar\"></div></header>
    <main>
        <h1 id=\"project_title\">{escape(title)}</h1>
        <img id=\"project_image\" src=\"{escape(image_path, quote=True)}\" alt=\"{escape(title, quote=True)} projekt képe\">
        <div id=\"project_status\">{escape(status)}</div>
        <section id=\"project_tech_section\">
            <h2>Felhasznált technológiák</h2>
            <div id=\"project_tech\">
{tech_html}
            </div>
        </section>
        <section id=\"project_description_section\">
            <h2>Projekt leírása</h2>
            <p>{escape(description)}</p>
        </section>
    </main>
    <footer><div id=\"footer\"></div></footer>
    <script src=\"/JS/components.js\"></script>
</body>
</html>
"""


def parse_multipart_form(content_type, body):
    message = BytesParser(policy=default).parsebytes(
        b"Content-Type: " + content_type.encode("utf-8") + b"\r\n\r\n" + body
    )
    fields = {}
    files = {}

    if not message.is_multipart():
        return fields, files

    for part in message.iter_parts():
        field_name = part.get_param("name", header="content-disposition")
        if not field_name:
            continue

        payload = part.get_payload(decode=True) or b""
        filename = part.get_filename()
        if filename:
            files[field_name] = (os.path.basename(filename), payload)
        else:
            fields.setdefault(field_name, []).append(payload.decode("utf-8", errors="replace"))

    return fields, files


def build_project_list():
    entries = []

    if os.path.isdir(PROJECTS_ROOT):
        for folder_name in sorted(os.listdir(PROJECTS_ROOT)):
            folder_path = os.path.join(PROJECTS_ROOT, folder_name)

            if not os.path.isdir(folder_path):
                continue

            html_files = sorted(
                f for f in os.listdir(folder_path)
                if f.endswith(".html") and "index" in f.lower()
            )

            if not html_files:
                continue

            first_file = html_files[0]
            entries.append({
                "folder": folder_name,
                "file": first_file,
                "path": f"/Portfolio_projects/{folder_name}/{first_file}"
            })

    return entries


class ProjectHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = self.path.split("?", 1)[0]

        if parsed_path == "/api/projects":
            body = json.dumps(build_project_list()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if parsed_path == "/":
            self.send_response(303)
            self.send_header("Location", "/portfolio.html")
            self.end_headers()
            return

        self.path = parsed_path
        return super().do_GET()

    def do_POST(self):
        parsed_path = self.path.split("?", 1)[0]
        if parsed_path != "/submit_project":
            self.send_error(404, "Ismeretlen végpont.")
            return

        content_type = self.headers.get("Content-Type", "")
        content_length = int(self.headers.get("Content-Length", "0"))
        if not content_type.startswith("multipart/form-data"):
            self.send_error(400, "A feltöltéshez multipart űrlap szükséges.")
            return
        if not 0 < content_length <= MAX_UPLOAD_SIZE:
            self.send_error(400, "A feltöltés mérete legfeljebb 10 MB lehet.")
            return

        fields, files = parse_multipart_form(content_type, self.rfile.read(content_length))
        project_name = fields.get("project_name", [""])[0].strip()
        description = fields.get("description", [""])[0].strip()
        status = fields.get("status", ["Planned"])[0]
        technologies = fields.get("technology", [])

        if not project_name or not description:
            self.send_error(400, "A projekt neve és leírása kötelező.")
            return
        if status not in {"Planned", "In progress", "Done"}:
            self.send_error(400, "Érvénytelen projektállapot.")
            return

        folder_name = unique_project_folder(project_name)
        folder_path = os.path.join(PROJECTS_ROOT, folder_name)
        image_path = "https://placehold.co/1200x675/ee6352/ffffff?text=Project"
        os.makedirs(folder_path)

        screenshot = files.get("screenshot")
        if screenshot and screenshot[0]:
            filename, image_data = screenshot
            extension = os.path.splitext(filename)[1].lower()
            if extension not in ALLOWED_IMAGE_EXTENSIONS:
                os.rmdir(folder_path)
                self.send_error(400, "Csak GIF, JPG, PNG vagy WebP kép tölthető fel.")
                return

            assets_path = os.path.join(folder_path, "assets")
            os.makedirs(assets_path)
            safe_filename = f"cover{extension}"
            with open(os.path.join(assets_path, safe_filename), "wb") as image_file:
                image_file.write(image_data)
            image_path = f"assets/{safe_filename}"

        page = create_project_page(folder_name, description, status, technologies, image_path)
        index_filename = f"{folder_name}_index.html"
        with open(os.path.join(folder_path, index_filename), "w", encoding="utf-8") as page_file:
            page_file.write(page)

        self.send_response(303)
        self.send_header("Location", "/portfolio.html")
        self.end_headers()


if __name__ == "__main__":
    os.chdir(ROOT_DIR)

    server = ThreadingHTTPServer(("127.0.0.1", 8000), ProjectHandler)
    print("Server running at http://127.0.0.1:8000")
    server.serve_forever()
