import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TripsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TripsGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const secret = this.configService.get<string>('jwt.accessSecret');
      const payload = this.jwtService.verify(token, { secret });
      
      client.data.user = payload;
      
      // Auto-join user-specific and school-specific rooms for trip events & notifications
      if (payload.schoolId) {
        client.join(`school:${payload.schoolId}`);
      }
      client.join(`user:${payload.sub}`);

      this.logger.log(`Client connected for trip events: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_trip_room')
  async handleJoinTripRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string },
  ) {
    const user = client.data.user;
    if (!user || !user.schoolId) return { success: false, error: 'Unauthorized' };

    const trip = await this.prisma.trip.findFirst({
      where: { id: data.tripId, schoolId: user.schoolId },
      include: {
        tripStudents: { include: { student: { include: { guardianLinks: true } } } },
      },
    });

    if (!trip) return { success: false, error: 'Trip not found or unauthorized' };

    // Authorization checks based on role
    let isAuthorized = false;
    
    if (user.role === 'SCHOOL_ADMIN' || user.role === 'TRANSPORT_MANAGER') {
      isAuthorized = true;

    } else if (user.role === 'SUPERVISOR') {
      const supervisor = await this.prisma.supervisor.findFirst({ where: { schoolUserId: user.sub, schoolId: user.schoolId } });
      if (supervisor && trip.supervisorId === supervisor.id) isAuthorized = true;
    } else if (user.role === 'PARENT') {
      const guardian = await this.prisma.guardian.findFirst({ where: { schoolUserId: user.sub, schoolId: user.schoolId } });
      if (guardian) {
        const isChildInTrip = trip.tripStudents.some(ts => 
          ts.student.guardianLinks.some(gl => gl.guardianId === guardian.id)
        );
        if (isChildInTrip) isAuthorized = true;
      }
    }

    if (isAuthorized) {
      client.join(`trip:${data.tripId}`);
      return { success: true, room: `trip:${data.tripId}` };
    } else {
      return { success: false, error: 'Unauthorized to join this trip room' };
    }
  }

  // Real-time trip status event emitter helper (used for boarding / dropoff / trip events)
  emitTripEvent(tripId: string, eventName: string, payload: any) {
    this.server.to(`trip:${tripId}`).emit(eventName, payload);
  }
}
