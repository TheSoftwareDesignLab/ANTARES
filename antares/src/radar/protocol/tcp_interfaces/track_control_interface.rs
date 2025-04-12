use super::constants::{ClientCommand, ErrorMessage, TCI_PORT};
use super::{BaseTrackInterface, Server};

/// The track control interface
pub struct TrackControlInterface;

impl TrackControlInterface {
    /// Create and runs a new track control interface
    ///
    /// # Arguments
    /// - `host`: The host address to bind the server to
    /// - `num_workers`: The number of worker threads to use
    pub fn new(host: String, num_workers: usize) -> Self {
        let server = Server::new(host, TCI_PORT, num_workers);
        <Self as BaseTrackInterface>::start(&server);
        TrackControlInterface {}
    }
}

impl BaseTrackInterface for TrackControlInterface {
    fn handle_operation(
        operation: ClientCommand,
        _args: &Vec<String>,
    ) -> Result<String, ErrorMessage> {
        match operation {
            ClientCommand::Get => todo!(),
            ClientCommand::Set => todo!(),
            ClientCommand::TrackCreate => todo!(),
            ClientCommand::TrackDelete => todo!(),
            ClientCommand::TrackSwap => todo!(),
            ClientCommand::TrackSelect => todo!(),
            ClientCommand::TrackMove => todo!(),
            ClientCommand::NaazCreate => todo!(),
            ClientCommand::NaazDelete => todo!(),
            ClientCommand::NtzCreate => todo!(),
            ClientCommand::NtzDelete => todo!(),
            ClientCommand::AtonCreate => todo!(),
            ClientCommand::AtonDelete => todo!(),
            ClientCommand::EchoCreate => todo!(),
            ClientCommand::EchoDelete => todo!(),
            // The following commands are already handled in the base interface
            ClientCommand::Ping => panic!("Ping should be handled in the base interface"),
            ClientCommand::Bye => panic!("Bye should be handled in the base interface"),
        }
    }
}
