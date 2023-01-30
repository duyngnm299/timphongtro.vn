import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { BsChevronDown } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import images from '~/assets/images';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as locales from 'react-date-range/dist/locale';
import { Calendar } from 'react-date-range';
import { FiCalendar } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import data from '~/api/data/provinces.json';
import moment from 'moment/moment';
import { useDispatch } from 'react-redux';
import { updatedUser } from '~/redux/slice/authSlice';
import { MdVerified } from 'react-icons/md';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { updateUserFormData } from '~/api';
const cx = classNames.bind(styles);
function Profile() {
    useEffect(() => {
        if (provinceValue && districtValue) {
            const currentDistrict = data.filter((item) =>
                item?.name?.includes(provinceValue),
            );
            setDistrictList(currentDistrict[0].districts);

            const currentWard = currentDistrict[0].districts.filter((item) =>
                item.name.includes(districtValue),
            );
            setWardList(currentWard[0].wards);
            setDetailAddressValue([districtValue, provinceValue]);
            if (wardValue) {
                setDetailAddressValue([
                    ` ${wardValue}`,
                    ` ${districtValue}`,
                    ` ${provinceValue}`,
                ]);
            }
        }
    }, []);
    const HOST_NAME = process.env.REACT_APP_HOST_NAME;
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const crFullName = currentUser?.fullName;
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    const udtFullName = udtUser?.fullName;
    const [fullName, setFullName] = useState(
        udtUser
            ? udtFullName
                ? udtFullName
                : ''
            : crFullName
            ? crFullName
            : '',
    );
    const [gender, setGender] = useState(
        udtUser?.gender
            ? udtUser?.gender
            : currentUser?.gender
            ? currentUser?.gender
            : 'male',
    );
    const [date, setDate] = useState(
        currentUser?.dateOfBirth || udtUser?.dateOfBirth
            ? moment(
                  currentUser?.dateOfBirth || udtUser?.dateOfBirth,
                  'DD/MM/YYYY',
              ).toDate()
            : new Date(),
    );
    const [showCalendar, setShowCalendar] = useState(false);
    const [province, setProvince] = useState(false);
    const [provinceValue, setProvinceValue] = useState(
        udtUser?.province
            ? udtUser?.province
            : currentUser?.province
            ? currentUser?.province
            : '',
    );
    const [district, setDistrict] = useState(false);
    const [districtList, setDistrictList] = useState([]);
    const [districtValue, setDistrictValue] = useState(
        udtUser?.district
            ? udtUser?.district
            : currentUser?.district
            ? currentUser?.district
            : '',
    );
    const [ward, setWard] = useState(false);
    const [wardList, setWardList] = useState([]);
    const [wardValue, setWardValue] = useState(
        udtUser?.ward
            ? udtUser?.ward
            : currentUser?.ward
            ? currentUser?.ward
            : '',
    );
    // eslint-disable-next-line no-unused-vars
    const [detailAddressValue, setDetailAddressValue] = useState([]);
    const [inputAddressValue, setInputAddressValue] = useState(
        udtUser?.address
            ? udtUser?.address
            : currentUser?.address
            ? currentUser?.address
            : [],
    );
    const [phoneNumber, setPhoneNumber] = useState(
        udtUser?.phoneNumber
            ? udtUser?.phoneNumber
            : currentUser?.phoneNumber
            ? currentUser?.phoneNumber
            : '',
    );
    const [identityCard, setIdentityCard] = useState(
        udtUser?.identityCard
            ? udtUser?.identityCard
            : currentUser?.identityCard
            ? currentUser?.identityCard
            : '',
    );
    const [zaloValue, setZaloValue] = useState(
        udtUser?.zaloValue
            ? udtUser?.zaloValue
            : currentUser?.zaloValue
            ? currentUser?.zaloValue
            : '',
    );

    const [showNotify, setShowNotify] = useState(false);
    const [image, setImage] = useState('');
    const [file, setFile] = useState(
        udtUser?.profilePicture
            ? udtUser?.profilePicture.includes('https://lh3')
                ? udtUser?.profilePicture
                : `${HOST_NAME}${udtUser?.profilePicture}`
            : currentUser?.profilePicture
            ? currentUser?.profilePicture.includes('https://lh3')
                ? currentUser?.profilePicture
                : `${HOST_NAME}${currentUser?.profilePicture}`
            : [],
    );
    console.log(file.length);
    console.log(file);
    const calendarRef = useRef();
    const fullNameRef = useRef();
    const provinceRef = useRef();
    const districtRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const dispatch = useDispatch();
    const handleClickOutside = (e) => {
        const { target } = e;
        if (calendarRef.current === null) {
            setShowCalendar(false);
            return;
        }
        if (calendarRef.current === undefined) {
            setShowCalendar(false);
            return;
        }
        if (!calendarRef.current.contains(target)) {
            setShowCalendar(false);
            return;
        }
    };

    const handleChangeImage = (e) => {
        setImage(e.target.files);
        // setImage(e.target.files);
        Object.entries(e.target.files).map((item) =>
            setFile(URL.createObjectURL(item[1])),
        );
    };
    console.log(file);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (fullName.length === 0) {
            setShowNotify(true);
            fullNameRef.current.focus();
            return;
        }
        if (province.length === 0) {
            setShowNotify(true);
            provinceRef.current.focus();
            return;
        }
        if (district.length === 0) {
            setShowNotify(true);
            districtRef.current.focus();
            return;
        }
        if (phoneNumber.length === 0) {
            setShowNotify(true);
            phoneRef.current.focus();
            return;
        }
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('dateOfBirth', date.toLocaleDateString());
        formData.append('gender', gender);
        formData.append('province', provinceValue);
        formData.append('district', districtValue);
        formData.append('ward', wardValue);
        formData.append('identityCard', identityCard);
        formData.append('address', inputAddressValue.toString());
        formData.append('phoneNumber', phoneNumber);
        formData.append('zalo', zaloValue);
        console.log(image[0]);
        formData.append('file', image[0]);

        updateUserFormData(currentUser._id, formData)
            .then((res) => {
                console.log(res);
                dispatch(updatedUser(res));
                alert('Cập nhật thành công!', 'success', '');
            })
            .catch((err) => console.log(err));
    };

    const alert = (title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        });
    };
    return (
        <div className={cx('wrapper')}>
            <form encType="multipart/form-data" method="POST" name="file">
                <div
                    className={cx('content')}
                    onClick={(e) => {
                        handleClickOutside(e);
                    }}
                >
                    <h4 className={cx('heading')}>
                        thay đổi thông tin cá nhân
                    </h4>
                    <div className={cx('content-container')}>
                        <div className={cx('title')}>Ảnh đại diện</div>
                        <div className={cx('content-item', 'avt')}>
                            <label
                                htmlFor="avatar"
                                className={cx('label-avatar')}
                            >
                                <img
                                    className={cx('avatar-img')}
                                    src={
                                        file.length > 0
                                            ? file
                                            : images.defaultAvt
                                    }
                                    alt=""
                                />
                                <span className={cx('selected-img')}>
                                    Chọn ảnh
                                </span>
                            </label>
                            <input
                                id="avatar"
                                className={cx('avatar-input')}
                                type="file"
                                onChange={handleChangeImage}
                                accept="image/*,.heic"
                                autoComplete="off"
                                name="file"
                            />
                        </div>
                        <div className={cx('title')}>
                            <span className={cx('title-text')}>
                                Thông tin cá nhân
                            </span>
                        </div>
                        <div className={cx('content-item')}>
                            <div className={cx('full-name')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Họ và tên
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </div>
                                <div className={cx('right')}>
                                    <input
                                        ref={fullNameRef}
                                        value={fullName}
                                        type="text"
                                        placeholder="Nhập họ tên của bạn"
                                        className={cx('input-right')}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            {showNotify && fullName.length === 0 ? (
                                <span
                                    className={cx(
                                        'validate',
                                        'validate-fullname',
                                    )}
                                >
                                    {fullName.length === 0
                                        ? 'Cần nhập thông tin này'
                                        : ''}
                                </span>
                            ) : (
                                ''
                            )}
                            <div className={cx('date-of-birth')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Ngày sinh
                                    </span>
                                </div>
                                <div className={cx('right')}>
                                    <div className={cx('calendar-wrapper')}>
                                        <input
                                            value={
                                                date.toLocaleDateString() || ''
                                            }
                                            type="text"
                                            className={cx(
                                                'input-right',
                                                'input-calendar',
                                            )}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCalendar(true);
                                            }}
                                        />
                                        <span className={cx('dpk-icon')}>
                                            <FiCalendar />
                                        </span>
                                        {showCalendar && (
                                            <div ref={calendarRef}>
                                                <Calendar
                                                    className={cx('calendar')}
                                                    onChange={(item) => {
                                                        setDate(item);
                                                        setShowCalendar(false);
                                                    }}
                                                    locale={locales['vi']}
                                                    date={date}
                                                    focusedInput={showCalendar}
                                                    maxDate={new Date()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={cx('genders')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Giới tính
                                    </span>
                                </div>
                                <div className={cx('right')}>
                                    <div className={cx('gender-container')}>
                                        <input
                                            value="male"
                                            id="male"
                                            type="radio"
                                            className={cx('input-male')}
                                            checked={gender === 'male'}
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            }
                                        />
                                        <label
                                            htmlFor="male"
                                            className={cx('label')}
                                        >
                                            Nam
                                        </label>
                                        <input
                                            value={'female'}
                                            id="female"
                                            type="radio"
                                            className={cx('input-female')}
                                            checked={gender === 'female'}
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            }
                                        />
                                        <label
                                            htmlFor="female"
                                            className={cx('label')}
                                        >
                                            Nữ
                                        </label>
                                        <input
                                            value="other"
                                            id="other"
                                            type="radio"
                                            className={cx('input-female')}
                                            checked={gender === 'other'}
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            }
                                        />
                                        <label
                                            htmlFor="other"
                                            className={cx('label')}
                                        >
                                            Khác
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('address')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Địa chỉ
                                    </span>
                                </div>
                                <div className={cx('right', 'adr')}>
                                    <div className={cx('address-top')}>
                                        <div className={cx('province')}>
                                            <span
                                                className={cx('province-text')}
                                            >
                                                Tỉnh/Thành phố
                                                <span>
                                                    <FontAwesomeIcon
                                                        icon={faAsterisk}
                                                        className={cx(
                                                            'asterisk-icon',
                                                        )}
                                                    />
                                                </span>
                                            </span>
                                            <div
                                                className={cx(
                                                    'province-selected',
                                                )}
                                            >
                                                <input
                                                    ref={provinceRef}
                                                    value={provinceValue}
                                                    className={cx(
                                                        'input-selected',
                                                    )}
                                                    type="text"
                                                    placeholder="
                                                -- Tỉnh/Thành phố --
                                                "
                                                    readOnly
                                                    onChange={(e) =>
                                                        setProvinceValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onClick={() =>
                                                        setProvince(!province)
                                                    }
                                                    onBlur={() => {
                                                        const timerId =
                                                            setTimeout(() => {
                                                                setProvince(
                                                                    false,
                                                                );
                                                            }, 200);
                                                        return () => {
                                                            clearTimeout(
                                                                timerId,
                                                            );
                                                        };
                                                    }}
                                                />
                                                <span
                                                    className={cx(
                                                        'arrow-down-icon',
                                                    )}
                                                >
                                                    <BsChevronDown />
                                                </span>
                                                {province && (
                                                    <div
                                                        className={cx(
                                                            'province-list',
                                                        )}
                                                    >
                                                        {data.map(
                                                            (item, index) => (
                                                                <p
                                                                    key={index}
                                                                    className={cx(
                                                                        'province-item',
                                                                    )}
                                                                    onClick={() => {
                                                                        setProvinceValue(
                                                                            item.name,
                                                                        );
                                                                        setDistrictList(
                                                                            item.districts,
                                                                        );
                                                                        setProvince(
                                                                            false,
                                                                        );
                                                                        if (
                                                                            item.name !==
                                                                            provinceValue
                                                                        ) {
                                                                            setDistrictValue(
                                                                                '',
                                                                            );
                                                                            setWardValue(
                                                                                '',
                                                                            );
                                                                            setDetailAddressValue(
                                                                                [
                                                                                    ` ${item.name}`,
                                                                                ],
                                                                            );
                                                                            setInputAddressValue(
                                                                                [
                                                                                    ` ${item.name}`,
                                                                                ],
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {showNotify &&
                                            provinceValue.length === 0 ? (
                                                <span
                                                    className={cx('validate')}
                                                >
                                                    {provinceValue.length === 0
                                                        ? 'Cần nhập thông tin này'
                                                        : ''}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>

                                        <div className={cx('province')}>
                                            <span
                                                className={cx('province-text')}
                                            >
                                                Quận/Huyện
                                                <span>
                                                    <FontAwesomeIcon
                                                        icon={faAsterisk}
                                                        className={cx(
                                                            'asterisk-icon',
                                                        )}
                                                    />
                                                </span>
                                            </span>
                                            <div
                                                className={cx(
                                                    'province-selected',
                                                )}
                                            >
                                                <input
                                                    ref={districtRef}
                                                    value={districtValue}
                                                    className={cx(
                                                        'input-selected',
                                                    )}
                                                    type="text"
                                                    placeholder="
                                                -- Quận/Huyện --
                                                "
                                                    disabled={
                                                        provinceValue.length ===
                                                        0
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) =>
                                                        setDistrictValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onClick={() =>
                                                        setDistrict(!district)
                                                    }
                                                    onBlur={() => {
                                                        const timerId =
                                                            setTimeout(() => {
                                                                setDistrict(
                                                                    false,
                                                                );
                                                            }, 200);
                                                        return () => {
                                                            clearTimeout(
                                                                timerId,
                                                            );
                                                        };
                                                    }}
                                                    readOnly
                                                />
                                                <span
                                                    className={cx(
                                                        'arrow-down-icon',
                                                    )}
                                                >
                                                    <BsChevronDown />
                                                </span>

                                                {district && (
                                                    <div
                                                        className={cx(
                                                            'province-list',
                                                        )}
                                                    >
                                                        {districtList.map(
                                                            (item, index) => (
                                                                <p
                                                                    key={index}
                                                                    className={cx(
                                                                        'province-item',
                                                                    )}
                                                                    onClick={() => {
                                                                        setDistrictValue(
                                                                            item.name,
                                                                        );
                                                                        setWardList(
                                                                            item.wards,
                                                                        );
                                                                        setDistrict(
                                                                            false,
                                                                        );
                                                                        if (
                                                                            item.name !==
                                                                            districtValue
                                                                        ) {
                                                                            setWardValue(
                                                                                '',
                                                                            );
                                                                            setDetailAddressValue(
                                                                                (
                                                                                    prevState,
                                                                                ) => {
                                                                                    if (
                                                                                        prevState.length >
                                                                                        1
                                                                                    ) {
                                                                                        prevState =
                                                                                            prevState.splice(
                                                                                                prevState.length -
                                                                                                    1,
                                                                                                prevState.length -
                                                                                                    1,
                                                                                            );
                                                                                        setInputAddressValue(
                                                                                            [
                                                                                                ` ${item.name}`,
                                                                                                ...prevState,
                                                                                            ],
                                                                                        );
                                                                                        return [
                                                                                            ` ${item.name}`,
                                                                                            ...prevState,
                                                                                        ];
                                                                                    } else {
                                                                                        setInputAddressValue(
                                                                                            [
                                                                                                ` ${item.name}`,
                                                                                                ...prevState,
                                                                                            ],
                                                                                        );
                                                                                        return [
                                                                                            ` ${item.name}`,
                                                                                            ...prevState,
                                                                                        ];
                                                                                    }
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {showNotify &&
                                            districtValue.length === 0 ? (
                                                <span
                                                    className={cx('validate')}
                                                >
                                                    {districtValue.length === 0
                                                        ? 'Cần nhập thông tin này'
                                                        : ''}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                        <div className={cx('province')}>
                                            <span
                                                className={cx('province-text')}
                                            >
                                                Phường/Xã
                                            </span>
                                            <div
                                                className={cx(
                                                    'province-selected',
                                                )}
                                            >
                                                <input
                                                    value={wardValue}
                                                    className={cx(
                                                        'input-selected',
                                                    )}
                                                    type="text"
                                                    placeholder="
                                                -- Phường/Xã --
                                                "
                                                    readOnly
                                                    disabled={
                                                        districtValue.length ===
                                                        0
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) =>
                                                        setWardValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onClick={() =>
                                                        setWard(!ward)
                                                    }
                                                    onBlur={() => {
                                                        const timerId =
                                                            setTimeout(() => {
                                                                setWard(false);
                                                            }, 200);
                                                        return () => {
                                                            clearTimeout(
                                                                timerId,
                                                            );
                                                        };
                                                    }}
                                                />
                                                <span
                                                    className={cx(
                                                        'arrow-down-icon',
                                                    )}
                                                >
                                                    <BsChevronDown />
                                                </span>
                                                {ward && (
                                                    <div
                                                        className={cx(
                                                            'province-list',
                                                        )}
                                                    >
                                                        {wardList.map(
                                                            (item, index) => (
                                                                <p
                                                                    key={index}
                                                                    className={cx(
                                                                        'province-item',
                                                                    )}
                                                                    onClick={() => {
                                                                        setWardValue(
                                                                            item.name,
                                                                        );
                                                                        setWard(
                                                                            false,
                                                                        );
                                                                        if (
                                                                            item.name !==
                                                                            wardValue
                                                                        ) {
                                                                            setDetailAddressValue(
                                                                                (
                                                                                    prevState,
                                                                                ) => {
                                                                                    if (
                                                                                        prevState.length >
                                                                                        2
                                                                                    ) {
                                                                                        prevState =
                                                                                            prevState.splice(
                                                                                                prevState.length -
                                                                                                    2,
                                                                                                prevState.length -
                                                                                                    1,
                                                                                            );
                                                                                        setInputAddressValue(
                                                                                            [
                                                                                                ` ${item.name}`,
                                                                                                ...prevState,
                                                                                            ],
                                                                                        );
                                                                                        return [
                                                                                            ` ${item.name}`,
                                                                                            ...prevState,
                                                                                        ];
                                                                                    } else {
                                                                                        setInputAddressValue(
                                                                                            [
                                                                                                ` ${item.name}`,
                                                                                                ...prevState,
                                                                                            ],
                                                                                        );
                                                                                        return [
                                                                                            ` ${item.name}`,
                                                                                            ...prevState,
                                                                                        ];
                                                                                    }
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {showNotify &&
                                            wardValue.length === 0 ? (
                                                <span
                                                    className={cx('validate')}
                                                >
                                                    {ward.length === 0
                                                        ? ''
                                                        : ''}
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('address-bottom')}>
                                        <div className={cx('province', 'dtad')}>
                                            <span
                                                className={cx('province-text')}
                                            >
                                                Địa chỉ cụ thể
                                            </span>
                                            <div
                                                className={cx('detail-address')}
                                            >
                                                <input
                                                    value={inputAddressValue}
                                                    className={cx(
                                                        'input-selected',
                                                        'input-details-address',
                                                    )}
                                                    type="text"
                                                    placeholder="Địa chỉ cụ thể"
                                                    onChange={(e) =>
                                                        setInputAddressValue(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('title')}>
                            <span className={cx('title-text')}>
                                Thông tin liên hệ
                            </span>
                        </div>
                        <div className={cx('content-item')}>
                            <div className={cx('full-name')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Số điện thoại
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </div>
                                <div className={cx('right')}>
                                    <input
                                        ref={phoneRef}
                                        className={cx('input-right')}
                                        value={phoneNumber}
                                        placeholder={'Nhập số điện thoại'}
                                        type="text"
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            {showNotify && phoneNumber.length === 0 ? (
                                <span
                                    className={cx(
                                        'validate',
                                        'validate-fullname',
                                    )}
                                >
                                    {phoneNumber.length === 0
                                        ? 'Cần nhập thông tin này'
                                        : ''}
                                </span>
                            ) : (
                                ''
                            )}
                            <div className={cx('date-of-birth')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Email
                                    </span>
                                </div>
                                <div className={cx('right')}>
                                    <input
                                        ref={emailRef}
                                        value={currentUser?.email || ''}
                                        type="text"
                                        className={cx('input-right')}
                                        readOnly
                                    />
                                </div>

                                <div className={cx('verify-icon')}>
                                    <MdVerified className={cx('icon')} />
                                </div>
                            </div>

                            <div className={cx('date-of-birth')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        CMND/CCCD
                                    </span>
                                </div>
                                <div className={cx('right')}>
                                    <input
                                        className={cx('input-right')}
                                        type="text"
                                        value={identityCard}
                                        onChange={(e) =>
                                            setIdentityCard(e.target.value)
                                        }
                                        placeholder="Nhập số CMND/CCCD"
                                    />
                                </div>
                            </div>

                            <div className={cx('date-of-birth')}>
                                <div className={cx('left')}>
                                    <span className={cx('left-text')}>
                                        Zalo
                                    </span>
                                </div>
                                <div className={cx('right')}>
                                    <input
                                        type="text"
                                        className={cx('input-right')}
                                        value={zaloValue}
                                        onChange={(e) =>
                                            setZaloValue(e.target.value)
                                        }
                                        placeholder="Nhập số điện thoại đăng ký Zalo"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={cx('submit')}>
                            <input
                                value="Lưu lại"
                                type="submit"
                                className={cx('btn-submit')}
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Profile;
