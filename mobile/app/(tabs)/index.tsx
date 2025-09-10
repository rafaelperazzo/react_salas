import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['right', 'top', 'left']}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
            <Image
              source={require('@/assets/images/dc_logo2.png')}
              style={styles.reactLogo}
            />
          }>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">DCapp</ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <Button 
              variant="solid" size="md" action="primary"
              onPress={
                () => {
                  router.navigate('/(tabs)/Alocacao');
                }
              }
            >
              <ButtonText>Alocação de Salas</ButtonText>
            </Button>
          </ThemedView>
          
        </ParallaxScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
