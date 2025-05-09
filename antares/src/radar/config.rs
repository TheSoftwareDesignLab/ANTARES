use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RadarConfig {
    pub detector: DetectorConfig,
    pub broadcast: BroadcastConfig,
    pub bind_addr: String,
}

impl Default for RadarConfig {
    fn default() -> Self {
        RadarConfig {
            detector: DetectorConfig::default(),
            broadcast: BroadcastConfig::default(),
            bind_addr: "0.0.0.0:17396".into(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DetectorConfig {
    pub range: f64,
    pub speed: f64,
    pub angle: f64,
    pub start_coordinates: (f64, f64),
}

impl Default for DetectorConfig {
    fn default() -> Self {
        DetectorConfig {
            range: 1000.0,
            speed: 0.0,
            angle: 0.0,
            start_coordinates: (4.0, -72.0),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum BroadcastConfig {
    Tcp,
    WebSocket,
}

impl Default for BroadcastConfig {
    fn default() -> Self {
        BroadcastConfig::Tcp
    }
}
