//! This module contains the interfaces for the TCP communication with the radar.
//! The interfaces define the basic functionality that a track server should implement.

mod base_track_interface;
mod track_control_interface;
mod track_data_interface;

use super::{constants, Track};
use base_track_interface::{BaseTrackInterface, Server};

pub use track_control_interface::TrackControlInterface;
pub use track_data_interface::TrackDataInterface;
