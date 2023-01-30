import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './MessageItem.module.scss';
// import { format } from 'timeago.js';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';

// import it first.
import vi from 'timeago.js/lib/lang/vi';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function MessageItem({ theirUser, message, own }) {
    timeago.register('vi', vi);
    return (
        <div className={cx('message-item', own && 'message-own')}>
            {!own && (
                <div className={cx('msg-avatar')}>
                    <img
                        src={
                            theirUser
                                ? `${HOST_NAME}${theirUser.profilePicture}`
                                : images.defaultAvt
                        }
                        alt=""
                        className={cx('msg-img')}
                    />
                </div>
            )}

            <div className={cx('message-text', own && 'text-own')}>
                <span className={cx('msg-text')}>{message.text}</span>
                <span className={cx('time', own && 'time-own')}>
                    <TimeAgo datetime={message.createdAt} locale="vi" />
                </span>
            </div>
        </div>
    );
}

export default MessageItem;
