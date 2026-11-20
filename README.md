# NativeBits Demo

A React Native app for trying all 20 text effects from [`nativebits-animated-text`](https://www.npmjs.com/package/nativebits-animated-text). Pick an effect, edit the sample text, try its presets, and replay it. The gallery supports light and dark themes.

## Run locally

Install Node.js 22.11 or newer and set up the native tools for your platform. Use Android Studio and an emulator or connected device for Android. Use macOS and Xcode for iOS. [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment)

From the repository root, install dependencies and start Metro.

```sh
npm ci
npm start
```

In a second terminal, build and run Android.

```sh
npm run android
```

For iOS on macOS, install the CocoaPods dependencies and run the app.

```sh
bundle install
cd ios
bundle exec pod install
cd ..
npm run ios
```

The demo uses the published NativeBits package. Reanimated, Worklets, and Skia are included in the app dependencies, and the Worklets Babel plugin is configured in `babel.config.js`.

## Tests

```sh
npm test -- --runInBand
```

The smoke test covers effect selection, preset changes, themes, and replay. The [NativeBits npm README](https://www.npmjs.com/package/nativebits-animated-text#component-reference) lists the available component props and defaults.
