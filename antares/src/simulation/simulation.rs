use crate::simulation::emitters::Ship;
use std::time::Duration;

use super::{
    CircleMovement, Emitter, LineMovement, RandomMovement, SimulationConfig, StationaryMovement,
    Wave,
};
use std::sync::mpsc::Sender;
use std::thread;

pub struct Simulation {
    config: SimulationConfig,
}

impl Simulation {
    /// Create a new Simulation.
    pub fn new(config: SimulationConfig) -> Simulation {
        Simulation { config }
    }

    /// Start the simulation.
    pub fn start(&self, wave_sender: Sender<Wave>) {
        let emission_interval = self.config.emission_interval;
        let mut ships = Vec::new();
        let mut ship_id = 0;

        // Create ships with line movement
        for line_ship in &self.config.ships.line {
            let movement_strategy = Box::new(LineMovement::new(line_ship.angle, line_ship.speed));
            ships.push(Ship {
                id: ship_id,
                position: line_ship.initial_position,
                emission_interval,
                movement_strategy,
            });
            ship_id += 1;
        }

        // Create ships with circle movement
        for circle_ship in &self.config.ships.circle {
            let movement_strategy = Box::new(CircleMovement::new(
                circle_ship.radius,
                circle_ship.speed,
                emission_interval,
            ));
            ships.push(Ship {
                id: ship_id,
                position: circle_ship.initial_position,
                emission_interval,
                movement_strategy,
            });
            ship_id += 1;
        }

        // Create ships with random movement
        for random_ship in &self.config.ships.random {
            let movement_strategy = Box::new(RandomMovement::new(random_ship.max_speed));
            ships.push(Ship {
                id: ship_id,
                position: random_ship.initial_position,
                emission_interval,
                movement_strategy,
            });
            ship_id += 1;
        }

        // Create ships with stationary movement
        for stationary_ship in &self.config.ships.stationary {
            let movement_strategy = Box::new(StationaryMovement {});
            ships.push(Ship {
                id: ship_id,
                position: stationary_ship.initial_position,
                emission_interval,
                movement_strategy,
            });
            ship_id += 1;
        }

        thread::spawn(move || loop {
            let mut waves = Vec::with_capacity(ships.len());
            for ship in ships.iter_mut() {
                let wave = ship.emit();
                waves.push(wave);
                ship.update();
            }
            for wave in waves {
                wave_sender.send(wave).expect("Failed to send wave");
            }
            thread::sleep(Duration::from_millis(emission_interval));
        });
    }
}
