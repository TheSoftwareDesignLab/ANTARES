//! # Radar Simulation Library
//!
//! `radar-simulation` is a library for simulating radar data.
//!

mod config;
mod controller;
mod radar;
mod simulation;
mod utils;

use radar::{Radar, RadarConfig};
use simulation::{Simulation, SimulationConfig, Wave};

pub use config::Config;
pub use controller::Controller;
