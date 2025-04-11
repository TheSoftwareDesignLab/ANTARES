import httpx
import pytest

from antares.client.rest import RestClient
from antares.errors import ConnectionError, SimulationError
from antares.models.ship import ShipConfig


def test_reset_simulation_success(mocker):
    mock_request = httpx.Request("POST", "http://localhost/simulation/reset")
    mock_post = mocker.patch("httpx.post", return_value=httpx.Response(200, request=mock_request))
    client = RestClient(base_url="http://localhost")
    client.reset_simulation()
    mock_post.assert_called_once()


def test_reset_simulation_failure(mocker):
    mocker.patch("httpx.post", side_effect=httpx.ConnectTimeout("timeout"))
    client = RestClient(base_url="http://localhost")
    with pytest.raises(ConnectionError):
        client.reset_simulation()


def test_add_ship_success(mocker):
    mock_request = httpx.Request("POST", "http://localhost/simulation/ships")
    mock_post = mocker.patch("httpx.post", return_value=httpx.Response(200, request=mock_request))
    ship = ShipConfig(initial_position=(0, 0))
    client = RestClient(base_url="http://localhost")
    client.add_ship(ship)
    mock_post.assert_called_once()


def test_add_ship_invalid_response(mocker):
    mock_request = httpx.Request("POST", "http://localhost/simulation/ships")
    mocker.patch(
        "httpx.post",
        return_value=httpx.Response(
            400,
            content=b"bad request",
            request=mock_request,
        ),
    )
    ship = ShipConfig(initial_position=(0, 0))
    client = RestClient(base_url="http://localhost")
    with pytest.raises(SimulationError):
        client.add_ship(ship)
