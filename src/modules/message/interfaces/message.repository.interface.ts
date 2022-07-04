import { BaseInterfaceRepository } from '../../../shared/interfaces/base-interface-repository.interface'
import { Message } from '../schemas/message.schema'

export interface MessageRepositoryInterface extends BaseInterfaceRepository<Message> {}
