import { Entity, model, property, hasMany } from '@loopback/repository';
import { Post } from './post.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  creationDate: string;

  @hasMany(() => Post, { keyTo: 'author' })
  posts: Post[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
