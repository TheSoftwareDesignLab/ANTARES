use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RadarConfig {
    pub detector: DetectorConfig,
    pub broadcast: BroadcastConfig,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DetectorConfig {
    pub range: f64,
    pub speed: f64,
    pub angle: f64,
    pub start_coordinates: (f64, f64),
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum BroadcastConfig {
    Tcp { bind_addr: String },
    WebSocket { bind_addr: String },
}
