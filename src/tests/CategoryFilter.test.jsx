import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryFilter from '../components/CategoryFilter';

describe('CategoryFilter', () => {
  it('llama a setSelectedCategory cuando se hace clic en una categoría', () => {
    const mockSetCategory = vi.fn();
    render(
      <CategoryFilter 
        categories={['fantasy', 'adventure']} 
        setSelectedCategory={mockSetCategory}
        selectedCategory=""
      />
    );

    fireEvent.click(screen.getByText('fantasy'));
    expect(mockSetCategory).toHaveBeenCalledWith('fantasy');
  });
});
