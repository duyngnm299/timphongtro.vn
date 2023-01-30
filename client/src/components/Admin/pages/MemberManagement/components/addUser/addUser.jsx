/* eslint-disable react-hooks/rules-of-hooks */
import classNames from 'classnames/bind';
import styles from './addUser.module.scss';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as locales from 'react-date-range/dist/locale';
import { Calendar } from 'react-date-range';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useState } from 'react';
import { useRef } from 'react';
import { signUp } from '~/api';
import { useDispatch } from 'react-redux';
import { currentMenu } from '~/redux/slice/adminSlice';
const cx = classNames.bind(styles);

function addUser() {
    const dispatch = useDispatch();
    const [showCalendar, setShowCalendar] = useState(false);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [date, setDate] = useState(new Date());
    console.log(gender);
    const calendarRef = useRef();
    const usernameRef = useRef();
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneNumberRef = useRef();
    const addressRef = useRef();
    const genderRef = useRef();
    const dateOfBirthRef = useRef();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !username ||
            !fullName ||
            !email ||
            !password ||
            !phoneNumber ||
            !address ||
            !gender ||
            !dateOfBirth
        ) {
            alert(
                'Thêm thành viên thất bại',
                'error',
                'Vui lòng nhập đầy đủ thông tin!',
            );
        }
        if (!username) {
            usernameRef.current.focus();
            return;
        }
        if (!fullName) {
            fullNameRef.current.focus();
            return;
        }
        if (!email) {
            emailRef.current.focus();
            return;
        }
        if (!password) {
            passwordRef.current.focus();
            return;
        }
        if (password.length < 8) {
            alert(
                'Thêm thành viên thất bại',
                'error',
                'Mật khẩu phải có ít nhất 8 kí tự!',
            );
            passwordRef.current.focus();
            return;
        }

        if (!phoneNumber) {
            usernameRef.current.focus();
            return;
        }
        if (!address) {
            usernameRef.current.focus();
            return;
        }
        if (!gender) {
            usernameRef.current.focus();
            return;
        }
        if (!dateOfBirth) {
            usernameRef.current.focus();
            return;
        }
        const user = {
            username,
            fullName,
            email,
            password,
            phoneNumber,
            address,
            gender,
            dateOfBirth,
        };
        try {
            const res = await signUp(user);
            if (res.data.user) {
                alert('Thêm thành viên thành công', 'success', '');
                return;
            }
        } catch (error) {
            console.log(error.response.data);
            if (error.response.data === 'Username existed!') {
                usernameRef.current.focus();
                alert(
                    'Thêm thành viên thất bại!',
                    'error',
                    'Tên tài khoản đã tồn tại!',
                );
                return;
            }
            if (error.response.data === 'Email existed!') {
                emailRef.current.focus();
                alert(
                    'Thêm thành viên thất bại!',
                    'error',
                    'Email đã tồn tại!',
                );
                return;
            }
        }
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
        }).then((result) => {
            if (result.isConfirmed && type === 'success') {
                dispatch(currentMenu('list-user'));
            }
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
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h1 className={cx('title')}>Thêm thành viên</h1>
                <form
                    className={cx('form-add-user')}
                    onClick={handleOnClickOutside}
                >
                    <div className={cx('form-group-wrapper')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="username">Tên tài khoản</label>
                            <input
                                ref={usernameRef}
                                id="username"
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập tên tài khoản"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="fullName">Họ tên</label>
                            <input
                                ref={fullNameRef}
                                id="fullName"
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập họ tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('form-group-wrapper')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                className={cx('input')}
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="password">Mật Khẩu</label>
                            <input
                                ref={passwordRef}
                                id="password"
                                type="password"
                                className={cx('input')}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('form-group-wrapper')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="phone">Điện thoại</label>
                            <input
                                ref={phoneNumberRef}
                                id="phone"
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập số điện thoại"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="address">Địa chỉ</label>
                            <input
                                ref={addressRef}
                                id="address"
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('form-group-wrapper')}>
                        <div className={cx('form-group')} ref={genderRef}>
                            <label>Giới tính</label>
                            <div className={cx('input-wrapper')}>
                                <div className={cx('male-radio')}>
                                    <input
                                        id="male"
                                        type="radio"
                                        className={cx('input')}
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                    />
                                    <label
                                        htmlFor="male"
                                        className={cx('label-radio')}
                                    >
                                        Nam
                                    </label>
                                </div>
                                <div className={cx('female-radio')}>
                                    <input
                                        id="female"
                                        type="radio"
                                        className={cx('input')}
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                    />
                                    <label
                                        htmlFor="female"
                                        className={cx('label-radio')}
                                    >
                                        Nữ
                                    </label>
                                </div>
                                <div className={cx('diff-radio')}>
                                    <input
                                        id="diff"
                                        type="radio"
                                        className={cx('input')}
                                        value="diff"
                                        checked={gender === 'diff'}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                    />
                                    <label
                                        htmlFor="diff"
                                        className={cx('label-radio')}
                                    >
                                        Khác
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={cx('form-group', 'date-picker')}>
                            <label htmlFor="birthday">Ngày sinh</label>
                            <input
                                ref={dateOfBirthRef}
                                id="birthday"
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập ngày sinh"
                                value={dateOfBirth}
                                readOnly
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCalendar(!showCalendar);
                                }}
                            />
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
                    </div>
                    <div className={cx('submit')}>
                        <button
                            className={cx('btn-submit')}
                            onClick={handleSubmit}
                            type="submit"
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default addUser;
