import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchByAddress.module.scss';
import { MdOutlineLocationOn } from 'react-icons/md';
import { BsChevronDown } from 'react-icons/bs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { address_list } from '~/components/AddressList';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useSelector, useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react/headless';
import { getAllPostOfUser } from '~/api';
import { postListOfUser } from '~/redux/slice/postSlice';
const cx = classNames.bind(styles);

function SearchByAddress() {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login.currentUser?.user,
    );
    const [districtList, setDistrictList] = useState([]);
    const [district, setDistrict] = useState(false);
    const [address, setAddress] = useState(false);
    const [districtValue, setDistrictValue] = useState('');
    useEffect(() => {
        address_list.map((item) => {
            return setDistrictList((prevState) => [...prevState, item]);
        });
    }, []);

    useEffect(() => {
        districtValue
            ? getAllPostOfUser(
                  `createdBy=${currentUser._id}&district=${districtValue}`,
              ).then((res) => dispatch(postListOfUser(res.post)))
            : dispatch(postListOfUser());
    }, [districtValue]);
    const renderItems = () => {
        return (
            <div className={cx('address-items')}>
                {districtList.map((item, index) => (
                    <p
                        tabIndex={index}
                        key={index}
                        className={cx('item')}
                        onClick={() => {
                            setDistrictValue(item.district);
                            setAddress(false);
                            setDistrict(false);
                        }}
                    >
                        {item.district}
                    </p>
                ))}
            </div>
        );
    };
    const renderResult = (attrs) => (
        <div className={cx('address-list')} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('address-popper')}>
                <div className={cx('address-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );
    return (
        <div>
            <Tippy
                visible={address}
                delay={[0, 100]}
                offset={[0, 8]}
                // hideOnClick={hideOnClick}
                interactive
                placement="bottom-end"
                render={renderResult}
            >
                <div
                    className={cx(
                        'search-by-address',
                        districtValue && 'active',
                    )}
                    onClick={() => setAddress(!address)}
                >
                    <div className={cx('left')}>
                        <MdOutlineLocationOn className={cx('icon-left')} />
                        <span className={cx('text')}>
                            {districtValue || 'Khu vực'}
                        </span>
                    </div>
                    <div className={cx('right')}>
                        {districtValue ? (
                            <FontAwesomeIcon
                                icon={faCircleXmark}
                                className={cx('icon-clear')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDistrictValue('');
                                }}
                            />
                        ) : (
                            <BsChevronDown className={cx('icon-right')} />
                        )}
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

export default SearchByAddress;
