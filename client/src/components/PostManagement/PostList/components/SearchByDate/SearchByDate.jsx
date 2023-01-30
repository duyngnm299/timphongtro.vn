import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchByDate.module.scss';
import { FiCalendar } from 'react-icons/fi';
import { BsChevronDown } from 'react-icons/bs';

const cx = classNames.bind(styles);
const items = ['Mặc định', '7 ngày qua', '30 ngày qua', 'Tùy chọn ngày'];
function SearchByDate() {
    const [showItem, setShowItem] = useState(false);
    const [itemValue, setItemValue] = useState('Mặc định');
    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('search-by-date')}
                onClick={() => setShowItem(!showItem)}
                onBlur={() => setShowItem(false)}
            >
                <FiCalendar className={cx('icon-left')} />
                <span className={cx('text')}>{itemValue}</span>
                <BsChevronDown className={cx('icon-right')} />
                {showItem && (
                    <div className={cx('list-item')}>
                        {items.map((item, index) => (
                            <p
                                className={cx('item')}
                                key={index}
                                onClick={() => setItemValue(item)}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchByDate;
