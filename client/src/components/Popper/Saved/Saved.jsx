import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState } from 'react';
import images from '~/assets/images';

import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Saved.module.scss';
import SavedItem from './SavedItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

// const defaultFn = () => {};

function Saved({
    show = false,
    children,
    items = [],
    hide,
    // onChange = defaultFn,
}) {
    console.log(items);
    const renderItems = () => {
        return items?.map((item, index) => {
            return <SavedItem key={index} data={item}></SavedItem>;
        });
    };

    const renderResult = (attrs) => (
        <div className={cx('saved-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('saved-popper')}>
                <span className={cx('header')}>Tin đã lưu</span>
                <div
                    className={cx(
                        'saved-body',
                        items.length > 0 && 'have-item',
                    )}
                >
                    {items.length > 0 ? (
                        renderItems()
                    ) : (
                        <div className={cx('saved-item')}>
                            <img
                                src={images.emptySaved}
                                alt="a"
                                className={cx('empty-image')}
                            />
                        </div>
                    )}
                </div>
                <div className={cx('see-all')}>
                    <p className={cx('text')}>
                        Xem tất cả{' '}
                        <span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                    </p>
                </div>
            </PopperWrapper>
        </div>
    );

    return (
        <Tippy
            visible={show}
            delay={[0, 1000]}
            offset={[170, 8]}
            interactive
            placement="bottom-end"
            render={renderResult}
            onClickOutside={hide}
        >
            {children}
        </Tippy>
    );
}

Saved.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Saved;
