//! Controller module
//!
//! This module contains the Controller struct which is responsible for starting the simulation and radar.
//!

use super::{Config, Radar, Simulation};
use tokio::sync::mpsc;

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

    pub async fn run(self) {
        let (wave_sender, wave_receiver) = mpsc::channel(100);
        let Controller { radar, simulation } = self;

        tokio::spawn(simulation.start(wave_sender));
        tokio::spawn(radar.start(wave_receiver));

        tokio::signal::ctrl_c()
            .await
            .expect("failed to listen for Ctrl+C");
    }
}
