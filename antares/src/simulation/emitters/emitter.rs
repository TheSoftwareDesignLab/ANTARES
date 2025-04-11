use super::Wave;

pub trait Emitter {
    fn emit(&mut self) -> Wave;
}
