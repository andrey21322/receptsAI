import { IsString, IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsArray()
  @IsString({ each: true })
  instructions: string[];

  @IsNumber()
  prepTime: number;

  @IsNumber()
  cookTime: number;

  @IsNumber()
  servings: number;

  @IsString()
  difficulty: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  instructions?: string[];

  @IsOptional()
  @IsNumber()
  prepTime?: number;

  @IsOptional()
  @IsNumber()
  cookTime?: number;

  @IsOptional()
  @IsNumber()
  servings?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class CreateRatingDto {
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
