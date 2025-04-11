from unittest.mock import AsyncMock, MagicMock

import pytest

from antares.client.tcp import TCPSubscriber
from antares.errors import SubscriptionError


@pytest.mark.asyncio
async def test_subscribe_success(monkeypatch):
    # Simulated lines returned from the TCP stream
    lines = [b'{"event": "ok"}\n', b'{"event": "done"}\n', b""]

    async def fake_readline():
        return lines.pop(0)

    # Simulate EOF after all lines are read
    eof_flags = [False, False, True]

    fake_reader = AsyncMock()
    fake_reader.readline = AsyncMock(side_effect=fake_readline)
    fake_reader.at_eof = MagicMock(side_effect=eof_flags)

    # Patch asyncio.open_connection to return our mocked reader
    monkeypatch.setattr("asyncio.open_connection", AsyncMock(return_value=(fake_reader, None)))

    subscriber = TCPSubscriber("localhost", 1234, reconnect=False)

    events = [event async for event in subscriber.subscribe()]
    assert events == [{"event": "ok"}, {"event": "done"}]


@pytest.mark.asyncio
async def test_subscribe_failure(monkeypatch):
    monkeypatch.setattr("asyncio.open_connection", AsyncMock(side_effect=ConnectionRefusedError()))

    subscriber = TCPSubscriber("localhost", 1234, reconnect=False)
    with pytest.raises(SubscriptionError):
        async for _ in subscriber.subscribe():
            pass
