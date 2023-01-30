import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// import Button from '~/components/Button';
import styles from './MenuAdmin.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '~/config';
import { createAxiosAdmin } from '~/createInstances';
import {
    faUser,
    faRightFromBracket,
    faBars,
    faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogOut } from '~/api/index';
import { adminLogOutSuccess, currentMenu } from '~/redux/slice/adminSlice';
const cx = classNames.bind(styles);

function MenuItemAdmin() {
    const currentUser = useSelector(
        (state) => state.admin.adminLogin?.currentUser,
    );
    const id = currentUser?.user?._id;
    const accessToken = currentUser?.accessToken;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let axiosJWT = createAxiosAdmin(currentUser, dispatch, adminLogOutSuccess);
    const handleLogout = () => {
        adminLogOut(dispatch, id, navigate, accessToken, axiosJWT);
    };
    const handleOnClick = (index) => {
        switch (index) {
            case 0:
                dispatch(currentMenu('list-post'));
                return;
            case 1:
                dispatch(currentMenu('change_profile'));
                return;
            case 2:
                dispatch(currentMenu('change_password'));
                return;
            case 3:
                handleLogout();
                return;
            default:
                break;
        }
    };
    const menuItem = [
        {
            to: config.routes.adminPostMng,
            text: 'Quản lý bài đăng',
            icon: <FontAwesomeIcon icon={faBars} />,
        },
        {
            to: config.routes.adminProfile + `/${id}`,
            text: 'Thay đổi thông tin cá nhân',
            icon: <FontAwesomeIcon icon={faUser} />,
        },
        {
            to: config.routes.adminChangePassword + `/${id}`,
            text: 'Thay đổi mật khẩu',
            icon: <FontAwesomeIcon icon={faLock} />,
        },
        {
            text: 'Đăng xuất',
            icon: <FontAwesomeIcon icon={faRightFromBracket} />,
        },
    ];
    return (
        <>
            {menuItem.map((item, index) => (
                <Link to={item?.to && item.to} key={index}>
                    <div
                        className={cx('menu-item')}
                        onClick={() => handleOnClick(index)}
                    >
                        <div className={cx('abc')}>
                            <span className={cx('menu-icon')}>{item.icon}</span>
                            <span className={cx('menu-title')}>
                                {item.text}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </>
    );
}

// MenuItemAdmin.propTypes = {
//     data: PropTypes.object.isRequired,
//     onClick: PropTypes.func,
// };

export default MenuItemAdmin;
