import React from 'react';
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from '../components/SearchBar';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SearchBar', () => {
  it('renders correctly', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Enter ZIP code')).toBeInTheDocument();
  });

  it('allows only numeric input', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Enter ZIP code') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc123' } });
    expect(input.value).toBe('');
  });

  it('shows error state for invalid ZIP code', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Enter ZIP code');
    const form = input.closest('form')!;
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.submit(form);
    expect(input.parentElement).toHaveClass('ring-2 ring-red-500');
  });

  it('navigates to weather page for valid ZIP code', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Enter ZIP code');
    const form = input.closest('form')!;
    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.submit(form);
    expect(pushMock).toHaveBeenCalledWith('/weather/12345');
  });
});
