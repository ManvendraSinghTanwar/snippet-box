import { Request, Response, NextFunction } from 'express';
import { QueryTypes, Op } from 'sequelize';
import { sequelize } from '../db';
import { asyncWrapper } from '../middleware';
import { SnippetModel, Snippet_TagModel, TagModel } from '../models';
import { ErrorResponse, tagParser, Logger, createTags, AIService } from '../utils';
import { Body, SearchQuery } from '../typescript/interfaces';

/**
 * @description Create new snippet
 * @route /api/snippets
 * @request POST
 */
export const createSnippet = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Get tags from request body
    const { language, tags: requestTags, code, useAI } = <Body & { useAI?: boolean }>req.body;
    
    let aiAnalysis = null;
    let finalTags = [...requestTags, language.toLowerCase()];
    let aiExplanation = '';
    let complexity = 'beginner';

    // Use AI analysis if requested and API key is available
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        const aiService = new AIService();
        aiAnalysis = await aiService.analyzeCode(code, language);
        
        // Merge AI suggested tags with user tags
        finalTags = [...new Set([...finalTags, ...aiAnalysis.suggestedTags])];
        aiExplanation = aiAnalysis.explanation;
        complexity = aiAnalysis.complexity;
      } catch (error) {
        // Continue without AI if it fails
        console.warn('AI analysis failed, continuing without it');
      }
    }

    const parsedRequestTags = tagParser(finalTags);

    // Create snippet with AI data
    const snippet = await SnippetModel.create({
      ...req.body,
      aiExplanation,
      complexity,
      tags: [...parsedRequestTags].join(',')
    });

    // Create tags
    await createTags(parsedRequestTags, snippet.id);

    // Get raw snippet values
    const rawSnippet = snippet.get({ plain: true });

    res.status(201).json({
      data: {
        ...rawSnippet,
        tags: [...parsedRequestTags]
      }
    });
  }
);

/**
 * @description Get all snippets
 * @route /api/snippets
 * @request GET
 */
export const getAllSnippets = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const snippets = await SnippetModel.findAll({
      include: [
        {
          model: TagModel,
          as: 'tags',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          model: require('../models').CollectionModel,
          as: 'collection',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    });

    const populatedSnippets = snippets.map(snippet => {
      const rawSnippet = snippet.get({ plain: true });

      return {
        ...rawSnippet,
        tags: rawSnippet.tags?.map((tag: any) => tag.name)
      };
    });

    res.status(200).json({
      data: populatedSnippets
    });
  }
);

/**
 * @description Get single snippet by id
 * @route /api/snippets/:id
 * @request GET
 */
export const getSnippet = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const snippet = await SnippetModel.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: TagModel,
          as: 'tags',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          model: require('../models').CollectionModel,
          as: 'collection',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    });

    if (!snippet) {
      return next(
        new ErrorResponse(
          404,
          `Snippet with id of ${req.params.id} was not found`
        )
      );
    }

    const rawSnippet = snippet.get({ plain: true });
    const populatedSnippet = {
      ...rawSnippet,
      tags: rawSnippet.tags?.map((tag: any) => tag.name)
    };

    res.status(200).json({
      data: populatedSnippet
    });
  }
);

/**
 * @description Update snippet
 * @route /api/snippets/:id
 * @request PUT
 */
export const updateSnippet = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let snippet = await SnippetModel.findOne({
      where: { id: req.params.id }
    });

    if (!snippet) {
      return next(
        new ErrorResponse(
          404,
          `Snippet with id of ${req.params.id} was not found`
        )
      );
    }

    // Check if this is a partial update (only collectionId)
    const isPartialUpdate = Object.keys(req.body).length === 1 && 'collectionId' in req.body;

    if (isPartialUpdate) {
      // Just update the collectionId
      snippet = await snippet.update({
        collectionId: req.body.collectionId
      });

      res.status(200).json({
        success: true,
        data: snippet
      });
      return;
    }

    // Full update - handle tags as before
    const { language, tags: requestTags } = <Body>req.body;
    let parsedRequestTags = tagParser([...requestTags, language.toLowerCase()]);

    // Update snippet
    snippet = await snippet.update({
      ...req.body,
      tags: [...parsedRequestTags].join(',')
    });

    // Delete old tags and create new ones
    await Snippet_TagModel.destroy({ where: { snippet_id: req.params.id } });
    await createTags(parsedRequestTags, snippet.id);

    // Get raw snippet values
    const rawSnippet = snippet.get({ plain: true });

    res.status(200).json({
      success: true,
      data: {
        ...rawSnippet,
        tags: [...parsedRequestTags]
      }
    });
  }
);

/**
 * @description Delete snippet
 * @route /api/snippets/:id
 * @request DELETE
 */
export const deleteSnippet = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const snippet = await SnippetModel.findOne({
      where: { id: req.params.id }
    });

    if (!snippet) {
      return next(
        new ErrorResponse(
          404,
          `Snippet with id of ${req.params.id} was not found`
        )
      );
    }

    await Snippet_TagModel.destroy({ where: { snippet_id: req.params.id } });
    await snippet.destroy();

    res.status(200).json({
      data: {}
    });
  }
);

/**
 * @description Count tags
 * @route /api/snippets/statistics/count
 * @request GET
 */
export const countTags = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await sequelize.query(
      `SELECT
        COUNT(tags.name) as count,
        tags.name
      FROM snippets_tags
      INNER JOIN tags ON snippets_tags.tag_id = tags.id
      GROUP BY tags.name
      ORDER BY name ASC`,
      {
        type: QueryTypes.SELECT
      }
    );

    res.status(200).json({
      data: result
    });
  }
);

/**
 * @description Get raw snippet code
 * @route /api/snippets/raw/:id
 * @request GET
 */
export const getRawCode = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const snippet = await SnippetModel.findOne({
      where: { id: req.params.id },
      raw: true
    });

    if (!snippet) {
      return next(
        new ErrorResponse(
          404,
          `Snippet with id of ${req.params.id} was not found`
        )
      );
    }

    res.status(200).send(snippet.code);
  }
);

/**
 * @description Search snippets
 * @route /api/snippets/search
 * @request POST
 */
export const searchSnippets = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query, tags, languages } = <SearchQuery>req.body;

    // Check if all search parameters are empty
    if (!query && !tags.length && !languages.length) {
      res.status(200).json({
        data: []
      });
      return;
    }

    // Build where conditions
    const whereConditions: any = {};
    const includeConditions: any = [];

    // Add text search condition if query is provided
    if (query && query.trim() !== '') {
      whereConditions[Op.or] = [
        { title: { [Op.substring]: query.trim() } },
        { description: { [Op.substring]: query.trim() } },
        { code: { [Op.substring]: query.trim() } }
      ];
    }

    // Add language filter if provided
    if (languages.length > 0) {
      whereConditions.language = { [Op.in]: languages };
    }

    // Base include for tags (always include to get tag data)
    const tagInclude: any = {
      model: TagModel,
      as: 'tags',
      attributes: ['name'],
      through: {
        attributes: []
      }
    };

    // Add tag filter if provided
    if (tags.length > 0) {
      tagInclude.where = {
        name: { [Op.in]: tags }
      };
      tagInclude.required = true; // Inner join when filtering by tags
    } else {
      tagInclude.required = false; // Left join when not filtering by tags
    }

    includeConditions.push(tagInclude);

    // Add collection include
    includeConditions.push({
      model: require('../models').CollectionModel,
      as: 'collection',
      attributes: ['id', 'name', 'color', 'icon'],
      required: false
    });

    const snippets = await SnippetModel.findAll({
      where: whereConditions,
      include: includeConditions,
      order: [['updatedAt', 'DESC']]
    });

    // Transform the results to match the expected format
    const populatedSnippets = snippets.map(snippet => {
      const rawSnippet = snippet.get({ plain: true });
      return {
        ...rawSnippet,
        tags: rawSnippet.tags?.map((tag: any) => tag.name) || []
      };
    });

    res.status(200).json({
      data: populatedSnippets
    });
  }
);
