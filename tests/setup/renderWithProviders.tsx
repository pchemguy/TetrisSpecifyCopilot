import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';

function TestProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  });
}