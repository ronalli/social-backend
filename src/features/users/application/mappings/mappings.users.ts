import { InfoCurrentUserModel } from '../../api/models/output/info.current.user';
import { UserOutputModel } from '../../api/models/output/user.output.model';

export class MappingsUsersService {
  formatViewModel(user: UserOutputModel): InfoCurrentUserModel {
    return {
      userId: user.id,
      email: user.email,
      login: user.login,
    };
  }
}
