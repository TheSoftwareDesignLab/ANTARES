use std::fmt::{Display, Formatter, Result};

pub enum ErrorMessage {
    UnknownCommand,
    _IncorrectNumberOfArguments,
    _OutOfRadarScope,
    _TypeMismatch,
    _IllegalValue,
    _InternalError,
    _NotATrack,
    _NaazAlreadyExists,
    _NotANaaz,
    _NtzAlreadyExists,
    _NotANtz,
    _PolygonLimitReached,
    _AtonAlreadyExists,
    _NotAnAton,
    _AtonLimitReached,
    _EchoAlreadyExists,
    _NotAnEcho,
    _EchoLimitReached,
    _UnsupportedProtocolRevision,
}

impl Display for ErrorMessage {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        let message = match self {
            ErrorMessage::UnknownCommand => "Unknown command",
            ErrorMessage::_IncorrectNumberOfArguments => "Incorrect number of arguments",
            ErrorMessage::_OutOfRadarScope => "Out of radar scope",
            ErrorMessage::_TypeMismatch => "Type mismatch",
            ErrorMessage::_IllegalValue => "Illegal value",
            ErrorMessage::_InternalError => "Internal error",
            ErrorMessage::_NotATrack => "Not a track",
            ErrorMessage::_NaazAlreadyExists => "NAAZ already exists",
            ErrorMessage::_NotANaaz => "Not a NAAZ",
            ErrorMessage::_NtzAlreadyExists => "NTZ already exists",
            ErrorMessage::_NotANtz => "Not a NTZ",
            ErrorMessage::_PolygonLimitReached => "Polygon limit reached",
            ErrorMessage::_AtonAlreadyExists => "AtoN already exists",
            ErrorMessage::_NotAnAton => "Not an AtoN",
            ErrorMessage::_AtonLimitReached => "AtoN limit reached",
            ErrorMessage::_EchoAlreadyExists => "Echo already exists",
            ErrorMessage::_NotAnEcho => "Not an Echo",
            ErrorMessage::_EchoLimitReached => "Echo limit reached",
            ErrorMessage::_UnsupportedProtocolRevision => "Unsupported protocol revision",
        };
        write!(f, "{}", message)
    }
}
