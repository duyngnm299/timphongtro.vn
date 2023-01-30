import React from 'react';
import classNames from 'classnames/bind';
import { useRef, useEffect } from 'react';
import styles from './Home.module.scss';
import ImageSlider from '~/components/ImageSlider';
import SearchHomePage from '~/components/SearchHomePage';
import ShowPost from '~/components/ShowPost';
import images from '~/assets/images';

const cx = classNames.bind(styles);
const Home = () => {
    const slides = [
        { url: images.slider1, title: 'beach' },
        { url: images.slider2, title: 'boat' },
        { url: images.slider3, title: 'forest' },
        { url: images.slider4, title: 'city' },
        { url: images.slider5, title: 'italy' },
    ];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('slider-container')}>
                <ImageSlider slides={slides} />
                <SearchHomePage />
            </div>
            <div className={cx('post-container')}>
                <ShowPost />
            </div>
        </div>
    );
};

export default Home;
