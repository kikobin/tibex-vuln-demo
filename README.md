# tibex-vuln-demo

Intentionally vulnerable demo application for testing [Tibex](https://tibex.io) scans and PR reviews.

**Do not deploy this to the internet or use any of this code.** Every bug here is deliberate.

| Where | What Tibex should report |
| --- | --- |
| `api/src/users.js` `GET /users/search` | SQL injection: the query string is concatenated into SQL |
| `api/src/users.js` `GET /users/:id` | Broken access control (IDOR): any signed-in user reads any profile |
| `api/src/files.js` `GET /files` | Path traversal: `name` goes straight into `path.join` and `res.sendFile` |
| `api/src/tools.js` `POST /tools/ping` | OS command injection through `exec` |
| `api/src/tools.js` `GET /tools/preview` | SSRF: the server fetches any URL from the query |
| `api/src/tools.js` `POST /tools/calc` | Code injection through `eval` |
| `api/src/config.js` | Hard-coded database connection string with a password |
| `api/src/auth.js` | JWT secret in code and `none` algorithm accepted |
| `reports/app.py` `GET /report` | SQL injection through an f-string in `execute` |
| `reports/app.py` `POST /import` | Unsafe deserialization with `pickle.loads` |
| `reports/app.py` `GET /export` | Command injection with `shell=True` |

Safe code that must **not** be reported (false-positive checks):

- `api/src/users.js` `GET /users/by-email` — parameterized query;
- `reports/app.py` `GET /report/safe` — parameterized query;
- `api/src/files.js` `GET /files/safe` — name checked against an allowlist.

## What the scanner reported on this commit

`python -m tibex_scanner.code_audit . --analyst heuristic` (no LLM) — 10 signals:

- found: path traversal `api/src/files.js:9`, command injection `api/src/tools.js:8` and `reports/app.py:43`, SSRF `api/src/tools.js:14`, `eval` `api/src/tools.js:19`, SQL injection `reports/app.py:23`, `pickle.loads` `reports/app.py:36`, secrets `api/src/auth.js:3` and `api/src/config.js:3`;
- correctly silent: parameterized queries in `api/src/users.js` and `reports/app.py`;
- false positive: `api/src/files.js:16` (`/files/safe` is behind an allowlist);
- missed: SQL injection through `db.prepare("…" + req.query.q)` in `api/src/users.js:8` (better-sqlite3 `prepare` is not a known sink), IDOR and the JWT `none` algorithm (logic bugs — for the LLM analyst and manual triage).

These are the known gaps to check in a full Tibex scan with the LLM analyst.

## Run locally

```bash
docker compose up --build
```

The API listens on `http://localhost:3000`, the reports service on `http://localhost:5000`. Bind them to localhost only.
