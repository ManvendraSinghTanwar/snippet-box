import React, { useState, useEffect } from 'react';
import { NewCollection, Collection } from '../../typescript/interfaces';
import { Button } from '../UI';

interface CollectionFormProps {
  collection?: Collection | null;
  onSubmit: (data: NewCollection) => void;
  onCancel: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  collection,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<NewCollection>({
    name: '',
    description: '',
    color: '#007bff',
    icon: 'folder'
  });

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || '',
        color: collection.color || '#007bff',
        icon: collection.icon || 'folder'
      });
    }
  }, [collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const iconOptions = [
    { value: 'folder', label: 'Folder' },
    { value: 'folder-fill', label: 'Folder (Filled)' },
    { value: 'collection', label: 'Collection' },
    { value: 'archive', label: 'Archive' },
    { value: 'bookmark', label: 'Bookmark' },
    { value: 'star', label: 'Star' },
    { value: 'heart', label: 'Heart' },
    { value: 'briefcase', label: 'Briefcase' },
    { value: 'tag', label: 'Tag' },
    { value: 'tags', label: 'Tags' }
  ];

  const colorOptions = [
    { value: '#007bff', label: 'Blue' },
    { value: '#28a745', label: 'Green' },
    { value: '#dc3545', label: 'Red' },
    { value: '#ffc107', label: 'Yellow' },
    { value: '#17a2b8', label: 'Cyan' },
    { value: '#6f42c1', label: 'Purple' },
    { value: '#e83e8c', label: 'Pink' },
    { value: '#fd7e14', label: 'Orange' },
    { value: '#6c757d', label: 'Gray' },
    { value: '#343a40', label: 'Dark' }
  ];

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {collection ? 'Edit Collection' : 'Create New Collection'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter collection name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter collection description (optional)"
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="icon" className="form-label">Icon</label>
                    <select
                      className="form-select"
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                    >
                      {iconOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <i
                        className={`bi bi-${formData.icon}`}
                        style={{ fontSize: '1.5rem', color: formData.color }}
                      ></i>
                      <small className="text-muted ms-2">Preview</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="color" className="form-label">Color</label>
                    <select
                      className="form-select"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: formData.color,
                          borderRadius: '3px',
                          display: 'inline-block'
                        }}
                      ></div>
                      <small className="text-muted ms-2">Preview</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                text="Cancel"
                color="secondary"
                handler={onCancel}
                type="button"
              />
              <Button
                text={collection ? 'Update Collection' : 'Create Collection'}
                color="primary"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;
