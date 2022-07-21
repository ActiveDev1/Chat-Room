import { MockModel } from '../../../../shared/tests/support/mock.model'
import { User } from '../../schemas/user.schema'
import { userStub } from '../stubs/user.stub'

export class UserModel extends MockModel<User> {
	protected entityStub = userStub()
}
