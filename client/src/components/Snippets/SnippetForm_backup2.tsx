import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useState,
  useContext,
  useEffect
} from 'react';
import { SnippetsContext } from '../../store';
import { NewSnippet, Collection } from '../../typescript/interfaces';
import AutoTagger from '../AI/AutoTagger';
import AIExplainer from '../AI/AIExplainer';

interface Props {
  inEdit?: boolean;
}

export const SnippetForm = (props: Props): JSX.Element => {
  const { inEdit = false } = props;
  const { createSnippet, currentSnippet, updateSnippet } =
    useContext(SnippetsContext);

  const [formData, setFormData] = useState<NewSnippet>({
    title: '',
    description: '',
    language: '',
    code: '',
    docs: '',
    isPinned: false,
    tags: [],
    collectionId: undefined
  });

  const [useAI, setUseAI] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoadingCollections(true);
      const response = await fetch('/api/collections');
      const data = await response.json();
      
      if (data.success) {
        setCollections(data.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoadingCollections(false);
    }
  };

  useEffect(() => {
    if (inEdit) {
      if (currentSnippet) {
        setFormData({ ...currentSnippet });
      }
    }
  }, [currentSnippet]);

  const inputHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (name === 'collectionId') {
      processedValue = value === '' ? undefined : parseInt(value, 10);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const stringToTags = (e: ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData({
      ...formData,
      tags
    });
  };

  const tagsToString = (): string => {
    return formData.tags.join(', ');
  };

  const formHandler = (e: FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      useAI
    };

    if (inEdit) {
      if (currentSnippet) {
        updateSnippet(submissionData, currentSnippet.id);
      }
    } else {
      createSnippet(submissionData);
    }
  };

  return (
    <Fragment>
      <div className='col-12 mt-3'>
        <form onSubmit={e => formHandler(e)}>
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon icon-details">
                <i className="bi bi-info-circle"></i>
              </div>
              <h5 className="section-title">
                Snippet Details
                <div className="section-subtitle">Basic information about your code snippet</div>
              </h5>
            </div>

            {/* TITLE */}
            <div className='form-group-modern'>
              <label htmlFor='title' className='form-label-modern'>
                <i className="bi bi-type label-icon"></i>
                Title
                <span className="label-required">*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-modern'
                id='title'
                name='title'
                value={formData.title}
                placeholder='Recursively copy all files'
                required
                onChange={e => inputHandler(e)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className='form-group-modern'>
              <label htmlFor='description' className='form-label-modern'>
                <i className="bi bi-chat-text label-icon"></i>
                Short description
              </label>
              <input
                type='text'
                className='form-control form-control-modern'
                id='description'
                name='description'
                value={formData.description}
                placeholder='Bash script to copy all files from src to dest'
                onChange={e => inputHandler(e)}
              />
            </div>

            {/* LANGUAGE */}
            <div className='form-group-modern'>
              <label htmlFor='language' className='form-label-modern'>
                <i className="bi bi-code-slash label-icon"></i>
                Language
                <span className="label-required">*</span>
              </label>
              <input
                type='text'
                className='form-control form-control-modern'
                id='language'
                name='language'
                value={formData.language}
                placeholder='python'
                required
                onChange={e => inputHandler(e)}
              />
            </div>

            {/* TAGS */}
            <div className='form-group-modern'>
              <label htmlFor='tags' className='form-label-modern'>
                <i className="bi bi-tags label-icon"></i>
                Tags
              </label>
              <div className="tags-input-wrapper">
                <input
                  type='text'
                  className='form-control form-control-modern'
                  id='tags'
                  name='tags'
                  value={tagsToString()}
                  placeholder='automation, files, loop'
                  onChange={e => stringToTags(e)}
                />
                <div className='form-text-modern'>
                  <i className="bi bi-info-circle form-tip-icon"></i>
                  Tags should be separated with a comma. Language tag will be added automatically
                </div>
                {formData.tags.length > 0 && (
                  <div className="tags-preview">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag-pill">
                        {tag}
                        <i 
                          className="bi bi-x tag-remove"
                          onClick={() => {
                            const newTags = formData.tags.filter((_, i) => i !== index);
                            setFormData({ ...formData, tags: newTags });
                          }}
                        ></i>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* COLLECTION */}
            <div className='form-group-modern'>
              <label htmlFor='collectionId' className='form-label-modern'>
                <i className="bi bi-folder label-icon"></i>
                Collection
              </label>
              <select
                className='form-select form-select-modern'
                id='collectionId'
                name='collectionId'
                value={formData.collectionId || ''}
                onChange={e => inputHandler(e)}
                disabled={loadingCollections}
              >
                <option value=''>Select a collection (optional)</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                    {collection.isDefault && ' (Default)'}
                  </option>
                ))}
              </select>
              {loadingCollections && (
                <div className='form-text-modern'>
                  <i className="bi bi-arrow-clockwise form-tip-icon"></i>
                  Loading collections...
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <div className="section-icon icon-code">
                <i className="bi bi-code"></i>
              </div>
              <h5 className="section-title">
                Snippet Code
                <div className="section-subtitle">The actual code for your snippet</div>
              </h5>
            </div>

            <div className='form-group-modern'>
              <textarea
                className='form-control form-control-modern form-control-code'
                id='code'
                name='code'
                rows={12}
                value={formData.code}
                placeholder='cp -r ./src ./dest'
                required
                onChange={e => inputHandler(e)}
              ></textarea>
            </div>
          </div>

          {/* AI FEATURES TOGGLE */}
          <div className='ai-toggle-section'>
            <div className='ai-toggle-header'>
              <div className='ai-toggle-icon'>
                <i className='bi bi-robot'></i>
              </div>
              <div className='ai-toggle-content'>
                <h6 className='ai-toggle-title'>AI-Powered Features</h6>
                <p className='ai-toggle-desc'>
                  Enable automatic tagging and code explanation using artificial intelligence
                </p>
              </div>
            </div>
            <div className='form-check-modern'>
              <input
                className='form-check-input'
                type='checkbox'
                id='useAI'
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
              />
              <label className='form-check-label' htmlFor='useAI'>
                Enable AI Features
              </label>
            </div>
            <div className='form-text-modern'>
              <i className="bi bi-key form-tip-icon"></i>
              AI features require an OpenAI API key to be configured
            </div>
          </div>

          {/* AI AUTO-TAGGER */}
          {useAI && formData.code && formData.language && (
            <div className='form-section'>
              <div className="section-header">
                <div className="section-icon icon-ai">
                  <i className="bi bi-tags"></i>
                </div>
                <h5 className="section-title">
                  AI Auto-Tagger
                  <div className="section-subtitle">Let AI suggest relevant tags for your code</div>
                </h5>
              </div>
              <AutoTagger
                code={formData.code}
                language={formData.language}
                currentTags={formData.tags}
                onTagsGenerated={(newTags) => setFormData({...formData, tags: newTags})}
              />
            </div>
          )}

          {/* AI EXPLAINER */}
          {useAI && formData.code && formData.language && (
            <div className='form-section'>
              <div className="section-header">
                <div className="section-icon icon-ai">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <h5 className="section-title">
                  AI Code Explainer
                  <div className="section-subtitle">Get an AI-generated explanation of your code</div>
                </h5>
              </div>
              <AIExplainer
                code={formData.code}
                language={formData.language}
              />
            </div>
          )}

          <div className="form-section">
            <div className="section-header">
              <div className="section-icon icon-docs">
                <i className="bi bi-file-text"></i>
              </div>
              <h5 className="section-title">
                Documentation
                <div className="section-subtitle">Additional notes and documentation for your snippet</div>
              </h5>
            </div>

            <div className='form-group-modern'>
              <textarea
                className='form-control form-control-modern'
                id='docs'
                name='docs'
                rows={8}
                value={formData.docs}
                placeholder='`-r` flag stands for `--recursive`'
                onChange={e => inputHandler(e)}
              ></textarea>
              <div className='form-text-modern'>
                <i className="bi bi-markdown form-tip-icon"></i>
                You can use Markdown formatting here
              </div>
            </div>
          </div>

          {/* SUBMIT SECTION */}
          <div className='submit-section'>
            <button
              type="submit"
              className="submit-button"
            >
              <i className="bi bi-check-circle me-2"></i>
              {inEdit ? 'Update snippet' : 'Create snippet'}
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};
