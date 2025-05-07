from collections.abc import AsyncIterator
from typing import Any

from antares.client.rest import RestClient
from antares.client.tcp import TCPSubscriber
from antares.config import AntaresSettings
from antares.models.ship import ShipConfig
from antares.models.track import Track


class AntaresClient:
    def __init__(
        self,
        **kwargs: Any,
    ) -> None:
        """
        Public interface for interacting with the Antares simulation engine.
        Accepts config overrides directly or falls back to environment-based configuration.
        """

        # Only include kwargs that match AntaresSettings fields
        valid_fields = AntaresSettings.model_fields.keys()
        filtered_kwargs = {k: v for k, v in kwargs.items() if k in valid_fields and v is not None}

        # Merge provided arguments with environment/.env via AntaresSettings
        self._settings = AntaresSettings(**filtered_kwargs)

        base_url = f"http://{self._settings.controller_bind_addr}"
        host, tcp_port = self._settings.radar_bind_addr.split(":")
        self._rest = RestClient(
            base_url=base_url,
            timeout=self._settings.timeout,
        )
        self._tcp = TCPSubscriber(
            host=host,
            port=int(tcp_port),
        )

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

    async def subscribe(self) -> AsyncIterator[Track]:
        """
        Subscribes to live simulation data over TCP.

        Yields:
            Parsed simulation event data as Track objects.
        """
        async for event in self._tcp.subscribe():
            yield event
