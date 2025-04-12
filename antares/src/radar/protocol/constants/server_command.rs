use std::fmt::{Display, Formatter, Result};

/// Commands that the server can send to the client
pub enum ServerCommand {
    CurrVal,
    MsgErr,
    Pong,
    Bye,
    NaazCreated,
    NaazDeleted,
    NtzCreated,
    NtzDeleted,
    AtonCreated,
    AtonDeleted,
    EchoCreated,
    EchoDeleted,
    Track,
    Corr,
}

impl ServerCommand {
    pub fn from_str(command: &str) -> Option<Self> {
        match command.to_ascii_lowercase().as_str() {
            "currval" => Some(ServerCommand::CurrVal),
            "msgerr" => Some(ServerCommand::MsgErr),
            "pong" => Some(ServerCommand::Pong),
            "bye" => Some(ServerCommand::Bye),
            "naazcreated" => Some(ServerCommand::NaazCreated),
            "naazdeleted" => Some(ServerCommand::NaazDeleted),
            "ntzcreated" => Some(ServerCommand::NtzCreated),
            "ntzdeleted" => Some(ServerCommand::NtzDeleted),
            "atoncreated" => Some(ServerCommand::AtonCreated),
            "atondeleted" => Some(ServerCommand::AtonDeleted),
            "echocreated" => Some(ServerCommand::EchoCreated),
            "echodeleted" => Some(ServerCommand::EchoDeleted),
            "track" => Some(ServerCommand::Track),
            "corr" => Some(ServerCommand::Corr),
            _ => None,
        }
    }
}

impl Display for ServerCommand {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        let message = match self {
            ServerCommand::CurrVal => "currval",
            ServerCommand::MsgErr => "msgerr",
            ServerCommand::Pong => "pong",
            ServerCommand::Bye => "bye",
            ServerCommand::NaazCreated => "naazcreated",
            ServerCommand::NaazDeleted => "naazdeleted",
            ServerCommand::NtzCreated => "ntzcreated",
            ServerCommand::NtzDeleted => "ntzdeleted",
            ServerCommand::AtonCreated => "atoncreated",
            ServerCommand::AtonDeleted => "atondeleted",
            ServerCommand::EchoCreated => "echocreated",
            ServerCommand::EchoDeleted => "echodeleted",
            ServerCommand::Track => "track",
            ServerCommand::Corr => "corr",
        };
        write!(f, "{}", message)
    }
}
