import { Module } from '@nestjs/common';
import { PlatformUsersModule } from './users/platform-users.module';
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
    PlatformUsersModule,
    OverviewModule,
    PlatformSchoolsModule,
    PlatformPlansModule,
    PlatformSubscriptionsModule,
    PlatformInvoicesModule,
    PlatformFeaturesModule,
    PlatformSupportModule,
    PlatformAuditModule,
    PlatformHealthModule,
  ],
  exports: [
    PlatformUsersModule,
    OverviewModule,
    PlatformSchoolsModule,
    PlatformPlansModule,
    PlatformSubscriptionsModule,
    PlatformInvoicesModule,
    PlatformFeaturesModule,
    PlatformSupportModule,
    PlatformAuditModule,
    PlatformHealthModule,
  ],
})
export class PlatformModule {}
