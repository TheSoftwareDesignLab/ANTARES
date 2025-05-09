use super::{
    CircleMovement, LineMovement, MovementStrategy, RandomMovement, Ship, StationaryMovement,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SimulationConfig {
    pub emission_interval: u64,
    pub initial_ships: Vec<ShipConfig>,
    pub controller_bind_addr: String,
}

impl Default for SimulationConfig {
    fn default() -> Self {
        SimulationConfig {
            emission_interval: 20,
            initial_ships: Vec::new(),
            controller_bind_addr: "0.0.0.0:17394".into(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShipConfig {
    pub initial_position: (f64, f64),
    #[serde(flatten)]
    pub movement: MovementType,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum MovementType {
    Line { angle: f64, speed: f64 },
    Circle { radius: f64, speed: f64 },
    Random { max_speed: f64 },
    Stationary,
}

pub fn build_ship_from_config(id: u64, config: ShipConfig, emission_interval: u64) -> Ship {
    let movement_strategy: Box<dyn MovementStrategy> = match config.movement {
        MovementType::Line { angle, speed } => Box::new(LineMovement::new(angle, speed)),
        MovementType::Circle { radius, speed } => {
            Box::new(CircleMovement::new(radius, speed, emission_interval))
        }
        MovementType::Random { max_speed } => Box::new(RandomMovement::new(max_speed)),
        MovementType::Stationary => Box::new(StationaryMovement {}),
    };

    Ship {
        id,
        position: config.initial_position,
        emission_interval,
        movement_strategy,
    }
}
