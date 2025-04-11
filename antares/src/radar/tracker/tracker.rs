use super::{Plot, Track};
use chrono::{Datelike, Timelike};
use std::collections::HashMap;
use std::sync::mpsc;
use std::thread;

pub struct Tracker;

impl Tracker {
    pub fn start(plot_receiver: mpsc::Receiver<Plot>, track_sender: mpsc::Sender<Track>) {
        thread::spawn(move || {
            let mut last_plot_by_id = HashMap::new();
            loop {
                let plot = plot_receiver.recv().expect("Failed to receive plot");
                let (speed, course) = if let Some(last_plot) = last_plot_by_id.get(&plot.id) {
                    Tracker::calculate_speed_vector(last_plot, &plot)
                } else {
                    (0.0, 0.0)
                };

                let track = Track {
                    id: plot.id,
                    year: plot.timestamp.year() as u32,
                    month: plot.timestamp.month(),
                    day: plot.timestamp.day(),
                    hour: plot.timestamp.hour(),
                    minute: plot.timestamp.minute(),
                    second: plot.timestamp.second(),
                    millisecond: plot.timestamp.timestamp_subsec_millis(),
                    stat: "CA".to_string(),
                    type_: "TARGET".to_string(),
                    name: "".to_string(),
                    linemask: 0,
                    size: 0,
                    range: plot.range,
                    azimuth: plot.azimuth,
                    lat: plot.latitude,
                    long: plot.longitude,
                    speed,
                    course,
                    quality: 0,
                    l16quality: 0,
                    lacks: 0,
                    winrgw: 0,
                    winazw: 0.0,
                    stderr: 0.0,
                };
                track_sender.send(track).unwrap();
                last_plot_by_id.insert(plot.id, plot);
            }
        });
    }

    fn calculate_speed_vector(old_plot: &Plot, new_plot: &Plot) -> (f64, f64) {
        let time_diff = new_plot.timestamp - old_plot.timestamp;
        let delta_x =
            new_plot.range * new_plot.azimuth.cos() - old_plot.range * old_plot.azimuth.cos();
        let delta_y =
            new_plot.range * new_plot.azimuth.sin() - old_plot.range * old_plot.azimuth.sin();
        let speed = (delta_x.powi(2) + delta_y.powi(2)).sqrt() * 1000.0
            / time_diff.num_milliseconds() as f64;
        let course = delta_y.atan2(delta_x);
        (speed, course)
    }
}
