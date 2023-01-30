import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import images from '~/assets/images';
import { MenuIcon } from '~/components/Icons';
import { FiUsers } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { AiOutlineUser } from 'react-icons/ai';
import { MdPassword } from 'react-icons/md';
import { Link } from 'react-router-dom';
import config from '~/config';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineHome } from 'react-icons/ai';
import { currentMenu } from '~/redux/slice/adminSlice';
const cx = classNames.bind(styles);

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function Sidebar() {
    const dispatch = useDispatch();
    const crMenu = useSelector((state) => state.admin?.currentMenu?.menu);
    const currentUser = useSelector(
        (state) => state.admin.adminLogin?.currentUser?.user,
    );
    const udtUser = useSelector(
        (state) => state.admin.updateAdmin?.currentUser?.user,
    );
    const [quickMenuIndex, setQuickMenuIndex] = useState(0);
    useEffect(() => {
        if (crMenu === 'home') {
            setQuickMenuIndex(0);
            return;
        }
        if (crMenu === 'change_profile') {
            setQuickMenuIndex(1);
            return;
        }
        if (crMenu === 'list-post') {
            setQuickMenuIndex(2);
            return;
        }
        if (crMenu === 'change_password') {
            setQuickMenuIndex(5);
            return;
        }
    }, [crMenu]);

    const quickMenuItems = [
        {
            title: 'Trang chủ',
            icon: <AiOutlineHome />,
            to: config.routes.admin,
            disp: currentMenu('home'),
        },

        {
            title: 'Thông tin cá nhân',
            icon: <AiOutlineUser />,
            to: config.routes.adminProfile + `/${currentUser?._id}`,
            disp: currentMenu('change_profile'),
        },
        {
            title: 'Quản lý bài đăng',
            icon: <MenuIcon />,
            to: config.routes.adminPostMng,
            disp: currentMenu('list-post'),
        },
        {
            title: 'Quản lý thành viên',
            icon: <FiUsers />,
            to: config.routes.membermng,
            disp: currentMenu('list_user'),
        },
        {
            title: 'Quản lý giao dịch',
            icon: <RiMoneyDollarCircleLine />,
            to: config.routes.adminTransaction,
            disp: currentMenu('list_transaction'),
        },
        {
            title: 'Thay đổi mật khẩu',
            icon: <MdPassword />,
            to: config.routes.adminChangePassword + `/${currentUser?._id}`,
            disp: currentMenu('change_password'),
        },
    ];

    const handleOnClickQuickMenu = (item, i) => {
        if (item?.disp) {
            dispatch(item.disp);
        }
        setQuickMenuIndex(i);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <div className={cx('user')}>
                    <div className={cx('user-avatar')}>
                        <img
                            src={
                                udtUser?.profilePicture
                                    ? `${HOST_NAME}${udtUser?.profilePicture}`
                                    : currentUser?.profilePicture
                                    ? `${HOST_NAME}${currentUser?.profilePicture}`
                                    : images.defaultAvt
                            }
                            alt="avatar"
                            className={cx('avatar')}
                        />
                    </div>
                    <div className={cx('user-details')}>
                        <span className={cx('username')}>
                            {udtUser?.fullName
                                ? udtUser?.fullName
                                : currentUser?.fullName
                                ? currentUser?.fullName
                                : currentUser?.username}
                        </span>
                        <span className={cx('email')}>
                            {currentUser && currentUser.memberCode}
                        </span>
                    </div>
                </div>
            </div>
            <div className={cx('dashboard-container')}>
                <div className={cx('dashboard-mng')}>
                    <span className={cx('text-title')}>Danh mục</span>
                </div>
            </div>
            <div className={cx('quick-menu-container')}>
                {quickMenuItems.map((item, index) => (
                    <Link
                        to={item?.to}
                        key={index}
                        className={cx(
                            'quick-menu-item',
                            quickMenuIndex === index && 'active',
                        )}
                        onClick={() => handleOnClickQuickMenu(item, index)}
                    >
                        <span className={cx('icon')}>{item.icon}</span>
                        <span className={cx('text')}>{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
