use naval_radar_simulator::{Config, Controller};
use std::{env, fs, process};

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        eprintln!("Usage: naval_radar <config-file>");
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

    let controller = Controller::new(config);
    controller.run();
}
