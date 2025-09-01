import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '../UI';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  availableLanguages: string[];
  availableTags: string[];
}

interface SearchFilters {
  query: string;
  languages: string[];
  tags: string[];
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  availableLanguages,
  availableTags
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    languages: [],
    tags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      onSearch(filters);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  useEffect(() => {
    return debouncedSearch;
  }, [debouncedSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    
    handleFilterChange('languages', newLanguages);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      languages: [],
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="advanced-search mb-4">
      <div className="card">
        <div className="card-body">
          {/* Basic Search */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search snippets by title or description..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Simple' : 'Advanced'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="advanced-filters">
              <div className="row g-3">
                {/* Languages */}
                <div className="col-md-6">
                  <label className="form-label">Languages</label>
                  <div className="filter-tags">
                    {availableLanguages.map(language => (
                      <Badge
                        key={language}
                        text={language}
                        color={filters.languages.includes(language) ? 'primary' : 'secondary'}
                        onClick={() => toggleLanguage(language)}
                        className="me-1 mb-1 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="col-md-6">
                  <label className="form-label">Tags</label>
                  <div className="filter-tags" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        text={tag}
                        color={filters.tags.includes(tag) ? 'primary' : 'secondary'}
                        onClick={() => toggleTag(tag)}
                        className="me-1 mb-1 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Complexity */}
                <div className="col-md-4">
                  <label className="form-label">Complexity</label>
                  <select
                    className="form-select"
                    value={filters.complexity || ''}
                    onChange={(e) => handleFilterChange('complexity', e.target.value || undefined)}
                  >
                    <option value="">Any</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="col-md-4">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="col-md-4">
                  <label className="form-label">Order</label>
                  <select
                    className="form-select"
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-3">
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={resetFilters}
                >
                  🔄 Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
