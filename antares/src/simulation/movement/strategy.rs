/// # Movement Command
/// A movement command is a struct that contains the angle and speed of a movement.
///
/// # Parameters
/// - `angle`: The angle of the movement in radians.
/// - `speed`: The speed of the movement in m/s.
pub struct MovementCommand {
    pub angle: f64,
    pub speed: f64,
}

pub trait MovementStrategy: Send + Sync {
    fn next_movement(&mut self) -> MovementCommand;
}
