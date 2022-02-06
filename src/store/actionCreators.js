import { bindActionCreators } from 'redux';
import store from 'store';
import { actions as testActions } from './modules/test';
import { actions as appActions } from './modules/app';
import { actions as baseActions } from './modules/base';
import { actions as authActions } from './modules/auth';
import { actions as userActions } from './modules/user';
import { actions as utilActions } from './modules/util';
import { actions as designerActions } from './modules/designer';
import { actions as projectActions } from './modules/project';
import { actions as teethActions } from './modules/teeth';
import { actions as binActions } from './modules/bin';
import { actions as eventActions } from './modules/event';
import { actions as pointActions } from './modules/point';
import { actions as storeActions } from './modules/store';

export const { dispatch } = store;

export const TestActions = bindActionCreators(testActions, dispatch);
export const AppActions = bindActionCreators(appActions, dispatch);
export const BaseActions = bindActionCreators(baseActions, dispatch);
export const AuthActions = bindActionCreators(authActions, dispatch);
export const UserActions = bindActionCreators(userActions, dispatch);
export const UtilActions = bindActionCreators(utilActions, dispatch);
export const DesignerActions = bindActionCreators(designerActions, dispatch);
export const ProjectActions = bindActionCreators(projectActions, dispatch);
export const TeethActions = bindActionCreators(teethActions, dispatch);
export const BinActions = bindActionCreators(binActions, dispatch);
export const EventActions = bindActionCreators(eventActions, dispatch);
export const PointActions = bindActionCreators(pointActions, dispatch);
export const StoreActions = bindActionCreators(storeActions, dispatch);

// export const DispatchActions = {
//   ...AppActions,
// };
