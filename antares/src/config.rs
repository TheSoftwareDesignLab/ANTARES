//! # Config module
//!
//! This module contains the configuration struct for the simulation and radar.
//! The configuration is loaded from a TOML file.
//!

use super::{RadarConfig, SimulationConfig};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Config {
    pub antares: AntaresConfig,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct AntaresConfig {
    pub simulation: SimulationConfig,
    pub radar: RadarConfig,
}
