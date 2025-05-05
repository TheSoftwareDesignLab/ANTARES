//! Controller module
//!
//! This module contains the Controller struct which is responsible for starting the simulation and radar.
//!

use super::{Config, Radar, ShipConfig, Simulation};
use std::sync::Arc;
use tokio::sync::mpsc;

pub struct Controller {
    radar: Arc<Radar>,
    simulation: Arc<Simulation>,
}

impl Controller {
    pub fn new(config: Config) -> Controller {
        Controller {
            radar: Arc::new(Radar::new(config.radar)),
            simulation: Arc::new(Simulation::new(config.simulation)),
        }
    }

    pub async fn run(&self) {
        let (wave_sender, wave_receiver) = mpsc::channel(100);

        let simulation = Arc::clone(&self.simulation);
        let radar = Arc::clone(&self.radar);

        tokio::spawn(async move {
            simulation.start(wave_sender).await;
        });

        tokio::spawn(async move {
            radar.start(wave_receiver).await;
        });

        tokio::signal::ctrl_c()
            .await
            .expect("failed to listen for Ctrl+C");
    }

    pub fn reset_simulation(&self) {
        self.simulation.reset();
    }

    pub fn add_ship(&self, ship_data: ShipConfig) {
        self.simulation.add_ship(ship_data);
    }
}
