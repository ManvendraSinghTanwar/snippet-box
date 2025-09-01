import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageHeader } from '../components/UI';
import { SmartSnippetForm } from '../components/Snippets/SmartSnippetForm';

export const SmartEditor = () => {
  const history = useHistory();

  return (
    <div className="container-xxl my-5">
      <div className="row">
        <div className="col-12">
          <PageHeader title="Smart Snippet Creator">
            <p className="text-muted mb-0">
              Paste your code and let AI generate the title, description, language, and tags for you.
            </p>
          </PageHeader>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <SmartSnippetForm />
        </div>
      </div>
    </div>
  );
};
