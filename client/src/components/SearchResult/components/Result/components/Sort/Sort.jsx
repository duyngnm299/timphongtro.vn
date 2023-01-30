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
    const link = useSelector((state) => state.filter.linkSearch?.link);
    const searchValue = useSelector((state) => state.filter.search?.title);
    const currentDistrict = useSelector(
        (state) => state.filter.district?.currentDistrict,
    );
    const currentCategory = useSelector(
        (state) => state.filter.category?.currentCategory,
    );
    const areaGte = useSelector((state) => state.filter.area?.areaGte);
    const areaLte = useSelector((state) => state.filter.area?.areaLte);
    const priceGte = useSelector((state) => state.filter.price?.priceGte);
    const priceLte = useSelector((state) => state.filter.price?.priceLte);
    const dispatch = useDispatch();
    const [showSortItem, setShowSortItem] = useState(true);
    const [sortValue, setSortValue] = useState('');
    const [indexItem, setIndexItem] = useState(0);
    const handleOnClick = (item, index) => {
        setSortValue(item);
        setShowSortItem(false);
        setIndexItem(index);
        switch (index) {
            case 0:
                console.log(priceGte, priceLte);

                const sort1 = '&_sort=createdAt:desc';
                indexItem !== 0 &&
                    SearchFilterPost(
                        `title=${
                            searchValue ? searchValue : ''
                        }&status=approved&category_name=${
                            currentCategory ? currentCategory : ''
                        }&district=${
                            currentDistrict ? currentDistrict : ''
                        }&price_gte=${
                            priceGte !== null ? priceGte : ''
                        }&price_lte=${
                            priceLte !== null ? priceLte : ''
                        }&areaGte=${areaGte !== null ? areaGte : ''}&areaLte=${
                            areaLte !== null ? areaLte : ''
                        }&${sort1}`,
                    ).then((res) => {
                        dispatch(sortLink(sort1));
                        dispatch(filterResult(res));
                    });
                return;
            case 1:
                const sort2 = '&_sort=price:asc';
                indexItem !== 1 &&
                    SearchFilterPost(
                        `title=${
                            searchValue ? searchValue : ''
                        }&status=approved&category_name=${
                            currentCategory ? currentCategory : ''
                        }&district=${
                            currentDistrict ? currentDistrict : ''
                        }&price_gte=${
                            priceGte !== null ? priceGte : ''
                        }&price_lte=${
                            priceLte !== null ? priceLte : ''
                        }&areaGte=${areaGte !== null ? areaGte : ''}&areaLte=${
                            areaLte !== null ? areaLte : ''
                        }&${sort2}`,
                    ).then((res) => {
                        dispatch(filterResult(res));
                        dispatch(sortLink(sort2));
                    });
                return;
            case 2:
                const sort3 = '&_sort=price:desc';
                indexItem !== 2 &&
                    SearchFilterPost(
                        `title=${
                            searchValue ? searchValue : ''
                        }&status=approved&category_name=${
                            currentCategory ? currentCategory : ''
                        }&district=${
                            currentDistrict ? currentDistrict : ''
                        }&price_gte=${
                            priceGte !== null ? priceGte : ''
                        }&price_lte=${
                            priceLte !== null ? priceLte : ''
                        }&areaGte=${areaGte !== null ? areaGte : ''}&areaLte=${
                            areaLte !== null ? areaLte : ''
                        }&${sort3}`,
                    ).then((res) => {
                        dispatch(filterResult(res));
                        dispatch(sortLink(sort3));
                    });
                return;
            case 3:
                const sort4 = '&_sort=area:asc';
                indexItem !== 3 &&
                    SearchFilterPost(
                        `title=${
                            searchValue ? searchValue : ''
                        }&status=approved&category_name=${
                            currentCategory ? currentCategory : ''
                        }&district=${
                            currentDistrict ? currentDistrict : ''
                        }&price_gte=${
                            priceGte !== null ? priceGte : ''
                        }&price_lte=${
                            priceLte !== null ? priceLte : ''
                        }&areaGte=${areaGte !== null ? areaGte : ''}&areaLte=${
                            areaLte !== null ? areaLte : ''
                        }&${sort4}`,
                    ).then((res) => {
                        dispatch(filterResult(res));
                        dispatch(sortLink(sort4));
                    });
                return;
            case 4:
                const sort5 = '&_sort=area:desc';
                indexItem !== 4 &&
                    SearchFilterPost(
                        `title=${
                            searchValue ? searchValue : ''
                        }&status=approved&category_name=${
                            currentCategory ? currentCategory : ''
                        }&district=${
                            currentDistrict ? currentDistrict : ''
                        }&price_gte=${
                            priceGte !== null ? priceGte : ''
                        }&price_lte=${
                            priceLte !== null ? priceLte : ''
                        }&areaGte=${areaGte !== null ? areaGte : ''}&areaLte=${
                            areaLte !== null ? areaLte : ''
                        }&${sort5}`,
                    ).then((res) => {
                        dispatch(filterResult(res));
                        dispatch(sortLink(sort5));
                    });
                return;
            default:
                break;
        }
    };
    const renderItems = () => {
        return (
            <div className={cx('sort-item')}>
                {sort_item.map((item, index) => (
                    <p
                        key={index}
                        className={cx(
                            'item-text',
                            index === indexItem && 'active',
                        )}
                        onClick={() => handleOnClick(item, index)}
                    >
                        {item}
                    </p>
                ))}
            </div>
        );
    };
    const renderResult = (attrs) => (
        <div className={cx('category-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('category-popper')}>
                <div className={cx('slider-price-container')}>
                    {renderItems()}
                </div>
            </PopperWrapper>
        </div>
    );
    return (
        <div>
            <HeadlessTippy
                visible={showSortItem}
                delay={[0, 1000]}
                offset={[0, 8]}
                interactive
                placement="bottom-end"
                render={renderResult}
                onClickOutside={() => setShowSortItem(false)}
            >
                <div
                    className={cx('sort')}
                    onClick={() => setShowSortItem(!showSortItem)}
                >
                    <span className={cx('sort-text')}>
                        {sortValue ? sortValue : 'Tin mới nhất'}
                    </span>
                    <span className={cx('icon')}>
                        <MdKeyboardArrowDown />
                    </span>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Sort;
