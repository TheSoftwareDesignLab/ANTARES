use super::super::Track;
use async_trait::async_trait;
use tokio::sync::broadcast::Sender;

/// A trait representing a broadcast interface that sends track data to clients.
#[async_trait]
pub trait Broadcaster: Send + Sync {
    async fn start(&self);
    fn sender(&self) -> Sender<Track>;
}
