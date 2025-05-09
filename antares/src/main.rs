use antares::{Config, Controller, ShipConfig};
use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use clap::Parser;
use std::{fs, net::SocketAddr, process, sync::Arc};
use tower_http::cors::{Any, CorsLayer};

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

    let controller_config = config.clone();
    let controller = Arc::new(Controller::new(controller_config));

    controller.run().await;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/simulation/config", get(get_config))
        .route("/simulation/reset", post(reset_simulation))
        .route("/simulation/ships", post(add_ship))
        .layer(cors)
        .with_state(controller);

    let addr: SocketAddr = config
        .antares
        .simulation
        .controller_bind_addr
        .parse()
        .unwrap();
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

#[axum::debug_handler]
async fn get_config(State(controller): State<Arc<Controller>>) -> Json<Config> {
    Json(controller.get_config())
}

async fn reset_simulation(State(controller): State<Arc<Controller>>) {
    controller.reset_simulation();
}

async fn add_ship(State(controller): State<Arc<Controller>>, Json(payload): Json<ShipConfig>) {
    controller.add_ship(payload);
}
