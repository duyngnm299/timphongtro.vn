import React, { useRef } from 'react';
import classNames from 'classnames/bind';

import styles from '../SearchHomePage.module.scss';

import Category from '../components/category/Category';
import Search from '../components/Search';
import Filter from '../components/Filter';

const cx = classNames.bind(styles);

function SearchHomePage() {
    // const [searchValue, setSearchValue] = useState('');
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <Category />
                <Search />
            </div>
            <div className={cx('search-filter')}>
                <Filter />
            </div>
        </div>
    );
}

export default SearchHomePage;
