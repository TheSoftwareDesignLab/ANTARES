use super::{Detector, RadarConfig, TrackControlInterface, TrackDataInterface, Tracker, Wave};
use std::sync::mpsc;
use std::thread;

pub struct Radar {
    config: RadarConfig,
}

impl Radar {
    pub fn new(config: RadarConfig) -> Radar {
        Radar { config }
    }

    pub fn start(&self, wave_receiver: mpsc::Receiver<Wave>) {
        let (plot_sender, plot_receiver) = mpsc::channel();
        let (track_sender, track_receiver) = mpsc::channel();

        let detector = Detector::new(self.config.detector.clone());
        detector.start(wave_receiver, plot_sender);
        Tracker::start(plot_receiver, track_sender);
        TrackControlInterface::new(
            self.config.protocol.host.clone(),
            self.config.protocol.num_workers_tci,
        );
        let tdi = TrackDataInterface::new(
            self.config.protocol.host.clone(),
            self.config.protocol.num_workers_tdi,
        );

        thread::spawn(move || {
            while let Ok(track) = track_receiver.recv() {
                tdi.broadcast(track);
            }
        });
    }
}
