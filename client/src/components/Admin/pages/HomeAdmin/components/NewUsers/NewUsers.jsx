import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './NewUsers.module.scss';
import { AiFillEye } from 'react-icons/ai';
import { useEffect } from 'react';
import { getUserNewest } from '~/api';
import { useState } from 'react';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function NewUsers() {
    const [listUser, setListUser] = useState([]);
    useEffect(() => {
        getUserNewest().then((res) => setListUser(res.result));
    }, []);
    return (
        <div className={cx('wrapper')}>
            <h4 className={cx('title')}>Thành viên mới</h4>
            <ul className={cx('new-user-list')}>
                {listUser?.length &&
                    listUser.map((item, index) => (
                        <li className={cx('new-user-item')} key={index}>
                            <div className={cx('info-container')}>
                                <img
                                    src={
                                        item?.profilePicture
                                            ? `${HOST_NAME}${item?.profilePicture}`
                                            : images.defaultAvt
                                    }
                                    alt=""
                                    className={cx('avatar')}
                                />
                                <div className={cx('info')}>
                                    <span className={cx('username')}>
                                        {item?.fullName || item?.username}
                                    </span>
                                    <span className={cx('email')}>
                                        {item?.email}
                                    </span>
                                </div>
                            </div>
                            <div className={cx('see-info')}>
                                <span className={cx('icon')}>
                                    <AiFillEye />
                                </span>
                                <span className={cx('text')}>Thông tin</span>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default NewUsers;
