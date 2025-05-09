//! # Radar module
//!
//! This module contains the radar detector, tracker and communication protocol.
//!

mod broadcaster;
mod config;
mod detector;
mod radar;
mod tracker;

use super::Wave;
use config::{BroadcastConfig, DetectorConfig};
use detector::{Detector, Plot};
use tracker::{Track, Tracker};

pub use config::RadarConfig;
pub use radar::Radar;
