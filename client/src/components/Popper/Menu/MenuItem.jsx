import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
// import Button from '~/components/Button';
import styles from './Menu.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '~/config';
import { createAxios } from '~/createInstances';
import {
    faUser,
    faRightFromBracket,
    faBars,
    faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '~/api/index';
import { logOutSuccess, registerFailed } from '~/redux/slice/authSlice';
import { currentMenu } from '~/redux/slice/menuSlice';
const cx = classNames.bind(styles);

function MenuItem() {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const id = currentUser?.user?._id;
    console.log(currentUser);
    const accessToken = currentUser?.accessToken;
    console.log(id);
    console.log(accessToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let axiosJWT = createAxios(currentUser, dispatch, logOutSuccess);
    const handleLogout = () => {
        logOut(dispatch, id, navigate, accessToken, axiosJWT);
    };
    const handleOnClick = (index) => {
        switch (index) {
            case 0:
                dispatch(currentMenu('post_list'));
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
            to: config.routes.postlist + `/${id}`,
            text: 'Quản lý tin đăng',
            icon: <FontAwesomeIcon icon={faBars} />,
        },
        {
            to: config.routes.profile + `/${id}`,
            text: 'Thay đổi thông tin cá nhân',
            icon: <FontAwesomeIcon icon={faUser} />,
        },
        {
            to: config.routes.password + `/${id}`,
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

// MenuItem.propTypes = {
//     data: PropTypes.object.isRequired,
//     onClick: PropTypes.func,
// };

export default MenuItem;
