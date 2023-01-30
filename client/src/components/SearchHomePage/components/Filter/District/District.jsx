import classNames from 'classnames/bind';
import styles from './District.module.scss';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { address_list } from '~/components/AddressList';
import { useDispatch, useSelector } from 'react-redux';
import { currentDistrict } from '~/redux/slice/filterSlice';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { BiRefresh } from 'react-icons/bi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';

const cx = classNames.bind(styles);
function District({ className }) {
    const crDistrict = useSelector(
        (state) => state.filter.district?.currentDistrict,
    );
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [showDistrict, setShowDistrict] = useState(false);
    const [districtList, setDistrictList] = useState([]);
    const [checkedIndex, setCheckedIndex] = useState(-1);
    const [checked, setChecked] = useState([]);
    const [ipChecked, setIpCheck] = useState(true);
    useEffect(() => {
        let arr = [];
        address_list.map((item) => arr.push({ districtName: item.district }));
        setData(arr);
    }, []);
    useEffect(() => {
        setDistrictList(data.map((item) => ({ ...item, isChecked: false })));
    }, [data]);
    const handleChange = (e) => {
        const { name } = e.target;
        setCheckedIndex(parseInt(name));
        let itemChecked = districtList[name];
        if (e.target.checked) {
            setIpCheck(true);
            itemChecked = { ...itemChecked, isChecked: true };
            setChecked([itemChecked]);
            districtList[name].isChecked = true;
            dispatch(currentDistrict(itemChecked.districtName));
        } else {
            setChecked(false);
            districtList[name].isChecked = false;
            dispatch(currentDistrict(null));
            setChecked([]);
        }
    };
    const handleRefresh = () => {
        setIpCheck(false);
        setChecked([]);
        districtList.map((item) => (item.isChecked = false));
        dispatch(currentDistrict(null));
    };
    const renderItems = () => {
        return districtList.map((item, index) => {
            return (
                <label
                    htmlFor={`checkbox${index}`}
                    key={index}
                    className={cx('district-item')}
                >
                    <span className={cx('district-name')}>
                        {item.districtName}
                    </span>
                    <input
                        name={index}
                        value={item}
                        type="checkbox"
                        id={`checkbox${index}`}
                        className={cx('checkbox')}
                        onChange={handleChange}
                        checked={
                            crDistrict &&
                            ipChecked &&
                            districtList[index].isChecked &&
                            index === checkedIndex
                                ? true
                                : false
                        }
                    />
                </label>
            );
        });
    };
    const renderResult = (attrs) => (
        <div className={cx('category-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('category-popper')}>
                <div className={cx('district')}>{renderItems()}</div>
                <div className={cx('refresh')}>
                    <div className={cx('left')} onClick={handleRefresh}>
                        <BiRefresh className={cx('rf-icon')} />
                        <p className={cx('rf-text')}>Đặt lại</p>
                    </div>
                    <button
                        className={cx('btn-refresh')}
                        onClick={() => setShowDistrict(false)}
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
                visible={showDistrict}
                delay={[0, 1000]}
                offset={className ? [88, 12] : [0, 8]}
                interactive
                placement="bottom-end"
                render={renderResult}
                onClickOutside={() => setShowDistrict(false)}
            >
                {className ? (
                    <div onClick={() => setShowDistrict(!showDistrict)}>
                        <div className={cx('title-wrapper')}>
                            <span className={cx('title')}>Khu vực</span>
                            <span>
                                <FontAwesomeIcon
                                    className={cx('arrow-down')}
                                    icon={faChevronDown}
                                />
                            </span>
                        </div>

                        <p className={cx('sort-value')}>
                            {' '}
                            {crDistrict && checked[0]?.districtName
                                ? checked[0]?.districtName
                                : 'Tất cả'}
                        </p>
                    </div>
                ) : (
                    <div
                        className={cx('item')}
                        onClick={() => setShowDistrict(!showDistrict)}
                    >
                        <span className={cx('text')}>
                            {crDistrict && checked[0]?.districtName
                                ? checked[0]?.districtName
                                : 'Khu vực'}
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

export default District;
