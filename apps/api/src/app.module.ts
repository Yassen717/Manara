import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CitizensModule } from './modules/citizens/citizens.module';
import { ServicesModule } from './modules/services/services.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { RequestsModule } from './modules/requests/requests.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { StatusModule } from './modules/status/status.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { EntitlementsModule } from './modules/entitlements/entitlements.module';
import { HealthModule } from './modules/health/health.module';
import { EducationModule } from './modules/education/education.module';
import { UtilitiesModule } from './modules/utilities/utilities.module';

@Module({
  imports: [
    AuthModule,
    CitizensModule,
    ServicesModule,
    DocumentsModule,
    RequestsModule,
    NotificationsModule,
    StatusModule,
    WalletModule,
    EntitlementsModule,
    HealthModule,
    EducationModule,
    UtilitiesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
