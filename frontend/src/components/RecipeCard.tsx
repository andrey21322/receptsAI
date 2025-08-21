'use client';

import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/lib/api';
import { Clock, Users, Star, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
        {/* Recipe Image */}
        <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ChefHat className="h-16 w-16 text-orange-400" />
          )}
        </div>

        {/* Recipe Content */}
        <div className="p-6">
          {/* Title and Author */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-black mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-black">
              by <span className="font-medium text-black">{recipe.author?.name || 'Unknown Author'}</span>
            </p>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-black text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Recipe Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-black">
              <Clock className="h-4 w-4 mr-2 text-orange-500" />
              <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
            </div>
            <div className="flex items-center text-sm text-black">
              <Users className="h-4 w-4 mr-2 text-orange-500" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {/* Difficulty and Cuisine */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            {recipe.cuisine && (
              <span className="text-sm text-black bg-gray-100 px-3 py-1 rounded-full">
                {recipe.cuisine}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium text-black">
                {recipe.averageRating > 0 ? recipe.averageRating.toFixed(1) : 'No ratings'}
              </span>
              {recipe.ratingCount > 0 && (
                <span className="text-sm text-black ml-1">
                  ({recipe.ratingCount})
                </span>
              )}
            </div>
            <span className="text-xs text-black">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
