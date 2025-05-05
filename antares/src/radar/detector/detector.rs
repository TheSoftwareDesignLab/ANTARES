use super::super::DetectorConfig;
use super::{Plot, Wave};
use chrono::{DateTime, Utc};
use tokio::sync::mpsc::{Receiver, Sender};
use tokio::task;

pub struct Detector {
    pub range: f64,
    pub speed: f64,
    pub angle: f64,
    pub start_coordinates: (f64, f64),
    pub start_time: DateTime<Utc>,
}

impl Detector {
    pub fn new(config: DetectorConfig) -> Detector {
        Detector {
            range: config.range,
            speed: config.speed,
            angle: config.angle,
            start_coordinates: config.start_coordinates,
            start_time: chrono::Utc::now(),
        }
    }

    pub fn start(self, mut wave_receiver: Receiver<Wave>, plot_sender: Sender<Plot>) {
        task::spawn(async move {
            while let Some(wave) = wave_receiver.recv().await {
                let (range, azimuth) = self.calculate_range_azimuth(&wave);
                if range > self.range {
                    continue;
                }

                let (latitude, longitude) = self.meters_to_lat_lng(wave.position);
                let plot = Plot {
                    id: wave.id,
                    range,
                    azimuth,
                    timestamp: wave.timestamp,
                    latitude,
                    longitude,
                };
                if plot_sender.send(plot).await.is_err() {
                    eprintln!("Plot sender dropped");
                    break;
                }
            }
        });
    }

    fn calculate_range_azimuth(&self, wave: &Wave) -> (f64, f64) {
        let time_delta = (wave.timestamp - self.start_time).num_milliseconds() as f64 / 1000.0;
        let current_position = (
            self.speed * time_delta * self.angle.cos(),
            self.speed * time_delta * self.angle.sin(),
        );
        let delta_position = (
            wave.position.0 - current_position.0,
            wave.position.1 - current_position.1,
        );
        let range = (delta_position.0.powi(2) + delta_position.1.powi(2)).sqrt();
        let azimuth = delta_position.1.atan2(delta_position.0);
        (range, azimuth)
    }

    fn meters_to_lat_lng(&self, position: (f64, f64)) -> (f64, f64) {
        let (lat, lng) = self.start_coordinates;
        let (dx, dy) = position;
        let new_lat = lat + (dy / 111320.0);
        let new_lng = lng + (dx / (111320.0 * lat.to_radians().cos()));
        (new_lat, new_lng)
    }
}
