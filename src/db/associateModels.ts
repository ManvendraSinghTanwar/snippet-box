import { TagModel, SnippetModel, Snippet_TagModel, CollectionModel } from '../models';

export const associateModels = async () => {
  TagModel.belongsToMany(SnippetModel, {
    through: Snippet_TagModel,
    foreignKey: 'tag_id',
    as: 'snippets'
  });

  SnippetModel.belongsToMany(TagModel, {
    through: Snippet_TagModel,
    foreignKey: 'snippet_id',
    as: 'tags'
  });

  // Collection associations
  CollectionModel.hasMany(SnippetModel, {
    foreignKey: 'collectionId',
    as: 'snippets'
  });

  SnippetModel.belongsTo(CollectionModel, {
    foreignKey: 'collectionId',
    as: 'collection'
  });
};
