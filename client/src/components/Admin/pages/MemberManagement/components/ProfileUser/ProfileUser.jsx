import classNames from 'classnames/bind';
import styles from './ProfileUser.module.scss';
import { useSelector } from 'react-redux';
import images from '~/assets/images';
import { BsCalendarEvent, BsPhone, BsUpload } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
import { GoMail } from 'react-icons/go';
import { MdOutlineLocationSearching } from 'react-icons/md';
import { useState, useRef } from 'react';
import { updateUserFormData } from '~/api';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as locales from 'react-date-range/dist/locale';
import { Calendar } from 'react-date-range';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useDispatch } from 'react-redux';
import { currentMenu, editedUser } from '~/redux/slice/adminSlice';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
const cx = classNames.bind(styles);

const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function ProfileUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector((state) => state.admin.editUser?.user);
    const [fullName, setFullName] = useState(profile?.fullName || '');
    const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || '');
    const [email, setEmail] = useState(profile?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
    const [address, setAddress] = useState(profile?.address || '');
    const [avatar, setAvatar] = useState([]);
    const [file, setFile] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [showValidateText, setShowValidateText] = useState(false);
    const calendarRef = useRef();
    const fullNameRef = useRef();
    const dateOfBirthRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const handleChangeImage = (e) => {
        setAvatar(e.target.files[0]);
        setFile(URL.createObjectURL(e.target.files[0]));
    };
    const handleUpdateUser = (e) => {
        e.preventDefault();
        if (!fullName) {
            setShowValidateText(true);
            fullNameRef.current.focus();
            return;
        }
        if (!dateOfBirth) {
            setShowValidateText(true);
            dateOfBirthRef.current.focus();
            return;
        }
        if (!phoneNumber) {
            setShowValidateText(true);
            phoneRef.current.focus();
            return;
        }
        if (!address) {
            setShowValidateText(true);
            addressRef.current.focus();
            return;
        }
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('dateOfBirth', dateOfBirth);
        formData.append('phoneNumber', phoneNumber);
        formData.append('address', address);
        formData.append('file', avatar);
        profile &&
            updateUserFormData(profile?._id, formData).then((res) => {
                dispatch(editedUser(res.user));
                alert('Cập nhật thành công', 'success', '');
            });
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
    const handleOnClickOutside = (e) => {
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
    const handleBack = () => {
        navigate(config.routes.membermng);
        dispatch(currentMenu('list-user'));
        dispatch(editedUser(null));
    };
    const handleAddUser = () => {
        dispatch(currentMenu('add-user'));
        navigate(config.routes.membermng);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top')}>
                <button className={cx('btn-back')} onClick={handleBack}>
                    Quay lại
                </button>
                <button className={cx('btn-add')} onClick={handleAddUser}>
                    Thêm thành viên
                </button>
            </div>
            <div className={cx('container')}>
                <div className={cx('left')}>
                    <span className={cx('right-title')}>
                        Thông tin thành viên
                    </span>

                    <div className={cx('avatar-and-name')}>
                        <img
                            src={
                                profile?.profilePicture
                                    ? `${HOST_NAME}${profile.profilePicture}`
                                    : images.defaultAvt
                            }
                            alt="avatar"
                            className={cx('img')}
                        />
                        <div className={cx('name')}>
                            <span className={cx('full-name')}>
                                {profile?.fullName
                                    ? profile?.fullName
                                    : profile?.username}
                            </span>
                            <span className={cx('member-code')}>
                                {profile?.memberCode && profile?.memberCode}
                            </span>
                        </div>
                    </div>
                    <div className={cx('account-details')}>
                        <span className={cx('title-small')}>
                            Thông tin chi tiết
                        </span>
                        <div className={cx('gender')}>
                            <span className={cx('icon')}>
                                <BiUser />
                            </span>
                            <span className={cx('text')}>
                                {profile?.username}
                            </span>
                        </div>
                        <div className={cx('date-of-birth')}>
                            <span className={cx('icon')}>
                                <BsCalendarEvent />
                            </span>
                            <span className={cx('text')}>
                                {profile?.dateOfBirth || 'Chưa cập nhật'}
                            </span>
                        </div>
                    </div>
                    <div className={cx('contact-info')}>
                        <span className={cx('title-small')}>
                            Thông tin liên hệ
                        </span>
                        <div className={cx('phone')}>
                            <span className={cx('icon')}>
                                <BsPhone />
                            </span>
                            <span className={cx('text')}>
                                {profile?.phoneNumber || 'Chưa cập nhật'}
                            </span>
                        </div>
                        <div className={cx('phone')}>
                            <span className={cx('icon')}>
                                <GoMail />
                            </span>
                            <span className={cx('text')}>{profile?.email}</span>
                        </div>
                        <div className={cx('phone')}>
                            <span className={cx('icon')}>
                                <MdOutlineLocationSearching />
                            </span>
                            <span className={cx('text')}>
                                {profile?.address || 'Chưa cập nhật'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cx('right')} onClick={handleOnClickOutside}>
                    <span className={cx('right-title')}>
                        Cập nhật thông tin
                    </span>
                    <form className={cx('update-user')}>
                        <div className={cx('left-form')}>
                            <div className={cx('username')}>
                                <label htmlFor="fullName">Họ tên</label>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        ref={fullNameRef}
                                        type="text"
                                        id="fullName"
                                        className={cx('input')}
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                    />
                                    {showValidateText && !fullName && (
                                        <span className={cx('validate')}>
                                            Trường này là bắt buộc!
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={cx('username', 'date-picker')}>
                                <label htmlFor="username">Ngày sinh</label>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        ref={dateOfBirthRef}
                                        type="text"
                                        id="username"
                                        readOnly
                                        className={cx('input')}
                                        value={dateOfBirth || ''}
                                        onChange={(e) =>
                                            setDateOfBirth(e.target.value)
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCalendar(!showCalendar);
                                        }}
                                    />
                                    {showValidateText && !dateOfBirth && (
                                        <span className={cx('validate')}>
                                            Trường này là bắt buộc!
                                        </span>
                                    )}
                                </div>
                                {showCalendar && (
                                    <div ref={calendarRef}>
                                        <Calendar
                                            className={cx('calendar')}
                                            onChange={(item) => {
                                                setDate(item);
                                                setShowCalendar(false);
                                                setDateOfBirth(
                                                    item.toLocaleDateString(),
                                                );
                                            }}
                                            maxDate={new Date()}
                                            locale={locales['vi']}
                                            date={date}
                                            focusedInput={showCalendar}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={cx('username')}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    disabled
                                    className={cx('input')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={cx('username')}>
                                <label htmlFor="phone">Điện thoại</label>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        ref={phoneRef}
                                        type="text"
                                        id="phone"
                                        className={cx('input')}
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                    {showValidateText && !phoneNumber && (
                                        <span className={cx('validate')}>
                                            Trường này là bắt buộc!
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={cx('username')}>
                                <label htmlFor="address">Địa chỉ</label>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        ref={addressRef}
                                        type="text"
                                        id="address"
                                        className={cx('input')}
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                    />
                                    {showValidateText && !address && (
                                        <span className={cx('validate')}>
                                            Trường này là bắt buộc!
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={cx('right-form')}>
                            <div className={cx('top-right-form')}>
                                <label htmlFor="file">
                                    <img
                                        src={
                                            file.length
                                                ? file
                                                : profile?.profilePicture
                                                ? `${HOST_NAME}${profile.profilePicture}`
                                                : images.defaultAvt
                                        }
                                        alt="avatar"
                                        className={cx('upload-img')}
                                    />
                                    <BsUpload className={cx('upload-icon')} />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    style={{ display: 'none' }}
                                    onChange={handleChangeImage}
                                />
                            </div>
                            <button
                                className={cx('update-btn')}
                                onClick={handleUpdateUser}
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfileUser;
