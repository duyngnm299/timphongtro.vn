import config from '~/config';

// Pages
import { HaveSearchBarLayout } from '~/layouts';
import { DefaultLayout } from '~/layouts';
import Home from '~/pages/Home/';
import Motel from '~/pages/Motel';
import House from '~/pages/House';
import Office from '~/pages/Office/';
import Apartment from '~/pages/Apartment';
import Ground from '~/pages/Ground';
import Profile from '~/pages/Profile';
import Search from '~/pages/Search';
import Password from '~/components/Password';
import PostManagement from '~/pages/PostManagement';
import Post from '~/components/PostManagement/Post';
import PostList from '~/components/PostManagement/PostList';
import Login from '~/components/Login';
import Register from '~/components/Register';
import FindRoomates from '~/pages/FindRoomates';
import HaveSidebarLayout from '~/layouts/HaveSidebarLayout';
import DetailPost from '~/components/DetailPost';
import SearchResult from '~/components/SearchResult';
import Message from '~/components/Message';
import PostListOfUser from '~/components/PostListOfUser';
import ForgotPassword from '~/components/ForgotPassword';
import AdminLayout from '~/components/Admin/layout/AdminLayout';
import HomeAdmin from '~/components/Admin/pages/HomeAdmin/HomeAdmin';
import MemberManagement from '~/components/Admin/pages/MemberManagement';
import ProfileUser from '~/components/Admin/pages/MemberManagement/components/ProfileUser';
import AdminPostManagement from '~/components/Admin/pages/AdminPostManagement';
import AdminDetailPost from '~/components/Admin/pages/AdminPostManagement/components/AdminDetailPost';
import AdminLogin from '~/components/Admin/pages/AdminLogin';
import LoginLayout from '~/components/Admin/layout/LoginLayout';
import AdminRegister from '~/components/Admin/pages/AdminRegister';
import AdminForgotPassword from '~/components/Admin/pages/AdminForgotPassword';
import ProfileAdmin from '~/components/Admin/pages/ProfileAdmin';
import Transaction from '~/components/Transaction';
import AdminTransaction from '~/components/Admin/pages/AdminTransaction';
import DetailRevenue from '~/components/Admin/pages/AdminTransaction/components/RevenueManagement/DetailRevenue';
import AdminChangePassword from '~/components/Admin/pages/AdminChangePassword';
import Payment from '~/components/Payment';
// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    {
        path: config.routes.adminLogin,
        component: AdminLogin,
        layout: LoginLayout,
    },
    {
        path: config.routes.adminRegister,
        component: AdminRegister,
        layout: LoginLayout,
    },
    {
        path: config.routes.adminForgotPassword,
        component: AdminForgotPassword,
        layout: LoginLayout,
    },
    {
        path: config.routes.adminChangePassword + '/:id',
        component: AdminChangePassword,
        layout: AdminLayout,
    },
    {
        path: config.routes.admin,
        component: HomeAdmin,
        layout: AdminLayout,
    },
    {
        path: config.routes.adminProfile + `/:id`,
        component: ProfileAdmin,
        layout: AdminLayout,
    },
    {
        path: config.routes.membermng,
        component: MemberManagement,
        layout: AdminLayout,
    },
    {
        path: config.routes.detailMember + '/:id',
        component: ProfileUser,
        layout: AdminLayout,
    },
    {
        path: config.routes.adminPostMng,
        component: AdminPostManagement,
        layout: AdminLayout,
    },
    {
        path: config.routes.adminDetailPost + '/:id',
        component: AdminDetailPost,
        layout: AdminLayout,
    },
    {
        path: config.routes.adminTransaction,
        component: AdminTransaction,
        layout: AdminLayout,
    },
    {
        path: config.routes.adminDetailRevenue,
        component: DetailRevenue,
        layout: AdminLayout,
    },
    {
        path: config.routes.motel,
        component: Motel,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.house,
        component: House,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.findroomates,
        component: FindRoomates,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.office,
        component: Office,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.apartment,
        component: Apartment,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.ground,
        component: Ground,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.detailPage + '/:id',
        component: DetailPost,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.searchResult,
        component: SearchResult,
        layout: HaveSearchBarLayout,
    },
    {
        path: config.routes.postmng,
        component: PostManagement,
        layout: HaveSidebarLayout,
    },

    {
        path: config.routes.message,
        component: Message,
    },
    {
        path: config.routes.post,
        component: Post,
        layout: HaveSidebarLayout,
    },

    {
        path: config.routes.postlist + '/:id',
        component: PostList,
        layout: HaveSidebarLayout,
    },
    {
        path: config.routes.profile + '/:id',
        component: Profile,
        layout: HaveSidebarLayout,
    },
    {
        path: config.routes.transaction + '/:id',
        component: Transaction,
        layout: HaveSidebarLayout,
    },
    {
        path: config.routes.password + '/:id',
        component: Password,
        layout: HaveSidebarLayout,
    },
    {
        path: config.routes.payment + '/:id',
        component: Payment,
        layout: HaveSidebarLayout,
    },
    {
        path: config.routes.postListOfUser + '/:id',
        component: PostListOfUser,
        layout: DefaultLayout,
    },
    {
        path: config.routes.forgotPassword,
        component: ForgotPassword,
        layout: DefaultLayout,
    },

    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.search, component: Search },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
