import asyncio

import pytest
from typer.testing import CliRunner

from antares.cli import app
from antares.errors import ConnectionError, SimulationError, SubscriptionError

runner = CliRunner()


@pytest.fixture
def fake_config(tmp_path):
    config_file = tmp_path / "config.toml"
    config_file.write_text("""
[antares]
base_url = "http://test.local"
tcp_host = "127.0.0.1"
tcp_port = 9001
timeout = 2.0
auth_token = "fake-token"
""")
    return str(config_file)


def test_cli_reset(mocker, fake_config):
    mock_reset = mocker.patch("antares.client.rest.RestClient.reset_simulation")
    result = runner.invoke(app, ["reset", "--config", fake_config])
    assert result.exit_code == 0
    assert "Simulation reset" in result.output
    mock_reset.assert_called_once()


def test_cli_add_ship(mocker, fake_config):
    mock_add = mocker.patch("antares.client.rest.RestClient.add_ship")
    result = runner.invoke(app, ["add-ship", "--x", "5.0", "--y", "6.0", "--config", fake_config])
    assert result.exit_code == 0
    assert "Added ship at (5.0, 6.0)" in result.output
    mock_add.assert_called_once()


def test_cli_subscribe(monkeypatch, mocker, fake_config):
    async def fake_sub(self):
        yield {"event": "test-event"}

    monkeypatch.setattr("antares.client.tcp.TCPSubscriber.subscribe", fake_sub)

    # Use a fresh event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = runner.invoke(app, ["subscribe", "--config", fake_config])
    assert result.exit_code == 0
    assert "test-event" in result.output


def test_handle_error_json(monkeypatch):
    result = runner.invoke(app, ["reset", "--json"], catch_exceptions=False)
    assert result.exit_code in {1, 2}
    assert "error" in result.output


def test_build_client_fails(mocker):
    mocker.patch("antares.config_loader.load_config", side_effect=Exception("broken config"))
    result = runner.invoke(app, ["reset", "--config", "invalid.toml"])
    assert result.exit_code == 1
    assert "Failed to load configuration" in result.output


def test_cli_reset_error_handling(mocker, fake_config):
    mocker.patch(
        "antares.client.rest.RestClient.reset_simulation",
        side_effect=ConnectionError("cannot connect"),
    )
    result = runner.invoke(app, ["reset", "--config", fake_config])
    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "cannot connect" in result.output


def test_cli_add_ship_error_handling(mocker, fake_config):
    mocker.patch(
        "antares.client.rest.RestClient.add_ship", side_effect=SimulationError("ship rejected")
    )
    result = runner.invoke(app, ["add-ship", "--x", "1", "--y", "2", "--config", fake_config])
    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "ship rejected" in result.output


def test_cli_subscribe_error(monkeypatch, fake_config):
    class FailingAsyncGenerator:
        def __aiter__(self):
            return self

        async def __anext__(self):
            raise SubscriptionError("stream failed")

    monkeypatch.setattr(
        "antares.client.tcp.TCPSubscriber.subscribe", lambda self: FailingAsyncGenerator()
    )

    result = runner.invoke(app, ["subscribe", "--config", fake_config])
    expected_exit_code = 3
    assert result.exit_code == expected_exit_code
    assert "stream failed" in result.output


def test_cli_verbose_prints_config(mocker, fake_config):
    mocker.patch("antares.client.tcp.TCPSubscriber.subscribe", return_value=iter([]))
    mocker.patch("antares.client.rest.RestClient.reset_simulation")

    result = runner.invoke(app, ["reset", "--config", fake_config, "--verbose"])
    assert result.exit_code == 0
    assert "Using settings" in result.output


def test_cli_subscribe_json(monkeypatch, fake_config):
    class OneEventGen:
        def __init__(self):
            self.done = False

        def __aiter__(self):
            return self

        async def __anext__(self):
            if not self.done:
                self.done = True
                return {"event": "test"}
            raise StopAsyncIteration

    monkeypatch.setattr("antares.client.tcp.TCPSubscriber.subscribe", lambda self: OneEventGen())

    result = runner.invoke(app, ["subscribe", "--config", fake_config, "--json"])

    assert result.exit_code == 0
    assert '{"event": "test"}' in result.output
