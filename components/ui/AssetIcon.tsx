import { Asset } from 'expo-asset';
import React from 'react';
import { SvgUri } from 'react-native-svg';

const SOURCES = {
  difficultyDefault: require('../../assets/icon/state=default.svg'),
  difficultySelected: require('../../assets/icon/state=selected.svg'),
  difficultyLevel: require('../../assets/icon/DifficultyLevel.svg'),
  add: require('../../assets/icon/IconAdd.svg'),
  up: require('../../assets/icon/IconAdd-1.svg'),
  calendar: require('../../assets/icon/Report/Icon/Calendar.svg'),
  notificationActive: require('../../assets/icon/Icon/state=active.svg'),
  homeDefault: require('../../assets/icon/Icon/NavigationBar/Home/Default.svg'),
  homeSelected: require('../../assets/icon/Icon/NavigationBar/Home/Selected.svg'),
  aiReportDefault: require('../../assets/icon/Icon/NavigationBar/AiReport/Default.svg'),
  aiReportSelected: require('../../assets/icon/Icon/NavigationBar/AiReport/Selected.svg'),
  studyRoomDefault: require('../../assets/icon/Icon/NavigationBar/StudyRoom/Default.svg'),
  studyRoomSelected: require('../../assets/icon/Icon/NavigationBar/StudyRoom/Selected.svg'),
  myPageDefault: require('../../assets/icon/Icon/NavigationBar/MyPage/Default.svg'),
  myPageSelected: require('../../assets/icon/Icon/NavigationBar/MyPage/Selected.svg'),
} as const;

export type AssetIconName = keyof typeof SOURCES;

export function AssetIcon({ name, width, height }: { name: AssetIconName; width: number; height: number }) {
  const asset = Asset.fromModule(SOURCES[name]);
  return <SvgUri uri={asset.localUri ?? asset.uri} width={width} height={height} />;
}
