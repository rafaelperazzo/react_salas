import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, MD2Colors, TextInput, PaperProvider, Button, Divider, Card } from 'react-native-paper';
import { ScrollView, StyleSheet, Modal, View, RefreshControl } from "react-native";
import Entrada from "@/components/ui/Entrada";
import {Picker} from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import supabase from '../../database/database';
import { storeObject } from "@/lib/Storage";

function retornaHorarios(sala: any[],dia: string) {
  let retorno: string[] = [];
  sala.forEach((room) => {
    let reg = new RegExp(`${dia}, ([0-9]{2}:[0-9]{2} a [0-9]{2}:[0-9]{2})`, "i");
    if (room.horario.includes(dia)) {
      const n = room.horario.match(reg);
      retorno.push(n[1] + " - " + room.disciplina);
    }
  });
  return retorno.sort();
}

function ocupacaoSala(todas: any[],sala: string[]) {
  sala = todas.filter((room) => room.sala === sala);
  const segunda = retornaHorarios(sala,"Segunda-feira");
  const terca = retornaHorarios(sala,"Terça-feira");
  const quarta = retornaHorarios(sala,"Quarta-feira");
  const quinta = retornaHorarios(sala,"Quinta-feira");
  const sexta = retornaHorarios(sala,"Sexta-feira");
  const sabado = retornaHorarios(sala,"Sábado");
  return [segunda, terca, quarta, quinta, sexta, sabado];
}

export default function Alocacao() {
    const [salas, setSalas] = useState<any[]>([]); 
    const [carregando,setCarregando] = useState(true);
    const [filtro,setFiltro] = useState('');
    const [dados,setDados] = useState<any[]>([]);
    const [lista_salas,setLista_salas] = useState<any[]>([]);
    const [filtro_sala,setFiltro_sala] = useState('');
    const [segunda,setSegunda] = useState<string[]>([]);
    const [terca,setTerca] = useState<string[]>([]);
    const [quarta,setQuarta] = useState<string[]>([]);
    const [quinta,setQuinta] = useState<string[]>([]);
    const [sexta,setSexta] = useState<string[]>([]);
    const [sabado,setSabado] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const onRefresh = useCallback(() => {
      setCarregando(true);
      const fetchSalas = async () => {
        const { data, error } = await supabase.from("alocacao_2025_2").select("*");
        if (error) {
          console.error("Error fetching salas:", error);
          setCarregando(false);
        } else {
          setSalas(data);
          await storeObject('salas',data);
          setCarregando(false);
        }
      }
      fetchSalas();
    }, []);
    useEffect(() => {
      const fetchSalas = async () => {
        const { data, error } = await supabase.from("alocacao_2025_2").select("*");
        if (error) {
          console.error("Error fetching salas:", error);
          setCarregando(false);
        } else {
          setSalas(data);
          await storeObject('salas',data);
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
          //const resultados = salas.filter((sala) => sala.sala.toLowerCase().includes(busca.toLowerCase()));
          const resultados = salas.filter((sala) => sala.sala.toLowerCase()===busca.toLowerCase() || busca === '');
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
              await storeObject('lista_salas',data);
              setCarregando(false);
          }
        }
        fetch_lista_salas();
    }, [])
    function render_salas() {
        return dados.map((sala) => (
            <Entrada
                key={sala.id}
                identificador={sala.id}
                disciplina={sala.disciplina}
                sala={sala.sala}
                horario={sala.horario}
            />
        ));
    }
    function render_mapa_sala() {
      return (
        <SafeAreaView>
          <Card 
              style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
              mode='elevated'
              elevation={0}
          >
            <Card.Content>
                <ThemedText type="subtitle">Segunda-feira</ThemedText>
                {segunda.map((item, index) => (
                    <ThemedText key={index}>{item}</ThemedText>
                ))}
            </Card.Content>
          </Card>
          <Card 
              style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
              mode='elevated'
              elevation={0}
          >
            <Card.Content>
                <ThemedText type="subtitle">Terça-feira</ThemedText>
                {terca.map((item, index) => (
                    <ThemedText key={index}>{item}</ThemedText>
                ))}
            </Card.Content>
          </Card>
          <Card 
              style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
              mode='elevated'
              elevation={0}
          >
            <Card.Content>
                <ThemedText type="subtitle">Quarta-feira</ThemedText>
                {quarta.map((item, index) => (
                    <ThemedText key={index}>{item}</ThemedText>
                ))}
            </Card.Content>
          </Card>
          <Card 
              style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
              mode='elevated'
              elevation={0}
          >
            <Card.Content>
                <ThemedText type="subtitle">Quinta-feira</ThemedText>
                {quinta.map((item, index) => (
                    <ThemedText key={index}>{item}</ThemedText>
                ))}
            </Card.Content>
          </Card>
          <Card 
              style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
              mode='elevated'
              elevation={0}
          >
            <Card.Content>
                <ThemedText type="subtitle">Sexta-feira</ThemedText>
                {sexta.map((item, index) => (
                    <ThemedText key={index}>{item}</ThemedText>
                ))}
            </Card.Content>
          </Card>
          <Card 
              style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
              mode='elevated'
              elevation={0}
          >
            <Card.Content>
                <ThemedText type="subtitle">Sábado</ThemedText>
                {sabado.map((item, index) => (
                    <ThemedText key={index}>{item}</ThemedText>
                ))}
            </Card.Content>
          </Card>
        </SafeAreaView>
      )  
    }
    return (
        <PaperProvider>
          <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['right', 'top', 'left']}>
                  <ScrollView
                    refreshControl={
                      <RefreshControl refreshing={carregando} onRefresh={onRefresh} />
                    }
                  >
                      <ThemedView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                          <ThemedText type="title">Alocação de Salas</ThemedText>
                          <ActivityIndicator animating={carregando} color={MD2Colors.blue500} />
                          <TextInput
                              label="Filtrar por disciplina"
                              mode="outlined"
                              value={filtro}
                              onChangeText={text => setFiltro(text)}
                              style={{ width: '90%', marginTop: 10, marginBottom: 10 }}
                          />  
                      </ThemedView>
                      <View style={styles.picker}>
                            <Picker
                              onValueChange={
                                    (value: string) => { 
                                      if(value === 'TODAS'){
                                        setFiltro_sala('');
                                      } else {
                                        setFiltro_sala(value as string);
                                        const mapa = ocupacaoSala(salas, value);
                                        setSegunda(mapa[0]);
                                        setTerca(mapa[1]);
                                        setQuarta(mapa[2]);
                                        setQuinta(mapa[3]);
                                        setSexta(mapa[4]);
                                        setSabado(mapa[5]);
                                      }
                                    }
                                  }
                            >
                              <Picker.Item label="Todas as salas" value="TODAS" />
                              {lista_salas.map((sala:any) => (
                                  <Picker.Item key={Math.random()} label={sala.sala} value={sala.sala} />
                              ))}
                            </Picker>
                            
                      </View>
                      <ThemedView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Button
                            mode="contained"
                            buttonColor='#000000'
                            onPress={() => setShowModal(true)}
                        >
                          Mapa semanal
                        </Button>
                        
                      </ThemedView>
                      <SafeAreaView>
                        <Modal
                          visible={showModal}
                          animationType="slide"
                          onRequestClose={() => setShowModal(false)}
                        >
                          <SafeAreaView>
                            <Ionicons 
                              name="close" size={32} color="black" style={{alignSelf: 'flex-end'}}
                              onPress={() => setShowModal(false)}
                            />
                          </SafeAreaView>
                          <SafeAreaView>
                            <ScrollView>
                              {render_mapa_sala()}
                            </ScrollView>
                          </SafeAreaView>
                        </Modal>
                      </SafeAreaView> 
                      <ThemedView style={styles.container}>
                          {render_salas()}
                          <Divider />
                      </ThemedView>
                      
                  </ScrollView>
              </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        flex: 1,
        width: '90%',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#fff',
    },
    reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});