import { render, screen } from '@testing-library/react';
import { ImageCard } from './ImageCard';
import { ProjectImage } from './types';
import { describe, it, expect, vi } from 'vitest';

const mockImage: ProjectImage = {
  id: '1',
  project_id: 'p1',
  image_url: 'http://example.com/image.jpg',
  title: 'Test Image',
  description: 'Test Description',
  display_order: 0,
  is_before: false,
  is_after: false,
};

describe('ImageCard', () => {
  it('renders image correctly', () => {
    render(
      <ImageCard
        image={mockImage}
        index={0}
        isDragging={false}
        isDropTarget={false}
        onDragStart={vi.fn()}
        onDragOver={vi.fn()}
        onDragEnd={vi.fn()}
        onDragLeave={vi.fn()}
        onDelete={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(screen.getByText('Image 1')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/image.jpg');
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });
});
