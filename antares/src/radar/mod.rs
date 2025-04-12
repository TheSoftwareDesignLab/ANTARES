//! # Radar module
//!
//! This module contains the radar detector, tracker and communication protocol.
//!

mod config;
mod detector;
mod protocol;
mod radar;
mod tracker;

use super::Wave;
use detector::{Detector, Plot};
use protocol::{TrackControlInterface, TrackDataInterface};
use tracker::{Track, Tracker};

pub use config::RadarConfig;
pub use radar::Radar;
