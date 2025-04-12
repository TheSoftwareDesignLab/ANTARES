use chrono::{DateTime, Utc};

pub struct Plot {
    pub id: u64,
    pub range: f64,
    pub azimuth: f64,
    pub latitude: f64,
    pub longitude: f64,
    pub timestamp: DateTime<Utc>,
}
