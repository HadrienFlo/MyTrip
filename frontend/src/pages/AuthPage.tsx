import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Group, Stack, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import api from '../api';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  const loginForm = useForm({
    initialValues: { username: '', password: '' },
  });

  const registerForm = useForm({
    initialValues: { username: '', email: '', password: '' },
  });

  const handleLogin = async (values: { username: string; password: string }) => {
    setError('');
    try {
      const response = await api.post('/auth/login', new URLSearchParams(values), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem('token', response.data.access_token);
      window.location.href = '/dashboard';
    } catch {
      setError('Identifiants invalides');
    }
  };

  const handleRegister = async (values: { username: string; email: string; password: string }) => {
    setError('');
    try {
      await api.post('/auth/signup', values);
      setMode('login');
    } catch {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <Center mt={40}>
        <Group mt={80}>
        <Paper shadow="md" p={30} radius="md" withBorder>
            <Title order={2} mb="md">
            {mode === 'login' ? 'Connexion' : "Inscription"}
            </Title>
            {mode === 'login' ? (
            <form onSubmit={loginForm.onSubmit(handleLogin)}>
                <Stack>
                <TextInput
                    label="Nom d'utilisateur"
                    required
                    {...loginForm.getInputProps('username')}
                />
                <PasswordInput
                    label="Mot de passe"
                    required
                    {...loginForm.getInputProps('password')}
                />
                <Button type="submit" fullWidth>Se connecter</Button>
                </Stack>
            </form>
            ) : (
            <form onSubmit={registerForm.onSubmit(handleRegister)}>
                <Stack>
                <TextInput
                    label="Nom d'utilisateur"
                    required
                    {...registerForm.getInputProps('username')}
                />
                <TextInput
                    label="Email"
                    type="email"
                    required
                    {...registerForm.getInputProps('email')}
                />
                <PasswordInput
                    label="Mot de passe"
                    required
                    {...registerForm.getInputProps('password')}
                />
                <Button type="submit" fullWidth>S'inscrire</Button>
                </Stack>
            </form>
            )}
            <Group mt="md">
            <Text size="sm" style={{ cursor: 'pointer' }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? "Pas de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter'}
            </Text>
            </Group>
            {error && <Text color="red" mt="md">{error}</Text>}
        </Paper>
        </Group>
    </Center>
  );
};

export default AuthPage;
