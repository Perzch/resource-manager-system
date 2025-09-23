import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

export interface DashboardStats {
  totalResources: number;
  totalUsers: number;
  totalCategories: number;
  totalDownloads: number;
  topUploaders: TopUploaderStats[];
  topCategories: TopCategoryStats[];
  recentResources: RecentResourceStats[];
  downloadTrends: DownloadTrendStats[];
}

export interface TopUploaderStats {
  userId: number;
  username: string;
  avatar?: string;
  resourceCount: number;
  totalDownloads: number;
}

export interface TopCategoryStats {
  categoryId: number;
  categoryName: string;
  resourceCount: number;
  totalDownloads: number;
}

export interface RecentResourceStats {
  id: number;
  name: string;
  username: string;
  categoryName: string;
  downloadCount: number;
  createDate: Date;
}

export interface DownloadTrendStats {
  date: string;
  downloads: number;
}

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalResources,
      totalUsers,
      totalCategories,
      totalDownloads,
      topUploaders,
      topCategories,
      recentResources,
      downloadTrends,
    ] = await Promise.all([
      this.getTotalResources(),
      this.getTotalUsers(),
      this.getTotalCategories(),
      this.getTotalDownloads(),
      this.getTopUploaders(),
      this.getTopCategories(),
      this.getRecentResources(),
      this.getDownloadTrends(),
    ]);

    return {
      totalResources,
      totalUsers,
      totalCategories,
      totalDownloads,
      topUploaders,
      topCategories,
      recentResources,
      downloadTrends,
    };
  }

  private async getTotalResources(): Promise<number> {
    return await this.resourceRepository.count();
  }

  private async getTotalUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  private async getTotalCategories(): Promise<number> {
    return await this.categoryRepository.count();
  }

  private async getTotalDownloads(): Promise<number> {
    const result = await this.resourceRepository
      .createQueryBuilder('resource')
      .select('SUM(resource.downloadCount)', 'total')
      .getRawOne();
    return parseInt(result.total) || 0;
  }

  private async getTopUploaders(limit: number = 5): Promise<TopUploaderStats[]> {
    const result = await this.resourceRepository
      .createQueryBuilder('resource')
      .select([
        'user.id as "userId"',
        'user.username as "username"',
        'user.avatar as "avatar"',
        'COUNT(resource.id) as "resourceCount"',
        'SUM(resource.downloadCount) as "totalDownloads"',
      ])
      .innerJoin('resource.user', 'user')
      .where('resource.userId IS NOT NULL')
      .groupBy('user.id, user.username, user.avatar')
      .orderBy('"resourceCount"', 'DESC')
      .addOrderBy('"totalDownloads"', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      userId: parseInt(row.userId),
      username: row.username,
      avatar: row.avatar,
      resourceCount: parseInt(row.resourceCount),
      totalDownloads: parseInt(row.totalDownloads) || 0,
    }));
  }

  private async getTopCategories(limit: number = 5): Promise<TopCategoryStats[]> {
    const result = await this.resourceRepository
      .createQueryBuilder('resource')
      .select([
        'category.id as "categoryId"',
        'category.name as "categoryName"',
        'COUNT(resource.id) as "resourceCount"',
        'SUM(resource.downloadCount) as "totalDownloads"',
      ])
      .innerJoin('resource.category', 'category')
      .where('resource.categoryId IS NOT NULL')
      .groupBy('category.id, category.name')
      .orderBy('"resourceCount"', 'DESC')
      .addOrderBy('"totalDownloads"', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      categoryId: parseInt(row.categoryId),
      categoryName: row.categoryName,
      resourceCount: parseInt(row.resourceCount),
      totalDownloads: parseInt(row.totalDownloads) || 0,
    }));
  }

  private async getRecentResources(limit: number = 10): Promise<RecentResourceStats[]> {
    const result = await this.resourceRepository
      .createQueryBuilder('resource')
      .select([
        'resource.id as "id"',
        'resource.name as "name"',
        'resource.downloadCount as "downloadCount"',
        'resource.createDate as "createDate"',
        'user.username as "username"',
        'category.name as "categoryName"',
      ])
      .leftJoin('resource.user', 'user')
      .leftJoin('resource.category', 'category')
      .orderBy('resource.createDate', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(row => ({
      id: parseInt(row.id),
      name: row.name,
      username: row.username || 'Unknown',
      categoryName: row.categoryName || 'Uncategorized',
      downloadCount: parseInt(row.downloadCount) || 0,
      createDate: new Date(row.createDate),
    }));
  }

  private async getDownloadTrends(days: number = 7): Promise<DownloadTrendStats[]> {
    // 获取最近7天的下载趋势（使用 TypeORM 的 Raw 查询方式）
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await this.resourceRepository
      .createQueryBuilder('resource')
      .select([
        'DATE(resource.createDate) as "date"',
        'SUM(resource.downloadCount) as "downloads"',
      ])
      .where('resource.createDate >= :startDate', { startDate })
      .groupBy('DATE(resource.createDate)')
      .orderBy('"date"', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      downloads: parseInt(row.downloads) || 0,
    }));
  }
}
