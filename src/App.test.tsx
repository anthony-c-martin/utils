import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const navbarHeader = screen.getByText(/Utils/i);
  expect(navbarHeader).toBeInTheDocument();
});