import React from 'react'; 
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from './TodoList';

describe('TodoList Component', () => {
  test('renders To-Do List title', () => {
    render(<TodoList />);
    const heading = screen.getByText(/To-Do List/i);
    expect(heading).toBeInTheDocument();
  });

  test('allows users to add tasks', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/Enter a new task/i);
    const addButton = screen.getByText(/Add Task/i);

    fireEvent.change(input, { target: { value: 'Test Task' } });
    fireEvent.click(addButton);

    const task = screen.getByText(/Test Task/i);
    expect(task).toBeInTheDocument();
  });

  test('allows users to complete tasks', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/Enter a new task/i);
    const addButton = screen.getByText(/Add Task/i);

    fireEvent.change(input, { target: { value: 'Test Task' } });
    fireEvent.click(addButton);

    const completeButton = screen.getByText(/Complete/i);
    fireEvent.click(completeButton);

    const task = screen.getByText(/Test Task/i);
    expect(task).toHaveStyle('text-decoration: line-through');
  });

  test('allows users to delete tasks', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/Enter a new task/i);
    const addButton = screen.getByText(/Add Task/i);

    fireEvent.change(input, { target: { value: 'Test Task' } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    expect(screen.queryByText(/Test Task/i)).not.toBeInTheDocument();
  });
});
