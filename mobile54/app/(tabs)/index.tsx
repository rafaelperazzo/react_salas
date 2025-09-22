import { Image } from 'expo-image';
import { StyleSheet, Appearance, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import * as Application from 'expo-application';

export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['right', 'top', 'left']}>
          <View 
            style={{ 
              flex: 2,
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Image
              source={require('@/assets/images/dc_logo2.png')}
              style={styles.reactLogo}
              contentFit='fill'
            />
          </View>
          <View style={styles.titleContainer}>
            <ThemedText type="title">DCApp</ThemedText>
          </View>
          <View 
            style={{ 
              flex: 3,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: 16,
              padding: 16, 
              backgroundColor: 'white', 
            }}
          >
            <Button 
              mode="contained"
              buttonColor='#000000'
              onPress={() => {
                router.navigate('/(tabs)/Alocacao');
              }}
            >
              Alocação de Salas
            </Button>
          </View>
          <View style={styles.rodape}>
                <Text variant='bodySmall'>Versão: {Application.nativeApplicationVersion}</Text>
          </View>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'column',
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
  rodape: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
  },
});
