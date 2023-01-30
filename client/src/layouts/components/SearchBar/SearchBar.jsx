import React from 'react';
import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
// import Search from '../Search';
import Search from '~/components/SearchHomePage/components/Search';
import Category from '~/components/SearchHomePage/components/category/Category';
import District from '~/components/SearchHomePage/components/Filter/District';
import SliderPrice from '~/components/SearchHomePage/components/Filter/SliderPrice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import Area from '~/components/SearchHomePage/components/Filter/Area';
import {
    areaRange,
    currentCategory,
    currentDistrict,
    priceRange,
    searchText,
} from '~/redux/slice/filterSlice';

const cx = classNames.bind(styles);
function SearchBar() {
    const dispatch = useDispatch();
    const handleRefresh = () => {
        dispatch(searchText(null));
        dispatch(currentCategory(null));
        dispatch(currentDistrict(null));
        dispatch(priceRange(null));
        dispatch(areaRange(null));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <Search className={cx('search-bar')} />
            </div>
            <div className={cx('sort-wrapper')}>
                <div className={cx('sort-item')}>
                    <Category className={'category-search-bar'} />
                </div>
                <div className={cx('sort-item')}>
                    <District className={cx('district-search-bar')} />
                </div>
                <div className={cx('sort-item')}>
                    <SliderPrice className={cx('price-search-bar')} />
                </div>
                <div className={cx('sort-item')}>
                    {/* <div className={cx('title-wrapper')}>
                        <span className={cx('title')}>Diện tích</span>
                        <span>
                            <FontAwesomeIcon
                                className={cx('icon')}
                                icon={faChevronDown}
                            />
                        </span>
                    </div>
                    <p className={cx('sort-value')}>Tất cả</p> */}
                    <Area className={cx('area-search-bar')} />
                </div>
                <div className={cx('sort-item')} onClick={handleRefresh}>
                    <div className={cx('refresh')}>
                        <span>
                            <FontAwesomeIcon
                                className={cx('icon-refresh')}
                                icon={faArrowsRotate}
                            />
                        </span>
                        <span className={cx('title-refresh')}>Đặt lại</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
