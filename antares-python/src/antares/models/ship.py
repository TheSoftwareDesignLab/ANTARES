from pydantic import BaseModel, Field


class ShipConfig(BaseModel):
    """
    Defines the configuration for a ship to be added to the simulation.
    """

    initial_position: tuple[float, float] = Field(
        ..., description="Initial (x, y) coordinates of the ship in simulation space."
    )
