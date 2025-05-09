use std::sync::Arc;
use tokio::sync::{mpsc::Sender, RwLock};

use super::{build_ship_from_config, Emitter, Ship, ShipConfig, SimulationConfig, Wave};

pub struct Simulation {
    ships: Arc<RwLock<Vec<Ship>>>,
    emission_interval: u64,
}

impl Simulation {
    pub fn new(config: SimulationConfig) -> Self {
        let ships = config
            .initial_ships
            .into_iter()
            .enumerate()
            .map(|(i, ship_config)| {
                build_ship_from_config(i as u64, ship_config, config.emission_interval)
            })
            .collect();

        Self {
            ships: Arc::new(RwLock::new(ships)),
            emission_interval: config.emission_interval,
        }
    }

    pub fn reset(&self) {
        let ships = Arc::clone(&self.ships);
        tokio::spawn(async move {
            ships.write().await.clear();
        });
    }

    pub fn add_ship(&self, config: ShipConfig) {
        let ships = Arc::clone(&self.ships);
        let interval = self.emission_interval;

        tokio::spawn(async move {
            let mut ships_guard = ships.write().await;
            let new_id = ships_guard.len() as u64;
            let ship = build_ship_from_config(new_id, config, interval);
            ships_guard.push(ship);
        });
    }

    pub async fn start(&self, wave_sender: Sender<Wave>) {
        let ships = self.ships.clone();
        let interval = tokio::time::Duration::from_millis(self.emission_interval);
        let mut ticker = tokio::time::interval(interval);

        tokio::spawn(async move {
            loop {
                ticker.tick().await;

                let mut ships_guard = ships.write().await;
                let mut waves = Vec::with_capacity(ships_guard.len());

                for ship in ships_guard.iter_mut() {
                    let wave = ship.emit();
                    ship.update();
                    waves.push(wave);
                }

                for wave in waves {
                    if wave_sender.send(wave).await.is_err() {
                        break;
                    }
                }
            }
        });
    }
}
