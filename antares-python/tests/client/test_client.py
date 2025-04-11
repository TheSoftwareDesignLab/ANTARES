import pytest

from antares.client import AntaresClient
from antares.models.ship import ShipConfig


def test_reset_simulation_delegates(mocker):
    mock_reset = mocker.patch("antares.client.rest.RestClient.reset_simulation")
    client = AntaresClient(base_url="http://localhost")
    client.reset_simulation()
    mock_reset.assert_called_once()


def test_add_ship_delegates(mocker):
    mock_add = mocker.patch("antares.client.rest.RestClient.add_ship")
    client = AntaresClient(base_url="http://localhost")
    ship = ShipConfig(initial_position=(1.0, 2.0))
    client.add_ship(ship)
    mock_add.assert_called_once_with(ship)


@pytest.mark.asyncio
async def test_subscribe_delegates(monkeypatch):
    async def fake_subscribe():
        yield {"event": "test"}

    monkeypatch.setattr("antares.client.tcp.TCPSubscriber.subscribe", fake_subscribe)
    client = AntaresClient(base_url="http://localhost")
    result = [event async for event in client.subscribe()]
    assert result == [{"event": "test"}]
