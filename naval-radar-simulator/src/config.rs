//! # Config module
//!
//! This module contains the configuration struct for the simulation and radar.
//! The configuration is loaded from a TOML file.
//!

use super::{RadarConfig, SimulationConfig};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub simulation: SimulationConfig,
    pub radar: RadarConfig,
}
