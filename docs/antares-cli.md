---
title: "🛠️ antares-cli: Command-Line Control"
description: "Use the antares-cli tool to prototype, command, and collect data from Antares simulations."
---

## 🛠️ antares-cli: Command-Line Control

> **A lightweight interface for controlling Antares simulations via terminal commands.**

`antares-cli` is a powerful tool for prototyping behaviors, capturing telemetry logs, and issuing real-time commands to the Antares simulation system — useful in both development and operational research settings.

---

## ⚙️ Core Capabilities

`antares-cli` allows engineers and researchers to:

- 🚀 **Quickly spawn ships** with precise motion parameters to test scenarios
- 📡 **Subscribe to event streams** from the simulation, with optional JSON logging
- ♻️ **Reset the environment** without restarting the binary
- 🧩 **Integrate with external systems** by sending programmatic commands to a shared simulation backend

➡️ Multiple CLI clients can connect concurrently to a central simulation — ideal for distributed experimentation.

---

## 🚧 Usage

Once installed, the `antares-cli` binary is available globally.

### 📋 Available Commands

| Command       | Description                                      |
|---------------|--------------------------------------------------|
| `add-ship`    | Add a ship with specific motion type             |
| `reset`       | Reset the simulation                             |
| `subscribe`   | Subscribe to simulation event stream             |
| `start`       | Start the Antares binary with optional config    |

### ⚙️ Common Options

| Option        | Description                                     |
|---------------|-------------------------------------------------|
| `--config`    | Path to `.toml` config file                     |
| `--verbose`   | Enable detailed output                          |
| `--json`      | Output results in JSON format (structured logs) |

---

## 💡 Example

```bash
antares-cli add-ship --type line --x 0 --y 0 --angle 0.5 --speed 5.0
````

➡️ This creates a ship moving along a fixed heading at 5 m/s.
You can then subscribe to track updates and log them using:

```bash
antares-cli subscribe
```

---

## 📎 Technical Details

For installation instructions, configuration schema, and developer options, see the [antares-python GitHub repository](https://github.com/jsurrea/antares-python).

