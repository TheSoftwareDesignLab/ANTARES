class AntaresError(Exception):
    """Base exception for all errors raised by antares-python."""


class ConnectionError(AntaresError):
    """Raised when unable to connect to the Antares backend."""


class SimulationError(AntaresError):
    """Raised when simulation commands (reset/add_ship) fail."""


class SubscriptionError(AntaresError):
    """Raised when subscription to TCP stream fails."""


class ShipConfigError(AntaresError):
    """Raised when provided ship configuration is invalid or rejected."""
