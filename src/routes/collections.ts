import { Router } from 'express';
import {
  getAllCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addSnippetsToCollection
} from '../controllers/collections';
import { requireBody } from '../middleware';

const collections = Router();

collections
  .route('/')
  .get(getAllCollections)
  .post(requireBody('name'), createCollection);

collections
  .route('/:id')
  .get(getCollection)
  .put(requireBody('name'), updateCollection)
  .delete(deleteCollection);

collections
  .route('/:id/snippets')
  .post(requireBody('snippetIds'), addSnippetsToCollection);

export default collections;
