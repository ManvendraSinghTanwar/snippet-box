import React, { useState, useEffect } from 'react';
import { Collection, NewCollection } from '../../typescript/interfaces';
import { Button, Badge } from '../UI';
import CollectionForm from './CollectionForm';

interface CollectionsManagerProps {
  onSelectCollection?: (collection: Collection | null) => void;
  selectedCollectionId?: number | null;
}

const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  onSelectCollection,
  selectedCollectionId
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections');
      const data = await response.json();
      
      if (data.success) {
        setCollections(data.data);
      } else {
        setError('Failed to fetch collections');
      }
    } catch (err) {
      setError('Failed to fetch collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (collectionData: NewCollection) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCollections(); // Refresh the list
        setShowForm(false);
      } else {
        setError('Failed to create collection');
      }
    } catch (err) {
      setError('Failed to create collection');
      console.error('Error creating collection:', err);
    }
  };

  const handleUpdateCollection = async (id: number, collectionData: NewCollection) => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCollections(); // Refresh the list
        setEditingCollection(null);
      } else {
        setError('Failed to update collection');
      }
    } catch (err) {
      setError('Failed to update collection');
      console.error('Error updating collection:', err);
    }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this collection? All snippets will be moved to the default collection.')) {
      return;
    }

    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchCollections(); // Refresh the list
        if (selectedCollectionId === id && onSelectCollection) {
          onSelectCollection(null); // Deselect if deleted collection was selected
        }
      } else {
        setError(data.message || 'Failed to delete collection');
      }
    } catch (err) {
      setError('Failed to delete collection');
      console.error('Error deleting collection:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-manager">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Collections</h5>
        <Button
          text="New Collection"
          color="primary"
          small={true}
          handler={() => setShowForm(true)}
        />
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <div className="row">
        {/* All Snippets option */}
        <div className="col-md-6 col-lg-4 mb-3">
          <div
            className={`card h-100 cursor-pointer ${
              selectedCollectionId === null ? 'border-primary' : ''
            }`}
            onClick={() => onSelectCollection?.(null)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-collection text-secondary" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="card-title mb-1">All Snippets</h6>
                <small className="text-muted">View all snippets</small>
              </div>
            </div>
          </div>
        </div>

        {collections.map((collection) => (
          <div key={collection.id} className="col-md-6 col-lg-4 mb-3">
            <div
              className={`card h-100 ${
                selectedCollectionId === collection.id ? 'border-primary' : ''
              }`}
            >
              <div className="card-body">
                <div className="d-flex align-items-start mb-2">
                  <div className="me-3">
                    <i
                      className={`bi bi-${collection.icon || 'folder'}`}
                      style={{ 
                        fontSize: '1.5rem',
                        color: collection.color || '#007bff'
                      }}
                    ></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="card-title mb-1">{collection.name}</h6>
                    {collection.description && (
                      <p className="card-text text-muted small mb-1">
                        {collection.description}
                      </p>
                    )}
                    <Badge
                      text={`${collection.snippetCount || 0} snippets`}
                      color="secondary"
                      className="me-1"
                    />
                    {collection.isDefault && (
                      <Badge
                        text="Default"
                        color="info"
                      />
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    text="View"
                    color="primary"
                    outline={true}
                    small={true}
                    classes="flex-grow-1"
                    handler={() => onSelectCollection?.(collection)}
                  />
                  <Button
                    text="✏️"
                    color="secondary"
                    outline={true}
                    small={true}
                    handler={() => setEditingCollection(collection)}
                  />
                  {!collection.isDefault && (
                    <Button
                      text="🗑️"
                      color="danger"
                      outline={true}
                      small={true}
                      handler={() => handleDeleteCollection(collection.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collection Form Modal */}
      {(showForm || editingCollection) && (
        <CollectionForm
          collection={editingCollection}
          onSubmit={editingCollection 
            ? (data: NewCollection) => handleUpdateCollection(editingCollection.id, data)
            : handleCreateCollection
          }
          onCancel={() => {
            setShowForm(false);
            setEditingCollection(null);
          }}
        />
      )}
    </div>
  );
};

export default CollectionsManager;
