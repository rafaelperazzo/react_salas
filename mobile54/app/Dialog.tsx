import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {Text, TextInput, Button} from 'react-native-paper';
import supabase from "@/database/database";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from "react";

export default function Dialog() {
  const { sala, identificador, disciplina, horario } = useLocalSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null); 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    });
  }, [])
  if (!session) {
    return (
      <View style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        
      }}>
        <Text variant="headlineMedium" style={{ marginBottom: 20 }}>MUDANÇA DE SALA</Text>
        <Text variant="bodyLarge" style={{ textAlign: 'center', margin: 20, marginBottom: 20 }}>Você precisa estar logado para fazer uma mudança de sala.</Text>
        <Button
            mode="contained"
            buttonColor="#000000"
            onPress={() => {
              router.push('/Login');
            }}
        >
            Fazer Login
        </Button>
      </View>
    );
      
  }
  else 
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "white" }}
        edges={["right", "top", "left"]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            margin: 30,
          }}
        >
            <Text variant="headlineMedium">MUDANÇA DE SALA</Text>
            <Text variant="headlineSmall">{disciplina}</Text>
            <Text variant="bodyMedium">{horario}</Text>
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 16,
            backgroundColor: "white",
          }}
        >
            <TextInput
                label="Sala"
                mode="outlined"
                style={{ width: '100%' }}
                value={sala as string}
            />
            <Button
                mode="contained"
                buttonColor="#000000"
                style={{ marginTop: 16, width: '100%' }}
                onPress={
                    () => {
                      router.navigate('/Login');
                    }
                }
            >
                Confirmar
            </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}