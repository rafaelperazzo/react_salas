import { Image } from 'expo-image';
import { StyleSheet, Appearance, View, BackHandler,Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Application from 'expo-application';
import Ionicons from '@expo/vector-icons/Ionicons';
import supabase from '@/database/database';
import { Session } from '@supabase/supabase-js'

export default function HomeScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    });
  }, [])
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Confirmação', 'Fechar o aplicativo?', [
        {
          text: 'CANCELAR',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'SIM', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
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
            <Button 
              mode="contained"
              buttonColor='#f70404ff'
              onPress={() => {
                Alert.alert('Confirmação', 'Fechar o aplicativo?', [
                {
                  text: 'CANCELAR',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'SIM', onPress: () => BackHandler.exitApp()},
              ]);
              }}
            >
              Fechar
            </Button>
          </View>
          <View style={styles.rodape}>
                <Text variant='bodySmall'>Versão: {Application.nativeApplicationVersion}</Text>
                {session ?
                  <Ionicons name="checkmark-circle" size={32} color="green" 
                    onPress={async () => {
                        {
                          await supabase.auth.signOut();
                        }
                      }
                    }
                  />
                :
                  <Ionicons name="checkmark-circle" size={32} color="red" 
                    onPress={ () => {
                        {
                          router.navigate('/Login');
                        }
                      }
                    }
                  />
                }
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
