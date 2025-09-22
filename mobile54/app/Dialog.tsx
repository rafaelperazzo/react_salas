import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {Text, TextInput, Button} from 'react-native-paper';
import supabase from "@/database/database";
import { useLocalSearchParams } from 'expo-router';

export default function Dialog() {
  const { sala, identificador, disciplina, horario } = useLocalSearchParams();
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