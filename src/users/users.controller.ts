import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { UserRole } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new user (Admin only)',
    description:
      'Create a new user account. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new admin user (Admin only)',
    description:
      'Create a new admin user account. Only existing admins can perform this action.',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin user created successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdmin(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all users (Admin only)',
    description:
      'Retrieve a list of all users. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the profile of the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user by ID (Admin only)',
    description:
      'Retrieve a specific user by ID. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update user role (Admin only)',
    description:
      'Update the role of a specific user. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  updateRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return this.usersService.updateRole(id, body.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update user (Admin only)',
    description: 'Update a specific user. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete user (Admin only)',
    description: 'Delete a specific user. Only admins can perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin access required' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
