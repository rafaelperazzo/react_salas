import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
}: Props) {
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View
          style={[
            styles.header,
          ]}>
          {headerImage}
        </View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    
  },
});
