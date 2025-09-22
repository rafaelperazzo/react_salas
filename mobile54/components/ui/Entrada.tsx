import { Card, Text } from "react-native-paper"; 
import { useRouter } from 'expo-router';

type EntradaProps = {
    disciplina: string;
    sala: string;
    horario: string;
    identificador: string;
};

export default function Entrada(props: EntradaProps) {
    const router = useRouter();
    return (
        <Card 
            style={{ marginBottom: 1, padding: 1, width: '90%', backgroundColor: '#ffffffff' }}
            mode='elevated'
            elevation={0}
            onPress={
                () => {
                    router.push(`/Dialog?sala=${encodeURIComponent(props.sala)}&identificador=${encodeURIComponent(props.identificador)}&disciplina=${encodeURIComponent(props.disciplina)}&horario=${encodeURIComponent(props.horario)}`);
                }
            }
        >
            <Card.Content>
                <Text style={{ fontWeight: 'bold' }}>{props.disciplina}</Text>
                <Text>Horário: {props.horario}</Text>
                <Text style={{ fontWeight: 'bold' }}>Sala: {props.sala}</Text>
            </Card.Content>
        </Card>
    );
}