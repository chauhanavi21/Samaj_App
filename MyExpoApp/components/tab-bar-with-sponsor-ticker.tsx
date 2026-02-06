import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { contentAPI } from '@/services/api';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fontScale, hp, padding } from '@/utils/responsive';

function formatSponsorAmount(amount: any) {
  const raw = String(amount ?? '').trim();
  if (!raw) return '';
  if (raw.includes('₹')) return raw;
  if (/^rs\.?\s*/i.test(raw)) return raw;
  if (/^\d/.test(raw)) return `₹${raw}`;
  return raw;
}

function SponsorTicker() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const translateX = useRef(new Animated.Value(0)).current;

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const text = useMemo(() => {
    const items = (sponsors || [])
      .map((s) => {
        const name = String(s?.name ?? '').trim();
        const amount = formatSponsorAmount(s?.amount);
        if (!name || !amount) return null;
        return `${name} • ${amount}`;
      })
      .filter(Boolean) as string[];

    if (items.length === 0) return '';
    return items.join('   |   ');
  }, [sponsors]);

  const spacer = useMemo(() => (text ? '   |   ' : ''), [text]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await contentAPI.getSponsors({ page: 1, limit: 100 });
        const data = res?.data ?? [];
        if (!cancelled) setSponsors(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setSponsors([]);
      }
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    translateX.stopAnimation();
    translateX.setValue(0);

    if (!text || containerWidth <= 0 || textWidth <= 0) return;

    const distance = textWidth;
    const pixelsPerSecond = 40;
    const duration = Math.max(8000, Math.round((distance / pixelsPerSecond) * 1000));

    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -distance,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    anim.start();
    return () => anim.stop();
  }, [text, containerWidth, textWidth, translateX]);

  if (!text) return null;

  const backgroundColor = colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#333333' : '#E0E0E0';

  return (
    <View
      style={[
        styles.tickerContainer,
        {
          backgroundColor,
          borderTopColor: borderColor,
          paddingBottom: Math.max(0, insets.bottom ? 0 : 0),
        },
      ]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.tickerClip}>
        <Animated.View style={[styles.tickerRow, { transform: [{ translateX }] }]}>
          <View style={styles.tickerInnerRow}>
            <Text
              style={[
                styles.tickerText,
                styles.tickerTextNoShrink,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}
              onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            >
              {text}
              {spacer}
            </Text>
            <Text
              style={[
                styles.tickerText,
                styles.tickerTextNoShrink,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}
            >
              {text}
              {spacer}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export function TabBarWithSponsorTicker(props: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <SponsorTicker />
      <BottomTabBar {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  tickerContainer: {
    height: hp(4.2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: padding.md,
  },
  tickerClip: {
    overflow: 'hidden',
  },
  tickerRow: {
    flexDirection: 'row',
  },
  tickerInnerRow: {
    flexDirection: 'row',
  },
  tickerText: {
    fontSize: fontScale(13),
    fontWeight: '700',
  },
  tickerTextNoShrink: {
    flexShrink: 0,
  },
});
