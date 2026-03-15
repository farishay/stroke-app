# Strokē — Digital Sketchbook

A professional React + Vite digital sketchbook with AI drawing assistant.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.example .env
# Open .env and paste your key

# 3. Run dev server
npm run dev
# Open http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
│
├── main.jsx              # Entry point
├── App.jsx               # Router + global state ONLY
│
├── styles/
│   ├── global.css        # Reset, body, animations
│   ├── variables.css     # Design tokens (colors, fonts, spacing)
│   └── components.css    # Shared reusable component styles
│
├── services/
│   └── ai.js             # Anthropic API + offline fallback
│
├── hooks/
│   └── useCanvas.js      # Canvas drawing engine (hook)
│
├── components/           # Shared UI components
│   ├── Nav.jsx           # Top navigation
│   ├── Nav.module.css
│   ├── Footer.jsx        # Footer with logo link
│   ├── Footer.module.css
│   ├── AIPanel.jsx       # Sliding AI chat panel
│   └── AIPanel.module.css
│
└── pages/                # One file per page
    ├── Gallery.jsx        # Homepage: hero + sketch grid
    ├── Gallery.module.css
    ├── CreatePage.jsx     # Canvas editor
    ├── CreatePage.module.css
    ├── MySketches.jsx     # Archive: list, edit, rename, delete
    ├── MySketches.module.css
    ├── Detail.jsx         # Single sketch full view
    └── Detail.module.css
```

---

## API Key Setup

Get your key from **https://console.anthropic.com** → API Keys → Create Key

Paste it in `.env`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
```

> Without an API key the AI panel still works — it uses smart offline fallback responses.

---

## Features

| Feature           | Description                                     |
|-------------------|-------------------------------------------------|
| Canvas Drawing    | Pen, eraser, color picker, stroke sizes         |
| Undo / Clear      | Step-by-step undo or full clear                 |
| Save Sketches     | Saved to app state with title + category        |
| Edit Drawing      | Re-open any saved sketch on canvas and redraw   |
| Rename            | Change title and category without opening canvas|
| Delete            | Remove sketches from archive                    |
| Download PNG      | Export canvas as PNG file                       |
| AI Assistant      | Ideas, feedback, tips, titles via Claude AI     |
| Responsive        | Works on mobile, tablet, and desktop            |
