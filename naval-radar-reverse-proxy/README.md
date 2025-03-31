# Naval Radar - Reverse Proxy

This project implements a WebSocket server that acts as an adapter between WebSocket clients and TCP servers. It allows WebSocket clients to establish and interact with a TCP connection via the WebSocket interface. The server is configurable using environment variables for flexibility and ease of deployment.

It is necessary to set up a reverse proxy server to use the Web UI. For security reasons, the Web UI cannot directly connect to the radar simulator with a TCP connection. The reverse proxy server acts as an intermediary that forwards the WebSocket messages from the Web UI to the radar simulator and vice versa.

## Features

- Establish TCP connections with remote servers through WebSocket messages.
- Forward messages from WebSocket clients to TCP servers and vice versa.
- Dynamically connect, disconnect, and communicate with TCP servers.
- Configurable WebSocket server port using environment variables.

## Requirements

- **Node.js**: Ensure you have Node.js installed on your machine.

## Installation

1. Navigate to the project directory:

   ```bash
   cd naval-radar-reverse-proxy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root to configure environment variables:

   ```bash
   touch .env
   ```

4. Add the following variable to the `.env` file:
   ```env
   WEBSOCKET_PORT=8080
   ```

## Usage

1. Start the server:

   ```bash
   node server.js
   ```

   or

   ```bash
   npm start
   ```

2. Connect to the WebSocket server at:

   ```
   ws://localhost:8080
   ```

3. Use the following commands to interact with the server:

   - **Connect to a TCP server**:

     ```plaintext
     connect <ip-address> <port>
     ```

     Example:

     ```
     connect 127.0.0.1 9000
     ```

   - **Disconnect from the TCP server**:

     ```plaintext
     disconnect
     ```

   - **Send a message to the TCP server**:
     ```plaintext
     <your-message>
     ```

## Environment Variables

The following environment variables can be set in the `.env` file:

| Variable         | Default | Description                                  |
| ---------------- | ------- | -------------------------------------------- |
| `WEBSOCKET_PORT` | `8080`  | The port on which the WebSocket server runs. |

## Logs and Debugging

- The server logs incoming WebSocket messages and interactions with the TCP server.
- Example logs:
  ```
  WebSocket server running on ws://localhost:8080
  Received message from Client: connect 127.0.0.1 9000
  Sent message to TCP server: Hello, TCP Server!
  ```
