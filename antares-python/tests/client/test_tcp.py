from unittest.mock import AsyncMock, MagicMock

import pytest

from antares.client.tcp import TCPSubscriber
from antares.errors import SubscriptionError
from antares.models.track import Track


@pytest.mark.asyncio
async def test_subscribe_success(monkeypatch, sample_track_line):
    # Simulated CSV lines returned from the TCP stream
    encoded_lines = [sample_track_line.encode() + b"\n", b""]

    async def fake_readline():
        return encoded_lines.pop(0)

    # Simulate EOF after all lines are read
    eof_flags = [False, True]

    fake_reader = AsyncMock()
    fake_reader.readline = AsyncMock(side_effect=fake_readline)
    fake_reader.at_eof = MagicMock(side_effect=eof_flags)

    # Patch asyncio.open_connection to return our mocked reader
    monkeypatch.setattr("asyncio.open_connection", AsyncMock(return_value=(fake_reader, None)))

    subscriber = TCPSubscriber("localhost", 1234, reconnect=False)

    events = [event async for event in subscriber.subscribe()]
    expected_lat = -33.45
    assert len(events) == 1
    assert isinstance(events[0], Track)
    assert events[0].name == "Eagle-1"
    assert events[0].lat == expected_lat


@pytest.mark.asyncio
async def test_subscribe_failure(monkeypatch):
    monkeypatch.setattr("asyncio.open_connection", AsyncMock(side_effect=ConnectionRefusedError()))

    subscriber = TCPSubscriber("localhost", 1234, reconnect=False)
    with pytest.raises(SubscriptionError):
        async for _ in subscriber.subscribe():
            pass


@pytest.mark.asyncio
async def test_subscribe_reconnects_on_failure(monkeypatch, sample_track_line):
    class OneMessageReader:
        def __init__(self):
            self.called = False

        def at_eof(self):
            return self.called

        async def readline(self):
            if not self.called:
                self.called = True
                return sample_track_line.encode() + b"\n"
            return b""

    open_calls = []

    async def fake_open_connection(host, port):
        if not open_calls:
            open_calls.append("fail")
            raise ConnectionRefusedError("initial fail")
        return OneMessageReader(), None

    monkeypatch.setattr("asyncio.open_connection", fake_open_connection)
    monkeypatch.setattr("asyncio.sleep", AsyncMock())

    subscriber = TCPSubscriber("localhost", 1234, reconnect=True)

    events = []
    async for event in subscriber.subscribe():
        events.append(event)
        break  # exit after first track

    assert len(events) == 1
    assert isinstance(events[0], Track)
    assert events[0].name == "Eagle-1"


@pytest.mark.asyncio
async def test_subscribe_invalid_field_count(monkeypatch):
    invalid_line = "1,2025,4,11"

    async def fake_readline():
        return invalid_line.encode() + b"\n"

    fake_reader = AsyncMock()
    fake_reader.readline = AsyncMock(side_effect=fake_readline)
    fake_reader.at_eof = MagicMock(side_effect=[False, True])

    monkeypatch.setattr("asyncio.open_connection", AsyncMock(return_value=(fake_reader, None)))

    subscriber = TCPSubscriber("localhost", 1234, reconnect=False)

    with pytest.raises(SubscriptionError) as excinfo:
        async for _ in subscriber.subscribe():
            pass

    assert "Expected 25 fields" in str(excinfo.value)


@pytest.mark.asyncio
async def test_subscribe_invalid_value(monkeypatch, sample_track_line):
    bad_line = sample_track_line.replace("1,", "bad_id,", 1)

    async def fake_readline():
        return bad_line.encode() + b"\n"

    fake_reader = AsyncMock()
    fake_reader.readline = AsyncMock(side_effect=fake_readline)
    fake_reader.at_eof = MagicMock(side_effect=[False, True])

    monkeypatch.setattr("asyncio.open_connection", AsyncMock(return_value=(fake_reader, None)))

    subscriber = TCPSubscriber("localhost", 1234, reconnect=False)

    with pytest.raises(SubscriptionError) as excinfo:
        async for _ in subscriber.subscribe():
            pass

    assert "Invalid value for field 'id'" in str(excinfo.value)


def test_from_csv_field_type_none(monkeypatch):
    class FakeTrack(Track):
        __field_order__ = ["id"]
        id: int

    FakeTrack.model_fields["id"].annotation = None

    with pytest.raises(ValueError) as excinfo:
        FakeTrack.from_csv_row("123")

    assert "has no type annotation" in str(excinfo.value)
