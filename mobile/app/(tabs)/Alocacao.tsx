import { Image } from 'expo-image';
import { StyleSheet, ActivityIndicator} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { VStack } from '@/components/ui/vstack';
import { createClient } from "@supabase/supabase-js";
import { useState,useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_KEY ?? ''
);

export default function Alocacao() {
  const [salas, setSalas] = useState<any[]>([]); 
  const [carregando,setCarregando] = useState(true);
  const [filtro,setFiltro] = useState('');
  const [dados,setDados] = useState<any[]>([]);
  const [lista_salas,setLista_salas] = useState<any[]>([]);
  const [filtro_sala,setFiltro_sala] = useState('TODAS');
  useEffect(() => {
    const fetchSalas = async () => {
      const { data, error } = await supabase.from("alocacao_2025_2").select("*");
      if (error) {
        console.error("Error fetching salas:", error);
        setCarregando(false);
      } else {
        setSalas(data);
        setCarregando(false);
      }
    }
    fetchSalas();
  }, [])
  useEffect(() => {
    const aplicarFiltro = async () => {
      const busca = filtro;
      const resultados = salas.filter((sala) => sala.disciplina.toLowerCase().includes(busca.toLowerCase()));
      setDados(resultados);
    }
    aplicarFiltro()
  }, [salas,filtro])
  useEffect(() => {
    const aplicarFiltroSala = async () => {
      const busca = filtro_sala;
      const resultados = salas.filter((sala) => sala.sala.toLowerCase().includes(busca.toLowerCase()));
      setDados(resultados);
    }
    aplicarFiltroSala()
  }, [salas,filtro_sala])
  useEffect(() => {
    const fetch_lista_salas = async () => {
      const { data, error } = await supabase.from("salas").select("*").order('sala', { ascending: true });
      if (error) {
        console.error("Error fetching lista_salas:", error);
      } else {
        setLista_salas(data);
        setCarregando(false);
      }
    }
    fetch_lista_salas();
  }, []) 
  return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                    <Image
                      source={require('@/assets/images/dc_logo.png')}
                      style={styles.reactLogo}
                    />
                  }>
            <ActivityIndicator size="large" color="#0000ff" animating={carregando} />
            <ThemedView style={styles.container}>
                <ThemedText type="title">Alocação de Salas</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <VStack space={2} style={{width: '90%', marginTop: 10}}>
                  <Input
                      variant="outline"
                      size="md"
                      isDisabled={false}
                      isInvalid={false}
                      isReadOnly={false}
                  >
                      <InputField 
                        placeholder="Disciplina" 
                        value={filtro}
                        onChangeText={setFiltro}
                      />
                  </Input>
                </VStack>
                  <VStack space={2} style={{width: '90%', marginTop: 10}}>
                    <Select 
                        onValueChange={
                            (value) => { 
                              if(value === 'TODAS'){
                                setFiltro_sala('');
                              } else {
                                setFiltro_sala(value);
                              }
                            }
                          } defaultValue="TODAS" >
                        <SelectTrigger variant="rounded" size="sm">
                            <SelectInput placeholder="Selecione a sala" />
                            <SelectIcon />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>
                                <SelectItem value="TODAS" label="Todas as salas" />
                                {lista_salas.map((sala:any) => (
                                    <SelectItem key={Math.random()} value={sala.sala} label={sala.sala} />
                                ))}
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                  </VStack>
            </ThemedView>
            <ThemedView style={styles.container}>
                    {dados.map((sala:any) => (
                        <Card key={sala.id} style={{ marginBottom: 10, padding: 10, width: '90%' }}>
                            <VStack space={2}>
                                <Heading size="md">{sala.disciplina}</Heading>
                                <Heading size="sm" className="mb-1">
                                  {sala.horario}
                                </Heading>
                                <Text>Sala: {sala.sala}</Text>
                            </VStack>
                        </Card>
                    ))}
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reactLogo: {
    height: '80%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});