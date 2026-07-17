import { Asset } from 'expo-asset';
import React from 'react';
import { SvgUri } from 'react-native-svg';

const SOURCES = {
  difficultyDefault: require('../../assets/icon/state=default.svg'),
  difficultySelected: require('../../assets/icon/state=selected.svg'),
  difficultyLevel: require('../../assets/icon/DifficultyLevel.svg'),
  add: require('../../assets/icon/IconAdd.svg'),
  up: require('../../assets/icon/IconAdd-1.svg'),
} as const;

export type AssetIconName = keyof typeof SOURCES;

export function AssetIcon({ name, width, height }: { name: AssetIconName; width: number; height: number }) {
  const asset = Asset.fromModule(SOURCES[name]);
  return <SvgUri uri={asset.localUri ?? asset.uri} width={width} height={height} />;
}
