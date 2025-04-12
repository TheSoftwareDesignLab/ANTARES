//! Simulation module.
//!
//! This module contains the simulation environment, emitters and movement strategies.
//!

mod config;
mod emitters;
mod environment;
mod movement;
mod simulation;

use emitters::Emitter;
use movement::{
    CircleMovement, LineMovement, MovementStrategy, RandomMovement, StationaryMovement,
};

pub use config::SimulationConfig;
pub use environment::Wave;
pub use simulation::Simulation;
