import classNames from 'classnames/bind';
import styles from './Notifications.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Notifications() {
    const renderItems = () => {
        return (
            <div className={cx('message-container')}>
                <div className={cx('message-item')}>
                    <div className={cx('avatar')}>
                        <img
                            src={images.defaultAvt}
                            alt=""
                            className={cx('img')}
                        />
                    </div>
                    <div className={cx('info')}>
                        <div className={cx('username')}>
                            <span>Manh Duy</span>
                        </div>
                        <div className={cx('text-container')}>
                            <span className={cx('text')}>
                                Manh Duy dep trai nhat tren doi nay luon a
                                eheheheheheheheh
                            </span>
                            <span className={cx('dot')}>·</span>
                            <span className={cx('time')}>1 giờ</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderResult = (attrs) => (
        <div className={cx('message-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('message-popper')}>
                <div className={cx('message-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    return (
        <Tippy
            className={cx('tippy-content')}
            content="Thông báo"
            delay={(0, 200)}
            placement="bottom"
        >
            <div>
                <HeadlessTippy
                    // visible
                    visible={false}
                    delay={[0, 1000]}
                    offset={[90, 8]}
                    interactive
                    placement="bottom-end"
                    render={renderResult}
                    // onClickOutside={() => setShowCategory(false)}
                >
                    <button className={cx('action-btn')}>
                        <FontAwesomeIcon icon={faBell} className={cx('icon')} />
                        <span className={cx('badge')}>12</span>
                    </button>
                </HeadlessTippy>
            </div>
        </Tippy>
    );
}

export default Notifications;
