---
order: 3
icon: fas fa-terminal
title: antares-cli
description: >-
  A command-line interface for prototyping, commanding, and collecting data from Antares simulations.
---

## 🧠 What is the Antares Python Client?

The **Antares Python Client** is a high-level, developer-friendly library that allows you to interact with the **Antares simulation engine** directly from Python. Designed for modern simulation workflows, it provides a seamless interface to control simulations, add dynamic entities (like ships), and stream simulation events in real time.

Whether you're prototyping autonomous decision-making systems, testing radar algorithms, or integrating simulations into command dashboards, `antares-python` makes it possible - and remarkably simple.

---

## ⚙️ Why Python?

Python is the language of choice for:

- **AI agents** (e.g., LLM-based decision-making)
- **Operational dashboards** (e.g., with Dash, Streamlit, or Flask)
- **System integration** (e.g., connecting simulations to ROS, Kafka, or MQTT)
- **Algorithm prototyping** (e.g., sensor fusion, trajectory prediction)

With `antares-python`, you can embed Rust-powered realistic, high-frequency maritime simulations directly into those environments — enabling closed-loop testing, ML training, or control logic validation at scale.

---

## 📦 Python Integration in 30 Seconds

```python
from antares.client import AntaresClient
from antares.models.ship import LineShip

client = AntaresClient()

client.add_ship(LineShip(
    initial_position=(30.1, -77.3),
    angle=1.2,
    speed=6.0
))

async for track in client.subscribe():
    threat = tactical_ai.evaluate(track)
    if threat.level > 0.8:
        system.launch_countermeasure(track.position)
```

➡️ *Spawn a ship and react to its telemetry in real time. Combine with tactical logic or AI systems for autonomous decisions.*

---

## 🛰️ Use Cases in Autonomous & Military Systems

Antares Python Client acts as a **simulation substrate** for intelligent systems. Key applications include:

* ✅ **Closed-loop testing**
  Simulate dynamic threats and assess how guidance, targeting or evasion algorithms respond under realistic conditions.

* ✅ **Live inputs for AI systems**
  Stream real-time data into LLM-based copilots or tactical assistants to enhance battlefield decision support.

* ✅ **Dashboard integration**
  Feed positional and behavioral data into command UIs for situational awareness, mission rehearsal, or red team analysis.

* ✅ **Synthetic data generation**
  Generate diverse and labeled simulation data at scale to train models for classification, tracking, or anomaly detection.

* ✅ **System validation under uncertainty**
  Test robustness of autonomous systems against unpredictable scenarios, sensor degradation, or adversarial tactics.

---

## 🌍 Designed for Integration

You can easily:

* Start simulations programmatically
* Add agents or environmental entities dynamically
* Receive **live data** via TCP (compatible with asyncio, threading, or any event loop)
* Configure everything via `.env` or `.toml`

Antares Python Client has **zero external dependencies** beyond its own models and tools, ensuring it's lightweight and portable — ideal for secure or isolated environments.

---

## 🛡️ Robust. Modular. Battle-Ready.

Whether you're building mission rehearsal tools, tactical planning apps, or AI-controlled defense simulations — `antares-python` offers a powerful, production-ready foundation for integration, testing, and innovation.

---

## 🔗 Learn More

Full technical details, API reference, and source code are available at the [GitHub repository](https://github.com/TheSoftwareDesignLab/ANTARES/antares-python).
