import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import images from '~/assets/images';
import styles from './Conversation.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '~/api';
import { GoPrimitiveDot } from 'react-icons/go';
import io from 'socket.io-client';
import { newMessage } from '~/redux/slice/messageSlice';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Conversation({ data, online }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const newMsg = useSelector((state) => state.message.message?.msg);

    const [user, setUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    useEffect(() => {
        const noti = data.members.includes(newMsg?.sender, newMsg?.receiver);
        if (noti) {
            setShowIcon(true);
        }
        if (!newMsg) {
            setShowIcon(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMsg]);
    useEffect(() => {
        const theirId = data.members.find((item) => item !== currentUser?._id);
        theirId && getUser(theirId).then((res) => setUser(res.user));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    useEffect(() => {
        const result = online.find((item) => item.userId === user?._id);
        if (result) {
            setOnlineUser(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, online]);
    const handleSeenMessage = () => {
        dispatch(newMessage(null));
        const noti = data.members.includes(newMsg?.sender, newMsg?.receiver);
        if (noti) {
            setShowIcon(false);
        }
    };
    return (
        <>
            <div
                className={cx('list-message-item')}
                onClick={handleSeenMessage}
            >
                <div className={cx('avatar')}>
                    <img
                        src={
                            user?.profilePicture
                                ? `${HOST_NAME}${user.profilePicture}`
                                : images.defaultAvt
                        }
                        alt=""
                        className={cx('img')}
                    />
                    {onlineUser && (
                        <GoPrimitiveDot className={cx('online-icon')} />
                    )}
                </div>
                <div className={cx('info')}>
                    <div className={cx('username')}>
                        <span>{user && user?.fullName}</span>
                    </div>
                </div>
                {showIcon && (
                    <div className={cx('notify-icon')}>
                        <GoPrimitiveDot className={cx('icon')} />
                    </div>
                )}
            </div>
        </>
    );
}

export default Conversation;
