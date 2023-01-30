import React from 'react';
import classNames from 'classnames/bind';
import styles from './PostList.module.scss';
import Search from '~/components/PostManagement/PostList/components/Search';
import SearchByDate from './components/SearchByDate';
import SearchByAddress from './components/SearchByAddress';
import NavbarPostList from './components/NavbarPostList';
const cx = classNames.bind(styles);

function PostList() {
    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('heading')}>Danh sách tin</h2>
            <div className={cx('search-filter')}>
                <div className={cx('search')}>
                    <Search postList={true} />
                </div>
                <div className={cx('search-by-address')}>
                    <SearchByAddress />
                </div>
            </div>
            <div className={cx('navbar-post-list')}>
                <NavbarPostList />
            </div>
        </div>
    );
}

export default PostList;
