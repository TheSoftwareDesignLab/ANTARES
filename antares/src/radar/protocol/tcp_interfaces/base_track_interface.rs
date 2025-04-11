use super::constants::ClientCommand;
use super::constants::ErrorMessage;
use super::constants::ServerCommand;
use crate::utils::{escape_text, unescape_text, ThreadPool};
use std::io::{prelude::*, BufReader};
use std::net::{TcpListener, TcpStream};
use std::sync::{Arc, Mutex};
use std::thread;

type Clients = Arc<Mutex<Vec<TcpStream>>>;

/// The server struct
/// This struct contains the server configuration and the list of connected clients
pub struct Server {
    pub host: String,
    pub port: u16,
    pub num_workers: usize,
    pub clients: Clients,
}

impl Server {
    /// Create a new server.
    ///
    /// # Arguments
    /// - `host`: The host address to bind the server to
    /// - `port`: The port to bind the server to
    /// - `num_workers`: The number of worker threads to use
    pub fn new(host: String, port: u16, num_workers: usize) -> Self {
        Server {
            host,
            port,
            num_workers,
            clients: Arc::new(Mutex::new(Vec::with_capacity(num_workers))),
        }
    }
}

/// Base interface for the track server
/// This trait defines the basic functionality that a track server should implement
pub trait BaseTrackInterface {
    /// Start the server
    /// This function should bind to the given host and port and listen for incoming connections
    /// For each incoming connection, a new thread should be spawned to handle the client
    fn start(server: &Server) {
        let ip_addr = server.host.to_string() + ":" + &server.port.to_string();
        println!("Initializing server on {}", ip_addr);

        let listener = TcpListener::bind(ip_addr).unwrap();
        let pool = ThreadPool::new(server.num_workers);
        let clients = Arc::clone(&server.clients);

        thread::spawn(move || {
            for stream in listener.incoming() {
                match stream {
                    Ok(mut stream) => {
                        let clients = Arc::clone(&clients);
                        pool.execute(move || {
                            Self::handle_client(&mut stream, clients);
                        });
                    }
                    Err(_) => eprintln!("Failed to accept connection"),
                }
            }
        });
    }

    /// Handle a client connection
    /// This function should read requests from the client and send responses back
    /// The function should continue reading requests until the client sends a "bye" command or disconnects
    fn handle_client(stream: &mut TcpStream, clients: Clients) {
        let peer_addr = stream.peer_addr().unwrap();
        println!("New client connected: {}", peer_addr);

        {
            // Add the client to the list of clients in a thread-safe way
            let mut clients = clients.lock().unwrap();
            clients.push(stream.try_clone().unwrap());
        }

        let reader = BufReader::new(stream.try_clone().unwrap());
        for request in reader.lines() {
            match request {
                Ok(request) => {
                    println!("Received request from client {}: {:?}", peer_addr, request);
                    let operation_index = request.find(',').unwrap_or(request.len());
                    let (operation_str, args) = request.split_at(operation_index);
                    let operation = ClientCommand::from_str(operation_str);
                    let args = args.split(',').map(|s| unescape_text(s.trim())).collect();
                    let result = match operation {
                        None => Err(ErrorMessage::UnknownCommand),
                        Some(ClientCommand::Bye) => break,
                        Some(ClientCommand::Ping) => Ok(Self::ping()),
                        Some(operation) => Self::handle_operation(operation, &args),
                    }
                    .unwrap_or_else(|error_message| {
                        Self::msgerr(error_message, operation_str.to_string(), &args)
                    });
                    if result.len() > 0 {
                        stream.write_all(result.as_bytes()).unwrap();
                    }
                }
                Err(_) => eprintln!("Failed to read request from client"),
            }
        }

        {
            // Remove the client from the list of clients in a thread-safe way
            let mut clients = clients.lock().unwrap();
            clients.retain(|client| client.peer_addr().unwrap() != peer_addr);
            println!("Client {} disconnected", peer_addr);
        }
    }

    /// Handle a client operation
    /// This function should handle the given operation and return the response
    /// If the operation fails, an error message should be returned
    fn handle_operation(
        operation: ClientCommand,
        args: &Vec<String>,
    ) -> Result<String, ErrorMessage>;

    /// Broadcast a message to all clients
    /// This function should send the given message to all clients in the list
    /// The message should be sent as a byte array
    fn broadcast(clients: &Vec<TcpStream>, message: String) {
        for mut client in clients {
            client.write_all(message.as_bytes()).unwrap();
        }
    }

    /// Create a message error response
    /// The response should be in the format "msgerr,<error message>,<original command>"
    /// The error message and original command should be escaped
    fn msgerr(error_message: ErrorMessage, operation: String, args: &Vec<String>) -> String {
        let original_command = operation + &args.join(",");
        format!(
            "{},{},{}",
            ServerCommand::MsgErr,
            escape_text(&error_message.to_string()),
            escape_text(&original_command)
        )
    }

    /// Create a ping command response
    /// The response should be "pong"
    /// The ping command should be ignored
    fn ping() -> String {
        ServerCommand::Pong.to_string()
    }
}
