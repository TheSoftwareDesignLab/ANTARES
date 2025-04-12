use super::{MovementCommand, MovementStrategy};
use std::f64::consts::PI;

pub struct CircleMovement {
    speed: f64,
    radius: f64,
    time_delta: u64,
    current_angle: f64,
}

impl CircleMovement {
    pub fn new(radius: f64, speed: f64, time_delta: u64) -> Self {
        CircleMovement {
            speed,
            radius,
            time_delta,
            current_angle: 0.0,
        }
    }
}

impl MovementStrategy for CircleMovement {
    fn next_movement(&mut self) -> MovementCommand {
        let time_step = self.time_delta as f64 / 1000.0;
        let distance = self.speed * time_step;
        let angle_step = distance / self.radius;
        self.current_angle = (self.current_angle + angle_step) % (2.0 * PI);

        MovementCommand {
            angle: self.current_angle,
            speed: self.speed,
        }
    }
}
