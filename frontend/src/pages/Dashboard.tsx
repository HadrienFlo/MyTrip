import React, { useEffect, useState } from 'react';
import { IconXboxX } from '@tabler/icons-react';
import { Card, Title, Text, Button, CloseButton, Group, Stack, Container, TextInput, Textarea, Modal, Grid, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import api from '../api';

interface Trip {
    id: number;
    title: string;
    description?: string;
}

const Dashboard: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const form = useForm({
        initialValues: { title: '', description: '' },
    });

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/trips', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrips(res.data);
        } catch {
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const handleAddTrip = async (values: { title: string; description: string }) => {
        const token = localStorage.getItem('token');
        try {
            await api.post('/trips', values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            form.reset();
            fetchTrips();
        } catch {
            // gestion d'erreur possible
        }
    };

    const openTripModal = (trip: Trip) => {
        setSelectedTrip(trip);
        setOpened(true);
    };

    const deleteTrip = async (trip: Trip) => {
        const token = localStorage.getItem('token');
        try {
            await api.delete(`/trips/${trip.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTrips();
        } catch {
            // gestion d'erreur possible
        }
    };

    return (
        //<Container strategy="grid" size="xl" mt={40}>

            <Grid grow mt={40}>
                <Grid.Col span={2} offset={2}>
                    <Center><Title order={2} mb="md">Ajouter un voyage</Title></Center>
                    <form onSubmit={form.onSubmit(handleAddTrip)}>
                        <TextInput
                            label="Titre"
                            placeholder="Titre du voyage"
                            required
                            {...form.getInputProps('title')}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Description du voyage"
                            minRows={1}
                            {...form.getInputProps('description')}
                        />
                        <Group justify="flex-start" mt="md">
                            <Button type="submit">Ajouter</Button>
                        </Group>
                    </form>
                
                </Grid.Col>
                <Grid.Col span={4} offset={2}>
                    <Center><Title order={2} mb="md">Mes voyages</Title></Center>
                    {loading ? (
                        <Text>Chargement...</Text>
                    ) : trips.length === 0 ? (
                        <Text>Aucun voyage pour le moment.</Text>
                    ) : (
                        <Stack>
                            {trips.map(trip => (
                                <Card key={trip.id} shadow="sm" p="lg" radius="md" withBorder>
                                    <Group justify="space-between">
                                        <div>
                                                <Title order={4}>{trip.title}</Title>
                                                <Text size="sm" color="dimmed">{trip.description}</Text>
                                        </div>
                                        <Group>
                                                <Button variant="light" onClick={() => openTripModal(trip)}>Voir</Button>
                                                <CloseButton icon={<IconXboxX size={18} stroke={2.5} />} onClick={() => deleteTrip(trip)} />
                                        </Group>
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    )}
                    <Modal
                        opened={opened}
                        onClose={() => setOpened(false)}
                        fullScreen
                        //title={selectedTrip?.title}
                    >
                        <Center><Title order={2} mb="md">{selectedTrip?.title}</Title></Center>
                        <Text size="lg" mb="md">{selectedTrip?.description}</Text>
                        {/* Ici tu pourras ajouter la gestion des étapes, édition, etc. */}
                    </Modal>
                </Grid.Col>
                <Grid.Col span={2}>
                </Grid.Col>
            </Grid>
    );
};

export default Dashboard;
