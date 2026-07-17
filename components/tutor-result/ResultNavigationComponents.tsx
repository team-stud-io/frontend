import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ReportNumberBadge } from './ReportNumberBadge';
import { resultStyles } from './resultStyles';

const styles = resultStyles;

export function UnderbarTabs({
  horizontal = false,
  onSelect,
  selectedIndex,
  tabs,
}: {
  horizontal?: boolean;
  onSelect: (index: number) => void;
  selectedIndex: number;
  tabs: string[];
}) {
  const content = tabs.map((tab, index) => {
    const selected = selectedIndex === index;
    return (
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        key={`${tab}-${index}`}
        onPress={() => onSelect(index)}
        style={[
          styles.underbarTab,
          !horizontal && styles.underbarTabFlexible,
          selected && styles.underbarTabSelected,
        ]}
      >
        <Text style={[styles.underbarTabText, selected && styles.underbarTabTextSelected]}>{tab}</Text>
      </Pressable>
    );
  });

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.underbarTabsHorizontal}
        contentContainerStyle={styles.underbarTabsScroll}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.underbarTabs}>{content}</View>;
}

export function ResultListCard({
  actionLabel,
  items,
  onAction,
  title,
}: {
  actionLabel?: string;
  items: { title: string; body: string }[];
  onAction?: () => void;
  title: string;
}) {
  return (
    <View style={styles.listCard}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{title}</Text>
        {!!actionLabel && !!onAction && (
          <Pressable accessibilityRole="button" hitSlop={8} onPress={onAction} style={styles.listActionButton}>
            <Text style={styles.listAction}>{actionLabel}</Text>
            <Text style={styles.listActionIcon}>›</Text>
          </Pressable>
        )}
      </View>
      {items.map((item, index) => (
        <View key={`${item.title}-${index}`} style={[styles.listItem, index === items.length - 1 && styles.listItemLast]}>
          <ReportNumberBadge number={`${index + 1}`} />
          <View style={styles.listItemCopy}>
            <Text style={styles.listItemTitle}>{item.title}</Text>
            <Text style={styles.listItemBody}>{item.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
