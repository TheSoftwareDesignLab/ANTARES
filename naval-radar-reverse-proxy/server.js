/**
 * WebSocket server that allows establishing a TCP connection with a
 * Remote Server and send messages over TCP connection.
 *
 * Works as an Adapter between the WebSocket client and the TCP server.
 */

const WebSocket = require("./node_modules/ws");
const net = require("net");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8080;

// Create a WebSocket server
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });

wss.on("connection", (ws) => {
  let tcpClient = null;

  ws.on("message", (message) => {
    const [command, ip, port, ...msg] = message.toString().split(" ");
    console.info(`Received message from Client: ${message}`);

    if (command === "connect") {
      // if there's an active connection, close it
      if (tcpClient) {
        tcpClient.end();
        ws.send("info: Disconnected from previous connection");
      }

      // Connect to the TCP server
      tcpClient = net.createConnection(
        { host: ip, port: parseInt(port) },
        () => {
          ws.send(`info: Connected to ${ip}:${port}`);
        }
      );

      tcpClient.on("data", (data) => {
        console.info(`Received message from TCP server: ${data.toString()}`);
        ws.send(`server: ${data.toString()}`);
      });

      tcpClient.on("end", () => {
        ws.send("info: TCP connection closed");
      });

      tcpClient.on("error", (err) => {
        ws.send(`error: ${err.message}`);
      });
    } else if (command === "disconnect") {
      if (tcpClient) {
        tcpClient.end();
        ws.send("info: Disconnected from server");
        tcpClient = null;
      } else {
        ws.send("error: No active connection to disconnect");
      }
    } else {
      // Send message to the TCP server if connected
      if (tcpClient) {
        tcpClient.write(message + "\r\n", "ascii", () =>
          console.info(`Sent message to TCP server: ${message}`)
        );
      } else {
        ws.send("error: No active TCP connection");
      }
    }
  });

  ws.on("close", () => {
    if (tcpClient) tcpClient.end();
  });
});

console.log("WebSocket server running on ws://localhost:" + WEBSOCKET_PORT);
