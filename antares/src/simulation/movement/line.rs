use super::{MovementCommand, MovementStrategy};

pub struct LineMovement {
    angle: f64,
    speed: f64,
}

impl LineMovement {
    pub fn new(angle: f64, speed: f64) -> Self {
        LineMovement { angle, speed }
    }
}

impl MovementStrategy for LineMovement {
    fn next_movement(&mut self) -> MovementCommand {
        MovementCommand {
            angle: self.angle,
            speed: self.speed,
        }
    }
}
