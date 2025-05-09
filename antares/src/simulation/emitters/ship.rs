use super::{Emitter, MovementStrategy, Wave};

pub struct Ship {
    pub id: u64,
    pub position: (f64, f64),
    pub emission_interval: u64,
    pub movement_strategy: Box<dyn MovementStrategy>,
}

impl Ship {
    pub fn update(&mut self) {
        let (x, y) = self.position;
        let movement_command = self.movement_strategy.next_movement();
        let emission_interval = self.emission_interval as f64;
        let dx = movement_command.speed * movement_command.angle.cos() * emission_interval / 1000.0;
        let dy = movement_command.speed * movement_command.angle.sin() * emission_interval / 1000.0;
        self.position = (x + dx, y + dy);
    }
}

impl Emitter for Ship {
    fn emit(&self) -> Wave {
        Wave {
            id: self.id,
            position: self.position,
            timestamp: chrono::Utc::now(),
        }
    }
}
