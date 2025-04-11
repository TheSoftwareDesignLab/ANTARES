import pytest
from typer.testing import CliRunner

from antares.cli import app

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
    result = runner.invoke(
        app, ["add-ship", "--x", "5.0", "--y", "6.0", "--config", fake_config]
    )
    assert result.exit_code == 0
    assert "Added ship at (5.0, 6.0)" in result.output
    mock_add.assert_called_once()


@pytest.mark.asyncio
async def test_cli_subscribe(monkeypatch, fake_config):
    async def fake_sub():
        yield {"event": "test-event"}

    monkeypatch.setattr("antares.client.tcp.TCPSubscriber.subscribe", fake_sub)
    result = runner.invoke(app, ["subscribe", "--config", fake_config])
    assert result.exit_code == 0
    assert "test-event" in result.output
