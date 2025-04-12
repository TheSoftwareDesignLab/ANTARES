use std::sync::{mpsc, Arc, Mutex};
use std::thread;

/// A thread pool.
///
/// The `ThreadPool` struct creates a number of threads and maintains a queue of jobs to be executed.
pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;

impl ThreadPool {
    /// Create a new ThreadPool.
    ///
    /// The size is the number of threads in the pool.
    ///
    /// # Panics
    ///
    /// The `new` function will panic if the size is zero.
    pub fn new(size: usize) -> ThreadPool {
        assert!(size > 0, "ThreadPool size must be greater than zero.");

        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        let mut workers = Vec::with_capacity(size);

        for _ in 0..size {
            workers.push(Worker::new(Arc::clone(&receiver)));
        }

        ThreadPool {
            workers,
            sender: Some(sender),
        }
    }

    /// Execute a function on the thread pool.
    ///
    /// The function must be `FnOnce`, `Send` and `'static`.
    pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.as_ref().unwrap().send(job).unwrap();
    }
}

impl Drop for ThreadPool {
    /// Drop all threads in the ThreadPool.
    ///
    /// This method will wait for all threads to finish their work before returning.
    fn drop(&mut self) {
        drop(self.sender.take());

        for worker in &mut self.workers {
            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
        }
    }
}

/// A worker in the thread pool.
///
/// The `Worker` struct is responsible for executing jobs on the thread pool.
struct Worker {
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    /// Create a new Worker.
    ///
    /// The `new` function creates a new worker that will execute jobs from the receiver.
    /// `receiver` is a `mpsc::Receiver<Job>` that contains the jobs to be executed.
    ///
    /// The worker will continue to execute jobs until the receiver is closed.
    fn new(receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => job(),
                Err(_) => break,
            }
        });

        Worker {
            thread: Some(thread),
        }
    }
}
