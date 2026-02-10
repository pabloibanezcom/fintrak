'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/primitives';
import styles from './Modal.module.css';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    const handleOverlayClick = useCallback(
      (e: MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      },
      [closeOnOverlayClick, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        modalRef.current?.focus();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    const classes = [styles.modal, styles[size], className]
      .filter(Boolean)
      .join(' ');

    const modalContent = (
      <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="presentation"
      >
        <div
          ref={(node) => {
            modalRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className={classes}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
          {...props}
        >
          {(title || showCloseButton) && (
            <div className={styles.header}>
              {title && (
                <h2 id="modal-title" className={styles.title}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <Icon name="Close" />
                </button>
              )}
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    );

    if (typeof window === 'undefined') return null;

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';
