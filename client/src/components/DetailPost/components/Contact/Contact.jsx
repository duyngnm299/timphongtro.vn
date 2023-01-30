import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import images from '~/assets/images';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { createConversation, getPostOfUser, getUser } from '~/api';
import config from '~/config';
import { currentConversation } from '~/redux/slice/messageSlice';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Contact() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );

    const crPost = useSelector(
        (state) => state.post?.post?.currentPost?.createdBy[0],
    );

    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const [listPostOfUser, setListPostOfUser] = useState([]);
    const [userPost, setUserpost] = useState('');

    useEffect(() => {
        crPost && getUser(crPost).then((res) => setUserpost(res.user));
        crPost &&
            getPostOfUser(crPost).then((res) => setListPostOfUser(res.posts));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function formatNumber(entry = '', hide = false) {
        const match = entry
            .replace(/\D+/g, '')
            .replace(/^1/, '')
            .match(/([^\d]*\d[^\d]*){1,10}$/)[0];
        const part1 = match.length > 2 ? `${match.substring(0, 4)}` : match;
        const part2 = match.length > 3 ? ` ${match.substring(4, 7)}` : '';
        const part3 =
            match.length > 6
                ? hide
                    ? ` ***`
                    : ` ${match.substring(7, 10)}`
                : '';
        return `${part1}${part2}${part3}`;
    }
    const handleSendMessage = () => {
        if (crPost === currentUser?._id) {
            return;
        }
        const data = { senderId: currentUser?._id, receiverId: crPost };
        currentUser &&
            createConversation(data).then((res) => {
                dispatch(currentConversation(res.savedConversation));
                navigate('/tat-ca-tin-nhan');
            });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('contact')}>
                <div className={cx('avatar')}>
                    <Link to={config.routes.postListOfUser + `/${crPost}`}>
                        <img
                            src={
                                userPost?.profilePicture
                                    ? HOST_NAME + userPost?.profilePicture
                                    : images.defaultAvt
                            }
                            alt=""
                            className={cx('avatar-img')}
                        />
                    </Link>
                </div>
                <div className={cx('created-by')}>
                    <span className={cx('text')}>Được đăng bởi</span>
                    <Link to={config.routes.postListOfUser + `/${crPost}`}>
                        <p className={cx('username')}>
                            {userPost?.fullName || userPost?.username}
                        </p>
                        {listPostOfUser.length > 1 && (
                            <p className={cx('see-more')}>
                                Xem thêm {listPostOfUser.length} tin khác
                            </p>
                        )}
                    </Link>
                </div>
                <div className={cx('info-contact')}>
                    <div
                        className={cx('contact-phone')}
                        onClick={() => setShowPhoneNumber(true)}
                    >
                        <span className={cx('phone')}>
                            {userPost?.phoneNumber
                                ? showPhoneNumber
                                    ? formatNumber(userPost?.phoneNumber)
                                    : formatNumber(
                                          userPost?.phoneNumber,
                                          true,
                                      ) + ' · Hiện số'
                                : 'Chưa cập nhật'}
                        </span>
                    </div>
                    <div
                        // to={config.routes.message}
                        className={cx(
                            'contact-email',
                            crPost && crPost === currentUser?._id && 'disabled',
                        )}
                    >
                        <span
                            className={cx('email')}
                            onClick={handleSendMessage}
                        >
                            Gửi tin nhắn
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
