# Repository Guidelines

## Project Structure & Module Organization
- `api/`: Flask backend (`app.py`, `requirements.txt`, `venv/`).
- `js/`: Frontend modules (`common.js`, `dashboard.js`, `pond[1-4].js`).
- `Fish-Smile0[1-4].html`: Pond dashboards mapping to `pond[1-4].js`.
- `start-dev.sh`: Spins up API and a simple static server.
- `README.md`: Architecture, endpoints, and quick start.

## Build, Test, and Development Commands
- Start both servers: `./start-dev.sh`
- Run API only:
  ```bash
  cd api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python app.py
  ```
- Run frontend only (static): `python3 -m http.server 8000`
- Quick API checks:
  ```bash
  curl http://localhost:5050/api/ponds
  curl "http://localhost:5050/api/sensors/pond1/history?limit=10&hours=2"
  ```

Note: Default API port is 5050; confirm `PORT` in `api/app.py` or set via env.

## Coding Style & Naming Conventions
- Python: PEP 8, 4-space indent, `snake_case` for functions/vars, `CapWords` for classes.
- JavaScript: 4-space indent, `camelCase` for functions/vars, `PascalCase` for classes.
- Filenames: `pond[1-4].js`, `Fish-Smile0[1-4].html`; keep IDs in code/HTML consistent (e.g., `pond3`).
- Keep modules focused; prefer small helpers in `common.js` over duplicating logic.

## Testing Guidelines
- No formal test suite yet. Use curl and browser-based verification:
  - Dashboards: open `http://localhost:8000/Fish-Smile01.html` etc.
  - API: verify 200s and payload shape (`success`, `data/forecast/analysis`).
- When adding tests, prefer `pytest` for API and lightweight JS unit tests; place under `api/tests/` and `js/tests/`.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise scope. Examples:
  - `api: add forecast confidence decay`
  - `js: refactor StatusUtils thresholds`
- PRs must include:
  - Purpose and summary, linked issue(s), and screenshots/GIFs of dashboards.
  - Repro steps and commands (e.g., how you ran API/frontend).
  - Notes on data shape changes or breaking changes.

## Security & Configuration Tips
- Do not commit secrets or virtualenvs; use `.env` (via `python-dotenv`) if needed.
- CORS is enabled for development; restrict in production.
- For production, consider `gunicorn` (see `api/README.md`) and align ports across scripts/docs.
