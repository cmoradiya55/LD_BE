// src/common/resources/base.resource.ts

export abstract class BaseResource<T, R = any> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  abstract toJSON(): R;

  static collection<T, R, Resource extends BaseResource<T, R>>(
    this: new (data: T) => Resource,
    items: T[],
  ): R[] {
    return items.map(item => new this(item).toJSON());
  }
}