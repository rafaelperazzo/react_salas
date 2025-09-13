import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, MD2Colors, TextInput, PaperProvider } from 'react-native-paper';
import { createClient } from "@supabase/supabase-js";
import { ScrollView, StyleSheet } from "react-native";
import Entrada from "@/components/ui/Entrada";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_KEY ?? ''
);

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

function ocupacaoSala(todas: any[],sala: any[]) {
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
    const [segunda,setSegunda] = useState([]);
    const [terca,setTerca] = useState([]);
    const [quarta,setQuarta] = useState([]);
    const [quinta,setQuinta] = useState([]);
    const [sexta,setSexta] = useState([]);
    const [sabado,setSabado] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalSala, setModalSala] = useState('');
    const [modalHorario, setModalHorario] = useState('');
    const [modalDisciplina, setModalDisciplina] = useState('');
    const [expanded, setExpanded] = useState(true);
    const openMenu = () => setShowModal(true);
    const closeMenu = () => setShowModal(false);
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
            setCarregando(false);
        }
        }
        fetch_lista_salas();
    }, [])
    function render_salas() {
        return dados.map((sala) => (
            <Entrada
                key={sala.id}
                disciplina={sala.disciplina}
                sala={sala.sala}
                horario={sala.horario}
            />
        ));
    }
    return (
        <PaperProvider>
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['right', 'top', 'left']}>
                <ScrollView>
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
                    <ThemedView style={styles.container}>
                        
                        {render_salas()}
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
    reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});