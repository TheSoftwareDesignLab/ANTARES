/// Represents an electromagnetic (radio) wave in the simulation
/// For now, it only carries the information that the radar uses to detect objects
/// In the future, it could be used to simulate the wave propagation and reflection
use chrono::{DateTime, Utc};

#[derive(Debug)]
pub struct Wave {
    pub id: u64,
    pub position: (f64, f64),
    pub timestamp: DateTime<Utc>,
}
