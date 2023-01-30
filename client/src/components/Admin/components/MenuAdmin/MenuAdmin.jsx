import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './MenuAdmin.module.scss';
import MenuItemAdmin from './MenuItemAdmin';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function MenuAdmin({
    children,
    items = [],
    hideOnClick = false,
    onChange = defaultFn,
}) {
    const renderResult = (attrs) => (
        <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper')}>
                <div className={cx('menu-body')}>
                    <MenuItemAdmin />
                </div>
            </PopperWrapper>
        </div>
    );

    return (
        <Tippy
            delay={[0, 100]}
            offset={[12, 8]}
            hideOnClick={hideOnClick}
            interactive
            placement="bottom-end"
            render={renderResult}
        >
            {children}
        </Tippy>
    );
}

MenuAdmin.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
};

export default MenuAdmin;
