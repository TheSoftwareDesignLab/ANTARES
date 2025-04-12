use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RadarConfig {
    pub detector: DetectorConfig,
    pub protocol: ProtocolConfig,
}

#[derive(Debug, Deserialize)]
pub struct ProtocolConfig {
    pub host: String,
    pub num_workers_tci: usize,
    pub num_workers_tdi: usize,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DetectorConfig {
    pub range: f64,
    pub speed: f64,
    pub angle: f64,
    pub start_coordinates: (f64, f64),
}
