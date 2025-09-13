import { Modal, List} from "react-native-paper";
import { ScrollView } from "react-native";

type ListaSalasProps = {
    salas: any[];
    visible: boolean;
};

export default function ListaSalas({ salas, visible }: ListaSalasProps) {
    const containerStyle = {backgroundColor: 'white', padding: 20};
    return (
            <Modal visible={visible} onDismiss={() => {}} contentContainerStyle={containerStyle}>
                <ScrollView>
                    <List.Section>
                        {salas.map((sala, index) => (
                            <List.Item key={index} title={sala.sala} />
                        ))}
                    </List.Section>
                </ScrollView>
            </Modal>
    );
}
