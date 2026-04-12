use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub enum AppError {
    Io(std::io::Error),
    Sqlite(rusqlite::Error),
    InvalidCompletedReason(String),
    MissingExecutableDirectory,
    MissingLocalAppData,
}

impl Display for AppError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(error) => write!(formatter, "I/O error: {error}"),
            Self::Sqlite(error) => write!(formatter, "SQLite error: {error}"),
            Self::InvalidCompletedReason(reason) => {
                write!(formatter, "Unsupported completedReason value: {reason}")
            }
            Self::MissingExecutableDirectory => {
                formatter.write_str("Could not resolve the application executable directory.")
            }
            Self::MissingLocalAppData => {
                formatter.write_str("LOCALAPPDATA is unavailable for desktop storage fallback.")
            }
        }
    }
}

impl std::error::Error for AppError {}

impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        Self::Io(error)
    }
}

impl From<rusqlite::Error> for AppError {
    fn from(error: rusqlite::Error) -> Self {
        Self::Sqlite(error)
    }
}