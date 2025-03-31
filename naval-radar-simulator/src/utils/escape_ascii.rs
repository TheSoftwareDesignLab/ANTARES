/// Escape special characters in TCP communication text.
///
/// # Examples
/// ```
/// let s = "Hello, world!";
/// let escaped = escape_text(s);
/// assert_eq!(escaped, "hello\\2c world!");
/// ```
pub fn escape_text(s: &str) -> String {
    s.to_ascii_lowercase()
        .chars()
        .map(|c| match c {
            ',' => "\\2c".to_string(),
            '\\' => "\\5c".to_string(),
            c if c as u8 <= 31 || c as u8 >= 128 => format!("\\{:02x}", c as u8),
            _ => c.to_string(),
        })
        .collect()
}

/// Unescape special characters in TCP communication text.
///
/// # Examples
/// ```
/// let s = "hello\\2c world!";
/// let unescaped = unescape_text(s);
/// assert_eq!(unescaped, "hello, world!");
/// ```
pub fn unescape_text(s: &str) -> String {
    let mut result = String::new();
    let mut chars = s.chars();
    while let Some(c) = chars.next() {
        if c == '\\' {
            let hex = chars.next().unwrap();
            let hex = hex.to_string() + &chars.next().unwrap().to_string();
            let c = u8::from_str_radix(&hex, 16).unwrap_or(b' ') as char;
            result.push(c as char);
        } else {
            result.push(c);
        }
    }
    result.to_ascii_lowercase()
}
