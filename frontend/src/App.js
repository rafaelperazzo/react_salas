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
import Select, { SelectChangeEvent } from '@mui/material/Select';

console.log(process.env.REACT_APP_SUPABASE_URL);
console.log(process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY);

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

function App() {
  const [salas, setSalas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [dados,setDados] = useState([]);
  const [lista_salas,setLista_salas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState("JVS::02");
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
                  <TableCell align="right">{sala.sala}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
    </div>
  );
}

export default App;
