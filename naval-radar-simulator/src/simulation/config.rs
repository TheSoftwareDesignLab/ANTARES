use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct SimulationConfig {
    pub emission_interval: u64,
    pub ships: ShipsConfig,
}

#[derive(Debug, Deserialize)]
pub struct ShipsConfig {
    pub line: Vec<LineMovementConfig>,
    pub circle: Vec<CircleMovementConfig>,
    pub random: Vec<RandomMovementConfig>,
    pub stationary: Vec<StationaryMovementConfig>,
}

#[derive(Debug, Deserialize)]
pub struct LineMovementConfig {
    pub initial_position: (f64, f64),
    pub angle: f64,
    pub speed: f64,
}

#[derive(Debug, Deserialize)]
pub struct CircleMovementConfig {
    pub initial_position: (f64, f64),
    pub radius: f64,
    pub speed: f64,
}

#[derive(Debug, Deserialize)]
pub struct RandomMovementConfig {
    pub initial_position: (f64, f64),
    pub max_speed: f64,
}

#[derive(Debug, Deserialize)]
pub struct StationaryMovementConfig {
    pub initial_position: (f64, f64),
}
