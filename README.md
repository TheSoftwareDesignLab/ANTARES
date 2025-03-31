# ANTARES: A Software-Based Tool for Simulating Naval Radar Operations

This repository contains the source code for ANTARES, a comprehensive naval radar simulation system designed to meet the operational needs of maritime security and training for the Colombian Navy. The system combines cutting-edge technology with modular and extensible architecture, providing a robust solution for naval simulation, real-time visualization, and tactical evaluation.

## 🚢 **Project Overview**

### **Introduction**

The project is aimed at developing an advanced naval radar simulator, capable of real-time detection, monitoring, and tracking of vessels in a simulated maritime environment. It supports realistic training, mission planning, and operational readiness, enhancing the Colombian Navy's capabilities and positioning it as a regional leader in naval technology.

### **Objective**

- To design and implement a radar simulation system for generating and visualizing real-time data on vessel positions and movements in a simulated naval setting.

## 📂 **Repository Structure**

The repository is divided into three major components, each with its own dedicated subdirectory and README file for further details:

### 1. **[Naval Radar Simulator](./naval-radar-simulator)**

- Implements the radar simulation engine, responsible for generating radar data in real-time.
- Developed in **Rust**, prioritizing:
  - High performance.
  - Security and low-level control.
  - Configurability via TOML configuration files.
- Real-time data is transmitted using TCP sockets.
- Modular design supports extensibility for new features such as movement patterns, physical conditions, and custom tracking algorithms.

**Instructions to Run**:

```bash
cd naval-radar-simulator
cargo run -- <config-file>
```

Replace `<config-file>` with the path to the desired TOML configuration file. Further setup instructions can be found in the subdirectory's [README](./naval-radar-simulator/README.md).

### 2. **[Naval Radar Web UI](./naval-radar-web-ui)**

- A **React-based user interface** for visualizing radar data.
- Features include:
  - Real-time radar display with panning and zoom functionality.
  - Chat and control interface for interacting with the radar simulation.
  - Communication with the radar engine using WebSockets.

**Instructions to Run**:

```bash
cd naval-radar-web-ui
npm install
npm start
```

Open the interface in your browser at `http://localhost:5173`. Detailed information is available in the subdirectory's [README](./naval-radar-web-ui/README.md).

### 3. **[Naval Radar Reverse Proxy](./naval-radar-reverse-proxy)**

- Handles WebSocket connections between the web UI and radar simulation engine.
- Ensures secure and optimized data transfer.
- Configured to work seamlessly with both the simulation and web UI components.

**Instructions to Run**:

```bash
cd naval-radar-reverse-proxy
npm install
npm start
```

Configuration details can be found in the subdirectory's [README](./naval-radar-reverse-proxy/README.md).

## 🔧 **Key Features**

- **Real-Time Radar Simulation**: Sub-10ms latency for precise real-time data.
- **Extensibility**: Modular architecture allows integration of new entities and algorithms.
- **Secure Communication**: Data is transmitted securely via standardized TCP and WebSocket protocols.
- **Intuitive User Interface**: A highly interactive, user-friendly web interface for visualization and control.
- **High Performance**: Built in Rust for efficient handling of radar computations and data streaming.

## 📊 **Results and Impact**

The simulator achieves its objectives by:

1. Offering real-time, precise radar tracking.
2. Providing extensibility for future needs, including new physical conditions and tracking enhancements.
3. Meeting the operational training requirements of the Colombian Navy.

**System Performance**:

- Sub-10ms latency for seamless real-time updates.
- Modular components ensure flexibility and scalability.

## 📜 **References**

For further information on specific components, refer to the README files located in their respective directories:

- [Naval Radar Simulator](./naval-radar-simulator/README.md)
- [Naval Radar Web UI](./naval-radar-web-ui/README.md)
- [Naval Radar Reverse Proxy](./naval-radar-reverse-proxy/README.md)

## 📥 **Contributions**

This project was developed by **Juan Sebastian Urrea Lopez** as part of research initiatives at **Universidad de los Andes**, in collaboration with the **Armada de la República de Colombia**.

For any contributions, suggestions, or issues, feel free to open a pull request or contact the authors directly.
