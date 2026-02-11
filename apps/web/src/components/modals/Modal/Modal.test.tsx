import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => (
      <span data-testid="modal-icon">{name}</span>
    ),
  };
});

describe('Modal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders dialog content and closes on close button click', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Confirm Action">
        <p>Delete transaction?</p>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Delete transaction?')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on overlay click and Escape by default', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <p>Modal body</p>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay).toBeTruthy();

    fireEvent.click(overlay as HTMLElement);
    fireEvent.keyDown(overlay as HTMLElement, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('does not close on overlay click when disabled', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} closeOnOverlayClick={false}>
        <p>Locked modal</p>
      </Modal>
    );

    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay as HTMLElement);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('restores body overflow on unmount', async () => {
    const { unmount } = render(
      <Modal isOpen onClose={vi.fn()}>
        Content
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
    unmount();

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });
  });
});
