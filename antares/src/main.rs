use antares::{Config, Controller, ShipConfig};
use axum::{extract::State, routing::post, Json, Router};
use clap::Parser;
use std::{fs, net::SocketAddr, process, sync::Arc};

#[derive(Parser)]
#[command(author, version, about)]
struct Args {
    #[arg(long)]
    config: Option<String>,
}

#[tokio::main]
async fn main() {
    let args = Args::parse();

    let config = match args.config {
        Some(path) => {
            let content = fs::read_to_string(path).unwrap_or_else(|err| {
                eprintln!("Problem reading the config file: {err}");
                process::exit(1);
            });

            toml::from_str(&content).unwrap_or_else(|err| {
                eprintln!("Problem parsing the config file: {err}");
                process::exit(1);
            })
        }
        None => Config::default(),
    };

    let controller_bind_addr = config.simulation.controller_bind_addr.clone();
    let controller = Arc::new(Controller::new(config));

    controller.run().await;

    let app = Router::new()
        .route("/simulation/reset", post(reset_simulation))
        .route("/simulation/ships", post(add_ship))
        .with_state(controller);

    let addr: SocketAddr = controller_bind_addr.parse().unwrap();
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    println!("🚢 Controller server running on {addr}");

    tokio::select! {
        result = axum::serve(listener, app.into_make_service()) => {
            if let Err(err) = result {
                eprintln!("Server error: {err}");
            }
        }
        _ = tokio::signal::ctrl_c() => {
            println!("🛑 Received Ctrl+C, shutting down...");
        }
    }
}

async fn reset_simulation(State(controller): State<Arc<Controller>>) {
    controller.reset_simulation();
}

async fn add_ship(State(controller): State<Arc<Controller>>, Json(payload): Json<ShipConfig>) {
    controller.add_ship(payload);
}
