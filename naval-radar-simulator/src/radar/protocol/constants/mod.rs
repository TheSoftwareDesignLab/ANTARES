//! # Constants for the radar protocol.
//!
//! This module contains the constants for the radar protocol. The constants are used to define the
//! different types of commands that can be sent between the client and the server. The constants
//! are defined as enums, with each enum variant representing a different command type.

mod client_command;
mod error_message;
mod interface_ports;
mod server_command;

pub use client_command::ClientCommand;
pub use error_message::ErrorMessage;
pub use interface_ports::{TCI_PORT, TDI_PORT};
pub use server_command::ServerCommand;
