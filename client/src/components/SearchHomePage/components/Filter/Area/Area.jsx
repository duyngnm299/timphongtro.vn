import classNames from 'classnames/bind';
import styles from './Area.module.scss';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { BiRefresh } from 'react-icons/bi';
import HeadlessTippy from '@tippyjs/react/headless';
import { BsArrowRightShort } from 'react-icons/bs';
import { Slider } from '@mui/material';

// import Slider from '@material-ui/core/Slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { areaRange } from '~/redux/slice/filterSlice';
const cx = classNames.bind(styles);
function SliderPrice({ className }) {
    const areaGte = useSelector((state) => state.filter.area?.areaGte);
    const areaLte = useSelector((state) => state.filter.area?.areaLte);

    console.log(areaGte, areaLte);
    const dispatch = useDispatch();
    const [showSliderArea, setShowSliderArea] = useState(false);
    const [areaChange, setAreaChange] = useState(false);
    const [value, setValue] = useState([0, 300]);

    // Changing State when volume increases/decreases
    const rangeSelector = (event, newValue) => {
        setValue(newValue);
        setAreaChange(true);
        dispatch(areaRange([`${newValue[0]}` || 0, newValue[1]]));
    };
    const handleRefresh = () => {
        setValue([1, 300]);

        setAreaChange(false);
        dispatch(areaRange(null));
    };
    const renderItems = () => {
        return (
            <div className={cx('slider-price')}>
                <div className={cx('input-price')}>
                    <input
                        type="text"
                        value={areaChange ? `${value[0]} m²` : 'Từ'}
                        className={cx('price-gte')}
                        readOnly
                    />
                    <span className={cx('arrow-icon')}>
                        <BsArrowRightShort />
                    </span>
                    <input
                        readOnly
                        type="text"
                        value={areaChange ? `${value[1]} m²` : 'Đến'}
                        className={cx('price-lte')}
                    />
                </div>
                <div className={cx('slider')}>
                    <Slider
                        step={20}
                        value={value}
                        min={0}
                        max={300}
                        onChange={rangeSelector}
                        marks
                    />
                </div>
            </div>
        );
    };
    const renderResult = (attrs) => (
        <div className={cx('category-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('category-popper')}>
                <div className={cx('slider-price-container')}>
                    {renderItems()}
                </div>
                <div className={cx('refresh')}>
                    <div className={cx('left')} onClick={handleRefresh}>
                        <BiRefresh className={cx('rf-icon')} />
                        <p className={cx('rf-text')}>Đặt lại</p>
                    </div>
                    <button
                        className={cx('btn-refresh')}
                        onClick={() => setShowSliderArea(false)}
                    >
                        Áp dụng
                    </button>
                </div>
            </PopperWrapper>
        </div>
    );
    return (
        <div>
            <HeadlessTippy
                visible={showSliderArea}
                delay={[0, 1000]}
                offset={className ? [87, 12] : [0, 8]}
                interactive
                placement="bottom-end"
                render={renderResult}
                onClickOutside={() => setShowSliderArea(false)}
            >
                {className ? (
                    <div onClick={() => setShowSliderArea(!showSliderArea)}>
                        <div className={cx('title-wrapper')}>
                            <span className={cx('title')}>Mức giá</span>
                            <span>
                                <FontAwesomeIcon
                                    className={cx('arrow-down')}
                                    icon={faChevronDown}
                                />
                            </span>
                        </div>

                        <p className={cx('sort-value')}>
                            {areaChange && areaLte && areaGte
                                ? `${value[0] || 0}  - ${value[1]} m²`
                                : 'Tất cả'}
                        </p>
                    </div>
                ) : (
                    <div
                        className={cx('item')}
                        onClick={() => setShowSliderArea(!showSliderArea)}
                    >
                        <span className={cx('text')}>
                            {areaChange && areaLte && areaGte
                                ? `${value[0] || 0}  - ${value[1]} m²`
                                : 'Diện tích'}
                        </span>
                        <span className={cx('icon')}>
                            <MdKeyboardArrowDown />
                        </span>
                    </div>
                )}
            </HeadlessTippy>
        </div>
    );
}

export default SliderPrice;
