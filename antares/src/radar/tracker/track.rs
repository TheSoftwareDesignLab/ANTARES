/// Represents a radar track with relevant information captured by the radar system.
///
/// # Arguments
/// - `id`: Unique track identifier (0 ≤ id ≤ 9999)
/// - `timestamp`: Date and time of detection (year, month, day, hour, minute, second, millisecond)
/// - `stat`: Track status (CA, CS, FA, FS, LA, LS)
/// - `type_`: Type of object (TARGET, ATON)
/// - `name`: Name of the object if `ATON`, empty if `TARGET`
/// - `linemask`: Proprietary service information (0 ≤ linemask ≤ 63)
/// - `size`: Size or plot area of the track
/// - `range`: Slant range of the track in meters relative to the radar
/// - `azimuth`: Track azimuth in radians (0 ≤ azimuth ≤ 6.28319)
/// - `lat`: Latitude of the track in decimal degrees (-90 ≤ lat ≤ 90)
/// - `long`: Longitude of the track in decimal degrees (-180 ≤ long ≤ 180)
/// - `speed`: Speed in m/s
/// - `course`: Direction of the speed vector in radians (0 ≤ course ≤ 6.28319)
/// - `quality`: Track quality (0 ≤ quality ≤ 30)
/// - `l16quality`: STANAG5516 track quality (0 ≤ l16quality ≤ 15)
/// - `lacks`: Track detection gaps or misses
/// - `winrgw`: Track search window range width in meters
/// - `winazw`: Track search window azimuth width in radians
/// - `stderr`: The tracker’s calculated standard error on the filtered track position in meters
#[derive(Debug, Clone)]
pub struct Track {
    pub id: u64,
    pub year: u32,
    pub month: u32,
    pub day: u32,
    pub hour: u32,
    pub minute: u32,
    pub second: u32,
    pub millisecond: u32,
    pub stat: String,
    pub type_: String,
    pub name: String,
    pub linemask: u32,
    pub size: u32,
    pub range: f64,
    pub azimuth: f64,
    pub lat: f64,
    pub long: f64,
    pub speed: f64,
    pub course: f64,
    pub quality: u32,
    pub l16quality: u32,
    pub lacks: u32,
    pub winrgw: u32,
    pub winazw: f64,
    pub stderr: f64,
}

impl Track {
    /// Serializes the Track into a CSV-formatted string.
    pub fn serialize(&self) -> String {
        format!(
            "{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}",
            self.id,
            self.year,
            self.month,
            self.day,
            self.hour,
            self.minute,
            self.second,
            self.millisecond,
            self.stat,
            self.type_,
            self.name.clone(),
            self.linemask,
            self.size,
            self.range,
            self.azimuth,
            self.lat,
            self.long,
            self.speed,
            self.course,
            self.quality,
            self.l16quality,
            self.lacks,
            self.winrgw,
            self.winazw,
            self.stderr
        )
    }
}
