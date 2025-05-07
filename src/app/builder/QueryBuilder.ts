/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client';

type TQueryParams = {
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
  orderBy?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
};

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type TPrismaModelDelegate = {
  findMany: (args: any) => Promise<any[]>;
  count: (args: any) => Promise<number>;
};

export class QueryBuilder<T extends TPrismaModelDelegate> {
  private where: Prisma.PrismaClientKnownRequestError['meta'];
  private orderBy: { [key: string]: 'asc' | 'desc' }[] = [];
  private skip = 0;
  private take = 10;

  constructor(
    private readonly model: T,
    private query: TQueryParams,
    private searchableFields: string[],
    private modelName?: string,
  ) {
    this.where = {};
  }

  search() {
    const { searchTerm } = this.query;
    if (searchTerm && this.where) {
      this.where.OR = this.searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      }));
    }
    return this;
  }

  filter() {
    const excludeFields = [
      'searchTerm',
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ];
    const filters = { ...this.query };
    excludeFields.forEach((field) => {
      delete filters[field];
    });

    // Add remaining filters to where clause
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.where![key] = value;
      }
    });
    return this;
  }

  sort() {
    const { orderBy = 'createdAt', sortOrder = 'desc' } = this.query;
    this.orderBy = [{ [orderBy]: sortOrder }];
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    this.skip = (page - 1) * limit;
    this.take = limit;
    return this;
  }

  async execute(): Promise<{ meta: TMeta; data: any[] }> {
    let findObject = {
      where: this.where,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take,
    };
    if (this.modelName === 'Post') {
      findObject = {
        ...findObject,
        ...{
          include: {
            category: true,
            postImages: true,
            author: {
              select: {
                id: true,
                role: true,
                status: true,
                userDetails: {
                  select: {
                    name: true,
                    profilePhoto: true,
                  },
                },
              },
            },
            comments: {
              take: 3,
              orderBy: {
                createdAt: 'desc',
              },
              include: {
                commenter: {
                  select: {
                    id: true,
                    role: true,
                    status: true,
                    userDetails: {
                      select: {
                        name: true,
                        profilePhoto: true,
                      },
                    },
                  },
                },
              },
            },
            postRatings: {
              select: {
                rating: true,
              },
            },
            _count: {
              select: {
                comments: true,
                votes: true,
                postRatings: true,
              },
            },
          },
        },
      };
    } else if (this.modelName === 'Comments') {
      findObject = {
        ...findObject,
        ...{
          include: {
            commenter: {
              select: {
                id: true,
                role: true,
                status: true,
                userDetails: {
                  select: {
                    name: true,
                    profilePhoto: true,
                  },
                },
              },
            },
          },
        },
      };
    }
    console.log(findObject);
    const data = await this.model.findMany(findObject);
    if (this.modelName === 'Post') {
      data.forEach((post) => {
        const ratings =
          post.postRatings?.map((r: { rating: any }) => r.rating) || [];
        const avg =
          ratings.length > 0
            ? ratings.reduce((sum: any, r: any) => sum + r, 0) / ratings.length
            : null;
        post.averageRating = avg;
      });
    }

    console.log({ data });
    const total = await this.model.count({ where: this.where });

    return {
      meta: {
        total,
        page: Number(this.query.page) || 1,
        limit: this.take,
        totalPages: Math.ceil(total / this.take),
      },
      data,
    };
  }
}
