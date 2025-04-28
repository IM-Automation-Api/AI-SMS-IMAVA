import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiKeyManager } from '@/components/ui/settings/api-key-manager';
import { useApiKeys } from '@/lib/api-key-context';

// Mock the useApiKeys hook
jest.mock('@/lib/api-key-context', () => ({
  useApiKeys: jest.fn(),
}));

describe('ApiKeyManager Component', () => {
  const mockApiKeys = [
    {
      id: '1',
      user_id: 'user1',
      provider: 'openai',
      api_key: 'sk-openai-key123',
      is_active: true,
      created_at: '2025-04-19T10:00:00Z',
    },
    {
      id: '2',
      user_id: 'user1',
      provider: 'claude',
      api_key: 'sk-claude-key456',
      is_active: false,
      created_at: '2025-04-18T09:00:00Z',
    },
  ];
  
  const mockProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'OpenAI API',
      logo_url: '/openai-logo.png',
      is_available: true,
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Claude API',
      logo_url: '/claude-logo.png',
      is_available: true,
    },
    {
      id: 'llama',
      name: 'Llama',
      description: 'Llama API',
      logo_url: '/llama-logo.png',
      is_available: true,
    },
  ];
  
  const mockAddApiKey = jest.fn();
  const mockUpdateApiKey = jest.fn();
  const mockDeleteApiKey = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementation
    useApiKeys.mockImplementation(() => ({
      apiKeys: mockApiKeys,
      providers: mockProviders,
      loading: false,
      addApiKey: mockAddApiKey,
      updateApiKey: mockUpdateApiKey,
      deleteApiKey: mockDeleteApiKey,
    }));
  });
  
  test('renders existing API keys', () => {
    render(<ApiKeyManager />);
    
    expect(screen.getByText('openai')).toBeInTheDocument();
    expect(screen.getByText('claude')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
  
  test('shows loading state when loading is true', () => {
    useApiKeys.mockImplementation(() => ({
      apiKeys: [],
      providers: [],
      loading: true,
      addApiKey: mockAddApiKey,
      updateApiKey: mockUpdateApiKey,
      deleteApiKey: mockDeleteApiKey,
    }));
    
    render(<ApiKeyManager />);
    
    expect(screen.getByText('Loading API keys...')).toBeInTheDocument();
  });
  
  test('shows empty state when no API keys exist', () => {
    useApiKeys.mockImplementation(() => ({
      apiKeys: [],
      providers: mockProviders,
      loading: false,
      addApiKey: mockAddApiKey,
      updateApiKey: mockUpdateApiKey,
      deleteApiKey: mockDeleteApiKey,
    }));
    
    render(<ApiKeyManager />);
    
    expect(screen.getByText('No API keys added yet. Add your first API key below.')).toBeInTheDocument();
  });
  
  test('allows adding a new API key', () => {
    render(<ApiKeyManager />);
    
    // Select a provider
    const providerSelect = screen.getByLabelText('Provider');
    fireEvent.change(providerSelect, { target: { value: 'llama' } });
    
    // Enter API key
    const apiKeyInput = screen.getByLabelText('API Key');
    fireEvent.change(apiKeyInput, { target: { value: 'sk-llama-key789' } });
    
    // Click add button
    const addButton = screen.getByText('Add API Key');
    fireEvent.click(addButton);
    
    expect(mockAddApiKey).toHaveBeenCalledWith('llama', 'sk-llama-key789');
  });
  
  test('allows updating an existing API key', () => {
    render(<ApiKeyManager />);
    
    // Find the first API key input
    const apiKeyInputs = screen.getAllByPlaceholderText('Enter API key');
    const firstApiKeyInput = apiKeyInputs[0];
    
    // Change the API key
    fireEvent.change(firstApiKeyInput, { target: { value: 'sk-openai-new-key' } });
    
    // Click save button
    const saveButtons = screen.getAllByText('Save');
    const firstSaveButton = saveButtons[0];
    fireEvent.click(firstSaveButton);
    
    expect(mockUpdateApiKey).toHaveBeenCalledWith('1', 'sk-openai-new-key', true);
  });
  
  test('allows toggling API key active state', () => {
    render(<ApiKeyManager />);
    
    // Find the active toggle for the first API key
    const activeToggles = screen.getAllByLabelText(/active/i);
    const firstActiveToggle = activeToggles[0];
    
    // Toggle it
    fireEvent.click(firstActiveToggle);
    
    expect(mockUpdateApiKey).toHaveBeenCalledWith('1', 'sk-openai-key123', false);
  });
  
  test('allows deleting an API key with confirmation', () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    render(<ApiKeyManager />);
    
    // Find delete buttons
    const deleteButtons = screen.getAllByLabelText('Delete API key');
    const firstDeleteButton = deleteButtons[0];
    
    // Click delete
    fireEvent.click(firstDeleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteApiKey).toHaveBeenCalledWith('1');
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });
  
  test('does not delete when confirmation is cancelled', () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);
    
    render(<ApiKeyManager />);
    
    // Find delete buttons
    const deleteButtons = screen.getAllByLabelText('Delete API key');
    const firstDeleteButton = deleteButtons[0];
    
    // Click delete
    fireEvent.click(firstDeleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteApiKey).not.toHaveBeenCalled();
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });
});
