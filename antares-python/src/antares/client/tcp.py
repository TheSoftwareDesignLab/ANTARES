import asyncio
import json
from collections.abc import AsyncIterator

from antares.errors import SubscriptionError


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

    async def subscribe(self) -> AsyncIterator[dict]:
        """
        Connects to the TCP server and yields simulation events as parsed dictionaries.
        This is an infinite async generator until disconnected or cancelled.

        Yields:
            Parsed simulation events.
        """
        while True:
            try:
                reader, _ = await asyncio.open_connection(self.host, self.port)
                while not reader.at_eof():
                    line = await reader.readline()
                    if line:
                        yield json.loads(line.decode())
            except (
                ConnectionRefusedError,
                asyncio.IncompleteReadError,
                json.JSONDecodeError,
            ) as e:
                raise SubscriptionError(f"Failed to read from TCP stream: {e}") from e

            if not self.reconnect:
                break

            # Wait before attempting to reconnect
            await asyncio.sleep(1)
