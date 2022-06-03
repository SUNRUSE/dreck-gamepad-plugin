type GamepadState = {
  /**
   * The stick's X axis, where -1 is left and 1 is right.  Constrained to a circle alongside y.
   */
  readonly x: number;

  /**
   * The stick's Y axis, where -1 is up and 1 is down.  Constrained to a circle alongside x.
   */
  readonly y: number;

  /**
   * True when the stick is being clicked, otherwise, false.
   */
  readonly click: boolean;

  /**
   * True when the north-pointing face button is being pressed, otherwise, false.
   */
  readonly north: boolean;

  /**
   * True when the east-pointing face button is being pressed, otherwise, false.
   */
  readonly east: boolean;

  /**
   * True when the south-pointing face button is being pressed, otherwise, false.
   */
  readonly south: boolean;

  /**
   * True when the west-pointing face button is being pressed, otherwise, false.
   */
  readonly west: boolean;

  /**
   * True when the left trigger/shoulder button is being pressed, otherwise, false.
   */
  readonly left: boolean;

  /**
   * True when the right trigger/shoulder button is being pressed, otherwise, false.
   */
  readonly right: boolean;

  /**
   * True when the pause/start/options button is being pressed, otherwise, false.
   */
  readonly pause: boolean;
};

type GamepadManagerInternal360Source = {
  readonly type: `360`;
  readonly index: number;
};

type GamepadManagerInternalSource = GamepadManagerInternal360Source;

type GamepadManagerInternalGamepadState = {
  x: number;
  y: number;
  click: boolean;
  north: boolean;
  east: boolean;
  west: boolean;
  south: boolean;
  left: boolean;
  right: boolean;
  pause: boolean;
  sources: GamepadManagerInternalSource[];
};

/**
 * Handles gamepad input.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GamepadManager {
  /**
   * The state of the currently connected gamepads.  Call poll() to refresh.
   */
  public readonly state: readonly [
    null | GamepadState,
    null | GamepadState,
    null | GamepadState,
    null | GamepadState,
    null | GamepadState,
    null | GamepadState,
    null | GamepadState,
    null | GamepadState
  ];

  private readonly realState: [
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState,
    null | GamepadManagerInternalGamepadState
  ] = [null, null, null, null, null, null, null, null];

  constructor() {
    this.state = this.realState;

    this.poll();
  }

  /**
   * Updates state.  State will not change unless this is called.
   */
  poll(): void {
    const next = navigator.getGamepads();

    const getByIndex = (index: number): null | Gamepad => {
      for (const gamepad of next) {
        if (gamepad !== null && gamepad.index === index && gamepad.connected) {
          return gamepad;
        }
      }

      return null;
    };

    const getButtonState = (gamepad: Gamepad, button: number): boolean => {
      const state = gamepad.buttons[button] as GamepadButton;
      return state.pressed;
    };

    const getAxisState = (gamepad: Gamepad, axis: number): number =>
      gamepad.axes[axis] as number;

    const mapNew = (source: GamepadManagerInternalSource): void => {
      for (
        let mappedIndex = 0;
        mappedIndex < this.realState.length;
        mappedIndex++
      ) {
        const currentlyMapped = this.realState[
          mappedIndex
        ] as null | GamepadManagerInternalGamepadState;

        if (currentlyMapped === null) {
          this.realState[mappedIndex] = {
            x: 0,
            y: 0,
            click: false,
            north: false,
            east: false,
            west: false,
            south: false,
            left: false,
            right: false,
            pause: false,
            sources: [source],
          };

          return;
        }
      }
    };

    for (
      let gamepadIndex = 0;
      gamepadIndex < this.realState.length;
      gamepadIndex++
    ) {
      const gamepad = this.realState[
        gamepadIndex
      ] as null | GamepadManagerInternalGamepadState;

      if (gamepad !== null) {
        for (let sourceIndex = 0; sourceIndex < gamepad.sources.length; ) {
          const source = gamepad.sources[
            sourceIndex
          ] as GamepadManagerInternalSource;

          switch (source.type) {
            case `360`: {
              if (getByIndex(source.index)) {
                sourceIndex++;
              } else {
                gamepad.sources.splice(sourceIndex, 1);
              }
              break;
            }
          }
        }

        if (gamepad.sources.length === 0) {
          this.realState[gamepadIndex] = null;
        }
      }
    }

    for (const gamepad of next) {
      if (gamepad !== null && gamepad.connected) {
        let alreadyASource = false;

        for (const mapped of this.realState) {
          if (mapped !== null) {
            for (const source of mapped.sources) {
              switch (source.type) {
                case `360`:
                  if (source.index === gamepad.index) {
                    alreadyASource = true;
                  }
                  break;
              }

              if (alreadyASource) {
                break;
              }
            }

            if (alreadyASource) {
              break;
            }
          }
        }

        if (alreadyASource) {
          continue;
        }

        mapNew({ type: `360`, index: gamepad.index });
      }
    }

    for (const mapped of this.realState) {
      if (mapped !== null) {
        mapped.x = 0;
        mapped.y = 0;
        mapped.north = false;
        mapped.east = false;
        mapped.south = false;
        mapped.west = false;
        mapped.left = false;
        mapped.right = false;
        mapped.pause = false;

        for (const source of mapped.sources) {
          switch (source.type) {
            case `360`: {
              const raw = getByIndex(source.index) as Gamepad;

              if (getButtonState(raw, 14)) {
                mapped.x--;
              }

              if (getButtonState(raw, 15)) {
                mapped.x++;
              }

              if (getButtonState(raw, 12)) {
                mapped.y--;
              }

              if (getButtonState(raw, 13)) {
                mapped.y++;
              }

              mapped.x += getAxisState(raw, 0);
              mapped.y += getAxisState(raw, 1);

              mapped.north = mapped.north || getButtonState(raw, 3);
              mapped.east = mapped.east || getButtonState(raw, 1);
              mapped.south = mapped.south || getButtonState(raw, 0);
              mapped.west = mapped.west || getButtonState(raw, 2);
              mapped.click = mapped.click || getButtonState(raw, 10);
              mapped.left =
                mapped.left || getButtonState(raw, 4) || getButtonState(raw, 6);
              mapped.right =
                mapped.right ||
                getButtonState(raw, 5) ||
                getButtonState(raw, 7);
              mapped.pause =
                mapped.pause ||
                getButtonState(raw, 8) ||
                getButtonState(raw, 9);
              break;
            }
          }
        }
      }
    }
  }
}
