import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './Header.module.scss';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';

import Image from '~/components/Image';
import { useSelector } from 'react-redux';
import MenuAdmin from '../MenuAdmin';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Header() {
    const navigate = useNavigate();
    const currentUser = useSelector(
        (state) => state.admin.adminLogin?.currentUser?.user,
    );
    const udtUser = useSelector(
        (state) => state.admin.updateAdmin?.currentUser?.user,
    );
    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <div
                    className={cx('logo')}
                    onClick={() => {
                        navigate(config.routes.admin);
                    }}
                >
                    <img src={images.logo} alt="" className={cx('logo-img')} />
                </div>
            </div>
            <div className={cx('right')}>
                <div className={cx('notifications')}>
                    <IoMdNotificationsOutline className={cx('noti-icon')} />
                </div>
                <div className={cx('setting')}>
                    <IoSettingsOutline className={cx('setting-icon')} />
                </div>
                <MenuAdmin>
                    <div className={cx('user-wrapper')}>
                        <Image
                            className={cx('user-avatar')}
                            src={
                                udtUser
                                    ? `${HOST_NAME}${udtUser?.profilePicture}`
                                    : `${HOST_NAME}${currentUser?.profilePicture}`
                            }
                            alt="avatar"
                            // Link ảnh gốc lỗi => set ảnh khác khác ảnh no Image
                            fallBack={images.defaultAvt}
                        />

                        <span className={cx('username')}>
                            Hi,{' '}
                            {udtUser
                                ? udtUser?.fullName
                                    ? udtUser?.fullName
                                    : udtUser?.username
                                : currentUser?.fullName
                                ? currentUser?.fullName
                                : currentUser?.username}
                        </span>
                    </div>
                </MenuAdmin>
            </div>
        </div>
    );
}

export default Header;
