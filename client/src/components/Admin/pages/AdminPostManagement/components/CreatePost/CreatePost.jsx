import React from 'react';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAsterisk,
    faMinus,
    faPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { IoCloseOutline } from 'react-icons/io5';
import { UploadImage } from '~/components/Icons';
import { BsChevronDown } from 'react-icons/bs';
import Button from '~/components/Button';
import { address_list } from '~/components/AddressList';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import {
    getAllCategories,
    createPost,
    updateUser,
    updatePost,
    deletedPost,
} from '~/api';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi';
import styles from './CreatePost.module.scss';
import Mapbox from '~/components/Mapbox';
import { useDispatch } from 'react-redux';
import { updatedStart, updatedUser } from '~/redux/slice/authSlice';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useNavigate } from 'react-router-dom';
import { editPost } from '~/redux/slice/postSlice';
import { currentMenu } from '~/redux/slice/menuSlice';
import config from '~/config';

const cx = classNames.bind(styles);
const initialValue = 0;
const postTypeItems = [
    {
        type: ['Tin thường', 'Tin nổi bật'],
        dayPost: [
            7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30,
        ],
        price: [10000, 20000],
    },
];
const dayInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

const handleDate = (
    dateNumber,
    monthNumber,
    yearNumber,
    totalDay,
    datePostValue,
) => {
    if (monthNumber === 12) {
        if (dateNumber + datePostValue > totalDay) {
            monthNumber = 1;
            yearNumber += 1;
            dateNumber = dateNumber + datePostValue - totalDay;
            if (dateNumber < 10) {
                dateNumber = '0' + dateNumber;
            }
            if (monthNumber < 10) {
                monthNumber = '0' + monthNumber;
            }
            return [dateNumber, monthNumber, yearNumber];
        }
        dateNumber += datePostValue;
        if (dateNumber < 10) {
            dateNumber = '0' + dateNumber;
        }
        if (monthNumber < 10) {
            monthNumber = '0' + monthNumber;
        }
        return [dateNumber, monthNumber, yearNumber];
    }

    if (dateNumber + datePostValue > totalDay) {
        monthNumber += 1;
        dateNumber = dateNumber + datePostValue - totalDay;
        if (dateNumber < 10) {
            dateNumber = '0' + dateNumber;
        }
        if (monthNumber < 10) {
            monthNumber = '0' + monthNumber;
        }
        return [dateNumber, monthNumber, yearNumber];
    }
    dateNumber += datePostValue;
    if (dateNumber < 10) {
        dateNumber = '0' + dateNumber;
    }
    if (monthNumber < 10) {
        monthNumber = '0' + monthNumber;
    }
    return [dateNumber, monthNumber, yearNumber];
};
function CreatePost() {
    const currentUser = useSelector(
        (state) => state.admin.adminLogin?.currentUser?.user,
    );
    console.log(currentUser);
    const edt = useSelector((state) => state.post.editPost?.currentPost);
    const userId = currentUser?._id;
    const fullName = currentUser?.fullName;
    const email = currentUser?.email;
    const phoneNumber = currentUser?.phoneNumber;
    // Basic info state
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        address_list.map((item) => {
            return setDistrictList((prevState) => [...prevState, item]);
        });
        getAllCategories()
            .then((res) => setCategoryList(res.data))
            .catch((error) => console.log(error));
    }, []);

    console.log(!currentPost);
    console.log(currentPost ? currentPost.street : '');
    console.log(edt);
    useEffect(() => {
        return () => {
            dispatch(editPost(null));
        };
    }, [currentPost]);
    const [category, setCategory] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryValue, setCategoryValue] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [province, setProvince] = useState(false);
    const [provinceValue, setProvinceValue] = useState('');
    const [district, setDistrict] = useState(false);
    const [districtList, setDistrictList] = useState([]);
    const [districtValue, setDistrictValue] = useState('');
    const [wards, setWards] = useState(false);
    const [wardsValue, setWardsValue] = useState('');
    const [wardsList, setWardsList] = useState([]);
    const [streets, setStreets] = useState(false);
    const [streetList, setStreetList] = useState([]);
    const [streetValue, setStreetValue] = useState('');
    const [addressOnPost, setAddressOnPost] = useState([]);
    const [valueInputAddress, setValueInputAddress] = useState([]);
    const [showNotify, setShowNotify] = useState(false);
    // Post info state
    const [titlePost, setTitlePost] = useState(
        currentPost ? currentPost.title : '',
    );
    const [validatePostTitle, setValidatePostTitle] = useState('');
    const [describe, setDescribe] = useState('');
    const [validateDescribe, setValidateDescribe] = useState('');
    // Details info state
    const [areaValue, setAreaValue] = useState('');
    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState(false);
    const [priceUnitValue, setPriceUnitValue] = useState('VND');
    const [images, setImage] = useState('');
    console.log(images);
    const [bedroom, setBedroom] = useState(initialValue);
    const [restroom, setRestroom] = useState(initialValue);
    const [floor, setFloor] = useState(initialValue);
    const [furniture, setFurniture] = useState('');
    const [file, setFile] = useState([]);
    // Contact info state
    const [contactName, setContactName] = useState(fullName || '');
    const [contactPhoneNumber, setContactPhoneNumber] = useState(
        phoneNumber || '',
    );
    const [contactAddress, setContactAddress] = useState(
        valueInputAddress || '',
    );
    const [contactEmail, setContactEmail] = useState(email);
    // POST TYPE STATE
    const [type, setType] = useState(false);
    const [typeValue, setTypeValue] = useState('Tin nổi bật');
    const [datePost, setDatePost] = useState(false);
    const [datePostValue, setDatePostValue] = useState(7);
    const [date, setDate] = useState(new Date());
    const [dateFinished, setDateFinished] = useState(() => {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        const totalDay = dayInMonth(m, y);

        const result = handleDate(d, m, y, totalDay, datePostValue);

        return `${result[0]}/${result[1]}/${result[2]}`;
    });
    const [pricePostType, setPricePostType] = useState(10000);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categoryRef = useRef();
    const provinceRef = useRef();
    const districtRef = useRef();
    const wardRef = useRef();
    const streetRef = useRef();
    const inputAddressRef = useRef();
    const titleRef = useRef();
    const describeRef = useRef();
    const areaRef = useRef();
    const priceRef = useRef();
    const imageRef = useRef();
    const contactNameRef = useRef();
    const contactPhoneNumberRef = useRef();
    const contactAddressRef = useRef();
    const contactEmailRef = useRef();
    // handle change Basic info
    const handleChangeCategory = (e) => {
        setCategoryValue(e.target.value);
    };
    const handleChangeProvince = (e) => {
        setProvinceValue(e.target.value);
    };
    const handleChangeDistrict = (e) => {
        setDistrictValue(e.target.value);
    };
    const handleChangeWards = (e) => {
        setWardsValue(e.target.value);
    };
    // Tìm kiếm quận huyện
    const filteredWards = wardsList?.filter((wards) =>
        wards.match(new RegExp(wardsValue.toLocaleLowerCase().trim(), 'i')),
    );
    const handleChangeStreet = (e) => {
        setStreetValue(e.target.value);
    };
    const filteredStreets = streetList?.filter((street) =>
        street.match(new RegExp(streetValue.toLocaleLowerCase().trim(), 'i')),
    );
    const handleChangeAddressOnPost = (e) => {
        setValueInputAddress(e.target.value);
        setContactAddress(e.target.value);
    };
    // handle change Post info
    const handleChangeTitlePost = (e) => {
        setTitlePost(e.target.value);
    };
    const handleChangeDescribe = (e) => {
        setDescribe(e.target.value);
    };
    const handleChangeArea = (e) => {
        setAreaValue(e.target.value);
    };
    const handleChangePrice = (e) => {
        setPrice(e.target.value);
    };
    const handleChangeBedroom = (e) => {
        setBedroom(e.target.value);
    };
    const handleChangeRestroom = (e) => {
        setRestroom(e.target.value);
    };
    const handleChangeFloor = (e) => {
        setFloor(e.target.value);
    };
    const handleChangeFurniture = (e) => {
        setFurniture(e.target.value);
    };
    const handleChangeImage = (e) => {
        Object.entries(e.target.files).map((item) =>
            setImage((prev) => [...prev, item[1]]),
        );
        Object.entries(e.target.files).map((item) =>
            setFile((prevState) => [
                ...prevState,
                URL.createObjectURL(item[1]),
            ]),
        );
    };
    const handleDeleteImage = (i) => {
        setFile((prevState) => prevState.filter((item, index) => index !== i));
        setImage((prevState) =>
            prevState?.filter((item, index) => index !== i),
        );
    };
    // Handle change contact info
    const handleChangeContactName = (e) => {
        setContactName(e.target.value);
    };
    const handleChangeContactPhoneNumber = (e) => {
        setContactPhoneNumber(e.target.value);
    };
    const handleChangeContactAddress = (e) => {
        setContactAddress(e.target.value);
    };
    const handleChangeContactEmail = (e) => {
        setContactEmail(e.target.value);
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (categoryValue.length === 0) {
            setShowNotify(true);
            categoryRef.current.focus();
            return;
        }
        if (provinceValue.length === 0) {
            setShowNotify(true);
            provinceRef.current.focus();
            return;
        }
        if (districtValue.length === 0) {
            setShowNotify(true);
            districtRef.current.focus();
            return;
        }
        if (wardsValue.length === 0) {
            setShowNotify(true);
            wardRef.current.focus();
            return;
        }
        if (streetValue.length === 0) {
            setShowNotify(true);

            streetRef.current.focus();
            return;
        }
        if (valueInputAddress.length === 0) {
            setShowNotify(true);
            inputAddressRef.current.focus();
            return;
        }
        if (titlePost.length < 30 || titlePost.length > 99) {
            setShowNotify(true);
            titleRef.current.focus();
            return;
        }
        if (describe.length < 30 || describe.length > 3000) {
            setShowNotify(true);

            describeRef.current.focus();
            return;
        }

        if (file.length === 0) {
            setShowNotify(true);

            imageRef.current.focus();
            return;
        }
        if (contactName.length === 0) {
            setShowNotify(true);
            contactNameRef.current.focus();
            return;
        }
        if (contactPhoneNumber.length === 0) {
            setShowNotify(true);

            contactPhoneNumberRef.current.focus();
            return;
        }
        if (contactAddress.length === 0) {
            setShowNotify(true);

            contactAddressRef.current.focus();
            return;
        }
        if (contactEmail.length === 0) {
            setShowNotify(true);

            contactEmailRef.current.focus();
            return;
        }
        setShowNotify(false);
        const formData = new FormData();
        formData.append('category_id', categoryId);
        formData.append('category_name', categoryValue);
        formData.append('title', titlePost);
        formData.append(
            'describe',
            JSON.stringify({
                describe,
                areaValue,
                price,
                bedroom,
                restroom,
                floor,
                furniture,
            }),
        );
        formData.append('address', valueInputAddress);
        formData.append('province', provinceValue);
        formData.append('district', districtValue);
        formData.append('ward', wardsValue);
        formData.append('street', streetValue);
        formData.append('area', areaValue);
        formData.append('price', price);
        formData.append('createdBy', userId);
        formData.append('status', 'approved');
        formData.append(
            'userInfo',
            JSON.stringify({
                contactName,
                contactPhoneNumber,
                contactAddress,
                contactEmail,
            }),
        );
        images.map((item) => formData.append('images', item));
        // for (let i = 0; i < images.length; i++) {
        //     formData.append('images', images[i]);
        // }
        formData.append('postType', typeValue);
        formData.append('numberDayPost', datePostValue);
        formData.append('startDate', date.toLocaleDateString());
        formData.append('endDate', dateFinished);

        createPost(formData)
            .then((res) => {
                const data = res.data;
                console.log(data.newPost);
                alert('Đăng tin thành công!', 'success', '');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // POST TYPE
    const handleChangeDatePicker = (date) => {
        setDate(date);
        let dateNumber = date.getDate();
        let monthNumber = date.getMonth() + 1;
        let yearNumber = date.getFullYear();
        let totalDay = dayInMonth(monthNumber, yearNumber);
        const result = handleDate(
            dateNumber,
            monthNumber,
            yearNumber,
            totalDay,
            datePostValue,
        );
        setDateFinished(() => `${result[0]}/${result[1]}/${result[2]}`);
        console.log(result);
    };

    useEffect(() => {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        const totalDay = dayInMonth(m, y);
        const result = handleDate(d, m, y, totalDay, datePostValue);
        setDateFinished(`${result[0]}/${result[1]}/${result[2]}`);
    }, [datePostValue]);
    const handleNumberOfDayPost = (item) => {
        console.log(date);
        setDatePostValue(item);
        setDatePost(false);
    };

    const alert = (title, type, message) => {
        setShowAlert(true);
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
        }).then((result) => {
            if (result.isConfirmed) {
                setShowAlert(false);
                type === 'success' && navigate(config.routes.adminPostMng);
            }
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div
                className={cx(
                    'info',
                    currentPost &&
                        currentPost.status !== 'expired' &&
                        'edit-info',
                )}
            >
                {/* BASIC INFO */}
                <form
                    className={cx('form-post')}
                    action="/post"
                    method="post"
                    encType="multipart/form-data"
                >
                    <div className={cx('basic-info')}>
                        <h2 className={cx('heading')}>Thông tin cơ bản</h2>
                        <div className={cx('form-group')}>
                            <label className={cx('title')}>
                                Phân loại{' '}
                                <span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </span>
                            </label>
                            <div className={cx('category-container')}>
                                <div className={cx('category')}>
                                    <input
                                        ref={categoryRef}
                                        className={cx('input-category')}
                                        value={
                                            currentPost
                                                ? currentPost.category_name
                                                : categoryValue
                                        }
                                        readOnly
                                        type="text"
                                        placeholder="Chọn"
                                        onFocus={() => setCategory(true)}
                                        onBlur={() =>
                                            setTimeout(() => {
                                                setCategory(false);
                                            }, 200)
                                        }
                                        onChange={handleChangeCategory}
                                    />
                                    <span className={cx('icon')}>
                                        <BsChevronDown />
                                    </span>

                                    {category ? (
                                        <div className={cx('items-container')}>
                                            {categoryList?.map(
                                                (item, index) => (
                                                    <p
                                                        key={index}
                                                        className={cx('item')}
                                                        onClick={() => {
                                                            setCategoryValue(
                                                                item.category_name,
                                                            );
                                                            setCategoryId(
                                                                item._id,
                                                            );
                                                            setShowNotify(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {item.category_name}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className={cx('address-title')}>Địa chỉ</p>
                        <div className={cx('form-container')}>
                            <div className={cx('form-group')}>
                                <label className={cx('title')}>
                                    Tỉnh, thành phố{' '}
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faAsterisk}
                                            className={cx('asterisk-icon')}
                                        />
                                    </span>
                                </label>
                                <div className={cx('address-input-wrapper')}>
                                    <input
                                        ref={provinceRef}
                                        value={provinceValue}
                                        type="text"
                                        readOnly
                                        className={cx('input')}
                                        placeholder="Chọn"
                                        onFocus={() => setProvince(true)}
                                        onBlur={() =>
                                            setTimeout(
                                                () => setProvince(false),
                                                200,
                                            )
                                        }
                                        onChange={handleChangeProvince}
                                    />
                                    <span className={cx('icon')}>
                                        <BsChevronDown />
                                    </span>
                                    {province ? (
                                        <div className={cx('address-items')}>
                                            <p
                                                className={cx('item')}
                                                onClick={() => {
                                                    setProvinceValue('Đà Nẵng');
                                                    setShowNotify(false);
                                                    setAddressOnPost(
                                                        (prevState) => {
                                                            if (
                                                                !prevState.includes(
                                                                    ' Đà Nẵng',
                                                                )
                                                            ) {
                                                                setDistrictValue(
                                                                    '',
                                                                );
                                                                setWardsValue(
                                                                    '',
                                                                );
                                                                setStreetValue(
                                                                    '',
                                                                );
                                                                setValueInputAddress(
                                                                    [
                                                                        ...prevState,
                                                                        ' Đà Nẵng',
                                                                    ],
                                                                );
                                                                return [
                                                                    ...prevState,
                                                                    ' Đà Nẵng',
                                                                ];
                                                            } else {
                                                                setDistrictValue(
                                                                    '',
                                                                );
                                                                setWardsValue(
                                                                    '',
                                                                );
                                                                setStreetValue(
                                                                    '',
                                                                );
                                                                setValueInputAddress(
                                                                    ' Đà Nẵng',
                                                                );

                                                                return [
                                                                    ' Đà Nẵng',
                                                                ];
                                                            }
                                                        },
                                                    );
                                                }}
                                            >
                                                Đà Nẵng
                                            </p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {showNotify &&
                                    (provinceValue.length > 0 &&
                                    districtValue.length > 0 ? (
                                        ''
                                    ) : (
                                        <span className={cx('validate')}>
                                            {provinceValue.length === 0
                                                ? 'Cần nhập thông tin này'
                                                : ''}
                                        </span>
                                    ))}
                            </div>
                            <div className={cx('form-group', 'ml')}>
                                <label className={cx('title')}>
                                    Quận, huyện{' '}
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faAsterisk}
                                            className={cx('asterisk-icon')}
                                        />
                                    </span>
                                </label>
                                <div className={cx('address-input-wrapper')}>
                                    <input
                                        ref={districtRef}
                                        type="text"
                                        className={cx(
                                            'input',
                                            provinceValue ? '' : 'disabled',
                                        )}
                                        readOnly
                                        disabled={provinceValue ? false : true}
                                        placeholder="Chọn"
                                        value={districtValue}
                                        onFocus={() => setDistrict(true)}
                                        onBlur={() =>
                                            setTimeout(() => {
                                                setDistrict(false);
                                            }, 200)
                                        }
                                        onChange={handleChangeDistrict}
                                    />
                                    <span className={cx('icon')}>
                                        <BsChevronDown />
                                    </span>

                                    {district && (
                                        <div className={cx('address-items')}>
                                            {districtList.map((item, index) => (
                                                <p
                                                    tabIndex={index}
                                                    key={index}
                                                    className={cx('item')}
                                                    onClick={() => {
                                                        setDistrictValue(
                                                            item.district,
                                                        );

                                                        setWardsList(
                                                            item.wards,
                                                        );
                                                        setStreetList(
                                                            item.streets,
                                                        );
                                                        setShowNotify(false);

                                                        setAddressOnPost(
                                                            (prevState) => {
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

                                                                    console.log(
                                                                        prevState,
                                                                    );
                                                                    setWardsValue(
                                                                        '',
                                                                    );
                                                                    setStreetValue(
                                                                        '',
                                                                    );
                                                                    setValueInputAddress(
                                                                        [
                                                                            ` ${item.district}`,
                                                                            ...prevState,
                                                                        ],
                                                                    );
                                                                    return [
                                                                        ` ${item.district}`,
                                                                        ...prevState,
                                                                    ];
                                                                } else {
                                                                    setValueInputAddress(
                                                                        [
                                                                            ` ${item.district}`,
                                                                            ...prevState,
                                                                        ],
                                                                    );
                                                                    return [
                                                                        ` ${item.district}`,
                                                                        ...prevState,
                                                                    ];
                                                                }
                                                            },
                                                        );
                                                        setValueInputAddress(
                                                            addressOnPost,
                                                        );
                                                    }}
                                                >
                                                    {item.district}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {showNotify &&
                                    (provinceValue.length > 0 &&
                                    districtValue.length > 0 ? (
                                        ''
                                    ) : (
                                        <span className={cx('validate')}>
                                            {districtValue.length === 0
                                                ? 'Cần nhập thông tin này'
                                                : ''}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        <div className={cx('form-container')}>
                            <div className={cx('form-group')}>
                                <label className={cx('title')}>
                                    Phường, xã{' '}
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faAsterisk}
                                            className={cx('asterisk-icon')}
                                        />
                                    </span>
                                </label>
                                <div className={cx('address-input-wrapper')}>
                                    <input
                                        ref={wardRef}
                                        className={cx(
                                            'input',
                                            districtValue.length > 0
                                                ? ''
                                                : 'disabled',
                                        )}
                                        value={wardsValue}
                                        type="text"
                                        placeholder="Chọn"
                                        disabled={
                                            districtValue.length > 0
                                                ? false
                                                : true
                                        }
                                        onFocus={() => {
                                            setWards(true);
                                            setWardsValue('');
                                            setStreetValue('');
                                        }}
                                        onBlur={() =>
                                            setTimeout(() => {
                                                setWards(false);
                                            }, 200)
                                        }
                                        onChange={handleChangeWards}
                                    />
                                    <span className={cx('icon')}>
                                        <BsChevronDown />
                                    </span>
                                    {wards ? (
                                        <div className={cx('address-items')}>
                                            {filteredWards?.map(
                                                (item, index) => (
                                                    <p
                                                        key={index}
                                                        className={cx('item')}
                                                        onClick={() => {
                                                            setWardsValue(item);
                                                            setShowNotify(
                                                                false,
                                                            );

                                                            setAddressOnPost(
                                                                (prevState) => {
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
                                                                        setStreetValue(
                                                                            '',
                                                                        );
                                                                        setValueInputAddress(
                                                                            [
                                                                                ` ${item}`,
                                                                                ...prevState,
                                                                            ],
                                                                        );
                                                                        return [
                                                                            ` ${item}`,
                                                                            ...prevState,
                                                                        ];
                                                                    } else {
                                                                        setValueInputAddress(
                                                                            [
                                                                                ` ${item}`,
                                                                                ...prevState,
                                                                            ],
                                                                        );
                                                                        return [
                                                                            ` ${item}`,
                                                                            ...prevState,
                                                                        ];
                                                                    }
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        {item}
                                                    </p>
                                                ),
                                            )}

                                            {filteredWards.length === 0 && (
                                                <p
                                                    className={cx(
                                                        'item',
                                                        'not-found',
                                                    )}
                                                >
                                                    Không tìm thấy kết quả phù
                                                    hợp
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {showNotify &&
                                    (wardsValue.length > 0 &&
                                    streetValue.length > 0 ? (
                                        ''
                                    ) : (
                                        <span className={cx('validate')}>
                                            {wardsValue.length === 0
                                                ? 'Cần nhập thông tin này'
                                                : ''}
                                        </span>
                                    ))}
                            </div>
                            <div className={cx('form-group', 'ml')}>
                                <label className={cx('title')}>
                                    Đường, phố{' '}
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faAsterisk}
                                            className={cx('asterisk-icon')}
                                        />
                                    </span>
                                </label>
                                <div className={cx('address-input-wrapper')}>
                                    <input
                                        ref={streetRef}
                                        className={cx(
                                            'input',
                                            wardsValue.length > 0
                                                ? ''
                                                : 'disabled',
                                        )}
                                        disabled={
                                            wardsValue.length > 0 ? false : true
                                        }
                                        value={streetValue}
                                        type="text"
                                        placeholder="Chọn"
                                        onFocus={() => {
                                            setStreets(true);
                                            setStreetValue('');
                                        }}
                                        onBlur={() =>
                                            setTimeout(
                                                () => setStreets(false),
                                                200,
                                            )
                                        }
                                        onChange={handleChangeStreet}
                                    />
                                    <span className={cx('icon')}>
                                        <BsChevronDown />
                                    </span>
                                    {streets ? (
                                        <div className={cx('address-items')}>
                                            {filteredStreets?.map(
                                                (item, index) => (
                                                    <p
                                                        key={index}
                                                        className={cx('item')}
                                                        onClick={() => {
                                                            setStreetValue(
                                                                item,
                                                            );
                                                            setShowNotify(
                                                                false,
                                                            );
                                                            setAddressOnPost(
                                                                (prevState) => {
                                                                    if (
                                                                        prevState.length >
                                                                        3
                                                                    ) {
                                                                        prevState =
                                                                            prevState.splice(
                                                                                prevState.length -
                                                                                    3,
                                                                                prevState.length -
                                                                                    1,
                                                                            );
                                                                        setValueInputAddress(
                                                                            [
                                                                                ` ${item}`,
                                                                                ...prevState,
                                                                            ],
                                                                        );
                                                                        return [
                                                                            ` ${item}`,
                                                                            ...prevState,
                                                                        ];
                                                                    } else {
                                                                        setValueInputAddress(
                                                                            [
                                                                                ` ${item}`,
                                                                                ...prevState,
                                                                            ],
                                                                        );
                                                                        return [
                                                                            ` ${item}`,
                                                                            ...prevState,
                                                                        ];
                                                                    }
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        {item}
                                                    </p>
                                                ),
                                            )}
                                            {filteredStreets.length === 0 && (
                                                <p
                                                    className={cx(
                                                        'item',
                                                        'not-found',
                                                    )}
                                                >
                                                    Không tìm thấy kết quả phù
                                                    hợp
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {showNotify &&
                                    (wardsValue.length > 0 &&
                                    streetValue.length > 0 ? (
                                        ''
                                    ) : (
                                        <span className={cx('validate')}>
                                            {streetValue.length === 0
                                                ? 'Cần nhập thông tin này'
                                                : ''}
                                        </span>
                                    ))}
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label className={cx('title')}>
                                Địa chỉ hiển thị trên tin đăng
                                <span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </span>
                            </label>
                            <div className={cx('input')}>
                                <input
                                    ref={inputAddressRef}
                                    value={valueInputAddress}
                                    className={cx(
                                        'address-input',
                                        provinceValue.length === 0 &&
                                            'disabled',
                                    )}
                                    disabled={
                                        provinceValue.length > 0 ? false : true
                                    }
                                    type="text"
                                    required
                                    placeholder="Bạn có thể bổ sung hẻm, ngách, ngõ"
                                    onChange={handleChangeAddressOnPost}
                                />
                            </div>
                        </div>
                        {streetValue && (
                            <div className={cx('form-group')}>
                                <div className={cx('google-map')}>
                                    <p className={cx('title')}>
                                        Vị trí trên bản đồ
                                    </p>
                                    <div className={cx('map')}>
                                        <Mapbox
                                            editPost={
                                                currentPost &&
                                                currentPost.status !== 'expired'
                                                    ? true
                                                    : false
                                            }
                                            searchAddress={valueInputAddress}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* ARTICLE INFO */}
                    <div className={cx('article-info')}>
                        <h2 className={cx('heading')}>Thông tin bài viết</h2>

                        <div className={cx('form-group')}>
                            <label className={cx('title')}>
                                Tiêu đề
                                <span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </span>
                            </label>
                            <textarea
                                className={cx('post-title-details')}
                                ref={titleRef}
                                value={titlePost}
                                id="title"
                                placeholder="VD: Bán nhà riêng 50m2 chính chủ tại Cầu Giấy"
                                rows="2"
                                type="text"
                                onChange={(e) => {
                                    setValidatePostTitle('');
                                    handleChangeTitlePost(e);
                                }}
                                onBlur={() => {
                                    if (titlePost.length < 30) {
                                        setValidatePostTitle(
                                            'Vui lòng nhập tối thiểu 30 ký tự!',
                                        );
                                    } else if (titlePost.length > 99) {
                                        setValidatePostTitle(
                                            'Vui lòng nhập tối đa 99 kí tự!',
                                        );
                                    } else {
                                        setValidatePostTitle('');
                                    }
                                }}
                            ></textarea>
                            <p
                                className={cx(
                                    'count-text',
                                    validatePostTitle.length > 0 && 'validate',
                                )}
                            >
                                {' '}
                                {showNotify && titlePost.length === 0 ? (
                                    <span className={cx('validate')}>
                                        {validatePostTitle.length === 0
                                            ? 'Cần nhập thông tin này'
                                            : ''}
                                    </span>
                                ) : validatePostTitle.length > 0 ? (
                                    validatePostTitle
                                ) : titlePost.length > 0 ? (
                                    `${titlePost.length} / 99 ký tự`
                                ) : (
                                    'Tối thiểu 30 ký tự, tối đa 99 ký tự'
                                )}
                            </p>
                        </div>

                        <div className={cx('form-group')}>
                            <label className={cx('title')}>
                                Mô tả
                                <span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </span>
                            </label>
                            <textarea
                                className={cx('describe')}
                                ref={describeRef}
                                value={describe}
                                id="describe"
                                placeholder="Nhập mô tả chung về bất động sản của bạn. Ví dụ: Khu nhà có vị trí thuận lợi, gần công viên, gần trường học ... "
                                type="text"
                                onChange={(e) => {
                                    setValidateDescribe('');
                                    handleChangeDescribe(e);
                                }}
                                onBlur={() => {
                                    if (describe.length < 30) {
                                        setValidateDescribe(
                                            'Vui lòng nhập tối thiểu 30 ký tự!',
                                        );
                                    } else if (describe.length > 3000) {
                                        setValidateDescribe(
                                            'Vui lòng nhập tối đa 3000 kí tự!',
                                        );
                                    } else {
                                        setValidateDescribe('');
                                    }
                                }}
                            ></textarea>
                            <p
                                className={cx(
                                    'count-text',
                                    validateDescribe.length > 0 && 'validate',
                                )}
                            >
                                {showNotify && describe.length === 0 ? (
                                    <span className={cx('validate')}>
                                        {validateDescribe.length === 0
                                            ? 'Cần nhập thông tin này'
                                            : ''}
                                    </span>
                                ) : validateDescribe.length > 0 ? (
                                    validateDescribe
                                ) : describe.length > 0 ? (
                                    `${describe.length} / 3000 ký tự`
                                ) : (
                                    'Tối thiểu 30 ký tự, tối đa 3000 ký tự'
                                )}
                            </p>
                        </div>
                    </div>
                    {/* DETAILS INFO */}
                    <div className={cx('details-info')}>
                        <h2 className={cx('heading')}>Thông tin chi tiết</h2>

                        <div className={cx('form-group')}>
                            <label className={cx('title')}>
                                Diện tích
                                <span>
                                    <FontAwesomeIcon
                                        icon={faAsterisk}
                                        className={cx('asterisk-icon')}
                                    />
                                </span>
                            </label>
                            <div className={cx('por')}>
                                <input
                                    ref={areaRef}
                                    className={cx('input-area')}
                                    value={areaValue}
                                    type="number"
                                    id="area"
                                    name="area"
                                    required
                                    placeholder="Nhập diện tích, VD 50"
                                    onWheel={(e) => e.target.blur()}
                                    onChange={handleChangeArea}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                                <span className={cx('square-metre')}>m²</span>
                            </div>
                            {showNotify &&
                                (areaValue.length > 0 ? (
                                    ''
                                ) : (
                                    <span className={cx('validate')}>
                                        {areaValue.length === 0
                                            ? 'Cần nhập thông tin này'
                                            : ''}
                                    </span>
                                ))}
                        </div>
                        <div className={cx('price-container')}>
                            <div className={cx('form-group', 'price-width')}>
                                <label className={cx('title')}>
                                    Mức giá
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faAsterisk}
                                            className={cx('asterisk-icon')}
                                        />
                                    </span>
                                </label>
                                <input
                                    ref={priceRef}
                                    className={cx(
                                        'input-price',
                                        priceUnitValue === 'Thỏa thuận' &&
                                            'disabled',
                                    )}
                                    value={price}
                                    type="number"
                                    id="price"
                                    name="price"
                                    onWheel={(e) => e.target.blur()}
                                    placeholder={
                                        priceUnitValue === 'Thỏa thuận'
                                            ? 'Giá thỏa thuận'
                                            : 'Nhập giá, VD 5000000'
                                    }
                                    disabled={
                                        priceUnitValue === 'Thỏa thuận'
                                            ? true
                                            : false
                                    }
                                    required
                                    onChange={handleChangePrice}
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                                {priceUnitValue !== 'Thỏa thuận'
                                    ? showNotify &&
                                      (areaValue.length > 0 ? (
                                          ''
                                      ) : (
                                          <span className={cx('validate')}>
                                              {areaValue.length === 0
                                                  ? 'Cần nhập thông tin này'
                                                  : ''}
                                          </span>
                                      ))
                                    : ''}
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('title')}>
                                    Đơn vị
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faAsterisk}
                                            className={cx('asterisk-icon')}
                                        />
                                    </span>
                                </label>
                                <div className={cx('price-unit')}>
                                    <input
                                        className={cx('input-price-unit')}
                                        value={priceUnitValue}
                                        type="text"
                                        readOnly
                                        onClick={() => setPriceUnit(!priceUnit)}
                                        onBlur={() =>
                                            setTimeout(() => {
                                                setPriceUnit(false);
                                            }, 200)
                                        }
                                    />
                                    <span className={cx('icon-unit')}>
                                        <BsChevronDown />
                                    </span>
                                    {priceUnitValue !== 'Thỏa thuận'
                                        ? showNotify &&
                                          (areaValue.length > 0 ? (
                                              ''
                                          ) : (
                                              <span
                                                  className={cx('validate')}
                                              ></span>
                                          ))
                                        : ''}
                                    {priceUnit && (
                                        <div className={cx('price-unit-items')}>
                                            <p
                                                className={cx('item')}
                                                onClick={() =>
                                                    setPriceUnitValue('VND')
                                                }
                                            >
                                                VND
                                            </p>
                                            <p
                                                className={cx('item')}
                                                onClick={() =>
                                                    setPriceUnitValue(
                                                        'Thỏa thuận',
                                                    )
                                                }
                                            >
                                                Thỏa thuận
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={cx('line')}></div>
                        <div className={cx('form-group')}>
                            <div className={cx('details-describe')}>
                                <div className={cx('left')}>Số phòng ngủ</div>
                                <div className={cx('right')}>
                                    <button
                                        className={cx('btn', 'btn-decrease')}
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (bedroom === 0) {
                                                setBedroom(0);
                                            } else {
                                                setBedroom(bedroom - 1);
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faMinus}
                                            className={cx('btn-icon')}
                                        />
                                    </button>
                                    <input
                                        value={bedroom}
                                        type="number"
                                        className={cx('input-count')}
                                        onChange={handleChangeBedroom}
                                    />
                                    <button
                                        className={cx('btn', 'btn-increase')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBedroom(bedroom + 1);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className={cx('btn-icon')}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className={cx('details-describe')}>
                                <div className={cx('left')}>
                                    Số phòng tắm, vệ sinh
                                </div>
                                <div className={cx('right')}>
                                    <button
                                        className={cx('btn', 'btn-decrease')}
                                        onClick={(e) => {
                                            e.preventDefault();

                                            if (restroom === 0) {
                                                setRestroom(0);
                                            } else {
                                                setRestroom(restroom - 1);
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faMinus}
                                            className={cx('btn-icon')}
                                        />
                                    </button>
                                    <input
                                        className={cx('input-count')}
                                        value={restroom}
                                        type="number"
                                        onChange={handleChangeRestroom}
                                    />
                                    <button
                                        className={cx('btn', 'btn-increase')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setRestroom(restroom + 1);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className={cx('btn-icon')}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className={cx('details-describe')}>
                                <div className={cx('left')}>Số tầng</div>
                                <div className={cx('right')}>
                                    <button
                                        className={cx('btn', 'btn-decrease')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (floor === 0) {
                                                setFloor(0);
                                            } else {
                                                setFloor(floor - 1);
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faMinus}
                                            className={cx('btn-icon')}
                                        />
                                    </button>
                                    <input
                                        className={cx('input-count')}
                                        type="number"
                                        value={floor}
                                        onChange={handleChangeFloor}
                                    />
                                    <button
                                        className={cx('btn', 'btn-increase')}
                                        onClick={(e) => {
                                            e.preventDefault();

                                            setFloor(floor + 1);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className={cx('btn-icon')}
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className={cx('furniture')}>
                                <p className={cx('title')}>Nội thất</p>
                                <input
                                    value={furniture}
                                    className={cx('input-furniture')}
                                    type="text"
                                    placeholder="VD: Nội thất đầy đủ"
                                    onChange={handleChangeFurniture}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('image-desribe')}>
                        <h2 className={cx('heading')}>Hình ảnh mô tả</h2>
                        <span className={cx('sub-title')}>
                            Hãy dùng ảnh thật, không trùng, không chèn số điện
                            thoại. Mỗi ảnh kích thước tối thiểu 100x100, tối đa
                            15 MB. Số lượng ảnh tối đa tuỳ theo loại tin. Xem
                            thêm{' '}
                            <span className={cx('highlight-text')}>
                                Quy định đăng tin
                            </span>
                            .
                        </span>

                        <div className={cx('upload-image')}>
                            <label
                                className={cx('label-upload')}
                                htmlFor="upload-image"
                            >
                                <UploadImage />
                                <p>Bấm vào đây để chọn ảnh cần tải lên</p>
                            </label>
                            <input
                                ref={imageRef}
                                id="upload-image"
                                style={{ display: 'none' }}
                                accept="image/*,.heic"
                                multiple
                                type="file"
                                autoComplete="off"
                                onChange={handleChangeImage}
                            />
                        </div>
                        {showNotify &&
                            (file.length > 0 ? (
                                ''
                            ) : (
                                <span className={cx('validate')}>
                                    Cần nhập thông tin này
                                </span>
                            ))}

                        {file.length > 0 && (
                            <div className={cx('image-wrapper')}>
                                {file?.map((item, index) => (
                                    <div
                                        className={cx('img-container')}
                                        key={index}
                                    >
                                        <img
                                            className={cx('image-item')}
                                            src={item}
                                            alt=""
                                        />

                                        <span
                                            className={cx('deleted')}
                                            onClick={() =>
                                                handleDeleteImage(index)
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                className={cx('deleted-icon')}
                                            />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={cx('contact-info')}>
                        <h2 className={cx('heading')}>Thông tin liên hệ</h2>
                        <div className={cx('form-group')}>
                            <div className={cx('form-container')}>
                                <div className={cx('form-group')}>
                                    <label className={cx('title')}>
                                        Tên liên hệ{' '}
                                        <span>
                                            <FontAwesomeIcon
                                                icon={faAsterisk}
                                                className={cx('asterisk-icon')}
                                            />
                                        </span>
                                    </label>
                                    <div
                                        className={cx(
                                            'contact-input-container',
                                        )}
                                    >
                                        <input
                                            ref={contactNameRef}
                                            value={contactName}
                                            type="text"
                                            required
                                            className={cx('contact-input')}
                                            placeholder="Nhập tên"
                                            onChange={handleChangeContactName}
                                        />
                                    </div>
                                    {showNotify &&
                                        (contactName.length > 0 &&
                                        contactPhoneNumber.length > 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('validate')}>
                                                {contactName.length === 0
                                                    ? 'Cần nhập thông tin này'
                                                    : ''}
                                            </span>
                                        ))}
                                </div>
                                <div className={cx('form-group', 'ml')}>
                                    <label className={cx('title')}>
                                        Số điện thoại{' '}
                                        <span>
                                            <FontAwesomeIcon
                                                icon={faAsterisk}
                                                className={cx('asterisk-icon')}
                                            />
                                        </span>
                                    </label>
                                    <div
                                        className={cx(
                                            'contact-input-container',
                                        )}
                                    >
                                        <input
                                            ref={contactPhoneNumberRef}
                                            value={contactPhoneNumber}
                                            type="text"
                                            required
                                            className={cx('contact-input')}
                                            placeholder="Chọn số đã đăng ký"
                                            onChange={
                                                handleChangeContactPhoneNumber
                                            }
                                        />
                                    </div>
                                    {showNotify &&
                                        (contactName.length > 0 &&
                                        contactPhoneNumber.length > 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('validate')}>
                                                {contactPhoneNumber.length === 0
                                                    ? 'Cần nhập thông tin này'
                                                    : ''}
                                            </span>
                                        ))}
                                </div>
                            </div>
                            <div className={cx('form-container')}>
                                <div className={cx('form-group')}>
                                    <label className={cx('title')}>
                                        Địa chỉ{' '}
                                        <span>
                                            <FontAwesomeIcon
                                                icon={faAsterisk}
                                                className={cx('asterisk-icon')}
                                            />
                                        </span>
                                    </label>
                                    <div
                                        className={cx(
                                            'contact-input-container',
                                        )}
                                    >
                                        <input
                                            ref={contactAddressRef}
                                            value={contactAddress}
                                            type="text"
                                            required
                                            className={cx('contact-input')}
                                            placeholder="Nhập địa chỉ"
                                            onChange={
                                                handleChangeContactAddress
                                            }
                                        />
                                    </div>
                                    {showNotify &&
                                        (contactAddress.length > 0 &&
                                        contactEmail.length > 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('validate')}>
                                                {contactAddress.length === 0
                                                    ? 'Cần nhập thông tin này'
                                                    : ''}
                                            </span>
                                        ))}
                                </div>
                                <div className={cx('form-group', 'ml')}>
                                    <label className={cx('title')}>
                                        Email{' '}
                                        <span>
                                            <FontAwesomeIcon
                                                icon={faAsterisk}
                                                className={cx('asterisk-icon')}
                                            />
                                        </span>
                                    </label>
                                    <div
                                        className={cx(
                                            'contact-input-container',
                                        )}
                                    >
                                        <input
                                            ref={contactEmailRef}
                                            value={contactEmail}
                                            type="email"
                                            required
                                            className={cx('contact-input')}
                                            placeholder="Nhập email"
                                            onChange={handleChangeContactEmail}
                                        />
                                    </div>
                                    {showNotify &&
                                        (contactAddress.length > 0 &&
                                        contactEmail.length > 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('validate')}>
                                                {contactEmail.length === 0
                                                    ? 'Cần nhập thông tin này'
                                                    : ''}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('submit')}>
                        <div className={cx('submit-content')}>
                            <>
                                <Button outline className={cx('btn-preview')}>
                                    Xem trước giao diện
                                </Button>
                                <Button
                                    primary
                                    className={cx('btn-next')}
                                    onClick={handleClick}
                                >
                                    Đăng tin
                                </Button>
                            </>
                        </div>
                    </div>
                </form>
            </div>

            <div className={cx('type')}>
                <div className={cx('post-type')}>
                    <div className={cx('form-group')}>
                        <p className={cx('title')}>Loại tin đăng</p>
                        <div className={cx('type-wrapper')}>
                            <div className={cx('input-type-wrapper')}>
                                <input
                                    className={cx('input-type')}
                                    type="text"
                                    value={typeValue}
                                    readOnly
                                    onClick={() => setType(!type)}
                                    onBlur={() =>
                                        setTimeout(() => {
                                            setType(false);
                                        }, 200)
                                    }
                                />
                                <span className={cx('type-icon')}>
                                    <BsChevronDown />
                                </span>
                            </div>
                            {type && (
                                <div className={cx('type-value')}>
                                    {postTypeItems[0].type.map(
                                        (item, index) => (
                                            <p
                                                key={index}
                                                className={cx(
                                                    'type-value-item',
                                                )}
                                                onClick={() => {
                                                    setTypeValue(item);
                                                    setPricePostType(
                                                        postTypeItems[0].price[
                                                            index
                                                        ],
                                                    );
                                                    setType(false);
                                                }}
                                            >
                                                {item}
                                            </p>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <p className={cx('title')}>Số ngày đăng</p>
                        <div className={cx('type-wrapper')}>
                            <div className={cx('input-type-wrapper')}>
                                <input
                                    className={cx('input-type')}
                                    type="text"
                                    value={datePostValue + ' ngày'}
                                    readOnly
                                    onClick={() => setDatePost(!datePost)}
                                    onBlur={() =>
                                        setTimeout(() => {
                                            setDatePost(false);
                                        }, 200)
                                    }
                                />
                                <span className={cx('type-icon')}>
                                    <BsChevronDown />
                                </span>
                            </div>
                            {datePost && (
                                <div
                                    className={cx(
                                        'type-value',
                                        'date-post-value',
                                    )}
                                >
                                    {postTypeItems[0].dayPost.map(
                                        (item, index) => (
                                            <p
                                                key={index}
                                                className={cx(
                                                    'type-value-item',
                                                )}
                                                onClick={() =>
                                                    handleNumberOfDayPost(item)
                                                }
                                            >
                                                {`${item} ngày`}
                                            </p>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cx('form-group')}>
                        <p className={cx('title')}>Ngày bắt đầu</p>

                        <div className={cx('date-picker-wrapper')}>
                            <ReactDatePicker
                                popperClassName={cx('popper')}
                                className={cx('date-picker')}
                                calendarClassName={cx('calendar')}
                                selected={date}
                                minDate={new Date()}
                                onChange={(date) =>
                                    handleChangeDatePicker(date)
                                }
                                dateFormat="dd/MM/yyyy"
                            />
                            <span className={cx('dpk-icon')}>
                                <FiCalendar className={cx()} />
                            </span>
                        </div>
                    </div>
                    <div className={cx('form-group')}>
                        <p className={cx('title')}>Ngày kết thúc</p>
                        <input
                            type="text"
                            value={dateFinished}
                            className={cx('input-type', 'disabled')}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
