// @flow
import type { DBUser } from '../../flowTypes'
import { isAdmin } from '../../utils/permissions';

export default ({ id }: DBUser) => isAdmin(id);
