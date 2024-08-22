// import { Module } from '@nestjs/common'
// import { LikeController } from './like.controller'
// import { ClientsModule, Transport } from '@nestjs/microservices'
// import { jwtModuleConfig } from 'src/config'
// import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
// import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
// import { ConfigService } from '@nestjs/config'
// import { JwtModule } from '@nestjs/jwt'
// import { randomBytes } from 'crypto'

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: 'POST_COMMENT_SERVICE',
//         transport: Transport.KAFKA,
//         options: {
//           client: {
//             clientId: 'gateway',
//             brokers: ['localhost:9092'],
//           },
//           consumer: {
//             groupId: 'gateway-consumer' + randomBytes(16).toString('hex'),
//             allowAutoTopicCreation: true,
//           },
//           producer: {
//             allowAutoTopicCreation: true,
//             idempotent: true,
//             maxInFlightRequests: 1,
//           },
//           send: {
//             acks: -1,
//           },
//         },
//       },
//     ]),
//     JwtModule.register(jwtModuleConfig(process.env.SECRET_KEY)),
//   ],
//   controllers: [LikeController],
//   providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, ConfigService],
// })
// export class LikeModule {}
