import classNames from 'classnames/bind';
import { SearchFilterPost } from '~/api';
import styles from './FilterSRS.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { areaRange, filterResult, priceRange } from '~/redux/slice/filterSlice';
import { useState } from 'react';
const cx = classNames.bind(styles);

const filterPriceItems = [
    'Dưới 1 triệu',
    '1 - 3 triệu',
    '3 - 5 triệu',
    '5 - 10 triệu',
    '10 - 40 triệu',
    '40 - 70 triệu',
    '70 - 100 triệu',
    'Trên 100 triệu',
];
const filterAreaItems = [
    'Dưới 30 m²',
    '30 - 50 m²',
    '50 - 80 m²',
    '80 - 100 m²',
    '100 - 150 m²',
    '150 - 200 m²',
    '200 - 250 m²',
    '250 - 300 m²',
];
function FilterSRS() {
    const dispatch = useDispatch();
    const link = useSelector((state) => state.filter.linkSearch?.link);
    const sort = useSelector((state) => state.filter.sort?.link);
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
    console.log(priceGte, priceLte);
    const [filterByPriceIndex, setFilterByPriceIndex] = useState(-1);
    const [filterByAreaIndex, setFilterByAreaIndex] = useState(-1);
    console.log(filterByPriceIndex);
    const handleFiletrByPrice = (index) => {
        setFilterByAreaIndex(-1);
        switch (index) {
            case 0:
                dispatch(priceRange([0, 999999]));
                dispatch(areaRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${0}&price_lte=${999999}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);
                return;
            case 1:
                dispatch(priceRange([1000000, 3000000]));
                dispatch(areaRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${1000000}&price_lte=${3000000}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);
                return;
            case 2:
                dispatch(priceRange([3000000, 5000000]));
                dispatch(areaRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${3000000}&price_lte=${5000000}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);

                return;
            case 3:
                dispatch(priceRange([5000000, 10000000]));
                dispatch(areaRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${5000000}&price_lte=${10000000}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);

                return;
            case 4:
                dispatch(priceRange([10000000, 40000000]));
                dispatch(areaRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${10000000}&price_lte=${40000000}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);
                return;
            case 5:
                dispatch(priceRange([40000000, 70000000]));
                dispatch(areaRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${40000000}&price_lte=${70000000}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);
                return;
            case 6:
                dispatch(priceRange([70000000, 100000000]));
                dispatch(areaRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${70000000}&price_lte=${100000000}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);
                return;
            case 7:
                dispatch(priceRange([100000000, 999999999]));
                dispatch(areaRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&price_gte=${100000000}&price_lte=${999999999}&${
                        sort && sort
                    }`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByPriceIndex(index);
                return;
            default:
                break;
        }
    };
    const handleFiletrByArea = (index) => {
        setFilterByPriceIndex(-1);
        switch (index) {
            case 0:
                dispatch(areaRange([0, 29]));
                dispatch(priceRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${0}&areaLte=${29}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);
                return;
            case 1:
                dispatch(areaRange([30, 50]));
                dispatch(priceRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${30}&areaLte=${50}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);

                return;
            case 2:
                dispatch(areaRange([51, 80]));
                dispatch(priceRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${51}&areaLte=${80}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);

                return;
            case 3:
                dispatch(areaRange([81, 100]));
                dispatch(priceRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${81}&areaLte=${100}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);

                return;
            case 4:
                dispatch(areaRange([101, 150]));
                dispatch(priceRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${101}&areaLte=${150}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);
                return;
            case 5:
                dispatch(areaRange([151, 200]));
                dispatch(priceRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${151}&areaLte=${200}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);
                return;
            case 6:
                dispatch(areaRange([201, 250]));
                dispatch(priceRange(null));

                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${201}&areaLte=${250}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);
                return;
            case 7:
                dispatch(areaRange([251, 300]));
                dispatch(priceRange(null));
                SearchFilterPost(
                    `title=${
                        searchValue ? searchValue : ''
                    }&status=approved&category_name=${
                        currentCategory ? currentCategory : ''
                    }&district=${
                        currentDistrict ? currentDistrict : ''
                    }&areaGte=${251}&areaLte=${300}&${sort && sort}`,
                ).then((res) => dispatch(filterResult(res)));
                setFilterByAreaIndex(index);
                return;
            default:
                break;
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('filter-by-price')}>
                    <div className={cx('title')}>
                        <span>Lọc theo khoảng giá</span>
                    </div>
                    <div className={cx('filter-item')}>
                        {filterPriceItems.map((item, index) => (
                            <p
                                key={index}
                                className={cx(
                                    'text',
                                    filterByPriceIndex === index && 'active',
                                )}
                                onClick={() => handleFiletrByPrice(index)}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
                <div className={cx('filter-by-price')}>
                    <div className={cx('title')}>
                        <span>Lọc theo diện tích</span>
                    </div>
                    <div className={cx('filter-item')}>
                        {filterAreaItems.map((item, index) => (
                            <p
                                key={index}
                                className={cx(
                                    'text',
                                    filterByAreaIndex === index && 'active',
                                )}
                                onClick={() => handleFiletrByArea(index)}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilterSRS;
