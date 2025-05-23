---
layout: page
toc: true
---

# ⚓ ANTARES
## A Modern, Open-Source Platform for Simulating Naval Radar Operations

**ANTARES** is a modular, real-time radar simulator developed for training, validation, and research in naval environments. It seamlessly integrates with modern systems, while remaining intuitive, secure, and extensible.  

## 🎯 Mission

**Prepare. Validate. Evolve.**

ANTARES is designed to serve **military training programs**, **system integrators**, and **research teams** by simulating realistic naval radar operations in software. It empowers decision-making and systems engineering *before touching real hardware*.

## 🔍 What is ANTARES?

**ANTARES** is an open-source project developed by **The Software Design Lab** at **Universidad de los Andes**, in collaboration with the **Colombian Navy**.

> This work is presented in the paper: 
**“ANTARES: A Software-Based Tool for Simulating Naval Radar Operations”**  
_International Conference on Military Technologies 2025_  
Brno, Czechia  
{: .prompt-info }

ANTARES is the result of applied research that bridges **simulation**, **military systems**, and **software engineering**. It provides a full-stack radar simulation platform with strong integration capabilities, a responsive web interface, and real-time performance.

## 🚀 Key Features

### ✅ Real-Time Radar Simulation
- Sub-10ms latency for live detection, tracking, and broadcasting
- Suitable for interactive training and tactical analysis

### 🧩 Modular & Extensible Architecture
- Easily extend with new movement strategies, emitters, or detection logic
- Open-closed design for plug-and-play module development

### 🌐 Web-Based Visualization
- Intuitive user interface built with modern web technologies
- Deployable in standalone or networked environments

### 🔐 Secure Communication
- Uses TCP and WebSocket protocols for flexible integration
- Can interoperate with external C4I and Combat Management Systems

### 🦀 Powered by Rust
- High performance, type safety, and memory safety
- Designed for concurrency and stability in long-running systems

## 🧪 Field-Validated

ANTARES has been tested with **12 officers and enlisted personnel** from the **Colombian Navy** during early-stage validation trials.  
Feedback confirmed its:

- Practical use in training environments  
- Relevance for system interoperability testing  
- Ease of deployment and control

> Simulation enables cost-effective training and system validation *before real-world deployment*.  
{: .prompt-tip }

## 📁 Project Structure

The platform is composed of multiple sub-projects, each with a focused role:

### 🧠 [`antares-simulator`](antares-simulator/)
High-performance simulation engine written in **Rust**. Simulates ship motion, wave interaction, radar detection, and signal broadcasting  

### 🌐 [`antares-web`](antares-web/)
Interactive web interface for configuring simulations, tracking targets, and visualizing radar output in real time  

### 🧪 [`antares-python`](antares-python/)
Python SDK for scripting simulation workflows and integrating with external platforms or AI agents  

### 💻 [`antares-cli`](antares-cli/)
Terminal interface for automation, testing, and headless execution of ANTARES simulations  

> All components are released under the MIT License and designed to work independently or as an integrated system.
{: .prompt-info }

## 🌍 Impact

ANTARES brings the power of simulation to modern naval operations by:

- **Reducing training costs** through virtual environments
- **Accelerating system validation** for C4I and radar components
- **Improving readiness** with repeatable and measurable scenarios
- **Democratizing access** to radar simulation technologies through open source

## 📬 Contact

**Project Authors:**  
- **Juan Sebastian Urrea-Lopez** (Universidad de los Andes) <js.urrea@uniandes.edu.co>
- **Camilo Barreto-Reyes** (Universidad de los Andes / Colombian Navy) <c.barretor@uniandes.edu.co>
- **Mario Linares-Vásquez** (Universidad de los Andes) <m.linaresv@uniandes.edu.co>

*Developed through a collaboration between:*  
🔹 **The Software Design Lab** at Universidad de los Andes  
🔹 **Armada de la República de Colombia**  

## 🔗 Links

- 🔗 [GitHub Repository](https://github.com/thesoftwaredesignlab/ANTARES)
- 🔗 [Conference Info](https://icmt2025.cz)
