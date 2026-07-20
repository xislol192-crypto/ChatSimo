# Fake Chat Simulator

A realistic, roleplay-only fake chat simulator built with React, Vite, and
Tailwind CSS. Create fake contacts and groups, chat back and forth as
either side of the conversation, place fake voice/video calls, and switch
between WhatsApp / Messenger / iMessage-style UI themes.

> ⚠️ **For roleplay and mockup purposes only.** No real messages are sent
> and no real calls are made — everything happens locally in your browser.

## Features

- **Three chat themes** — WhatsApp, Messenger, and iMessage bubble/header styles, set per contact or group
- **Contacts & Groups** — name, phone number, bio, profile photo, verified badge, and a custom "presence" line (e.g. "online")
- **Two-sided messaging** — send as yourself or as the other person/any group member, so you can write a whole conversation
- **Voice messages** — hold the mic button to record real audio and send it as a playable voice bubble
- **Image attachments** — attach and send photos in a chat
- **Message editing/deleting** — long-press any bubble to edit or remove it
- **Read receipts** — tap the checkmarks to cycle Sent → Delivered → Read
- **Fake calling** — outgoing/incoming voice & video call screens with ringing, accept/decline, duration, and a full call log
- **WhatsApp home screens** — Chats, Updates (Status), Communities, and Calls tabs, plus search and archive
- **Status updates** — post text statuses as yourself or as any contact, viewable in a full-screen story-style viewer
- **Communities** — group multiple chats together under one community
- **Chat wallpapers** — several built-in backgrounds plus custom photo upload
- **Sound effects** — lightweight send/receive/ring tones (no audio files, generated in-browser)
- Everything persists in your browser via `localStorage`

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

The production build is written to `dist/` and can be deployed to any
static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) for icons

## Notes

- Voice message recording requires microphone permission from your browser.
- All data (contacts, messages, call logs, settings) is stored locally in
  your browser's `localStorage` — nothing is sent to a server.
- This project was originally prototyped as a single-file component and
  later restructured into this standard Vite layout for easy hosting and
  version control.

## License

MIT — do whatever you'd like with it.
