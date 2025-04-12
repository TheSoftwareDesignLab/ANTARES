use std::fmt::{Display, Formatter, Result};

/// Commands that the client can send to the server
pub enum ClientCommand {
    Get,
    Ping,
    Bye,
    Set,
    TrackCreate,
    TrackDelete,
    TrackSwap,
    TrackSelect,
    TrackMove,
    NaazCreate,
    NaazDelete,
    NtzCreate,
    NtzDelete,
    AtonCreate,
    AtonDelete,
    EchoCreate,
    EchoDelete,
}

impl ClientCommand {
    pub fn from_str(command: &str) -> Option<Self> {
        match command.trim().to_ascii_lowercase().as_str() {
            "get" => Some(ClientCommand::Get),
            "ping" => Some(ClientCommand::Ping),
            "bye" => Some(ClientCommand::Bye),
            "set" => Some(ClientCommand::Set),
            "trackcreate" => Some(ClientCommand::TrackCreate),
            "trackdelete" => Some(ClientCommand::TrackDelete),
            "trackswap" => Some(ClientCommand::TrackSwap),
            "trackselect" => Some(ClientCommand::TrackSelect),
            "trackmove" => Some(ClientCommand::TrackMove),
            "naazcreate" => Some(ClientCommand::NaazCreate),
            "naazdelete" => Some(ClientCommand::NaazDelete),
            "ntzcreate" => Some(ClientCommand::NtzCreate),
            "ntzdelete" => Some(ClientCommand::NtzDelete),
            "atoncreate" => Some(ClientCommand::AtonCreate),
            "atondelete" => Some(ClientCommand::AtonDelete),
            "echocreate" => Some(ClientCommand::EchoCreate),
            "echodelete" => Some(ClientCommand::EchoDelete),
            _ => None,
        }
    }
}

impl Display for ClientCommand {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        let message = match self {
            ClientCommand::Get => "get",
            ClientCommand::Ping => "ping",
            ClientCommand::Bye => "bye",
            ClientCommand::Set => "set",
            ClientCommand::TrackCreate => "trackcreate",
            ClientCommand::TrackDelete => "trackdelete",
            ClientCommand::TrackSwap => "trackswap",
            ClientCommand::TrackSelect => "trackselect",
            ClientCommand::TrackMove => "trackmove",
            ClientCommand::NaazCreate => "naazcreate",
            ClientCommand::NaazDelete => "naazdelete",
            ClientCommand::NtzCreate => "ntzcreate",
            ClientCommand::NtzDelete => "ntzdelete",
            ClientCommand::AtonCreate => "atoncreate",
            ClientCommand::AtonDelete => "atondelete",
            ClientCommand::EchoCreate => "echocreate",
            ClientCommand::EchoDelete => "echodelete",
        };
        write!(f, "{}", message)
    }
}
