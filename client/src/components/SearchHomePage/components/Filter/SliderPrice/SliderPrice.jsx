import classNames from 'classnames/bind';
import styles from './SliderPrice.module.scss';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { BiRefresh } from 'react-icons/bi';
import HeadlessTippy from '@tippyjs/react/headless';
import { BsArrowRightShort } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Slider } from '@mui/material';
// import Slider from '@material-ui/core/Slider';
import { priceRange } from '~/redux/slice/filterSlice';
const cx = classNames.bind(styles);
function SliderPrice({ className }) {
    const priceGte = useSelector((state) => state.filter.price?.priceGte);
    const priceLte = useSelector((state) => state.filter.price?.priceLte);
    const dispatch = useDispatch();
    const [showSliderPrice, setShowSliderPrice] = useState(false);
    const [priceChange, setPriceChange] = useState(false);
    const [value, setValue] = useState([0, 100]);

    // Changing State when volume increases/decreases
    const rangeSelector = (event, newValue) => {
        setValue(newValue);
        setPriceChange(true);
        dispatch(
            priceRange([`${newValue[0]}000000` || 0, `${newValue[1]}000000`]),
        );
    };
    const handleRefresh = () => {
        setValue([0, 100]);
        setPriceChange(false);
        dispatch(priceRange(null));
    };
    console.log(value[0] === 0);
    const renderItems = () => {
        return (
            <div className={cx('slider-price')}>
                <div className={cx('input-price')}>
                    <input
                        type="text"
                        value={
                            priceChange && value[0] ? `${value[0]} triệu` : 'Từ'
                        }
                        className={cx('price-gte')}
                        readOnly
                    />
                    <span className={cx('arrow-icon')}>
                        <BsArrowRightShort />
                    </span>
                    <input
                        readOnly
                        type="text"
                        value={
                            value[1] && priceChange
                                ? `${value[1]} triệu`
                                : 'Đến'
                        }
                        className={cx('price-lte')}
                    />
                </div>
                <div className={cx('slider')}>
                    <Slider
                        sx={{
                            '& .MuiSlider-thumb': {
                                top: '50%',
                            },
                        }}
                        step={5}
                        value={value}
                        min={0}
                        max={100}
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
                        onClick={() => setShowSliderPrice(false)}
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
                visible={showSliderPrice}
                delay={[0, 1000]}
                offset={className ? [89, 12] : [0, 8]}
                interactive
                placement="bottom-end"
                render={renderResult}
                onClickOutside={() => setShowSliderPrice(false)}
            >
                {className ? (
                    <div onClick={() => setShowSliderPrice(!showSliderPrice)}>
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
                            {priceChange && priceGte && priceLte
                                ? `${value[0] || 0} - ${value[1]} triệu`
                                : 'Tất cả'}
                        </p>
                    </div>
                ) : (
                    <div
                        className={cx('item')}
                        onClick={() => setShowSliderPrice(!showSliderPrice)}
                    >
                        <span className={cx('text')}>
                            {priceChange && priceGte && priceLte
                                ? `${value[0] || 0} - ${value[1]} triệu`
                                : 'Mức giá'}
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
