# DeepAI Neural Interface — Setup Guide

A futuristic "AI OS" gift site. Pure HTML/CSS/JS, no build step, no backend.
Open `index.html` in a browser and it just works.

## 1. Where to place your photos

Put your image files (`.jpg`, `.png`, `.webp`) inside the `/images` folder.

Because this site has no server, the browser can't "look inside" a folder on
its own — so there's one small manual step: open `images/manifest.json` and
list your filenames, e.g.:

```json
["us-1.jpg", "trip-goa.jpg", "call-screenshot.png", "us-2.jpg"]
```

That's it. Those photos will automatically:
- appear flying onto the screen during the "I love you" cinematic
- show up as the enlarged final photo
- populate the Memories timeline thumbnails (in the order listed)

No filenames are hardcoded anywhere else — add or remove photos anytime by
editing that one list. If the list is empty, the love sequence and timeline
still work, just without photos.

**Important — photos need a local server, not double-clicking index.html.**
Most browsers block a page opened directly from disk (`file://...`) from
reading other files like `manifest.json`, as a security measure. Everything
else in the site works fine that way, but photos won't load. Two easy fixes:

- **Easiest:** deploy it to GitHub Pages (see step 5) — photos work
  automatically once it's on a real URL.
- **To preview locally first:** open a terminal in the project folder and run
  `python3 -m http.server 8000`, then visit `http://localhost:8000` in your
  browser. (Any similar local server works too, e.g. the VS Code
  "Live Server" extension.)

## 2. How to change the chatbot responses

Open `script.js` and find the `CHAT_RESPONSES` object near the top
(under "SECTION: CHATBOT"). Each key is the phrase she types (lowercase),
each value is what the AI replies:

```js
const CHAT_RESPONSES = {
  "coffee": "Brewing virtual coffee... ☕ ...",
  ...
};
```

Edit the text freely. To add a brand-new command, just add a new
`"trigger": "response"` line. The special value `"__LOVE_LOOKUP__"` triggers
the animated Thinking → Analyzing → Searching → "Deep." sequence — don't
reuse that string unless you want the same effect.

The terminal has its own separate list, `TERMINAL_RESPONSES`, right below it.

## 3. How to add more timeline events

In `script.js`, find the `TIMELINE` array (under "SECTION: MEMORIES
TIMELINE"). Each entry is one card:

```js
{ title:"First Date", date:"Chapter 03", text:"..." }
```

Add, remove, or reorder entries freely — the timeline renders automatically
from this list. The photo shown for each entry pulls from `images/manifest.json`
in the same order (entry 1 gets photo 1, etc.).

## 4. How to change the password

In `script.js`, right at the top under "Shared config", change:

```js
const DEV_PASSWORD = "developer";
```

to whatever you like. Also update `RELATIONSHIP_START` on the line below to
your actual "day one" date (`YYYY-MM-DD`) — Developer Mode uses it to show
a live day counter.

## 5. How to deploy it free with GitHub Pages

1. Create a new GitHub repository and upload `index.html`, `style.css`,
   `script.js`, and the `images/` folder (including `manifest.json`).
2. Go to the repo's **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick the `main` branch and `/ (root)` folder, then save.
4. GitHub will give you a live URL, usually
   `https://your-username.github.io/your-repo-name/`, within a minute or two.
5. Share that link instead of the files — it'll work on her phone too.

Note: `@import` in `style.css` pulls in Google Fonts online. It'll still look
good without internet (it falls back to system fonts), but for the full
effect, deploy it somewhere with a connection, or on GitHub Pages.

## Easter eggs, for your reference

- Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
- Double-click the home title
- Click the home title 10 times
- Press Shift 5 times quickly
- Type `sudo love` anywhere
- Type `i love you` or `love` into Start AI for the full cinematic
- Developer Mode password: `developer` (see #4 above to change it)
- "Hidden Link" on the home menu leads to a custom 404 page
