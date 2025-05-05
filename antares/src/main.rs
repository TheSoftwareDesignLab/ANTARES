use antares::ShipConfig;
use antares::{Config, Controller};
use axum::{extract::State, routing::post, Json, Router};
use std::{env, fs, net::SocketAddr, process, sync::Arc};
use tokio::task;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        eprintln!("Usage: antares <config-file>");
        process::exit(1);
    }

    let config_content = fs::read_to_string(&args[1]).unwrap_or_else(|err| {
        eprintln!("Problem reading the config file: {err}");
        process::exit(1);
    });

    let config: Config = toml::from_str(&config_content).unwrap_or_else(|err| {
        eprintln!("Problem parsing the config file: {err}");
        process::exit(1);
    });

    let controller_bind_addr = config.simulation.controller_bind_addr.clone();
    let controller = Arc::new(Controller::new(config));

    let controller_clone = Arc::clone(&controller);
    task::spawn(async move {
        controller_clone.run().await;
    });

    let app = Router::new()
        .route("/simulation/reset", post(reset_simulation))
        .route("/simulation/ships", post(add_ship))
        .with_state(controller);

    let addr: SocketAddr = controller_bind_addr.parse().unwrap();
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    println!("🚢 Controller server running on {addr}");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

async fn reset_simulation(State(controller): State<Arc<Controller>>) {
    controller.reset_simulation();
}

async fn add_ship(State(controller): State<Arc<Controller>>, Json(payload): Json<ShipConfig>) {
    controller.add_ship(payload);
}
