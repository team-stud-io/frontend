



import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Tab } from './Tab';

export interface TabSectionProps {
  tabs: string[];
  selectedIndex: number;
  onTabPress: (index: number) => void;
  style?: object;
  testID?: string;
}

export function TabSection({
  tabs,
  selectedIndex,
  onTabPress,
  style,
  testID,
}: TabSectionProps) {
  return (
    <View testID={testID} style={[styles.root, style]}>
      {tabs.map((label, index) => (
        <Tab
          key={index}
          label={label}
          state={selectedIndex === index ? 'Selected' : 'Default'}
          onPress={() => onTabPress(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors['Line.Normal.Strong'],
    backgroundColor: Colors['Fill.Normal.Normal'],
  },
});
