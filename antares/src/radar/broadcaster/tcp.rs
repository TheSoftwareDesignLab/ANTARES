use super::super::Track;
use super::Broadcaster;
use async_trait::async_trait;
use tokio::io::AsyncWriteExt;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::broadcast::{self, Sender};

pub struct TcpBroadcaster {
    bind_addr: String,
    sender: Sender<Track>,
}

impl TcpBroadcaster {
    pub fn new(bind_addr: String) -> Self {
        let (sender, _) = broadcast::channel(100);
        Self { bind_addr, sender }
    }

    async fn handle_client(
        mut stream: TcpStream,
        mut receiver: tokio::sync::broadcast::Receiver<Track>,
    ) {
        while let Ok(track) = receiver.recv().await {
            let csv_line = format!("{}\n", track.serialize());
            if let Err(e) = stream.write_all(csv_line.as_bytes()).await {
                eprintln!("Failed to send data to TCP client: {}", e);
                break;
            }
        }
    }
}

#[async_trait]
impl Broadcaster for TcpBroadcaster {
    async fn start(&self) {
        let listener = TcpListener::bind(&self.bind_addr).await.unwrap();
        let sender = self.sender.clone();

        println!("📡 TCP broadcaster listening on {}", self.bind_addr);

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
