import asyncio
import json
import logging
from collections.abc import AsyncIterator

from antares.errors import SubscriptionError
from antares.models.track import Track

logger = logging.getLogger(__name__)


class TCPSubscriber:
    """
    Manages a TCP connection to the Antares simulation for real-time event streaming.
    """

    def __init__(self, host: str, port: int, reconnect: bool = True) -> None:
        """
        Initializes the TCP subscriber.

        Args:
            host: The hostname or IP of the TCP server.
            port: The port number of the TCP server.
            reconnect: Whether to automatically reconnect on disconnect.
        """
        self.host = host
        self.port = port
        self.reconnect = reconnect

    async def subscribe(self) -> AsyncIterator[Track]:
        """
        Connects to the TCP server and yields simulation events as Track objects.
        This is an infinite async generator until disconnected or cancelled.

        Yields:
            Parsed simulation events as Track objects.
        """
        while True:
            try:
                reader, _ = await asyncio.open_connection(self.host, self.port)
                while not reader.at_eof():
                    line = await reader.readline()
                    if line:
                        track = Track.from_csv_row(line.decode())
                        yield track
            except (
                ConnectionRefusedError,
                asyncio.IncompleteReadError,
                json.JSONDecodeError,
                ValueError,
            ) as e:
                logger.error("TCP stream error: %s", e)
                if not self.reconnect:
                    raise SubscriptionError(f"Failed to read from TCP stream: {e}") from e

            # Stop if not reconnecting
            if not self.reconnect:
                break

            logger.info("Waiting 1 second before retrying TCP connection...")
            await asyncio.sleep(1)
