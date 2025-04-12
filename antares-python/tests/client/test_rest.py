import httpx
import pytest

from antares.client.rest import RestClient
from antares.errors import ConnectionError, ShipConfigError, SimulationError
from antares.models.ship import CircleShip, LineShip, RandomShip


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
    ship = LineShip(initial_position=(0, 0), angle=0, speed=1)
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
    ship = CircleShip(initial_position=(0, 0), radius=1, speed=1)
    client = RestClient(base_url="http://localhost")
    with pytest.raises(ShipConfigError):
        client.add_ship(ship)


def test_reset_simulation_http_error(mocker):
    request = httpx.Request("POST", "http://localhost/simulation/reset")
    response = httpx.Response(500, content=b"internal error", request=request)

    mock_post = mocker.patch("httpx.post", return_value=response)

    # .raise_for_status() triggers HTTPStatusError
    def raise_error():
        raise httpx.HTTPStatusError("error", request=request, response=response)

    response.raise_for_status = raise_error

    client = RestClient(base_url="http://localhost")

    with pytest.raises(SimulationError) as exc:
        client.reset_simulation()

    assert "Reset failed" in str(exc.value)
    mock_post.assert_called_once()


def test_add_ship_request_error(mocker):
    mocker.patch(
        "httpx.post",
        side_effect=httpx.RequestError(
            "connection dropped", request=httpx.Request("POST", "http://localhost/simulation/ships")
        ),
    )

    ship = RandomShip(initial_position=(0, 0), max_speed=1)
    client = RestClient(base_url="http://localhost")

    with pytest.raises(ConnectionError) as exc:
        client.add_ship(ship)

    assert "Could not reach Antares API" in str(exc.value)
