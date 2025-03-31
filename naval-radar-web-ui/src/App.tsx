import React, { useState, useEffect, FormEvent } from "react";
import Radar from "./Radar";
import "./App.css";

const App: React.FC = () => {
  const [controlSocket, setControlSocket] = useState<WebSocket | null>(null);
  const [dataSocket, setDataSocket] = useState<WebSocket | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [points, setPoints] = useState<{ range: number; azimuth: number; timestamp: number }[]>([]);
  const [radarRange, setRadarRange] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-update radar every 100ms
      setPoints((prevPoints) => prevPoints.filter((point) => Date.now() - point.timestamp < 5000));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const connectToServer = (ip: string) => {
    const control = new WebSocket("ws://localhost:8080");
    const data = new WebSocket("ws://localhost:8080");

    control.onopen = () => {
      control.send(`connect ${ip} 17394`);
      setChatMessages((prev) => [...prev, "Connected to control channel"]);
      setIsConnected(true);
    };

    control.onmessage = (event) => {
      setChatMessages((prev) => [...prev, event.data]);
    };

    data.onopen = () => {
      data.send(`connect ${ip} 17396`);
      setChatMessages((prev) => [...prev, "Connected to data channel"]);
    };

    data.onmessage = (event) => handleDataMessage(event.data);

    setControlSocket(control);
    setDataSocket(data);
  };

  const handleDataMessage = (data: string) => {
    const [,,,,,,,,,,,,,range,azimuth] = data.split(",").map((v) => parseFloat(v) || v);

    setPoints((prev) => [
      ...prev,
      { range: Number(range), azimuth: Number(azimuth), timestamp: Date.now() },
    ]);
  };

  const disconnect = () => {
    if (controlSocket) controlSocket.close();
    if (dataSocket) dataSocket.close();
    setIsConnected(false);
    setChatMessages((prev) => [...prev, "Disconnected from server"]);
  };

  const sendMessage = () => {
    if (chatInput && controlSocket && controlSocket.readyState === WebSocket.OPEN) {
      controlSocket.send(chatInput);
      setChatMessages((prev) => [...prev, `You: ${chatInput}`]);
      setChatInput("");
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ip = (e.target as HTMLFormElement).ip.value;
    connectToServer(ip);
  };

  const handleRadarRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRange = parseInt(e.target.value, 10);
    if (!isNaN(newRange) && newRange > 0) {
      setRadarRange(newRange);
    }
  };

  return (
    <div className="App">
      <h1>Radar Simulator</h1>
      <div className="container">
        <Radar points={points} radarRange={radarRange} />
        <div className="chat-section">
          <form id="connection-form" className="form-section" onSubmit={handleFormSubmit}>
            <label htmlFor="ip">Server IP:</label>
            <input type="text" id="ip" placeholder="Enter IP address" required />
            <button type="submit" id="connect-btn" disabled={isConnected}>
              Connect
            </button>
            <button type="button" id="disconnect-btn" onClick={disconnect} disabled={!isConnected}>
              Disconnect
            </button>
          </form>
          <div id="chat-box" className="chat-box">
            {chatMessages.map((msg, index) => (
              <div key={index} className={msg.startsWith("You:") ? "message" : "info"}>
                {msg}
              </div>
            ))}
          </div>
          <div className="input-section">
            <input
              type="text"
              id="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!isConnected}
              placeholder="Enter command"
            />
            <button id="send-btn" onClick={sendMessage} disabled={!isConnected}>
              Send
            </button>
          </div>
          <div className="radar-range-section">
            <label htmlFor="radar-range">Radar Range:</label>
            <input
              type="number"
              id="radar-range"
              value={radarRange}
              onChange={handleRadarRangeChange}
              placeholder="Set radar range"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
