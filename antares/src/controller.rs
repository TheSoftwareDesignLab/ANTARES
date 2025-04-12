//! Controller module
//!
//! This module contains the Controller struct which is responsible for starting the simulation and radar.
//!

use super::{Config, Radar, Simulation};
use std::sync::mpsc::channel;

pub struct Controller {
    radar: Radar,
    simulation: Simulation,
}

impl Controller {
    pub fn new(config: Config) -> Controller {
        Controller {
            radar: Radar::new(config.radar),
            simulation: Simulation::new(config.simulation),
        }
    }

    pub fn run(self) {
        let (wave_sender, wave_receiver) = channel();
        self.simulation.start(wave_sender);
        self.radar.start(wave_receiver);
        loop {}
    }
}
