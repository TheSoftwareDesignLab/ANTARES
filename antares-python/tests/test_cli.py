import asyncio
import subprocess

import pytest
from pydantic import BaseModel
from typer.testing import CliRunner

from antares.cli import app
from antares.errors import ConnectionError, SimulationError, SubscriptionError

runner = CliRunner()


@pytest.fixture
def fake_config(tmp_path):
    config_file = tmp_path / "config.toml"
    config_file.write_text("""
[antares.simulation]
controller_bind_addr = "10.20.20.10:17394"
[antares.radar]           
bind_addr = "0.0.0.0:17396"
""")
    return str(config_file)


def test_cli_reset(mocker, fake_config):
    mock_reset = mocker.patch("antares.client.rest.RestClient.reset_simulation")
    result = runner.invoke(app, ["reset", "--config", fake_config])
    assert result.exit_code == 0
    assert "Simulation reset" in result.output
    mock_reset.assert_called_once()


def test_cli_add_stationary_ship_success(mocker, fake_config):
    mock_add = mocker.patch("antares.client.rest.RestClient.add_ship")

    result = runner.invoke(
        app,
        ["add-ship", "--type", "stationary", "--x", "5.0", "--y", "6.0", "--config", fake_config],
    )

    assert result.exit_code == 0
    assert "Added stationary ship at (5.0, 6.0)" in result.output
    mock_add.assert_called_once()


def test_cli_add_line_ship_success(mocker, fake_config):
    mock_add = mocker.patch("antares.client.rest.RestClient.add_ship")

    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "line",
            "--x",
            "10.0",
            "--y",
            "20.0",
            "--angle",
            "0.5",
            "--speed",
            "3.0",
            "--config",
            fake_config,
        ],
    )

    assert result.exit_code == 0
    assert "Added line ship at (10.0, 20.0)" in result.output
    mock_add.assert_called_once()


def test_cli_add_circle_ship_success(mocker, fake_config):
    mock_add = mocker.patch("antares.client.rest.RestClient.add_ship")

    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "circle",
            "--x",
            "30.0",
            "--y",
            "40.0",
            "--radius",
            "15.0",
            "--speed",
            "2.5",
            "--config",
            fake_config,
        ],
    )

    assert result.exit_code == 0
    assert "Added circle ship at (30.0, 40.0)" in result.output
    mock_add.assert_called_once()


def test_cli_add_random_ship_success(mocker, fake_config):
    mock_add = mocker.patch("antares.client.rest.RestClient.add_ship")

    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "random",
            "--x",
            "0.0",
            "--y",
            "0.0",
            "--max-speed",
            "12.0",
            "--config",
            fake_config,
        ],
    )

    assert result.exit_code == 0
    assert "Added random ship at (0.0, 0.0)" in result.output
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

    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "stationary",
            "--x",
            "1",
            "--y",
            "2",
            "--config",
            fake_config,
            "--json",
        ],
    )

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "ship rejected" in result.output


def test_cli_add_ship_invalid_type(mocker, fake_config):
    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "invalid_type",
            "--x",
            "10.0",
            "--y",
            "20.0",
            "--config",
            fake_config,
        ],
    )

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "Invalid ship type" in result.output


def test_cli_add_stationary_ship_missing_args(fake_config):
    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "stationary",
            "--x",
            "5.0",
            "--config",
            fake_config,
        ],
    )

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code


def test_cli_add_line_ship_missing_args(fake_config):
    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "line",
            "--x",
            "10.0",
            "--y",
            "20.0",
            "--config",
            fake_config,
        ],
    )

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "Invalid ship parameters" in result.output


def test_cli_add_circle_missing_radius(mocker, fake_config):
    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "circle",
            "--x",
            "10.0",
            "--y",
            "20.0",
            "--speed",
            "2.0",
            "--config",
            fake_config,
        ],
    )

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "Invalid ship parameters" in result.output


def test_cli_add_random_missing_max_speed(mocker, fake_config):
    result = runner.invoke(
        app,
        [
            "add-ship",
            "--type",
            "random",
            "--x",
            "0.0",
            "--y",
            "0.0",
            "--config",
            fake_config,
        ],
    )

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "Invalid ship parameters" in result.output


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


def test_cli_subscribe_json(monkeypatch):
    class EventMock(BaseModel):
        event: str

    class OneEventGen:
        def __init__(self):
            self.done = False

        def __aiter__(self):
            return self

        async def __anext__(self):
            if not self.done:
                self.done = True
                return EventMock(event="test")
            raise StopAsyncIteration

    monkeypatch.setattr("antares.client.tcp.TCPSubscriber.subscribe", lambda self: OneEventGen())

    result = runner.invoke(app, ["subscribe", "--json"])

    assert result.exit_code == 0
    assert '{"event":"test"}' in result.output


def test_start_success(mocker):
    mock_which = mocker.patch("shutil.which", return_value="/usr/local/bin/antares")
    mock_popen = mocker.patch("subprocess.Popen", return_value=mocker.Mock(pid=1234))

    result = runner.invoke(app, ["start"])
    assert result.exit_code == 0
    assert "Antares started in background with PID 1234" in result.output
    mock_which.assert_called_once()
    mock_popen.assert_called_once_with(
        ["/usr/local/bin/antares"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )


def test_start_executable_not_found(mocker):
    mocker.patch("shutil.which", return_value=None)

    result = runner.invoke(app, ["start", "--executable", "fake-antares"])
    assert result.exit_code == 1
    assert "Executable 'fake-antares' not found" in result.output


def test_start_popen_failure(mocker):
    mocker.patch("shutil.which", return_value="/usr/bin/antares")
    mocker.patch("subprocess.Popen", side_effect=OSError("boom"))

    result = runner.invoke(app, ["start"])
    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert "Failed to start Antares" in result.output


def test_start_popen_failure_with_json_verbose(mocker):
    mocker.patch("shutil.which", return_value="/usr/bin/antares")
    mocker.patch("subprocess.Popen", side_effect=OSError("boom"))

    result = runner.invoke(app, ["start", "--json", "-v"])

    expected_exit_code = 2
    assert result.exit_code == expected_exit_code
    assert '{"error":' in result.stdout or result.stderr
    assert "Failed to start Antares: boom" in result.output


def test_start_with_json_output(mocker):
    mocker.patch("shutil.which", return_value="/usr/bin/antares")
    mocker.patch("subprocess.Popen", return_value=mocker.Mock(pid=4321))

    result = runner.invoke(app, ["start", "--json"])
    assert result.exit_code == 0
    assert '{"message":' in result.output
    assert '"pid": 4321' in result.output


def test_start_with_config(mocker):
    mocker.patch("shutil.which", return_value="/usr/local/bin/antares")
    mock_popen = mocker.patch("subprocess.Popen", return_value=mocker.Mock(pid=5678))

    result = runner.invoke(app, ["start", "--config", "config.toml"])
    assert result.exit_code == 0
    mock_popen.assert_called_once_with(
        ["/usr/local/bin/antares", "--config", "config.toml"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
