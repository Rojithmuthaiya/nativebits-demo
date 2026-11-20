import React from 'react';
import type { TextStyle } from 'react-native';
import {
  BlurText,
  BounceText,
  CountUpText,
  ElasticText,
  ExplosionText,
  FlipText,
  GlitchText,
  GradientText,
  MorphText,
  NeonText,
  ParticleText,
  RevealText,
  RotateText,
  ScrambleText,
  ShinyText,
  SplitText,
  TextWave,
  ThreeDText,
  TypewriterText,
  WaveText,
} from 'nativebits-animated-text';

export type Category = 'Reveal' | 'Motion' | 'Style';
type Preview = {
  text: string;
  style: TextStyle;
  fontSize: number;
  isDark: boolean;
};
type Demo = {
  name: string;
  description: string;
  category: Category;
  controls?: { label: string; options: string[] };
  render: (preview: Preview, option: number) => React.JSX.Element;
};

function variants<T>(
  label: string,
  options: readonly [string, T][],
  render: (preview: Preview, value: T) => React.JSX.Element,
) {
  return {
    controls: { label, options: options.map(([name]) => name) },
    render: (preview: Preview, option: number) =>
      render(preview, (options[option] ?? options[0])[1]),
  };
}

export const demos: readonly Demo[] = [
  {
    name: 'RotateText',
    description: 'Spin characters into place on the X, Y, or Z axis.',
    category: 'Motion',
    ...variants<'x' | 'y' | 'z'>(
      'Rotation axis',
      [
        ['X axis', 'x'],
        ['Y axis', 'y'],
        ['Z axis', 'z'],
      ],
      ({ text, style }, axis) => (
        <RotateText text={text} style={style} axis={axis} rotation={150} loop />
      ),
    ),
  },
  {
    name: 'FlipText',
    description: 'Flip each letter like a tile on the X or Y axis.',
    category: 'Motion',
    ...variants<'x' | 'y'>(
      'Flip axis',
      [
        ['X axis', 'x'],
        ['Y axis', 'y'],
      ],
      ({ text, style }, axis) => (
        <FlipText text={text} style={style} axis={axis} loop />
      ),
    ),
  },
  {
    name: 'SplitText',
    description: 'Reveal letters one by one with a staggered rise.',
    category: 'Reveal',
    render: ({ text, style }) => (
      <SplitText
        text={text}
        style={style}
        duration={680}
        stagger={65}
        fromY={22}
      />
    ),
  },
  {
    name: 'RevealText',
    description: 'Slide text in from any side of its mask.',
    category: 'Reveal',
    ...variants<'left' | 'right' | 'top' | 'bottom'>(
      'Reveal from',
      [
        ['Left', 'left'],
        ['Right', 'right'],
        ['Top', 'top'],
        ['Bottom', 'bottom'],
      ],
      ({ text, style }, direction) => (
        <RevealText
          text={text}
          style={style}
          direction={direction}
          mode="character"
          slide
          loop
        />
      ),
    ),
  },
  {
    name: 'ParticleText',
    description: 'Assemble text from particles or let it disperse.',
    category: 'Motion',
    ...variants<'assemble' | 'disperse'>(
      'Particle motion',
      [
        ['Assemble', 'assemble'],
        ['Disperse', 'disperse'],
      ],
      ({ text, style, fontSize, isDark }, direction) => (
        <ParticleText
          text={text}
          style={style}
          fontSize={fontSize}
          particleSize={1.2}
          particleColor={isDark ? '#61DAFB' : '#086181'}
          particleShape="diamond"
          particleGlow
          duration={1400}
          direction={direction}
          loop
        />
      ),
    ),
  },
  {
    name: 'ExplosionText',
    description: 'Send letters flying or pull them back together.',
    category: 'Motion',
    ...variants<'explode' | 'implode'>(
      'Explosion motion',
      [
        ['Explode', 'explode'],
        ['Implode', 'implode'],
      ],
      ({ text, style }, direction) => (
        <ExplosionText
          text={text}
          style={style}
          direction={direction}
          delay={300}
          distance={45}
          fade={false}
          loop
        />
      ),
    ),
  },
  {
    name: 'WaveText',
    description: 'Give letters a ripple of vertical motion.',
    category: 'Motion',
    render: ({ text, style }) => (
      <WaveText text={text} style={style} amplitude={12} loop />
    ),
  },
  {
    name: 'TextWave',
    description: 'Send a travelling wave left or right across the text.',
    category: 'Motion',
    ...variants<'left' | 'right'>(
      'Wave direction',
      [
        ['Left', 'left'],
        ['Right', 'right'],
      ],
      ({ text, style }, direction) => (
        <TextWave
          text={text}
          style={style}
          amplitude={12}
          direction={direction}
          loop
        />
      ),
    ),
  },
  {
    name: 'BounceText',
    description: 'Bounce letters in sequence like a spring.',
    category: 'Motion',
    render: ({ text, style }) => (
      <BounceText text={text} style={style} amplitude={15} loop />
    ),
  },
  {
    name: 'ElasticText',
    description: 'Stretch and squash the text before it settles.',
    category: 'Motion',
    render: ({ text, style }) => (
      <ElasticText text={text} style={style} amplitude={0.25} loop />
    ),
  },
  {
    name: 'BlurText',
    description: 'Bring blurred characters into sharp focus.',
    category: 'Reveal',
    render: ({ text, style }) => (
      <BlurText
        text={text}
        style={style}
        duration={1050}
        stagger={70}
        blur={10}
      />
    ),
  },
  {
    name: 'TypewriterText',
    description: 'Type and delete phrases with a blinking cursor.',
    category: 'Reveal',
    render: ({ text, style, isDark }) => (
      <TypewriterText
        texts={[text, 'Animate it.']}
        style={style}
        cursorColor={isDark ? '#61DAFB' : '#086181'}
        loop
      />
    ),
  },
  {
    name: 'ScrambleText',
    description: 'Shuffle symbols until they resolve into the message.',
    category: 'Reveal',
    render: ({ text, style }) => (
      <ScrambleText text={text} style={style} loop />
    ),
  },
  {
    name: 'MorphText',
    description: 'Swap between words with a staggered transition.',
    category: 'Reveal',
    render: ({ text, style }) => (
      <MorphText words={[text, 'In motion']} style={style} loop />
    ),
  },
  {
    name: 'GradientText',
    description: 'Move a gradient through the letters.',
    category: 'Style',
    render: ({ text, style, isDark }) => (
      <GradientText
        text={text}
        style={style}
        colors={
          isDark
            ? ['#61DAFB', '#6CA8FF', '#BAF5FF']
            : ['#086181', '#285BAC', '#0C6F88']
        }
        loop
      />
    ),
  },
  {
    name: 'ShinyText',
    description: 'Sweep a bright highlight across the text.',
    category: 'Style',
    render: ({ text, style, isDark }) => (
      <ShinyText
        text={text}
        style={style}
        color={isDark ? '#8BE7FF' : '#0A4560'}
        shineColor={isDark ? '#FFFFFF' : '#14729A'}
        loop
      />
    ),
  },
  {
    name: 'NeonText',
    description: 'Give the text a pulsing neon glow.',
    category: 'Style',
    render: ({ text, style, isDark }) => (
      <NeonText
        text={text}
        style={style}
        neonColor="#61DAFB"
        coreColor={isDark ? '#E5F8FF' : '#086181'}
        pulse
        loop
      />
    ),
  },
  {
    name: 'ThreeDText',
    description: 'Add depth and tilt the text around X or Y.',
    category: 'Style',
    ...variants<'x' | 'y'>(
      'Tilt axis',
      [
        ['X axis', 'x'],
        ['Y axis', 'y'],
      ],
      ({ text, style, isDark }, axis) => (
        <ThreeDText
          text={text}
          style={style}
          color={isDark ? '#DEF8FF' : '#086181'}
          depthColor={isDark ? '#2779A6' : '#173954'}
          rotationX={axis === 'x' ? 22 : 0}
          rotationY={axis === 'y' ? 22 : 0}
          animated
          loop
        />
      ),
    ),
  },
  {
    name: 'GlitchText',
    description: 'Distort text with jitter and optional RGB separation.',
    category: 'Style',
    ...variants<boolean>(
      'Glitch style',
      [
        ['RGB split', true],
        ['Jitter', false],
      ],
      ({ text, style }, rgbSplit) => (
        <GlitchText text={text} style={style} rgbSplit={rgbSplit} loop />
      ),
    ),
  },
  {
    name: 'CountUpText',
    description: 'Animate a number from one value to another.',
    category: 'Motion',
    render: ({ style }) => (
      <CountUpText from={0} to={2026} duration={1700} style={style} loop />
    ),
  },
];
