import React, { useState } from 'react';
import { Snippet } from '../../typescript/interfaces';
import { Button } from '../UI';
import MoveToCollection from './MoveToCollection';

interface BulkActionsProps {
  snippets: Snippet[];
  selectedSnippets: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  onActionComplete: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  snippets,
  selectedSnippets,
  onSelectionChange,
  onActionComplete
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
      setSelectAll(false);
    } else {
      onSelectionChange(snippets.map(s => s.id));
      setSelectAll(true);
    }
  };

  const handleIndividualSelect = (snippetId: number) => {
    if (selectedSnippets.includes(snippetId)) {
      onSelectionChange(selectedSnippets.filter(id => id !== snippetId));
    } else {
      onSelectionChange([...selectedSnippets, snippetId]);
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
    setSelectAll(false);
  };

  if (snippets.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label className="form-check-label" htmlFor="selectAll">
                  Select All ({snippets.length})
                </label>
              </div>
              
              {selectedSnippets.length > 0 && (
                <span className="badge bg-primary me-3">
                  {selectedSnippets.length} selected
                </span>
              )}
            </div>

            {selectedSnippets.length > 0 && (
              <div className="d-flex gap-2">
                <MoveToCollection
                  snippetIds={selectedSnippets}
                  onSuccess={() => {
                    onActionComplete();
                    clearSelection();
                  }}
                  buttonText={`Move ${selectedSnippets.length} snippets`}
                  buttonVariant="primary"
                />
                
                <Button
                  text="Clear Selection"
                  color="secondary"
                  outline={true}
                  small={true}
                  handler={clearSelection}
                />
              </div>
            )}
          </div>

          {selectedSnippets.length > 0 && (
            <div className="mt-3">
              <h6>Individual Selection:</h6>
              <div className="d-flex flex-wrap gap-2">
                {snippets
                  .filter(snippet => selectedSnippets.includes(snippet.id))
                  .map(snippet => (
                    <span key={snippet.id} className="badge bg-light text-dark">
                      {snippet.title}
                      <button
                        type="button"
                        className="btn-close btn-close-sm ms-2"
                        onClick={() => handleIndividualSelect(snippet.id)}
                        style={{ fontSize: '0.7em' }}
                      ></button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SnippetCheckbox: React.FC<{
  snippetId: number;
  isSelected: boolean;
  onToggle: (snippetId: number) => void;
}> = ({ snippetId, isSelected, onToggle }) => {
  return (
    <div 
      className="position-absolute"
      style={{ top: '10px', left: '10px', zIndex: 10 }}
    >
      <input
        className="form-check-input"
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(snippetId)}
      />
    </div>
  );
};

export default BulkActions;
