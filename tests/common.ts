declare const global: { [key: string]: unknown };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const operatingSystem = (description: string, specDefinitions: () => void) =>
  describe(`when using operating system "${description}"`, specDefinitions);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const browser = (description: string, specDefinitions: () => void) =>
  describe(`and web browser "${description}"`, specDefinitions);

type ConnectStep = {
  readonly type: `connect`;
  readonly id: string;
  readonly index: number;
  readonly axes: number;
  readonly buttons: number;
};

type PressButtonStep = {
  readonly type: `pressButton`;
  readonly index: number;
  readonly button: number;
};

type AdjustAxisStep = {
  readonly type: `adjustAxis`;
  readonly index: number;
  readonly axis: number;
  readonly value: number;
};

type SoftDisconnectStep = {
  readonly type: `softDisconnect`;
  readonly index: number;
};

type ReconnectStep = {
  readonly type: `reconnect`;
  readonly index: number;
};

type HardDisconnectStep = {
  readonly type: `hardDisconnect`;
  readonly index: number;
};

type PollStep = {
  readonly type: `poll`;
};

type PreConstructionStep =
  | ConnectStep
  | SoftDisconnectStep
  | PressButtonStep
  | AdjustAxisStep;

type PostConstructionStep =
  | PreConstructionStep
  | ReconnectStep
  | HardDisconnectStep
  | PollStep;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connect = (
  id: string,
  index: number,
  axes: number,
  buttons: number
): ConnectStep => ({
  type: `connect`,
  id,
  index,
  axes,
  buttons,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const softDisconnect = (index: number): SoftDisconnectStep => ({
  type: `softDisconnect`,
  index,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reconnect = (index: number): ReconnectStep => ({
  type: `reconnect`,
  index,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hardDisconnect = (index: number): HardDisconnectStep => ({
  type: `hardDisconnect`,
  index,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressButton = (index: number, button: number): PressButtonStep => ({
  type: `pressButton`,
  index,
  button,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adjustAxis = (
  index: number,
  axis: number,
  value: number
): AdjustAxisStep => ({
  type: `adjustAxis`,
  index,
  axis,
  value,
});

const poll = (): PollStep => ({
  type: `poll`,
});

const describeStep = (step: PostConstructionStep) => {
  switch (step.type) {
    case `connect`:
      return `connecting a "${step.id}" as ${step.index} with ${step.axes} axes and ${step.buttons} buttons`;

    case `pressButton`:
      return `pressing button ${step.button} on controller ${step.index}`;

    case `adjustAxis`:
      return `adjusting axis ${step.axis} to ${step.value} on controller ${step.index}`;

    case `softDisconnect`:
      return `marking controller ${step.index} as disconnected`;

    case `reconnect`:
      return `marking controller ${step.index} as reconnected`;

    case `hardDisconnect`:
      return `disconnecting controller ${step.index}`;

    case `poll`:
      return `polling`;
  }
};

type TestGamepad = {
  readonly axes: number[];
  readonly buttons: GamepadButton[];
  connected: boolean;
  readonly index: number;
  readonly id: string;
};

const executePreConstructionStep = (
  preConstructionStep: PreConstructionStep,
  gamepads: [
    null | TestGamepad,
    null | TestGamepad,
    null | TestGamepad,
    null | TestGamepad
  ]
) => {
  switch (preConstructionStep.type) {
    case `connect`: {
      const freeSlots = Object.entries(gamepads)
        .filter((x) => x[1] === null)
        .map((x) => Number.parseInt(x[0]));

      /* istanbul ignore else */
      if (freeSlots.length > 0) {
        const index = Math.floor(Math.random() * freeSlots.length);

        const axes: number[] = [];

        while (axes.length < preConstructionStep.axes) {
          axes.push(0);
        }

        const buttons: GamepadButton[] = [];

        while (buttons.length < preConstructionStep.buttons) {
          buttons.push({
            pressed: false,
            touched: false,
            value: 0,
          });
        }

        gamepads[freeSlots[index] as number] = {
          axes,
          buttons,
          connected: true,
          index: preConstructionStep.index,
          id: preConstructionStep.id,
        };
      } else {
        throw new Error(`All slots are currently occupied.`);
      }

      break;
    }

    case `softDisconnect`:
      {
        const gamepad = gamepads.find(
          (gamepad) =>
            gamepad !== null && gamepad.index === preConstructionStep.index
        );

        /* istanbul ignore else */
        if (gamepad !== undefined && gamepad !== null) {
          /* istanbul ignore else */
          if (gamepad.connected) {
            gamepad.connected = false;
          } else {
            throw new Error(
              `Gamepad ${preConstructionStep.index} is already disconnected.`
            );
          }
        } else {
          throw new Error(
            `Failed to find gamepad ${preConstructionStep.index}.`
          );
        }
      }
      break;

    case `pressButton`: {
      const gamepad = gamepads.find(
        (gamepad) =>
          gamepad !== null && gamepad.index === preConstructionStep.index
      );

      /* istanbul ignore else */
      if (gamepad !== undefined && gamepad !== null) {
        /* istanbul ignore else */
        if (preConstructionStep.button < gamepad.buttons.length) {
          gamepad.buttons[preConstructionStep.button] = {
            pressed: true,
            touched: true,
            value: 1,
          };
        } else {
          throw new Error(
            `Button ${preConstructionStep.button} is out-of-range for controller ${preConstructionStep.index}.`
          );
        }
      } else {
        throw new Error(`Failed to find gamepad ${preConstructionStep.index}.`);
      }
      break;
    }

    case `adjustAxis`:
      {
        const gamepad = gamepads.find(
          (gamepad) =>
            gamepad !== null && gamepad.index === preConstructionStep.index
        );

        /* istanbul ignore else */
        if (gamepad !== undefined && gamepad !== null) {
          /* istanbul ignore else */
          if (preConstructionStep.axis < gamepad.axes.length) {
            gamepad.axes[preConstructionStep.axis] = preConstructionStep.value;
          } else {
            throw new Error(
              `Axis ${preConstructionStep.axis} is out-of-range for controller ${preConstructionStep.index}.`
            );
          }
        } else {
          throw new Error(
            `Failed to find gamepad ${preConstructionStep.index}.`
          );
        }
      }
      break;
  }
};

const executePostConstructionStep = (
  postConstructionStep: PostConstructionStep,
  gamepads: [
    null | TestGamepad,
    null | TestGamepad,
    null | TestGamepad,
    null | TestGamepad
  ],
  gamepadManager: GamepadManager
) => {
  switch (postConstructionStep.type) {
    case `poll`:
      gamepadManager.poll();
      break;

    case `reconnect`:
      {
        const gamepad = gamepads.find(
          (gamepad) =>
            gamepad !== null && gamepad.index === postConstructionStep.index
        );

        /* istanbul ignore else */
        if (gamepad !== undefined && gamepad !== null) {
          /* istanbul ignore else */
          if (!gamepad.connected) {
            gamepad.connected = true;
          } else {
            throw new Error(
              `Gamepad ${postConstructionStep.index} is already connected.`
            );
          }
        } else {
          throw new Error(
            `Failed to find gamepad ${postConstructionStep.index}.`
          );
        }
      }
      break;

    case `hardDisconnect`:
      {
        const gamepad = gamepads.findIndex(
          (gamepad) =>
            gamepad !== null && gamepad.index === postConstructionStep.index
        );

        /* istanbul ignore else */
        if (gamepad !== -1) {
          gamepads[gamepad] = null;
        } else {
          throw new Error(
            `Failed to find gamepad ${postConstructionStep.index}.`
          );
        }
      }
      break;

    default:
      executePreConstructionStep(postConstructionStep, gamepads);
      break;
  }
};

type StatusIsAssertion = {
  readonly type: `statusIs`;
  readonly connected: readonly [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
  ];
};

const statusIs = (
  ...connected: readonly [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
  ]
): StatusIsAssertion => ({
  type: `statusIs`,
  connected,
});

type IsNeutralAssertion = {
  readonly type: `isNeutral`;
  readonly index: number;
};

const isNeutral = (index: number): IsNeutralAssertion => ({
  type: `isNeutral`,
  index,
});

type PressesNorthAssertion = {
  readonly type: `pressesNorth`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesNorth = (index: number): PressesNorthAssertion => ({
  type: `pressesNorth`,
  index,
});

type PressesEastAssertion = {
  readonly type: `pressesEast`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesEast = (index: number): PressesEastAssertion => ({
  type: `pressesEast`,
  index,
});

type PressesSouthAssertion = {
  readonly type: `pressesSouth`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesSouth = (index: number): PressesSouthAssertion => ({
  type: `pressesSouth`,
  index,
});

type PressesWestAssertion = {
  readonly type: `pressesWest`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesWest = (index: number): PressesWestAssertion => ({
  type: `pressesWest`,
  index,
});

type PullsStickLeftAssertion = {
  readonly type: `pullsStickLeft`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pullsStickLeft = (index: number): PullsStickLeftAssertion => ({
  type: `pullsStickLeft`,
  index,
});

type PullsStickRightAssertion = {
  readonly type: `pullsStickRight`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pullsStickRight = (index: number): PullsStickRightAssertion => ({
  type: `pullsStickRight`,
  index,
});

type PullsStickUpAssertion = {
  readonly type: `pullsStickUp`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pullsStickUp = (index: number): PullsStickUpAssertion => ({
  type: `pullsStickUp`,
  index,
});

type PullsStickDownAssertion = {
  readonly type: `pullsStickDown`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pullsStickDown = (index: number): PullsStickDownAssertion => ({
  type: `pullsStickDown`,
  index,
});

type ClicksStickAssertion = {
  readonly type: `clicksStick`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clicksStick = (index: number): ClicksStickAssertion => ({
  type: `clicksStick`,
  index,
});

type PressesLeftAssertion = {
  readonly type: `pressesLeft`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesLeft = (index: number): PressesLeftAssertion => ({
  type: `pressesLeft`,
  index,
});

type PressesRightAssertion = {
  readonly type: `pressesRight`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesRight = (index: number): PressesRightAssertion => ({
  type: `pressesRight`,
  index,
});

type PressesPauseAssertion = {
  readonly type: `pressesPause`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pressesPause = (index: number): PressesPauseAssertion => ({
  type: `pressesPause`,
  index,
});

type PullsStickDownAndLeftAssertion = {
  readonly type: `pullsStickDownAndLeft`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pullsStickDownAndLeft = (
  index: number
): PullsStickDownAndLeftAssertion => ({
  type: `pullsStickDownAndLeft`,
  index,
});

type StickIsBetweenCenterAndEdgeAssertion = {
  readonly type: `stickIsBetweenCenterAndEdge`;
  readonly index: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stickIsBetweenCenterAndEdge = (
  index: number
): StickIsBetweenCenterAndEdgeAssertion => ({
  type: `stickIsBetweenCenterAndEdge`,
  index,
});

type Assertion =
  | StatusIsAssertion
  | IsNeutralAssertion
  | PressesNorthAssertion
  | PressesEastAssertion
  | PressesSouthAssertion
  | PressesWestAssertion
  | PullsStickLeftAssertion
  | PullsStickRightAssertion
  | PullsStickUpAssertion
  | PullsStickDownAssertion
  | ClicksStickAssertion
  | PressesLeftAssertion
  | PressesRightAssertion
  | PressesPauseAssertion
  | PullsStickDownAndLeftAssertion
  | StickIsBetweenCenterAndEdgeAssertion;

const describeAssertion = (assertion: Assertion) => {
  switch (assertion.type) {
    case `statusIs`: {
      const indicesOfConnectedControllers = Object.entries(assertion.connected)
        .filter((x) => x[1])
        .map((x) => x[0])
        .reverse();

      switch (indicesOfConnectedControllers.length) {
        case 0:
          return `no controllers are to be connected`;

        case 1:
          return `controller ${indicesOfConnectedControllers[0]} is to be connected`;

        default:
          return `controllers ${indicesOfConnectedControllers
            .slice(1)
            .reverse()
            .join(`, `)} and ${
            indicesOfConnectedControllers[0]
          } are to be connected`;

        // TODO: remove when Joy-Con support is added.
        /* istanbul ignore next */
        case 8:
          return `all controllers are to be connected`;
      }
    }

    case `isNeutral`:
      return `activates no inputs of controller ${assertion.index}`;

    case `pressesNorth`:
      return `presses the north face button of controller ${assertion.index}`;

    case `pressesEast`:
      return `presses the east face button of controller ${assertion.index}`;

    case `pressesSouth`:
      return `presses the south face button of controller ${assertion.index}`;

    case `pressesWest`:
      return `presses the west face button of controller ${assertion.index}`;

    case `pullsStickLeft`:
      return `pulls the stick of controller ${assertion.index} left`;

    case `pullsStickRight`:
      return `pulls the stick of controller ${assertion.index} right`;

    case `pullsStickUp`:
      return `pulls the stick of controller ${assertion.index} up`;

    case `pullsStickDown`:
      return `pulls the stick of controller ${assertion.index} down`;

    case `clicksStick`:
      return `clicks the stick of controller ${assertion.index}`;

    case `pressesLeft`:
      return `presses the left trigger of controller ${assertion.index}`;

    case `pressesRight`:
      return `presses the right trigger of controller ${assertion.index}`;

    case `pressesPause`:
      return `presses the pause button of controller ${assertion.index}`;

    case `pullsStickDownAndLeft`:
      return `pulls the stick of controller ${assertion.index} down and left`;

    case `stickIsBetweenCenterAndEdge`:
      return `moves the stick of controller ${assertion.index} between the center and edge`;
  }
};

const checkAssertion = (
  assertion: Assertion,
  gamepadManager: GamepadManager
) => {
  const onlyPublicApi = (gamepad: GamepadState): GamepadState => ({
    x: gamepad.x,
    y: gamepad.y,
    north: gamepad.north,
    south: gamepad.south,
    east: gamepad.east,
    west: gamepad.west,
    left: gamepad.left,
    right: gamepad.right,
    pause: gamepad.pause,
    click: gamepad.click,
  });

  const checkSpecific = (index: number, is: GamepadState): void => {
    const actual = gamepadManager.state[index] as null | GamepadState;

    if (actual !== null) {
      expect(onlyPublicApi(actual)).toEqual(is);
    }
  };

  switch (assertion.type) {
    case `statusIs`:
      for (let i = 0; i < assertion.connected.length; i++) {
        const expected = assertion.connected[i] as boolean;
        const actual = gamepadManager.state[i] as null | GamepadState;

        if (expected) {
          expect(actual).withContext(`controller ${i}`).not.toBeNull();
        } else {
          expect(actual).withContext(`controller ${i}`).toBeNull();
        }
      }
      break;

    case `isNeutral`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pressesNorth`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: true,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pressesEast`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: true,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pressesSouth`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: true,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pressesWest`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: true,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pullsStickLeft`:
      checkSpecific(assertion.index, {
        x: -1,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pullsStickRight`:
      checkSpecific(assertion.index, {
        x: 1,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pullsStickUp`:
      checkSpecific(assertion.index, {
        x: 0,
        y: -1,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pullsStickDown`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 1,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `clicksStick`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: true,
      });
      break;

    case `pressesLeft`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: true,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `pressesRight`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: true,
        pause: false,
        click: false,
      });
      break;

    case `pressesPause`:
      checkSpecific(assertion.index, {
        x: 0,
        y: 0,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: true,
        click: false,
      });
      break;

    case `pullsStickDownAndLeft`:
      checkSpecific(assertion.index, {
        x: -0.7071067811865475,
        y: 0.7071067811865475,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;

    case `stickIsBetweenCenterAndEdge`:
      checkSpecific(assertion.index, {
        x: 0.3,
        y: -0.2,
        north: false,
        south: false,
        east: false,
        west: false,
        left: false,
        right: false,
        pause: false,
        click: false,
      });
      break;
  }
};

const scenario = (
  preConstructionSteps: ReadonlyArray<PreConstructionStep>,
  postConstructionSteps: ReadonlyArray<PostConstructionStep>,
  assertions: ReadonlyArray<Assertion>
) =>
  describe(`after ${[
    ...preConstructionSteps.map(describeStep),
    `constructing the GamepadManager`,
    ...postConstructionSteps.map(describeStep),
  ].join(` then `)}`, () => {
    let gamepadManager: GamepadManager;

    beforeAll(() => {
      const gamepads: [
        null | TestGamepad,
        null | TestGamepad,
        null | TestGamepad,
        null | TestGamepad
      ] = [null, null, null, null];

      global[`navigator`] = {
        getGamepads: () => gamepads,
      };

      for (const preConstructionStep of preConstructionSteps) {
        executePreConstructionStep(preConstructionStep, gamepads);
      }

      gamepadManager = new GamepadManager();

      for (const postConstructionStep of postConstructionSteps) {
        executePostConstructionStep(
          postConstructionStep,
          gamepads,
          gamepadManager
        );
      }
    });

    for (const assertion of assertions) {
      it(describeAssertion(assertion), () => {
        checkAssertion(assertion, gamepadManager);
      });
    }
  });

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fscenario = (
  preConstructionSteps: ReadonlyArray<PreConstructionStep>,
  postConstructionSteps: ReadonlyArray<PostConstructionStep>,
  assertions: ReadonlyArray<Assertion>
) =>
  fdescribe(`focused`, () => {
    scenario(preConstructionSteps, postConstructionSteps, assertions);
  });

scenario(
  [],
  [],
  [
    statusIs(false, false, false, false, false, false, false, false),
    isNeutral(0),
  ]
);

scenario(
  [],
  [poll()],
  [
    statusIs(false, false, false, false, false, false, false, false),
    isNeutral(0),
  ]
);
