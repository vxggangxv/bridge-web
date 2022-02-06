import lodable from '@loadable/component';
import { ENV_MODE_PROD } from 'lib/setting';
import HomePage from './home/Home';
import ErrorPage from './error/Error';
import AuthPage from './auth/Auth';
import DesignerPage from './designer/Designer';
import ProjectPage from './project/Project';
import UserPage from './user/User';
import OrderPage from './order/Order';
//
import AboutPage from './about/About';
import HowtoPage from './howto/Howto';
import PaymentPage from './payment/Payment';
import LegalPage from './legal/Legal';
import StorePage from './store/Store';

// NOTE: test용
export const Counter = lodable(() => import('./test/__test__/Counter'));
export const TodoApp = lodable(() => import('./test/__test__/todo/TodoApp'));
export const DelayedToggle = lodable(() => import('./test/__test__/DelayedToggle'));
export const UserProfile = lodable(() => import('./test/__test__/UserProfile'));
export const Test = lodable(() => import('./test/Test'));
export const TestList = lodable(() => import('./test/TestList'));
export const TestDetail = lodable(() => import('./test/TestDetail'));

// export { default as Home } from './home/Home';
// export { default as Error } from './error/Error';
// export { default as Auth } from './auth/Auth';
// export { default as About } from './about/About';
// export { default as User } from './user/User';

// NOTE: react-hot-loader 적용을 위해 별도 설정(code split 불가), production 버전에서 code split 적용
let Home = HomePage;
let Error = ErrorPage;
let Auth = AuthPage;
let Designer = DesignerPage;
let Project = ProjectPage;
let User = UserPage;
let Order = OrderPage;
//
let About = AboutPage;
let Howto = HowtoPage;
let Payment = PaymentPage;
let Legal = LegalPage;
let Store = StorePage;

if (ENV_MODE_PROD) {
  Home = lodable(() => import('./home/Home'));
  Error = lodable(() => import('./error/Error'));
  Auth = lodable(() => import('./auth/Auth'));
  Designer = lodable(() => import('./designer/Designer'));
  Project = lodable(() => import('./project/Project'));
  User = lodable(() => import('./user/User'));
  Order = lodable(() => import('./order/Order'));
  //
  About = lodable(() => import('./about/About'));
  Howto = lodable(() => import('./howto/Howto'));
  Payment = lodable(() => import('./payment/Payment'));
  Legal = lodable(() => import('./legal/Legal'));
  Store = lodable(() => import('./store/Store'));
}

export {
  Home,
  Error,
  Auth,
  Designer,
  Project,
  User,
  Order,
  //
  About,
  Howto,
  Payment,
  Legal,
  Store,
};
