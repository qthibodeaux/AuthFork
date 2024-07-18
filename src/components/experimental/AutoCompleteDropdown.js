import React, { useState, useEffect } from 'react';
import { Input, Spin, List } from 'antd';
import debounce from 'lodash.debounce';
import supabase from './supabaseClient'; // Ensure to configure Supabase client properly

const AutoCompleteDropdown = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('name', `%${searchQuery}%`);
      if (error) throw error;

      setResults(data);
    } catch (error) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchResults = debounce(fetchResults, 300);

  useEffect(() => {
    debouncedFetchResults(query);
    return () => debouncedFetchResults.cancel();
  }, [query]);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search profiles..."
      />
      {loading && <Spin />}
      {error && <div>{error}</div>}
      {!loading && results.length > 0 && (
        <List
          bordered
          dataSource={results}
          renderItem={(item) => (
            <List.Item key={item.id}>{item.name}</List.Item>
          )}
        />
      )}
    </div>
  );
};

export default AutoCompleteDropdown;
