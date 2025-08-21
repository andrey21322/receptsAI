import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto, CreateRatingDto } from './dto/recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto, userId: string) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(query?: string, userId?: string) {
    const where: any = { isPublic: true };
    
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { cuisine: { contains: query, mode: 'insensitive' } },
      ];
    }

    const recipes = await this.prisma.recipe.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return recipes.map(recipe => ({
      ...recipe,
      averageRating: recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length 
        : 0,
      ratingCount: recipe._count.ratings,
    }));
  }

  async findMyRecipes(userId: string) {
    return this.prisma.recipe.findMany({
      where: { authorId: userId },
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return {
      ...recipe,
      averageRating: recipe.ratings.length > 0 
        ? recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length 
        : 0,
      ratingCount: recipe._count.ratings,
    };
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateRecipeDto,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Recipe deleted successfully' };
  }

  async rateRecipe(recipeId: string, createRatingDto: CreateRatingDto, userId: string) {
    const { rating, comment } = createRatingDto;

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (!recipe.isPublic && recipe.authorId !== userId) {
      throw new ForbiddenException('Recipe is private');
    }

    return this.prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId,
        recipeId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
