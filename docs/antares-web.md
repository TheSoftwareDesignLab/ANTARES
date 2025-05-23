---
order: 2
icon: fas fa-pager
title: Antares Web Radar
description: >-
  A real-time web-based radar visualization and experimentation tool built for rapid prototyping and analysis.
---

## Overview

**Antares Web Radar** is an interactive, browser-based radar interface designed to **visualize, analyze, and command radar simulations** in real time. Built for defense research, operational testing, and prototyping scenarios, it provides a seamless way to **observe radar data** with minimal setup or installation.

By abstracting complexity and exposing only the necessary controls and data streams, Antares Web Radar empowers engineers, analysts, and decision-makers to **focus on the tactical implications of sensor data**, not the plumbing behind it.

## Key Features

### 🔍 Live Visualization of Radar Tracks
- Real-time display of **moving targets** and **navigational aids** (ATONs) over a configurable radar canvas.
- Automatic detection and **consolidation of multiple echoes** for the same object.
- Intuitive visualization of **range, speed, and bearing** for all tracked entities.

### 🧪 Rapid Experimentation
- Seamlessly issue **commands to the simulation engine** such as adding vessels or resetting scenarios.
- Built-in interface for configuring ships with different radar signatures, kinematics, and identifiers.
- Designed to support **live experiments and training exercises** with minimal latency.

### 🛰️ WebSocket Integration
- Connects to a live radar stream via WebSocket for **low-latency data ingestion**.
- Decodes structured telemetry modeled after standard radar output formats (e.g. range, bearing, position, velocity).

### ⚙️ Zero-Install, Full Capability
- Entirely web-based: just open the browser and connect.
- Configurable via `.env` settings for controller and radar endpoints.
- No installation or compilation required—**works out of the box** in any modern web browser.

## Use Cases

- **Sensor behavior validation**: visualize how changes in radar settings or environment affect target tracking.
- **Command & control prototyping**: simulate real-world scenarios and test control interfaces.
- **Training support**: provide operators or researchers with an intuitive radar feed for interpretation practice.
- **Tactical replay and debrief**: re-run scenarios and observe how the system behaved under various configurations.

## Screenshots

![Antares Radar UI](https://raw.githubusercontent.com/TheSoftwareDesignLab/ANTARES/refs/heads/main/docs/assets/antares-radar-ui.png){: width="700" }
_Live radar display with multiple dynamic targets_

![Ship Configuration Modal](https://raw.githubusercontent.com/TheSoftwareDesignLab/ANTARES/refs/heads/main/docs/assets/antares-ship-config.png){: width="700" }
_Adding a new vessel with customizable parameters_

## Learn More

For source code, contributions, or in-depth technical details, visit the GitHub repository:  
👉 [https://github.com/TheSoftwareDesignLab/ANTARES/tree/main/antares-web](https://github.com/TheSoftwareDesignLab/ANTARES/tree/main/antares-web)

