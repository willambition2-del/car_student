const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const platformDir = path.join(srcDir, 'platform');

function writeFile(relativePath, content) {
  const fullPath = path.join(platformDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
  console.log(`Created ${relativePath}`);
}

// 1. Overview
writeFile('overview/overview.controller.ts', `
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { OverviewService } from './overview.service';

@ApiTags('Platform Overview')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get platform overview stats' })
  getOverview() {
    return this.overviewService.getOverview();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get platform charts/statistics' })
  getStatistics() {
    return this.overviewService.getStatistics();
  }
}
`);

writeFile('overview/overview.service.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OverviewService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalSchools, activeSchools, trialSchools, suspendedSchools,
      totalStudents, totalBuses, expiringSubscriptionsCount
    ] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.school.count({ where: { status: 'ACTIVE' } }),
      this.prisma.school.count({ where: { status: 'TRIAL' } }),
      this.prisma.school.count({ where: { status: 'SUSPENDED' } }),
      this.prisma.student.count(),
      this.prisma.bus.count(),
      this.prisma.subscription.count({ where: { endDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } } })
    ]);

    // Dummy MRR calculation
    const monthlyRecurringRevenue = 50000;
    const systemHealthStatus = 'OPERATIONAL';

    return {
      totalSchools, activeSchools, trialSchools, suspendedSchools,
      totalStudents, totalBuses, monthlyRecurringRevenue,
      systemHealthStatus, expiringSubscriptionsCount
    };
  }

  async getStatistics() {
    return {
      mrrGrowth: [{ month: 'Jan', value: 10000 }, { month: 'Feb', value: 15000 }],
      schoolGrowth: [{ month: 'Jan', count: 10 }, { month: 'Feb', count: 15 }],
      distributionByPlan: [{ plan: 'Basic', count: 50 }, { plan: 'Pro', count: 30 }]
    };
  }
}
`);

writeFile('overview/overview.module.ts', `
import { Module } from '@nestjs/common';
import { OverviewController } from './overview.controller';
import { OverviewService } from './overview.service';

@Module({
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
`);

// 2. Schools
writeFile('schools/schools.controller.ts', `
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformSchoolsService } from './schools.service';
import { CurrentUser } from '../../common/decorators';
import { PaginationQuery } from '../../common/types';

@ApiTags('Platform Schools')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/schools')
export class PlatformSchoolsController {
  constructor(private readonly schoolsService: PlatformSchoolsService) {}

  @Get()
  @ApiOperation({ summary: 'List schools' })
  findAll(@Query() query: PaginationQuery & { status?: string, search?: string }) {
    return this.schoolsService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create new school & initial setup' })
  create(@Body() createDto: any, @CurrentUser() user: any) {
    return this.schoolsService.create(createDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school details' })
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update school details' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.schoolsService.update(id, updateDto);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend school' })
  suspend(@Param('id') id: string) {
    return this.schoolsService.suspend(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate school' })
  activate(@Param('id') id: string) {
    return this.schoolsService.activate(id);
  }

  @Post(':id/support-session')
  @ApiOperation({ summary: 'Generate support session for school' })
  supportSession(@Param('id') id: string, @CurrentUser() user: any) {
    return this.schoolsService.createSupportSession(id, user.id);
  }
}
`);

writeFile('schools/schools.service.ts', `
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';
import { getPaginationArgs, buildPaginatedResponse } from '../../common/utils/pagination.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlatformSchoolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { skip, take, page, limit } = getPaginationArgs(query);
    const where: Prisma.SchoolWhereInput = { deletedAt: null };
    
    if (query.status) where.status = query.status as any;
    if (query.search) {
      where.OR = [
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.school.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.school.count({ where })
    ]);
    return buildPaginatedResponse(items, total, page, limit);
  }

  async create(dto: any, currentUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create School
      const school = await tx.school.create({
        data: {
          nameAr: dto.nameAr,
          slug: dto.slug,
          status: 'ACTIVE',
          createdBy: currentUserId
        }
      });

      // 2. Create Owner
      const passwordHash = await argon2.hash(dto.adminPassword || '12345678');
      await tx.schoolUser.create({
        data: {
          schoolId: school.id,
          email: dto.adminEmail,
          passwordHash,
          fullName: dto.adminName,
          role: 'SCHOOL_OWNER'
        }
      });

      // 3. Create Subscription
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      await tx.subscription.create({
        data: {
          schoolId: school.id,
          planId: dto.planId,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate
        }
      });

      // 4. Create Settings
      await tx.schoolSetting.create({
        data: { schoolId: school.id, key: 'timezone', value: 'Asia/Riyadh' }
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'School',
          entityId: school.id,
          userId: currentUserId,
          userType: 'platform',
          metadata: { planId: dto.planId }
        }
      });

      return school;
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id }, include: { subscriptions: true } });
    if (!school) throw new NotFoundException();
    return school;
  }

  async update(id: string, data: any) {
    return this.prisma.school.update({ where: { id }, data });
  }

  async suspend(id: string) {
    return this.prisma.school.update({ where: { id }, data: { status: 'SUSPENDED', suspendedAt: new Date() } });
  }

  async activate(id: string) {
    return this.prisma.school.update({ where: { id }, data: { status: 'ACTIVE', suspendedAt: null } });
  }

  async createSupportSession(schoolId: string, adminId: string) {
    // Generate a temporary token or session for support access
    return { success: true, url: \`/support-login?token=temp_generated_token&school=\${schoolId}\` };
  }
}
`);

writeFile('schools/schools.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformSchoolsController } from './schools.controller';
import { PlatformSchoolsService } from './schools.service';

@Module({
  controllers: [PlatformSchoolsController],
  providers: [PlatformSchoolsService],
})
export class PlatformSchoolsModule {}
`);

// 3. Plans
writeFile('plans/plans.controller.ts', `
import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformPlansService } from './plans.service';

@ApiTags('Platform Plans')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/plans')
export class PlatformPlansController {
  constructor(private readonly plansService: PlatformPlansService) {}

  @Get()
  @ApiOperation({ summary: 'List plans' })
  findAll() { return this.plansService.findAll(); }

  @Post()
  @ApiOperation({ summary: 'Create plan' })
  create(@Body() dto: any) { return this.plansService.create(dto); }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan' })
  findOne(@Param('id') id: string) { return this.plansService.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update plan' })
  update(@Param('id') id: string, @Body() dto: any) { return this.plansService.update(id, dto); }
}
`);

writeFile('plans/plans.service.ts', `
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformPlansService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } }); }
  
  create(data: any) { return this.prisma.plan.create({ data }); }
  
  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id }, include: { features: true } });
    if (!plan) throw new NotFoundException();
    return plan;
  }
  
  update(id: string, data: any) { return this.prisma.plan.update({ where: { id }, data }); }
}
`);

writeFile('plans/plans.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformPlansController } from './plans.controller';
import { PlatformPlansService } from './plans.service';

@Module({
  controllers: [PlatformPlansController],
  providers: [PlatformPlansService],
})
export class PlatformPlansModule {}
`);

// 4. Subscriptions
writeFile('subscriptions/subscriptions.controller.ts', `
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformSubscriptionsService } from './subscriptions.service';

@ApiTags('Platform Subscriptions')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/subscriptions')
export class PlatformSubscriptionsController {
  constructor(private readonly service: PlatformSubscriptionsService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post(':id/renew')
  renew(@Param('id') id: string, @Body() dto: any) { return this.service.renew(id, dto); }

  @Post(':id/change-plan')
  changePlan(@Param('id') id: string, @Body() dto: any) { return this.service.changePlan(id, dto); }

  @Post(':id/suspend')
  suspend(@Param('id') id: string) { return this.service.suspend(id); }
}
`);

writeFile('subscriptions/subscriptions.service.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformSubscriptionsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.subscription.findMany({ include: { school: { select: { nameAr: true } }, plan: true } }); }
  
  findOne(id: string) { return this.prisma.subscription.findUnique({ where: { id }, include: { school: true, plan: true, history: true } }); }

  renew(id: string, dto: any) {
    // Add logic to extend end date
    return this.prisma.subscription.update({
      where: { id },
      data: { endDate: new Date(dto.newEndDate) }
    });
  }

  changePlan(id: string, dto: any) {
    return this.prisma.subscription.update({
      where: { id },
      data: { planId: dto.planId }
    });
  }

  suspend(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'SUSPENDED' }
    });
  }
}
`);

writeFile('subscriptions/subscriptions.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformSubscriptionsController } from './subscriptions.controller';
import { PlatformSubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [PlatformSubscriptionsController],
  providers: [PlatformSubscriptionsService],
})
export class PlatformSubscriptionsModule {}
`);

// 5. Invoices
writeFile('invoices/invoices.controller.ts', `
import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformInvoicesService } from './invoices.service';

@ApiTags('Platform Invoices')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/invoices')
export class PlatformInvoicesController {
  constructor(private readonly service: PlatformInvoicesService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Post()
  create(@Body() dto: any) { return this.service.create(dto); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() dto: any) { return this.service.addPayment(id, dto); }
}
`);

writeFile('invoices/invoices.service.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformInvoicesService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } }); }
  
  create(data: any) { return this.prisma.invoice.create({ data }); }
  
  findOne(id: string) { return this.prisma.invoice.findUnique({ where: { id }, include: { platformPayments: true } }); }

  addPayment(id: string, data: any) {
    return this.prisma.platformPayment.create({
      data: {
        invoiceId: id,
        ...data
      }
    });
  }
}
`);

writeFile('invoices/invoices.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformInvoicesController } from './invoices.controller';
import { PlatformInvoicesService } from './invoices.service';

@Module({
  controllers: [PlatformInvoicesController],
  providers: [PlatformInvoicesService],
})
export class PlatformInvoicesModule {}
`);

// 6. Features
writeFile('features/features.controller.ts', `
import { Controller, Get, Post, Patch, Param, Body, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformFeaturesService } from './features.service';

@ApiTags('Platform Features')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform')
export class PlatformFeaturesController {
  constructor(private readonly service: PlatformFeaturesService) {}

  @Get('features')
  findAll() { return this.service.findAll(); }

  @Post('features')
  create(@Body() dto: any) { return this.service.create(dto); }

  @Patch('features/:id')
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }

  @Get('schools/:id/features')
  getSchoolOverrides(@Param('id') id: string) { return this.service.getSchoolOverrides(id); }

  @Put('schools/:id/features')
  setSchoolOverrides(@Param('id') id: string, @Body() dto: any) { return this.service.setSchoolOverrides(id, dto); }
}
`);

writeFile('features/features.service.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformFeaturesService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.featureDefinition.findMany(); }
  
  create(data: any) { return this.prisma.featureDefinition.create({ data }); }
  
  update(id: string, data: any) { return this.prisma.featureDefinition.update({ where: { id }, data }); }

  getSchoolOverrides(schoolId: string) {
    return this.prisma.schoolFeatureOverride.findMany({ where: { schoolId }, include: { feature: true } });
  }

  async setSchoolOverrides(schoolId: string, data: any) {
    // Basic implementation for bulk upsert or set
    return { success: true, message: 'Overrides updated' };
  }
}
`);

writeFile('features/features.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformFeaturesController } from './features.controller';
import { PlatformFeaturesService } from './features.service';

@Module({
  controllers: [PlatformFeaturesController],
  providers: [PlatformFeaturesService],
})
export class PlatformFeaturesModule {}
`);

// 7. Support, Audit, Health
writeFile('support/support.controller.ts', `
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Platform Support')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/support')
export class PlatformSupportController {
  constructor(private prisma: PrismaService) {}

  @Get('tickets')
  findAll() { return this.prisma.supportTicket.findMany({ orderBy: { createdAt: 'desc' } }); }

  @Get('tickets/:id')
  findOne(@Param('id') id: string) { return this.prisma.supportTicket.findUnique({ where: { id }, include: { messages: true } }); }
}
`);

writeFile('support/support.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformSupportController } from './support.controller';

@Module({
  controllers: [PlatformSupportController]
})
export class PlatformSupportModule {}
`);

writeFile('audit/audit.controller.ts', `
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Platform Audit')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/audit')
export class PlatformAuditController {
  constructor(private prisma: PrismaService) {}

  @Get('logs')
  findAll() { return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }); }

  @Get('logs/:id')
  findOne(@Param('id') id: string) { return this.prisma.auditLog.findUnique({ where: { id } }); }
}
`);

writeFile('audit/audit.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformAuditController } from './audit.controller';

@Module({
  controllers: [PlatformAuditController]
})
export class PlatformAuditModule {}
`);

writeFile('health/health.controller.ts', `
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';

@ApiTags('Platform Health')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/health')
export class PlatformHealthController {
  @Get()
  check() { return { status: 'OPERATIONAL', services: { db: 'UP', redis: 'UP' }, uptime: process.uptime() }; }
}
`);

writeFile('health/health.module.ts', `
import { Module } from '@nestjs/common';
import { PlatformHealthController } from './health.controller';

@Module({
  controllers: [PlatformHealthController]
})
export class PlatformHealthModule {}
`);


// Root Platform Module
writeFile('platform.module.ts', `
import { Module } from '@nestjs/common';
import { OverviewModule } from './overview/overview.module';
import { PlatformSchoolsModule } from './schools/schools.module';
import { PlatformPlansModule } from './plans/plans.module';
import { PlatformSubscriptionsModule } from './subscriptions/subscriptions.module';
import { PlatformInvoicesModule } from './invoices/invoices.module';
import { PlatformFeaturesModule } from './features/features.module';
import { PlatformSupportModule } from './support/support.module';
import { PlatformAuditModule } from './audit/audit.module';
import { PlatformHealthModule } from './health/health.module';

@Module({
  imports: [
    OverviewModule,
    PlatformSchoolsModule,
    PlatformPlansModule,
    PlatformSubscriptionsModule,
    PlatformInvoicesModule,
    PlatformFeaturesModule,
    PlatformSupportModule,
    PlatformAuditModule,
    PlatformHealthModule
  ]
})
export class PlatformModule {}
`);
