//! # Utility module
//!
//! This module contains utility functions and structures that are used throughout the project.
//!

mod thread_pool;
pub use thread_pool::ThreadPool;
mod escape_ascii;
pub use escape_ascii::{escape_text, unescape_text};
