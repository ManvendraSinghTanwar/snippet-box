import { Request, Response, NextFunction } from 'express';
import { CollectionModel, SnippetModel, TagModel } from '../models';
import { asyncWrapper } from '../middleware';
import { ErrorResponse } from '../utils';

/**
 * @description Get all collections with snippet counts
 * @route /api/collections
 * @request GET
 */
export const getAllCollections = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const collections = await CollectionModel.findAll({
      include: [
        {
          model: SnippetModel,
          as: 'snippets',
          attributes: ['id']
        }
      ],
      order: [['isDefault', 'DESC'], ['name', 'ASC']]
    });

    const collectionsWithCounts = collections.map(collection => {
      const collectionData = collection.toJSON() as any;
      return {
        ...collectionData,
        snippetCount: collectionData.snippets?.length || 0
      };
    });

    res.status(200).json({
      success: true,
      data: collectionsWithCounts
    });
  }
);

/**
 * @description Get a collection by ID with its snippets
 * @route /api/collections/:id
 * @request GET
 */
export const getCollection = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const collection = await CollectionModel.findByPk(id, {
      include: [
        {
          model: SnippetModel,
          as: 'snippets',
          include: [
            {
              model: TagModel,
              as: 'tags',
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!collection) {
      return next(new ErrorResponse(404, 'Collection not found'));
    }

    res.status(200).json({
      success: true,
      data: collection
    });
  }
);

/**
 * @description Create a new collection
 * @route /api/collections
 * @request POST
 */
export const createCollection = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, description, color, icon } = req.body;

    const collection = await CollectionModel.create({
      name,
      description,
      color: color || '#007bff',
      icon: icon || 'folder',
      isDefault: false
    });

    res.status(201).json({
      success: true,
      data: collection
    });
  }
);

/**
 * @description Update a collection
 * @route /api/collections/:id
 * @request PUT
 */
export const updateCollection = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { name, description, color, icon } = req.body;

    const collection = await CollectionModel.findByPk(id);

    if (!collection) {
      return next(new ErrorResponse(404, 'Collection not found'));
    }

    // Prevent updating the default collection's name
    if (collection.isDefault && name !== collection.name) {
      return next(new ErrorResponse(400, 'Cannot rename the default collection'));
    }

    await collection.update({
      name,
      description,
      color,
      icon
    });

    res.status(200).json({
      success: true,
      data: collection
    });
  }
);

/**
 * @description Delete a collection (move snippets to default)
 * @route /api/collections/:id
 * @request DELETE
 */
export const deleteCollection = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const collection = await CollectionModel.findByPk(id);

    if (!collection) {
      return next(new ErrorResponse(404, 'Collection not found'));
    }

    // Prevent deleting the default collection
    if (collection.isDefault) {
      return next(new ErrorResponse(400, 'Cannot delete the default collection'));
    }

    // Find or create default collection
    const [defaultCollection] = await CollectionModel.findOrCreate({
      where: { isDefault: true },
      defaults: {
        name: 'Default',
        description: 'Default collection for uncategorized snippets',
        color: '#6c757d',
        icon: 'folder',
        isDefault: true
      }
    });

    // Move all snippets from this collection to default
    await SnippetModel.update(
      { collectionId: defaultCollection.id } as any,
      { where: { collectionId: id } }
    );

    // Delete the collection
    await collection.destroy();

    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully. Snippets moved to default collection.'
    });
  }
);

/**
 * @description Add snippets to a collection
 * @route /api/collections/:id/snippets
 * @request POST
 */
export const addSnippetsToCollection = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { snippetIds } = req.body;

    const collection = await CollectionModel.findByPk(id);

    if (!collection) {
      return next(new ErrorResponse(404, 'Collection not found'));
    }

    // Update snippets to belong to this collection
    const [updatedCount] = await SnippetModel.update(
      { collectionId: id } as any,
      { where: { id: snippetIds } }
    );

    res.status(200).json({
      success: true,
      message: `${updatedCount} snippets added to collection`,
      data: { updatedCount }
    });
  }
);
