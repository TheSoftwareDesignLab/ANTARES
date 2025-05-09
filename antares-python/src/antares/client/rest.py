import httpx

from antares.errors import ConnectionError, ShipConfigError, SimulationError
from antares.models.ship import ShipConfig


class RestClient:
    """
    Internal client for interacting with the Antares simulation REST API.
    """

    def __init__(self, base_url: str, timeout: float = 5.0) -> None:
        """
        Initializes the REST client.

        Args:
            base_url: The root URL of the Antares HTTP API.
            timeout: Timeout in seconds for each request.
            auth_token: Optional bearer token for authentication.
        """
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def reset_simulation(self) -> None:
        """
        Sends a request to reset the current simulation state.
        """
        try:
            response = httpx.post(
                f"{self.base_url}/simulation/reset",
                timeout=self.timeout,
            )
            response.raise_for_status()
        except httpx.RequestError as e:
            raise ConnectionError(f"Could not reach Antares API: {e}") from e
        except httpx.HTTPStatusError as e:
            raise SimulationError(f"Reset failed: {e.response.text}") from e

    def add_ship(self, ship: ShipConfig) -> None:
        """
        Sends a ship configuration to the simulation engine.

        Args:
            ship: A validated ShipConfig instance.
        """
        try:
            response = httpx.post(
                f"{self.base_url}/simulation/ships",
                json=ship.model_dump(),
                timeout=self.timeout,
            )
            response.raise_for_status()
        except httpx.RequestError as e:
            raise ConnectionError(f"Could not reach Antares API: {e}") from e
        except httpx.HTTPStatusError as e:
            raise ShipConfigError(f"Add ship failed: {e.response.text}") from e
