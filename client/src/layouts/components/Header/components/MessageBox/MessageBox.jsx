import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { GoPrimitiveDot } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import config from '~/config';

const cx = classNames.bind(styles);
// const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function MessageBox() {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const newMsg = useSelector((state) => state.message.message?.msg);

    const [message, setMessage] = useState(false);
    useEffect(() => {
        if (newMsg?.receiver === currentUser._id) {
            setMessage(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);
    useEffect(() => {
        if (newMsg?.receiver === currentUser._id) {
            setMessage(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMsg]);
    useEffect(() => {
        !newMsg && setMessage(false);
    }, [newMsg]);

    return (
        <Tippy
            className={cx('tippy-content')}
            content="Tin nhắn"
            delay={(0, 200)}
            placement="bottom"
        >
            <Link to={config.routes.message}>
                <div className={cx('message')}>
                    <button className={cx('action-btn')}>
                        <FontAwesomeIcon
                            icon={faMessage}
                            className={cx('icon')}
                        />
                        {message && (
                            <GoPrimitiveDot className={cx('notify-icon')} />
                        )}
                    </button>
                </div>
            </Link>
        </Tippy>
    );
}

export default MessageBox;
