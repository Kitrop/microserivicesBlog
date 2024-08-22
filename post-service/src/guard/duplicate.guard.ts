import { Injectable } from '@nestjs/common'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { KafkaContext } from '@nestjs/microservices'

@Injectable()
export class MessageDuplicateGuard implements CanActivate {
  private processedMessages = new Set()

  canActivate(context: ExecutionContext) {
    const message = context.switchToRpc().getContext<KafkaContext>()
    const messageId = message.getMessage().value['messageId']

    if (this.processedMessages.has(messageId)) {
      return false
    }

    this.processedMessages.add(messageId)
    return true
  }
}
