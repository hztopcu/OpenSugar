# OpenSugar

A patient-focused blood glucose tracker.

**A calm place to log your daily glucose, see your trends, and keep a clear picture of your numbers.**

---

## Philosophy

- **Patient-first.** Built for people who track their blood sugar day to day—not for dashboards or enterprise.
- **Calm daily tracking.** Logging should feel simple and unobtrusive, not overwhelming.
- **Apple-inspired design.** Soft colors, rounded cards, and clear typography. The interface stays minimal and friendly.
- **Simplicity over complexity.** Only what you need: log, view trends, review history. No clutter.

---

## Core Features

- **Morning & evening logging** — Quick add from the dashboard; full entry form when you need type and notes.
- **Trend visualization** — 7, 14, and 30-day views with a healthy range (70–140 mg/dL) and smooth curves.
- **Time-in-range ring** — See at a glance what share of readings falls below, in, or above range.
- **Clean history** — Chronological list and table; optional notes; status at a glance.
- **Light & dark mode** — Same clarity in either theme.

---

## Design Language

The app is visually inspired by Apple Health:

- Rounded, colorful cards with soft shadows.
- Soft gradients (e.g. header and key actions).
- Friendly micro-interactions: gentle hover, light feedback on save.
- Color used meaningfully: blue for low, green for in range, orange and pink-red for high—never harsh.

---

## Privacy & Data

- **No ads.** The app does not show advertisements.
- **No tracking.** No analytics or third-party tracking of your use.
- **Your data belongs to you.** Logs are stored in your own database (or locally); we do not collect or sell your data.
- **Runs locally.** You can self-host and keep everything on your own infrastructure.

---

## Non-Commercial Use Only

This project is **open-source and free for personal and non-commercial use only.**

**Commercial use is not permitted.** You may not use this software, in whole or in part, for any commercial product, service, or business without explicit permission. It is intended for individuals tracking their own health and for non-commercial community use.

If you are unsure whether your use is permitted, please open an issue before proceeding.

---

## Medical Disclaimer

This app is **not a medical device** and is not intended to diagnose, treat, or prevent any condition.

It is a **personal tracking tool** only. It does not replace professional medical advice, and it is not suitable for making treatment decisions on its own. Always follow your healthcare provider’s guidance. In case of hypoglycemia, hyperglycemia, or any medical emergency, seek immediate professional care.

The authors and contributors are not liable for any decisions or outcomes based on data or alerts from this app.

---

## Getting Started

**Requirements:** Node.js 18+, a Postgres database (e.g. [Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres)).

1. **Clone and install**

   ```bash
   git clone https://github.com/your-username/opensugar.git
   cd opensugar
   npm install
   ```

2. **Configure environment**

   Create `.env.local` in the project root:

   ```env
   APP_USER=your_username
   APP_PASSWORD=your_secure_password
   AUTH_SECRET=your_random_secret
   POSTGRES_URL=postgres://...
   ```

   Use a strong password and a random string for `AUTH_SECRET`. Get `POSTGRES_URL` from your Postgres provider.

3. **Create database tables**

   After the app is running once, call the setup endpoint (or run the SQL in `sql/` in order):

   ```
   GET http://localhost:3000/api/setup
   ```

   See the `sql/` folder for manual schema steps and migrations.

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign in with `APP_USER` and `APP_PASSWORD`.

**Deploying:** The app runs on [Vercel](https://vercel.com). Connect your repo, add a Postgres database, set the same environment variables, and deploy. Run the setup endpoint after the first deploy if tables do not yet exist.

---

## Open Source & Contribution

OpenSugar is built for the community. Contributions—ideas, bug reports, code, and documentation—are welcome.

Please respect the **non-commercial** intent of the project. By contributing, you agree that your work may be used under the same terms. Keep the tone calm and the code clear.

1. Open an issue or discussion for bugs and ideas.
2. Fork the repo, create a branch, make your changes.
3. Ensure `npm run build` and `npm run lint` pass.
4. Open a pull request with a short description.

---

## License

See [LICENSE](LICENSE) in this repository. Use is permitted for **personal and non-commercial purposes only**. Commercial use is not permitted without explicit permission.
