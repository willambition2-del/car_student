import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { validate } from './config/validation.schema';

import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlatformUsersModule } from './platform/users/platform-users.module';
import { PlatformModule } from './platform/platform.module';
import { SchoolSettingsModule } from './school-settings/school-settings.module';
import { StudentsModule } from './students/students.module';
import { GuardiansModule } from './guardians/guardians.module';
import { AddressRequestsModule } from './address-requests/address-requests.module';
import { BusesModule } from './buses/buses.module';
import { SupervisorsModule } from './supervisors/supervisors.module';
import { DriversModule } from './drivers/drivers.module';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { AbsenceRequestsModule } from './absence-requests/absence-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmergencyModule } from './emergency/emergency.module';
import { FinancialModule } from './financial/financial.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
          limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
        },
      ],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    PlatformUsersModule,
    PlatformModule,
    SchoolSettingsModule,
    StudentsModule,
    GuardiansModule,
    AddressRequestsModule,
    BusesModule,
    SupervisorsModule,
    DriversModule,
    RoutesModule,
    TripsModule,
    AbsenceRequestsModule,
    NotificationsModule,
    EmergencyModule,
    FinancialModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
