from typing import ClassVar

from pydantic import BaseModel, Field


class Track(BaseModel):
    id: int
    year: int
    month: int
    day: int
    hour: int
    minute: int
    second: int
    millisecond: int
    stat: str
    type_: str = Field(alias="type")  # maps from "type" input
    name: str
    linemask: int
    size: int
    range: float
    azimuth: float
    lat: float
    long: float
    speed: float
    course: float
    quality: int
    l16quality: int
    lacks: int
    winrgw: int
    winazw: float
    stderr: float

    # expected order of fields from TCP stream
    __field_order__: ClassVar[list[str]] = [
        "id",
        "year",
        "month",
        "day",
        "hour",
        "minute",
        "second",
        "millisecond",
        "stat",
        "type_",
        "name",
        "linemask",
        "size",
        "range",
        "azimuth",
        "lat",
        "long",
        "speed",
        "course",
        "quality",
        "l16quality",
        "lacks",
        "winrgw",
        "winazw",
        "stderr",
    ]

    @classmethod
    def from_csv_row(cls, line: str) -> "Track":
        parts = line.strip().split(",")
        if len(parts) != len(cls.__field_order__):
            raise ValueError(f"Expected {len(cls.__field_order__)} fields, got {len(parts)}")

        converted = {}
        for field_name, value in zip(cls.__field_order__, parts, strict=True):
            field_info = cls.model_fields[field_name]
            field_type = field_info.annotation

            if field_type is None:
                raise ValueError(f"Field '{field_name}' has no type annotation")

            # Use alias if defined
            key = field_info.alias or field_name
            try:
                # We trust simple coercion here; Pydantic will do final validation
                converted[key] = field_type(value)
            except Exception as e:
                raise ValueError(f"Invalid value for field '{field_name}': {value} ({e})") from e

        return cls(**converted)
