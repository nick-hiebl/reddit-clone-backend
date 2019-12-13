import { DefaultCrudRepository, DataObject, Options, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { User, UserRelations, Post } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { PostRepository } from './post.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.name,
  UserRelations
  > {

  public readonly posts: HasManyRepositoryFactory<Post, typeof User.prototype.name>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PostRepository') protected postRepositoryGetter: Getter<PostRepository>,
  ) {
    super(User, dataSource);
    this.posts = this.createHasManyRepositoryFactoryFor('posts', postRepositoryGetter);
    this.registerInclusionResolver('posts', this.posts.inclusionResolver);
  }

  create(entity: DataObject<User>, options?: Options): Promise<User> {
    entity.creationDate = (new Date()).toISOString();
    if (!entity.name) {
      throw new Error("Invalid username supplied");
    }
    if (this.exists(entity.name)) {
      throw new Error("Username already taken");
    }
    return super.create(entity, options);
  }
}
