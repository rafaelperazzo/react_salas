import React, { useState } from 'react'

import { View, AppState, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import supabase from '@/database/database';
import { useRouter } from 'expo-router';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white' }}
        edges={['right', 'top', 'left']}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            margin: 30,
          }}
        >
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={{ marginBottom: 12 }}
          />
          <Button
            mode="contained"
            onPress={ () => {
                signInWithEmail();
                router.navigate('/(tabs)/Alocacao');
            }}
            loading={loading}
            buttonColor='#000000'
          >
            Entrar
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}