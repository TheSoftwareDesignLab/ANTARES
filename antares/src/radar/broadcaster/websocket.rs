use super::super::Track;
use super::Broadcaster;
use async_trait::async_trait;
use futures_util::{SinkExt, StreamExt};
use tokio::net::TcpListener;
use tokio::sync::broadcast::{self, Sender};
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::Message;

pub struct WebSocketBroadcaster {
    bind_addr: String,
    sender: Sender<Track>,
}

impl WebSocketBroadcaster {
    pub fn new(bind_addr: String) -> Self {
        let (sender, _) = broadcast::channel(100);
        Self { bind_addr, sender }
    }

    async fn handle_client(
        stream: tokio::net::TcpStream,
        mut receiver: tokio::sync::broadcast::Receiver<Track>,
    ) {
        if let Ok(ws_stream) = accept_async(stream).await {
            let (mut sink, _) = ws_stream.split();
            while let Ok(track) = receiver.recv().await {
                let csv = format!("{}\n", track.serialize());
                let _ = sink.send(Message::Text(csv.into())).await;
            }
        }
    }
}

#[async_trait]
impl Broadcaster for WebSocketBroadcaster {
    async fn start(&self) {
        let listener = TcpListener::bind(&self.bind_addr).await.unwrap();
        let sender = self.sender.clone();

        println!("📡 WebSocket broadcaster listening on {}", self.bind_addr);

        loop {
            let (stream, _) = listener.accept().await.unwrap();
            let receiver = sender.subscribe();
            tokio::spawn(Self::handle_client(stream, receiver));
        }
    }

    fn sender(&self) -> Sender<Track> {
        self.sender.clone()
    }
}
