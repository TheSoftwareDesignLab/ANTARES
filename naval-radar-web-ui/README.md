# Naval Radar - Web UI

This project is a Web UI for the **Radar Simulator** built with **React** and WebSockets. It features a radar visualization using an HTML canvas, WebSocket communication for control and data channels, and a chat interface for sending commands to the server.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Code Structure](#code-structure)
- [Future Enhancements](#future-enhancements)

## Features

- **Radar Visualization**: Displays radar points dynamically on a canvas.
- **WebSocket Communication**:
  - Control channel: Sends commands to the server.
  - Data channel: Receives radar data from the server.
- **Interactive Chat**: Chat interface for sending and receiving server messages.
- **Real-Time Point Decay**: Points on the radar fade over time (5 seconds).
- **Connect/Disconnect Buttons**: Seamlessly manage WebSocket connections.

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Canvas API**: For radar visualization.
- **WebSocket API**: For real-time communication.
- **Styling**: Basic CSS.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14 or above recommended).
- **Vite**: This project uses Vite as the build tool.

### Installation

1. Navigate to the project directory:

   ```bash
   cd naval-radar-web-ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage

1. Enter the server's IP address in the input field provided. This will usually be "0.0.0.0"
2. Click **Connect** to establish WebSocket connections to the control and data channels.
3. Radar data will automatically populate the canvas as the server sends it.
4. Use the chat box to send commands to the server.

### Radar Simulation

- Points are plotted based on `range` and `azimuth` values received from the server.
- Each point decays (fades) over 5 seconds to simulate radar scanning.

### Disconnect

Click the **Disconnect** button to close the WebSocket connections.
