// src/tests/useVoiceCommands.test.jsx
import { renderHook } from '@testing-library/react';
import { it, expect } from 'vitest';
import useVoiceCommands from '../hooks/useVoiceCommands';

it('inicializa sin comandos registrados', () => {
  const { result } = renderHook(() => useVoiceCommands());
  expect(typeof result.current.registerCommand).toBe('function');
});
