import React, { useState, useEffect } from 'react';
import { Collection } from '../../typescript/interfaces';
import { Button } from '../UI';

interface MoveToCollectionProps {
  snippetIds: number[];
  currentCollectionId?: number | null;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  buttonText?: string;
  buttonSize?: boolean;
  buttonVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

const MoveToCollection: React.FC<MoveToCollectionProps> = ({
  snippetIds,
  currentCollectionId,
  onSuccess,
  onError,
  buttonText = 'Move to Collection',
  buttonSize = false,
  buttonVariant = 'secondary'
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      
      if (data.success) {
        setCollections(data.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const moveToCollection = async (collectionId: number | null) => {
    setLoading(true);
    try {
      // Update each snippet individually
      const updatePromises = snippetIds.map(async (snippetId) => {
        const response = await fetch(`/api/snippets/${snippetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            collectionId: collectionId
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update snippet ${snippetId}`);
        }
        
        return response.json();
      });

      await Promise.all(updatePromises);
      
      setShowDropdown(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error moving snippets:', error);
      if (onError) onError('Failed to move snippets to collection');
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="position-relative">
      <Button
        text={loading ? 'Moving...' : buttonText}
        color={buttonVariant}
        small={buttonSize}
        outline={true}
        disabled={loading}
        handler={toggleDropdown}
      />
      
      {showDropdown && (
        <div className="dropdown-menu show position-absolute" style={{ top: '100%', left: 0, zIndex: 1000 }}>
          <h6 className="dropdown-header">Move to Collection</h6>
          
          {/* Move to "No Collection" */}
          <button
            className={`dropdown-item ${currentCollectionId === null ? 'active' : ''}`}
            onClick={() => moveToCollection(null)}
            disabled={loading || currentCollectionId === null}
          >
            <i className="bi bi-collection me-2"></i>
            No Collection
          </button>
          
          <div className="dropdown-divider"></div>
          
          {collections.map(collection => (
            <button
              key={collection.id}
              className={`dropdown-item ${currentCollectionId === collection.id ? 'active' : ''}`}
              onClick={() => moveToCollection(collection.id)}
              disabled={loading || currentCollectionId === collection.id}
            >
              <i 
                className={`bi bi-${collection.icon || 'folder'} me-2`}
                style={{ color: collection.color || '#007bff' }}
              ></i>
              {collection.name}
              {collection.isDefault && ' (Default)'}
            </button>
          ))}
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 999 }}
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default MoveToCollection;
