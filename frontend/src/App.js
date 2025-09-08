import { useState,useEffect } from 'react'
import './App.css';
import { createClient } from "@supabase/supabase-js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    const fetchSalas = async () => {
      const { data, error } = await supabase.from("alocacao_2025_2").select("*");
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
        setCarregando(false);
      }
    }
    fetch_lista_salas();
  }, [])
  return (
    <div className="App">
      <div>
        <CircularProgress 
          style={{ display: carregando ? 'block' : 'none', position: 'absolute', top: '50%', left: '50%' }}
        />
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
                    setSegunda([]);
                    setTerca([]);
                    setQuarta([]);
                    setQuinta([]);
                    setSexta([]);
                    setSabado([]);
                  } else {
                    const resultados = salas.filter((sala) => sala.sala.toLowerCase().includes(e.target.value.toLowerCase()));
                    setDados(resultados);
                    const mapa = ocupacaoSala(salas, e.target.value);
                    setSegunda(mapa[0]);
                    setTerca(mapa[1]);
                    setQuarta(mapa[2]);
                    setQuinta(mapa[3]);
                    setSexta(mapa[4]);
                    setSabado(mapa[5]);
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
        <Divider />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Turma</StyledTableCell>
                <StyledTableCell align="right">Disciplina</StyledTableCell>
                <StyledTableCell align="right">Departamento</StyledTableCell>
                <StyledTableCell align="right">Horário</StyledTableCell>
                <StyledTableCell align="right">Sala</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {dados.map((sala) => (
                <StyledTableRow key={sala.id}>
                  <StyledTableCell component="th" scope="row">
                    {sala.turma}
                  </StyledTableCell>
                  <StyledTableCell align="right">{sala.disciplina}</StyledTableCell>
                  <StyledTableCell align="right">-</StyledTableCell>
                  <StyledTableCell align="right">{sala.horario}</StyledTableCell>
                  <StyledTableCell align="right"
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
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
      <Divider />
      <div>
          <h2 style={{ backgroundColor: 'lightgray' }}>Ocupação da Sala: {salaSelecionada}</h2>
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650}} aria-label="ocupacao sala">
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
