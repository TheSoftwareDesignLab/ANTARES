use super::{MovementCommand, MovementStrategy};

pub struct StationaryMovement;

impl MovementStrategy for StationaryMovement {
    fn next_movement(&mut self) -> MovementCommand {
        MovementCommand {
            angle: 0.0,
            speed: 0.0,
        }
    }
}
