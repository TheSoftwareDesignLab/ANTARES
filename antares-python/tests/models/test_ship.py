from antares.models.ship import ShipConfig


def test_ship_config_validation():
    ship = ShipConfig(initial_position=(10.0, 20.0))
    assert ship.initial_position == (10.0, 20.0)
