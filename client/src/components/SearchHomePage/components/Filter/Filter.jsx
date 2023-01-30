import classNames from 'classnames/bind';
import styles from './Filter.module.scss';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { BiRefresh } from 'react-icons/bi';
import District from './District';
import SliderPrice from './SliderPrice';
import Area from './Area';
import { useDispatch } from 'react-redux';
import {
    areaRange,
    currentCategory,
    currentDistrict,
    priceRange,
    searchText,
} from '~/redux/slice/filterSlice';
const cx = classNames.bind(styles);

function Filter() {
    const dispatch = useDispatch();
    const handleRefresh = () => {
        dispatch(searchText(null));
        dispatch(currentCategory(null));
        dispatch(currentDistrict(null));
        dispatch(priceRange(null));
        dispatch(areaRange(null));
    };
    return (
        <div className={cx('search-filter')}>
            <District />
            <SliderPrice />
            <Area />
            <div className={cx('refresh')}>
                <span className={cx('refresh-icon')} onClick={handleRefresh}>
                    <BiRefresh />
                </span>
            </div>
        </div>
    );
}

export default Filter;
