import { useState,useEffect } from 'react'
import './App.css';
import { createClient } from "@supabase/supabase-js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

function retornaHorarios(sala,dia) {
  let retorno = [];
  sala.forEach((room) => {
    let reg = new RegExp(`${dia}, ([0-9]{2}:[0-9]{2} a [0-9]{2}:[0-9]{2})`, "i");
    if (room.horario.includes(dia)) {
      const n = room.horario.match(reg);
      retorno.push(n[1] + " - " + room.disciplina);
    }
  });
  return retorno.sort();
}

function ocupacaoSala(todas,sala) {
  sala = todas.filter((room) => room.sala === sala);
  const segunda = retornaHorarios(sala,"Segunda-feira");
  const terca = retornaHorarios(sala,"Terça-feira");
  const quarta = retornaHorarios(sala,"Quarta-feira");
  const quinta = retornaHorarios(sala,"Quinta-feira");
  const sexta = retornaHorarios(sala,"Sexta-feira");
  const sabado = retornaHorarios(sala,"Sábado");
  return [segunda, terca, quarta, quinta, sexta, sabado];
}

function App() {
  const [salas, setSalas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [dados,setDados] = useState([]);
  const [lista_salas,setLista_salas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState("TODAS");
  const [segunda,setSegunda] = useState([]);
  const [terca,setTerca] = useState([]);
  const [quarta,setQuarta] = useState([]);
  const [quinta,setQuinta] = useState([]);
  const [sexta,setSexta] = useState([]);
  const [sabado,setSabado] = useState([]);
  useEffect(() => {
    const fetchSalas = async () => {
      const { data, error } = await supabase.from("salas_2025_2").select("*");
      if (error) {
        console.error("Error fetching salas:", error);
      } else {
        setSalas(data);
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
    const fetch_lista_salas = async () => {
      const { data, error } = await supabase.from("salas").select("*");
      if (error) {
        console.error("Error fetching lista_salas:", error);
      } else {
        setLista_salas(data);
      }
    }
    fetch_lista_salas();
  }, [])
  return (
    <div className="App">
      <div>
        <h1>Alocação de Salas do DC - 2025.2</h1>
      </div>
      <div>
          <Stack direction="row" spacing={2}>
              <TextField id="outlined-basic" label="Filtro por Disciplina" variant="outlined" 
                onChange={
                  (e) => {
                    setFiltro(e.target.value);
                  }
                }
              />
              <Select
                labelId="select-sala-label"
                id="select-sala"
                value={salaSelecionada}
                label="Sala"
                onChange={(e) => {
                  setSalaSelecionada(e.target.value);
                  if (e.target.value === "TODAS") {
                    setDados(salas);
                  } else {
                    const resultados = salas.filter((sala) => sala.sala.toLowerCase().includes(e.target.value.toLowerCase()));
                    setDados(resultados);
                  }
                }}
              >
                <MenuItem value="TODAS">
                  TODAS
                </MenuItem>
                {lista_salas.map((sala) => (
                  <MenuItem key={sala.sala} value={sala.sala}>
                    {sala.sala}
                  </MenuItem>
                ))}
              </Select>
          </Stack>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Turma</TableCell>
                <TableCell align="right">Disciplina</TableCell>
                <TableCell align="right">Departamento</TableCell>
                <TableCell align="right">Horário</TableCell>
                <TableCell align="right">Sala</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.map((sala) => (
                <TableRow key={sala.id}>
                  <TableCell component="th" scope="row">
                    {sala.turma}
                  </TableCell>
                  <TableCell align="right">{sala.disciplina}</TableCell>
                  <TableCell align="right">{sala.departamento}</TableCell>
                  <TableCell align="right">{sala.horario}</TableCell>
                  <TableCell align="right"
                      onClick={
                        () => {
                          setSalaSelecionada(sala.sala);
                          const resultados = salas.filter((room) => room.sala.toLowerCase().includes(sala.sala.toLowerCase()));
                          setDados(resultados);
                          const mapa = ocupacaoSala(salas, sala.sala);
                          setSegunda(mapa[0]);
                          setTerca(mapa[1]);
                          setQuarta(mapa[2]);
                          setQuinta(mapa[3]);
                          setSexta(mapa[4]);
                          setSabado(mapa[5]);
                        }
                      }
                  >
                    {sala.sala}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
      <div>
          <h2>Ocupação da Sala: {salaSelecionada}</h2>
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="ocupacao sala">
                <TableHead>
                  <TableRow>
                    <TableCell>Segunda-feira</TableCell>
                    <TableCell>Terça-feira</TableCell>
                    <TableCell>Quarta-feira</TableCell>
                    <TableCell>Quinta-feira</TableCell>
                    <TableCell>Sexta-feira</TableCell>
                    <TableCell>Sábado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {segunda.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell>
                      {terca.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell>
                      {quarta.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell>
                      {quinta.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell>
                      {sexta.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </TableCell>
                    <TableCell>
                      {sabado.map((item, index) => (
                        <p key={index}>{item}</p>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
      </div>
    </div>
  );
}

export default App;
