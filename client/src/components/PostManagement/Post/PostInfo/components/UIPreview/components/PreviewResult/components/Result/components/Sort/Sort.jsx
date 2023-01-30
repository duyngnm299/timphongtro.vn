import classNames from 'classnames/bind';
import styles from './Sort.module.scss';
import HeadlessTippy from '@tippyjs/react/headless';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useState } from 'react';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useSelector, useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { filterResult, searchLink, sortLink } from '~/redux/slice/filterSlice';
const cx = classNames.bind(styles);

const sort_item = [
    'Tin mới nhất',
    'Giá thấp đến cao',
    'Giá cao đến thấp',
    'Diện tích bé đến lớn',
    'Diện tích lớn đến bé',
];

function Sort() {
    return (
        <div>
            <div className={cx('sort')}>
                <span className={cx('sort-text')}>Tin mới nhất</span>
                <span className={cx('icon')}>
                    <MdKeyboardArrowDown />
                </span>
            </div>
        </div>
    );
}

export default Sort;
