import asyncio

from antares import AntaresClient, CircleShip, LineShip, RandomShip, StationaryShip


async def main() -> None:
    """
    Example of how to use the Antares Python client to add ships and subscribe to events.
    This example demonstrates how to create different types of ships and add them to the Antares
    simulation. It also shows how to subscribe to simulation events and print the track information.
    """

    # Initialize the Antares client
    client = AntaresClient()

    # Add ships
    ships = [
        StationaryShip(initial_position=(0.0, 0.0), type="stationary"),
        RandomShip(initial_position=(10.0, -10.0), max_speed=15.0, type="random"),
        CircleShip(initial_position=(-30.0, 20.0), radius=25.0, speed=3.0, type="circle"),
        LineShip(initial_position=(5.0, 5.0), angle=0.78, speed=4.0, type="line"),
    ]

    for ship in ships:
        client.add_ship(ship)
        print(f"✅ Added {ship.type} ship at {ship.initial_position}")

    print("📡 Subscribing to simulation events...\n")

    try:
        async for track in client.subscribe():
            print(
                f"📍 Track #{track.id} - {track.name} @ ({track.lat}, {track.long}) → {track.speed} m/s"  # noqa: E501
            )
    except KeyboardInterrupt:
        print("\n🛑 Subscription interrupted by user.")


if __name__ == "__main__":
    asyncio.run(main())
