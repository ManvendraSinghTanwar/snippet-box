import React, { useState, useEffect, useContext } from 'react';
import { Layout, PageHeader } from '../components/UI';
import CollectionsManager from '../components/Collections/CollectionsManager';
import { SnippetGrid } from '../components/Snippets/SnippetGrid';
import { Collection, Snippet } from '../typescript/interfaces';
import { SnippetsContext } from '../store';

const Collections: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionSnippets, setCollectionSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const { snippets } = useContext(SnippetsContext);

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionSnippets(selectedCollection.id);
    } else if (selectedCollection === null && snippets) {
      // Show all snippets when "All Snippets" is selected
      setCollectionSnippets(snippets);
    }
  }, [selectedCollection, snippets]);

  const fetchCollectionSnippets = async (collectionId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}`);
      const data = await response.json();
      
      if (data.success && data.data.snippets) {
        setCollectionSnippets(data.data.snippets);
      } else {
        setCollectionSnippets([]);
      }
    } catch (error) {
      console.error('Error fetching collection snippets:', error);
      setCollectionSnippets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCollection = (collection: Collection | null) => {
    setSelectedCollection(collection);
    if (!collection) {
      setCollectionSnippets([]);
    }
  };

  const getSelectedCollectionId = (): number | null => {
    return selectedCollection ? selectedCollection.id : null;
  };

  return (
    <Layout>
      <PageHeader
        title={selectedCollection ? selectedCollection.name : 'Collections'}
      />
      
      {!selectedCollection ? (
        <div>
          <p className="text-muted mb-4">Organize your snippets into collections for better management.</p>
          <CollectionsManager
            onSelectCollection={handleSelectCollection}
            selectedCollectionId={getSelectedCollectionId()}
          />
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary me-3"
                onClick={() => setSelectedCollection(null)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Collections
              </button>
              <div className="d-flex align-items-center">
                <i
                  className={`bi bi-${selectedCollection.icon || 'folder'} me-2`}
                  style={{
                    fontSize: '1.5rem',
                    color: selectedCollection.color || '#007bff'
                  }}
                ></i>
                <span className="h5 mb-0">{selectedCollection.name}</span>
                {selectedCollection.description && (
                  <small className="text-muted ms-2">- {selectedCollection.description}</small>
                )}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : collectionSnippets.length > 0 ? (
            <SnippetGrid snippets={collectionSnippets} />
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <i 
                  className={`bi bi-${selectedCollection.icon || 'folder'}`}
                  style={{ 
                    fontSize: '3rem', 
                    color: selectedCollection.color || '#007bff',
                    opacity: 0.3 
                  }}
                ></i>
              </div>
              <h5 className="text-muted">No snippets in this collection yet</h5>
              <p className="text-muted">
                Create new snippets and assign them to this collection, or move existing snippets here.
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Collections;
