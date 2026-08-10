import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PushDeliveryService {
  private readonly logger = new Logger(PushDeliveryService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Sends a push notification to a UnifiedPush/ntfy endpoint.
   * This is a self-hosted alternative to Firebase FCM.
   */
  async sendToEndpoint(endpoint: string, payload: {
    title: string;
    message: string;
    clickUrl?: string;
    data?: Record<string, any>;
  }): Promise<boolean> {
    try {
      // Create request options
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // For ntfy formatting specifically (UnifiedPush distributors usually handle this if it's ntfy under the hood)
      if (endpoint.includes('notify-staging.example.com') || endpoint.includes('localhost:3004') || endpoint.includes('ntfy')) {
        headers['Title'] = Buffer.from(payload.title, 'utf8').toString('utf8'); // ensure valid utf8
        if (payload.clickUrl) {
          headers['Click'] = payload.clickUrl;
        }
        
        // Optionally attach action/metadata
        if (payload.data && payload.data.actionType) {
          const actionStr = `view, View Details, ${payload.clickUrl || ''}, clear=true`;
          headers['Actions'] = actionStr;
        }
      }

      // We send it via fetch API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: endpoint.includes('ntfy') ? payload.message : JSON.stringify(payload), // ntfy often takes plain text body or JSON based on headers
      });

      if (!response.ok) {
        this.logger.error(`Failed to push to endpoint ${endpoint}: ${response.status} ${response.statusText}`);
        return false;
      }

      this.logger.debug(`Successfully pushed to endpoint ${endpoint}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending push to ${endpoint}:`, error);
      return false;
    }
  }
}
