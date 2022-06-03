operatingSystem(`windows`, () => {
  browser(`firefox`, () => {
    scenario(
      [connect(`xinput`, 123, 4, 17)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), softDisconnect(123)],
      [],
      [statusIs(false, false, false, false, false, false, false, false)]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17)],
      [softDisconnect(123), poll()],
      [statusIs(false, false, false, false, false, false, false, false)]
    );

    scenario(
      [],
      [connect(`xinput`, 123, 4, 17), softDisconnect(123), poll()],
      [statusIs(false, false, false, false, false, false, false, false)]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), softDisconnect(123)],
      [reconnect(123), poll()],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [],
      [connect(`xinput`, 123, 4, 17), poll(), hardDisconnect(123), poll()],
      [statusIs(false, false, false, false, false, false, false, false)]
    );

    scenario(
      [],
      [
        connect(`xinput`, 123, 4, 17),
        softDisconnect(123),
        poll(),
        reconnect(123),
        poll(),
      ],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17)],
      [hardDisconnect(123), poll()],
      [statusIs(false, false, false, false, false, false, false, false)]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), softDisconnect(123)],
      [hardDisconnect(123), poll()],
      [statusIs(false, false, false, false, false, false, false, false)]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17)],
      [poll()],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [],
      [connect(`xinput`, 123, 4, 17), poll()],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [],
      [connect(`xinput`, 123, 4, 17), poll(), poll()],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 3)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesNorth(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 1)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesEast(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 0)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesSouth(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 2)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesWest(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 14)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickLeft(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), adjustAxis(123, 0, -1)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickLeft(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 15)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickRight(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), adjustAxis(123, 0, 1)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickRight(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 12)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickUp(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), adjustAxis(123, 1, -1)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickUp(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 13)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickDown(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), adjustAxis(123, 1, 1)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickDown(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 10)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        clicksStick(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 4)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesLeft(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 6)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesLeft(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 5)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesRight(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 7)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesRight(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 8)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesPause(0),
      ]
    );

    scenario(
      [connect(`xinput`, 123, 4, 17), pressButton(123, 9)],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pressesPause(0),
      ]
    );

    scenario(
      [],
      [
        connect(`xinput`, 123, 4, 17),
        poll(),
        connect(`xinput`, 456, 4, 17),
        poll(),
        connect(`xinput`, 128, 4, 17),
        poll(),
        connect(`xinput`, 192, 4, 17),
        pressButton(123, 9),
        adjustAxis(456, 1, 1),
        pressButton(128, 2),
        adjustAxis(192, 0, -1),
        poll(),
      ],
      [
        statusIs(true, true, true, true, false, false, false, false),
        pressesPause(0),
        pullsStickDown(1),
        pressesWest(2),
        pullsStickLeft(3),
      ]
    );

    scenario(
      [
        connect(`xinput`, 123, 4, 17),
        adjustAxis(123, 0, -1),
        adjustAxis(123, 1, 1),
      ],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickDownAndLeft(0),
      ]
    );

    scenario(
      [
        connect(`xinput`, 123, 4, 17),
        pressButton(123, 14),
        pressButton(123, 13),
      ],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickDownAndLeft(0),
      ]
    );

    scenario(
      [
        connect(`xinput`, 123, 4, 17),
        pressButton(123, 14),
        adjustAxis(123, 1, 1),
      ],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        pullsStickDownAndLeft(0),
      ]
    );

    scenario(
      [
        connect(`xinput`, 123, 4, 17),
        adjustAxis(123, 0, 0.05),
        adjustAxis(123, 1, -0.05),
      ],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        isNeutral(0),
      ]
    );

    scenario(
      [
        connect(`xinput`, 123, 4, 17),
        adjustAxis(123, 0, 0.3),
        adjustAxis(123, 1, -0.2),
      ],
      [],
      [
        statusIs(true, false, false, false, false, false, false, false),
        stickIsBetweenCenterAndEdge(0),
      ]
    );
  });
});
