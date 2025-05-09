use super::Wave;

pub trait Emitter {
    fn emit(&self) -> Wave;
}
