import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useState,
  useContext,
  useEffect
} from 'react';
import { SnippetsContext } from '../../store';
import { NewSnippet } from '../../typescript/interfaces';
import { Button, Card } from '../UI';
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
    tags: []
  });

  const [useAI, setUseAI] = useState<boolean>(false);

  useEffect(() => {
    if (inEdit) {
      if (currentSnippet) {
        setFormData({ ...currentSnippet });
      }
    }
  }, [currentSnippet]);

  const inputHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const stringToTags = (e: ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',');
    setFormData({
      ...formData,
      tags
    });
  };

  const tagsToString = (): string => {
    return formData.tags.join(',');
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
        <Card>
          <form onSubmit={e => formHandler(e)}>
            {/* DETAILS SECTION */}
            <h5 className='card-title mb-3'>Snippet details</h5>

            {/* TITLE */}
            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>
                Title
              </label>
              <input
                type='text'
                className='form-control'
                id='title'
                name='title'
                value={formData.title}
                placeholder='Recursively copy all files'
                required
                onChange={e => inputHandler(e)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className='mb-3'>
              <label htmlFor='description' className='form-label'>
                Short description
              </label>
              <input
                type='text'
                className='form-control'
                id='description'
                name='description'
                value={formData.description}
                placeholder='Bash script to copy all files from src to dest'
                onChange={e => inputHandler(e)}
              />
            </div>

            {/* LANGUAGE */}
            <div className='mb-3'>
              <label htmlFor='language' className='form-label'>
                Language
              </label>
              <input
                type='text'
                className='form-control'
                id='language'
                name='language'
                value={formData.language}
                placeholder='python'
                required
                onChange={e => inputHandler(e)}
              />
            </div>

            {/* TAGS */}
            <div className='mb-3'>
              <label htmlFor='tags' className='form-label'>
                Tags
              </label>
              <input
                type='text'
                className='form-control'
                id='tags'
                name='tags'
                value={tagsToString()}
                placeholder='automation, files, loop'
                onChange={e => stringToTags(e)}
              />
              <div className='form-text'>
                Tags should be separated with a comma. Language tag will be
                added automatically
              </div>
            </div>

            {/* CODE SECTION */}
            <h5 className='card-title mb-3'>Snippet code</h5>
            <div className='mb-3'>
              <textarea
                className='form-control'
                id='code'
                name='code'
                rows={10}
                value={formData.code}
                placeholder='cp -r ./src ./dest'
                required
                onChange={e => inputHandler(e)}
              ></textarea>
            </div>

            {/* AI FEATURES TOGGLE */}
            <div className='mb-3'>
              <div className='form-check'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='useAI'
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                />
                <label className='form-check-label' htmlFor='useAI'>
                  🤖 Enable AI Features (Auto-tagging & Code explanation)
                </label>
              </div>
              <div className='form-text'>
                AI features require an OpenAI API key to be configured
              </div>
            </div>

            {/* AI AUTO-TAGGER */}
            {useAI && formData.code && formData.language && (
              <div className='mb-3'>
                <AutoTagger
                  code={formData.code}
                  language={formData.language}
                  currentTags={formData.tags}
                  onTagsGenerated={(newTags) => setFormData({...formData, tags: newTags})}
                />
              </div>
            )}

            <hr />

            {/* AI EXPLAINER */}
            {useAI && formData.code && formData.language && (
              <div className='mb-3'>
                <AIExplainer
                  code={formData.code}
                  language={formData.language}
                />
              </div>
            )}

            <hr />

            {/* DOCS SECTION */}
            <h5 className='card-title mb-3'>Snippet documentation</h5>
            <div className='mb-3'>
              <textarea
                className='form-control'
                id='docs'
                name='docs'
                rows={10}
                value={formData.docs}
                placeholder='`-r` flag stands for `--recursive`'
                onChange={e => inputHandler(e)}
              ></textarea>
            </div>

            {/* SUBMIT SECTION */}
            <div className='d-grid'>
              <Button
                text={`${inEdit ? 'Update snippet' : 'Create snippet'}`}
                color='secondary'
                type='submit'
              />
            </div>
          </form>
        </Card>
      </div>
    </Fragment>
  );
};
