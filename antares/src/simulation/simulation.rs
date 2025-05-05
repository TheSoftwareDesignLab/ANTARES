use crate::simulation::emitters::Ship;
use std::time::Duration;
use tokio::sync::mpsc::Sender;
use tokio::time::interval;

use super::{
    CircleMovement, Emitter, LineMovement, RandomMovement, SimulationConfig, StationaryMovement,
    Wave,
};

pub struct Simulation {
    config: SimulationConfig,
}

impl Simulation {
    /// Create a new Simulation.
    pub fn new(config: SimulationConfig) -> Self {
        Self { config }
    }

    /// Start the simulation (spawns a Tokio task).
    pub async fn start(self, wave_sender: Sender<Wave>) {
        let emission_interval = Duration::from_millis(self.config.emission_interval);
        let ships = Self::build_ships(self.config);

        tokio::spawn(async move {
            let mut ticker = interval(emission_interval);
            let mut ships = ships;

            loop {
                ticker.tick().await;

                let waves: Vec<Wave> = ships
                    .iter_mut()
                    .map(|ship| {
                        let wave = ship.emit();
                        ship.update();
                        wave
                    })
                    .collect();

                for wave in waves {
                    if wave_sender.send(wave).await.is_err() {
                        // Receiver dropped; end simulation task
                        break;
                    }
                }
            }
        });
    }

    fn build_ships(config: SimulationConfig) -> Vec<Ship> {
        let mut ships = Vec::new();
        let mut ship_id = 0;
        let emission_interval = config.emission_interval;

        // Helper closure to push ships
        let mut push_ship = |position, movement_strategy| {
            ships.push(Ship {
                id: ship_id,
                position,
                emission_interval,
                movement_strategy,
            });
            ship_id += 1;
        };

        for s in &config.ships.line {
            push_ship(
                s.initial_position,
                Box::new(LineMovement::new(s.angle, s.speed)),
            );
        }

        for s in &config.ships.circle {
            push_ship(
                s.initial_position,
                Box::new(CircleMovement::new(s.radius, s.speed, emission_interval)),
            );
        }

        for s in &config.ships.random {
            push_ship(
                s.initial_position,
                Box::new(RandomMovement::new(s.max_speed)),
            );
        }

        for s in &config.ships.stationary {
            push_ship(s.initial_position, Box::new(StationaryMovement {}));
        }

        ships
    }
}
