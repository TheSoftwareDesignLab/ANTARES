from collections.abc import AsyncIterator

from antares.client.rest import RestClient
from antares.client.tcp import TCPSubscriber
from antares.config import AntaresSettings
from antares.models.ship import ShipConfig


class AntaresClient:
    def __init__(
        self,
        base_url: str | None = None,
        tcp_host: str | None = None,
        tcp_port: int | None = None,
        timeout: float | None = None,
        auth_token: str | None = None,
    ) -> None:
        """
        Public interface for interacting with the Antares simulation engine.
        Accepts config overrides directly or falls back to environment-based configuration.
        """

        overrides = {
            "base_url": base_url,
            "tcp_host": tcp_host,
            "tcp_port": tcp_port,
            "timeout": timeout,
            "auth_token": auth_token,
        }
        clean_overrides = {k: v for k, v in overrides.items() if v is not None}

        # Merge provided arguments with environment/.env via AntaresSettings
        self._settings = AntaresSettings(**clean_overrides)

        self._rest = RestClient(
            base_url=self._settings.base_url,
            timeout=self._settings.timeout,
            auth_token=self._settings.auth_token,
        )
        self._tcp = TCPSubscriber(host=self._settings.tcp_host, port=self._settings.tcp_port)

    def reset_simulation(self) -> None:
        """
        Sends a request to reset the current simulation state.
        """
        return self._rest.reset_simulation()

    def add_ship(self, ship: ShipConfig) -> None:
        """
        Sends a new ship configuration to the simulation engine.
        """
        return self._rest.add_ship(ship)

    async def subscribe(self) -> AsyncIterator[dict]:
        """
        Subscribes to live simulation data over TCP.

        Yields:
            Parsed simulation event data as dictionaries.
        """
        async for event in self._tcp.subscribe():
            yield event
