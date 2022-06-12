# Dreck Gamepad Plugin [![License](https://img.shields.io/github/license/sunruse/dreck-gamepad-plugin.svg)](https://github.com/sunruse/dreck-gamepad-plugin/blob/master/license) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Adds a library of TypeScript which provides simple, lowest-common-denominator gamepad input.

## Features

- 1 two-axis joystick with click button, with deadzone, constrained to a circle.
- Four face buttons (north, east, south, west).
- Two digital shoulder buttons (L, R).
- One pause button.

### Compatibility

| Controller                                  | Android - Chrome | macOS - Chrome | macOS - Firefox | macOS - Safari  | Windows - Chrome | Windows - Firefox |
| ------------------------------------------- | ---------------- | -------------- | --------------- | --------------- | ---------------- | ----------------- |
| Keyboard                                    | Future           | Future         | Future          | Future          | Future           | Future            |
| Joy-Con                                     | Impossible       | Future         | Impossible      | Future, partial | Future           | Impossible        |
| PowerA Wired Controller for Nintendo Switch | Impossible       | Future         | Impossible      | Impossible      | Future           | Future            |
| Wired Xbox 360 Controller                   | Impossible       | Future         | Impossible      | Impossible      | Supported        | Supported         |
| DualShock 4 Wireless Controller             | Unknown          | Unknown        | Unknown         | Unknown         | Future           | Future            |
| DualSense Wireless Controller               | Future           | Future         | Future          | Future          | Future           | Future            |

## Installation

Run the following in a Bash shell at the root of your project:

```bash
git submodule add https://github.com/sunruse/dreck-gamepad-plugin plugins/gamepad
```

## Example

```typescript
const gamepadManager = new GamepadManager();

// State will update ONLY when poll() is called.
gamepadManager.poll();

// 0...7.
console.log(gamepadManager.state[0]);
```

```json
{
  "x": 0.707107,
  "y": 0.707107,
  "click": false,
  "north": false,
  "east": false,
  "west": false,
  "south": false,
  "left": false,
  "right": false,
  "pause": false
}
```

This will be `null` if no controller is connected in this slot.
