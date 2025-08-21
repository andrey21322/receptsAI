import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto, UpdateRecipeDto, CreateRatingDto } from './dto/recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRecipeDto: CreateRecipeDto, @Request() req) {
    return this.recipesService.create(createRecipeDto, req.user.userId);
  }

  @Get()
  findAll(@Query('q') query?: string) {
    return this.recipesService.findAll(query);
  }

  @Get('my-recipes')
  @UseGuards(JwtAuthGuard)
  findMyRecipes(@Request() req) {
    return this.recipesService.findMyRecipes(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req,
  ) {
    return this.recipesService.update(id, updateRecipeDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.recipesService.remove(id, req.user.userId);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  rateRecipe(
    @Param('id') id: string,
    @Body() createRatingDto: CreateRatingDto,
    @Request() req,
  ) {
    return this.recipesService.rateRecipe(id, createRatingDto, req.user.userId);
  }
}
