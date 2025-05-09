# ANTARES

**ANTARES** is an open-source, high-performance simulation platform for naval radar operations. It enables real-time, software-based simulation of maritime environments and radar tracking systems, with support for interactive visualization, TCP-based integration, and extensible simulation entities.

Developed with performance, modularity, and realism in mind, ANTARES supports both standalone and embedded use in larger C4I or Combat Management System (CMS) pipelines.

> 🧭 Showcase and live demos available at: [https://thesoftwaredesignlab.github.io/ANTARES](https://thesoftwaredesignlab.github.io/ANTARES)

## Key Features

- ⚡ **Real-Time Radar Simulation**  
  Sub-10ms latency for real-time generation and transmission of radar data.

- 🧱 **Modular & Extensible Architecture**  
  Easily add new vessel behaviors, emitter types, or environmental effects.

- 🔒 **Secure & Standardized Communication**  
  Transmit simulation data over TCP and WebSocket using standardized schemas.

- 🖥️ **Intuitive Web Interface**  
  A reactive, interactive GUI for real-time control and visualization.

- 🚀 **High-Performance Core in Rust**  
  Safety and speed for heavy computations and concurrent streaming.

## Repository Structure

This monorepo contains all components of the ANTARES platform:

```
ANTARES/
├── antares/           # Core simulator (Rust)
├── antares-python/    # Python client SDK
├── antares-web/       # Web-based interface and dashboard (TypeScript + React)
├── docs/              # Markdown source for documentation website
├── LICENSE            # MIT License
└── README.md          # You're here
```

Each subproject includes its own README with installation and usage instructions.

- **[antares](./antares)** — The simulation engine written in Rust  
- **[antares-python](./antares-python)** — A Python SDK and CLI for controlling and subscribing to simulation output  
- **[antares-web](./antares-web)** — The user-facing control and visualization interface  
- **[docs](./docs)** — Sources for the project website, built using [showcase-chirpy-easy-docs](https://github.com/jsurrea/showcase-chirpy-easy-docs)

## About the Project

> **ANTARES**: *A Software-Based Tool for Simulating Naval Radar Operations*  
> Presented at the **International Conference on Military Technologies 2025**, Brno, Czechia.

**Abstract**  
Simulation is a cost-effective method for training personnel in virtual environments before operating real machines or interacting with real and complex scenarios. Moreover, simulation is also valuable for analyzing the behavior of both deployed systems and those under development. For instance, the design and operation of Combat Management and C4I systems, which are inherently complex, have utilized simulation for early validation as well as for training Navy officers and enlisted personnel.

We present ANTARES, an open-source, software-based naval radar simulator. ANTARES is designed to seamlessly integrate with other systems via the TCP protocol while supporting standalone operation through a Graphical User Interface (GUI). Additionally, it adheres to the open-closed design principle, facilitating easy extensibility with new simulation entities, such as naval vessel movement strategies. The simulator was implemented using the Rust programming language due to its advantages in performance, type safety, concurrency, and memory safety. As an initial validation, we conducted a usability and usefulness study with 12 officers and enlisted personnel from the Colombian Navy. ANTARES is released under the MIT license.

## Credits

This project was developed by **Juan Sebastian Urrea-Lopez** as part of research initiatives at **Universidad de los Andes**, in collaboration with the **Armada de la República de Colombia**.

## License

ANTARES is released under the [MIT License](./LICENSE).  
