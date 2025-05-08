# Antares Web

**Antares Web** is a browser-based radar visualization and simulation control interface, part of the broader [ANTARES platform](https://thesoftwaredesignlab.github.io/ANTARES/). It connects to live radar data streams via WebSocket and provides tools to visualize tracks, issue commands, and configure scenarios in real-time.

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will start on [http://localhost:8080/](http://localhost:8080/) by default.

## Project Structure

This project is part of a monorepo. Below is a brief description of the main folders and files in `antares-web`:

```
antares-web/
├── src/                     # Main application source code
│   ├── api/                 # HTTP/WebSocket API interactions
│   ├── components/          # UI components
│   │   ├── ships/           # Ship creation and configuration UI
│   │   └── ui/              # Reusable UI primitives (modals, toasts, etc.)
│   ├── contexts/            # React context providers (e.g., config, WebSocket)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Generic utility functions
│   ├── pages/               # Route-based page components
│   ├── types/               # Type definitions (e.g., Track data)
│   └── utils/               # Radar-specific data parsers and validators
├── public/                  # Static assets
├── config.example.toml      # Example runtime config for ANTARES
├── template.env             # Example environment variables
├── vite.config.ts           # Vite configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Learn More

For demos, videos, and more information about the platform and its capabilities, visit the official project site:
👉 [https://thesoftwaredesignlab.github.io/ANTARES/antares-web](https://thesoftwaredesignlab.github.io/ANTARES/antares-web)

If you are interested in contributing or exploring the rest of the ANTARES simulation stack, check out the full monorepo:
👉 [https://github.com/TheSoftwareDesignLab/ANTARES](https://github.com/TheSoftwareDesignLab/ANTARES)

## Credits

This project was bootstrapped using [Lovable](https://lovable.dev/).
