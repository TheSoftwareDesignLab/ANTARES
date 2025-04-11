use super::{MovementCommand, MovementStrategy};
use rand::Rng;
use std::f64::consts::PI;

pub struct RandomMovement {
    max_speed: f64,
}

impl RandomMovement {
    pub fn new(max_speed: f64) -> RandomMovement {
        RandomMovement { max_speed }
    }
}

impl MovementStrategy for RandomMovement {
    fn next_movement(&mut self) -> MovementCommand {
        let mut rng = rand::thread_rng();
        let angle = rng.gen_range(0.0..(2.0 * PI));
        let speed = rng.gen_range(0.0..self.max_speed);
        MovementCommand { angle, speed }
    }
}
