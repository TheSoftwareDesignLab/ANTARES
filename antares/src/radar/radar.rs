use super::broadcaster::{Broadcaster, TcpBroadcaster, WebSocketBroadcaster};
use super::{BroadcastConfig, Detector, RadarConfig, Tracker, Wave};
use std::sync::Arc;
use tokio::sync::mpsc;
use tokio::task;

pub struct Radar {
    config: RadarConfig,
}

impl Radar {
    pub fn new(config: RadarConfig) -> Self {
        Self { config }
    }

    pub async fn start(self, wave_receiver: mpsc::Receiver<Wave>) {
        let (plot_sender, plot_receiver) = mpsc::channel(100);
        let (track_sender, mut track_receiver) = mpsc::channel(100);

        let detector = Detector::new(self.config.detector.clone());
        detector.start(wave_receiver, plot_sender);
        Tracker::start(plot_receiver, track_sender);

        let broadcaster: Arc<dyn Broadcaster> = match &self.config.broadcast {
            BroadcastConfig::Tcp { bind_addr } => Arc::new(TcpBroadcaster::new(bind_addr.clone())),
            BroadcastConfig::WebSocket { bind_addr } => {
                Arc::new(WebSocketBroadcaster::new(bind_addr.clone()))
            }
        };

        let broadcaster_clone = broadcaster.clone();
        tokio::spawn(async move {
            broadcaster_clone.start().await;
        });

        let sender = broadcaster.sender();
        task::spawn(async move {
            while let Some(track) = track_receiver.recv().await {
                let _ = sender.send(track);
            }
        });
    }
}
