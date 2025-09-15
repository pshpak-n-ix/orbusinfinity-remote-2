import { useState, useEffect } from 'react';
import { ApolloProvider, type ApolloClient } from '@apollo/client';
import { EntityCacheProvider } from '@orbusinfinity-shared/apollo-cache';
import { initializeApolloClient } from '../apollo/client';
import TodoTiles from './TodoTiles';

/**
 * A wrapper component that provides Apollo context for the TodoTiles component
 * when used in module federation scenarios where the host app doesn't have Apollo configured.
 */
const TodoTilesWrapper = () => {
  const [client, setClient] = useState<ApolloClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApolloClient()
      .then(({ client: initializedClient }) => {
        setClient(initializedClient);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize Apollo client:', err);
        setError('Failed to initialize Apollo client');
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading Apollo client...</div>
      </div>
    );
  }

  return (
    <ApolloProvider client={client}>
      <EntityCacheProvider apolloClient={client}>
        <TodoTiles />
      </EntityCacheProvider>
    </ApolloProvider>
  );
};

export default TodoTilesWrapper;
