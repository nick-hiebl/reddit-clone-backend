import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Post,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPostController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/posts', {
    responses: {
      '200': {
        description: 'Array of Post\'s belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Post)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Post>,
  ): Promise<Post[]> {
    return this.userRepository.posts(id).find(filter);
  }

  @post('/users/{id}/posts', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Post)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.name,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {
            title: 'NewPostInUser',
            exclude: ['id'],
            optional: ['author']
          }),
        },
      },
    }) post: Omit<Post, 'id'>,
  ): Promise<Post> {
    return this.userRepository.posts(id).create(post);
  }

  @patch('/users/{id}/posts', {
    responses: {
      '200': {
        description: 'User.Post PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Post, {partial: true}),
        },
      },
    })
    post: Partial<Post>,
    @param.query.object('where', getWhereSchemaFor(Post)) where?: Where<Post>,
  ): Promise<Count> {
    return this.userRepository.posts(id).patch(post, where);
  }

  @del('/users/{id}/posts', {
    responses: {
      '200': {
        description: 'User.Post DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Post)) where?: Where<Post>,
  ): Promise<Count> {
    return this.userRepository.posts(id).delete(where);
  }
}
