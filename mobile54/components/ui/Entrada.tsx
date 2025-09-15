import { Card, Text } from "react-native-paper";

type EntradaProps = {
    disciplina: string;
    sala: string;
    horario: string;
};

export default function Entrada(props: EntradaProps) {
    return (
        <Card 
            style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
            mode='elevated'
            elevation={0}
        >
            <Card.Content>
                <Text style={{ fontWeight: 'bold' }}>{props.disciplina}</Text>
                <Text>Horário: {props.horario}</Text>
                <Text style={{ fontWeight: 'bold' }}>Sala: {props.sala}</Text>
            </Card.Content>
        </Card>
    );
}