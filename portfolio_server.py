"""Helyi portfóliószerver automatikus projektlista API-val."""

import json
import os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECTS_ROOT = os.path.join(ROOT_DIR, "Portfolio_projects")


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
            parsed_path = "/portfolio.html"

        self.path = parsed_path
        return super().do_GET()


if __name__ == "__main__":
    os.chdir(ROOT_DIR)

    server = ThreadingHTTPServer(("127.0.0.1", 8000), ProjectHandler)
    print("Server running at http://127.0.0.1:8000")
    server.serve_forever()
