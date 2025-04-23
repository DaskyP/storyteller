import React from 'react';
import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import StoryCard from '../components/StoryCard';
// mocks mínimos necesarios
vi.mock('../components/PlayButton', () => ({
  default: () => <button>Play</button>
}));
vi.mock('../components/StoryNarrator', () => ({
  default: () => null
}));

it('muestra título y botón Play', () => {
  render(
    <StoryCard
      id={1}
      title="Bosque encantado"
      description="Un cuento mágico"
      duration={5}
      category="fantasy"
      content="Había una vez un bosque muy especial lleno de criaturas mágicas..."
      onEdit={() => {}}
      onDelete={() => {}}
      registerCommand={() => {}}
    />
  );

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Bosque encantado');
  expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
});
