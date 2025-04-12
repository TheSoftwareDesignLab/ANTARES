from typing import Annotated, Literal

from pydantic import BaseModel, Field


class BaseShip(BaseModel):
    """
    Base class for ship configurations.
    """

    initial_position: tuple[float, float] = Field(
        ..., description="Initial (x, y) coordinates of the ship."
    )


class LineShip(BaseShip):
    """
    Ship that moves in a straight line at a constant speed.
    """

    type: Literal["line"] = "line"
    angle: float = Field(..., description="Angle in radians.")
    speed: float = Field(..., description="Constant speed.")


class CircleShip(BaseShip):
    """
    Ship that moves in a circular path at a constant speed.
    """

    type: Literal["circle"] = "circle"
    radius: float = Field(..., description="Radius of circular path.")
    speed: float = Field(..., description="Constant speed.")


class RandomShip(BaseShip):
    """
    Ship that moves in a random direction at a constant speed.
    """

    type: Literal["random"] = "random"
    max_speed: float = Field(..., description="Maximum possible speed.")


class StationaryShip(BaseShip):
    """
    Ship that does not move.
    """

    type: Literal["stationary"] = "stationary"


# Union of all ship configs
ShipConfig = Annotated[
    LineShip | CircleShip | RandomShip | StationaryShip, Field(discriminator="type")
]
