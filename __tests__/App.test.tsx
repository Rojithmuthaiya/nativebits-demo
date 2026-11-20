/**
 * @format
 */

import React from 'react';
import { View } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-safe-area-context', () => {
  const { View: MockView } = require('react-native');
  return { SafeAreaProvider: MockView, SafeAreaView: MockView };
});

jest.mock('nativebits-animated-text', () => {
  const mockReact = require('react');
  const { View: MockView } = require('react-native');
  const components = new Map();
  return new Proxy(
    {},
    {
      get(_, name) {
        if (name === '__esModule') {
          return true;
        }
        if (!components.has(name)) {
          components.set(name, (props: object) =>
            mockReact.createElement(MockView, {
              testID: 'demo-' + String(name),
              accessibilityLabel: JSON.stringify(props),
            }),
          );
        }
        return components.get(name);
      },
    },
  );
});

test('selects effects, changes axes, and replays the current preview', async () => {
  let app!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    app = ReactTestRenderer.create(<App />);
  });

  function preview(name: string) {
    const view = app.root
      .findAllByType(View)
      .find(item => item.props.testID === 'demo-' + name);
    if (!view) {
      throw new Error('Preview was not mounted: ' + name);
    }
    return view;
  }

  async function tap(testID: string) {
    const button = app.root
      .findAllByProps({ testID })
      .find(item => typeof item.props.onPress === 'function');
    if (!button) {
      throw new Error('Button was not visible: ' + testID);
    }
    await ReactTestRenderer.act(async () => button.props.onPress());
  }

  expect(JSON.parse(preview('RotateText').props.accessibilityLabel).axis).toBe(
    'x',
  );
  await tap('variant-2');
  expect(JSON.parse(preview('RotateText').props.accessibilityLabel).axis).toBe(
    'z',
  );
  await tap('variant-1');
  expect(JSON.parse(preview('RotateText').props.accessibilityLabel).axis).toBe(
    'y',
  );
  const beforeTheme = preview('RotateText');
  const themeButton = () =>
    app.root
      .findAllByProps({ testID: 'toggle-theme' })
      .find(item => typeof item.props.onPress === 'function');
  expect(themeButton()?.props.accessibilityLabel).toBe('Switch to dark theme');
  await tap('toggle-theme');
  expect(themeButton()?.props.accessibilityLabel).toBe('Switch to light theme');
  expect(preview('RotateText')).toBe(beforeTheme);
  expect(
    JSON.parse(preview('RotateText').props.accessibilityLabel),
  ).toMatchObject({
    axis: 'y',
    style: { color: '#61DAFB' },
  });
  await tap('toggle-theme');
  expect(themeButton()?.props.accessibilityLabel).toBe('Switch to dark theme');

  const beforeReplay = preview('RotateText');
  await tap('replay-animation');
  expect(preview('RotateText')).not.toBe(beforeReplay);
  expect(JSON.parse(preview('RotateText').props.accessibilityLabel).axis).toBe(
    'y',
  );

  await tap('effect-FlipText');
  expect(JSON.parse(preview('FlipText').props.accessibilityLabel).axis).toBe(
    'x',
  );
  await tap('filter-Reveal');
  expect(JSON.parse(preview('SplitText').props.accessibilityLabel).text).toBe(
    'NATIVEBITS',
  );
  await tap('effect-RevealText');
  await tap('variant-3');
  expect(
    JSON.parse(preview('RevealText').props.accessibilityLabel).direction,
  ).toBe('bottom');

  await ReactTestRenderer.act(async () => app.unmount());
});
