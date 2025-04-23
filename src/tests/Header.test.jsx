import React from 'react';
import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import Header from '../components/Header';

it('renderiza el encabezado con el título correcto', () => {
  render(<Header />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Cuentacuentos Accesible/i);
});
