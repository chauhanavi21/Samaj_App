import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = Omit<ScrollViewProps, 'contentContainerStyle'> & {
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
};

export function KeyboardSafeScroll({
  children,
  keyboardVerticalOffset,
  keyboardShouldPersistTaps = 'handled',
  contentContainerStyle,
  ...rest
}: Props) {
  const insets = useSafeAreaInsets();

  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;
  const offset = keyboardVerticalOffset ?? 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={behavior} keyboardVerticalOffset={offset}>
      <ScrollView
        {...rest}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentContainerStyle={[
          { paddingBottom: (insets.bottom || 0) + 24 },
          contentContainerStyle,
        ]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
