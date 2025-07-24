import React, { useState } from 'react';
import { MantineProvider, ActionIcon, Group } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import '@mantine/core/styles.css';
import './App.css';

const App: React.FC = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const toggleColorScheme = () => setColorScheme((prev: 'light' | 'dark') => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <MantineProvider theme={{ primaryColor: 'blue' }} forceColorScheme={colorScheme} withCssVariables>
      <Group justify="flex-end" p="md">
        <ActionIcon
          variant="outline"
          color={colorScheme === 'dark' ? 'yellow' : 'blue'}
          onClick={toggleColorScheme}
          title="Toggle color scheme"
          size="lg"
        >
          {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>
      </Group>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
