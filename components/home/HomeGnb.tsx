import React from 'react';
import { BottomNavigation } from '../ui';

export function HomeGnb({ onReportPress, onMyPagePress, bottomInset }: { onReportPress: () => void; onMyPagePress: () => void; bottomInset: number }) {
  return <BottomNavigation activeSection="home" bottomInset={bottomInset} onAiReportPress={onReportPress} onMyPagePress={onMyPagePress} />;
}
