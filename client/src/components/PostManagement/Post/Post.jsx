import React from 'react';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import PostInfo from './PostInfo';

const cx = classNames.bind(styles);

function Post() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <PostInfo />
            </div>
        </div>
    );
}

export default Post;
