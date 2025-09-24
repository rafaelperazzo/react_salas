import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {Text, Button} from 'react-native-paper';
import supabase from "@/database/database";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from "react";
import { getObject } from "@/lib/Storage";
import { Picker } from "@react-native-picker/picker";

export default function Dialog() {
  const { sala, identificador, disciplina, horario } = useLocalSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [novaSala, setNovaSala] = useState(sala as string);
  const [lista_salas, setLista_salas] = useState<any[]>([]);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    });
  }, [])
  useEffect(() => {
    const fetch_lista_salas = async () => {
      const salas_armazenadas = await getObject('lista_salas');
      if (salas_armazenadas) {
        setLista_salas(salas_armazenadas);
      }
    };
    fetch_lista_salas();
  }, []);
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
            <View style=
              {{ width: '100%', marginTop: 16,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 4,
               }}
            >
              <Picker
                  selectedValue={novaSala}
                  onValueChange={(itemValue, itemIndex) => setNovaSala(itemValue)}
                  style={{ 
                    width: '100%',
                  }}
              >
                  <Picker.Item label="Selecione uma sala" value="" />
                  {lista_salas.map((sala) => (
                      <Picker.Item key={sala.id} label={sala.sala} value={sala.sala} />
                  ))}
              </Picker>
            </View>
            <Button
                mode="contained"
                buttonColor="#000000"
                loading={loading}
                style={{ marginTop: 16, width: '100%' }}
                onPress={
                    async () => {
                      setLoading(true);
                      const { error } = await supabase
                        .from('alocacao_2025_2')
                        .update({ sala: novaSala })
                        .eq('id', identificador);
                      if (error) {
                        alert('Erro ao atualizar a sala: ' + error.message);
                      } else {
                        alert('Sala atualizada com sucesso!');
                        router.replace('/(tabs)/Alocacao');
                      }
                      setLoading(false);
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