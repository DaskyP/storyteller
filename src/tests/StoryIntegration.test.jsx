/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../pages/Home';
import { vi } from 'vitest';
import axios from 'axios';

// Mock de axios
vi.mock('axios');

const mockStories = [
  {
    id: 1,
    title: "El dragón",
    description: "Una historia de aventura",
    duration: "5",
    category: "Aventuras",
    content: "Había una vez un dragón..."
  },
  {
    id: 2,
    title: "La ciencia es divertida",
    description: "Una historia educativa",
    duration: "3",
    category: "Educativos",
    content: "Aprendamos sobre ciencia..."
  }
];

describe('Integración: filtrado de historias por categoría', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockStories });
  });

  it('filtra y muestra solo las historias de la categoría seleccionada', async () => {
    render(<Home />);

    // Espera a que cargue "El dragón"
    await screen.findByText("El dragón");

    // Simula clic en "Aventuras"
    fireEvent.click(screen.getByText("Aventuras"));

    // Espera a que solo "El dragón" esté en pantalla
    await waitFor(() => {
      const titles = screen.getAllByRole('heading').map(el => el.textContent);
      expect(titles).toContain("El dragón");
      expect(titles).not.toContain("La ciencia es divertida");
    });
  });
});
