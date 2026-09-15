# GenuineWeb

A verified directory of authentic websites (government services, exams,
banking) that protects users from phishing and DNS-spoofing attacks.

- Backend: Node.js — plain `http` + `fs` modules only. No `npm install`
  needed, works on **any Node.js version** (10+), any device.
- Storage: a simple `data.json` file, created automatically on first run.
- Frontend: Plain HTML/CSS/JavaScript.

Reports submitted through the "Report a broken or suspicious link" form are
saved to the shared `data.json` file, so everyone who visits the live site
sees the same directory and the same reports (via `GET /api/reports`).

---

## Run it locally

1. Install Node.js from nodejs.org if you don't already have it.
2. Open a terminal in this folder.
3. Run:
   ```
   node server.js
   ```
4. Open `http://localhost:3000` in your browser.

That's it — no dependencies to install. `data.json` is created and seeded
with the directory automatically the first time you run it.

---

## Make it live, so anyone on any device can open it

### Option A — Replit (easiest from a phone)
1. Go to **replit.com/import** → choose **ZIP** → upload this zip as-is.
2. Once imported, open the **Shell** tab and run:
   ```
   node server.js
   ```
3. Tap **Open preview** (or use the **Deploy** option in Replit for a
   permanent link) to get a live URL anyone can open.

### Option B — Render (best from a laptop)
1. Create a free account at **github.com**, make a new repository, and
   upload all the files in this project (`server.js`, `package.json`,
   `README.md`, and the `public` folder).
2. Go to **render.com**, sign up with GitHub, click **New → Web Service**,
   select your repository.
3. Set:
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
4. Click **Create Web Service**. You'll get a live URL like
   `https://genuineweb.onrender.com` within a couple of minutes.

---

## API reference

| Method | Route            | Description                                              |
|--------|------------------|------------------------------------------------------------|
| GET    | `/api/links`      | List directory links. Query params: `search`, `category`  |
| GET    | `/api/categories` | List categories with counts                                |
| POST   | `/api/report`     | Submit a broken/suspicious link report (JSON: `site`, `url`, `details`) |
| GET    | `/api/reports`    | View all submitted reports (shared, visible to everyone)   |

---

## What's in the directory right now

34 verified links across five categories:
- **Identity Documents** (10): Aadhaar update, e-Aadhaar download, PAN
  application, PAN-Aadhaar linking, Voter ID, Driving Licence, Vehicle
  registration, Passport, DigiLocker, Birth/Death Certificate.
- **Exams & Admissions** (7): SSC, IBPS, RRB (Railways), UPSC, NTA
  (NEET/JEE), CBSE, UGC NET.
- **Banking & Finance** (7): SBI, RBI, EPFO, GST Portal, NPS, SEBI, India
  Post Payments Bank.
- **Welfare & Utilities** (6): MyGov, National Portal of India, Ayushman
  Bharat (PM-JAY), PM-KISAN, e-Shram, CoWIN.
- **Education** (4): National Scholarship Portal, SWAYAM, UGC, AICTE.

You (or anyone editing `server.js`) can add more entries to the
`DEFAULT_LINKS` array at the top of the file.

---

## Notes

- GenuineWeb never asks for or stores Aadhaar, PAN, OTP, or any sensitive
  personal data — only the link directory and link-reports.
