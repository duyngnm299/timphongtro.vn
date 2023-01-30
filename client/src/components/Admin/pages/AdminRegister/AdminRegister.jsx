import React from 'react';
import classNames from 'classnames/bind';
import styles from './AdminRegister.module.scss';
import Button from '~/components/Button';

import { FiLock } from 'react-icons/fi';
import { AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { useState } from 'react';
import { VscVerified } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { adminLogin, adminRegister } from '~/api';
import { IoCloseOutline } from 'react-icons/io5';
import Loading from '~/components/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { sendMail, deletedUser, verifyEmail } from '~/api';
import { adminLoginSuccess } from '~/redux/slice/adminSlice';
import images from '~/assets/images';

const cx = classNames.bind(styles);
function AdminRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState('');
    const [emailValidate, setEmailValidate] = useState('');
    const [usernameValidate, setUsernameValidate] = useState('');
    const [passwordValidate, setPasswordValidate] = useState('');
    const [confirmPwValidate, setConfirmPwValidate] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');

    const err = useSelector((state) => state.auth.register.error);
    const validateEmail = (em) => {
        return String(em)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    };
    const handleClickVerify = async () => {
        if (verifyCode.length > 0) {
            const data = JSON.stringify({ otp: verifyCode });
            const res = await verifyEmail(currentUserId, data);
            console.log(res.newUser);
            const user = {
                username: username,
                password: password,
            };

            adminLogin(user)
                .then((res) => {
                    console.log(res);
                    dispatch(adminLoginSuccess(res));
                })
                .catch((err) => console.log(err));

            if (res?.newUser?.isVerify) {
                setShowModal(false);
                alert(
                    'Đăng kí thành công!',
                    'success',
                    'Vui lòng cập nhật thông tin cá nhân của bạn!',
                );
                return;
            }
            setShowAlert(true);
        }
    };
    const handleRegister = async (e) => {
        setVerifyCode('');
        e.preventDefault();
        if (!username && !email && !password && !rePassword) {
            setUsernameValidate('Trường này là bắt buộc!');
            setEmailValidate('Trường này là bắt buộc!');
            setPasswordValidate('Trường này là bắt buộc!');
            setConfirmPwValidate('Trường này là bắt buộc!');
            return;
        }
        if (!username) {
            setUsernameValidate('Trường này là bắt buộc!');
            return;
        }
        if (!email) {
            setEmailValidate('Trường này là bắt buộc!');
            return;
        }
        if (!password) {
            setPasswordValidate('Trường này là bắt buộc!');
            return;
        }
        if (!rePassword) {
            setConfirmPwValidate('Trường này là bắt buộc!');
            return;
        }
        if (password !== rePassword) {
            setConfirmPwValidate('Mật khẩu không khớp!');
            return;
        }
        if (username.length < 8) {
            setUsernameValidate('Tên tài khoản phải có ít nhất 8 kí tự!');
            return;
        }
        if (password.length < 8) {
            setPasswordValidate('Tên tài khoản phải có ít nhất 8 kí tự!');
            return;
        }
        const validate = validateEmail(email);
        if (!validate) {
            setEmailValidate('Vui lòng nhập đúng định dạng Email!');
            return;
        }
        if (password === rePassword) {
            setMessage(true);

            const newUser = {
                username: username,
                email: email,
                password: password,
            };
            try {
                setLoading(true);
                const res = await adminRegister(newUser);
                if (
                    res?.response?.data === 'Username existed!' ||
                    res?.response?.data === 'Email existed!'
                ) {
                    setLoading(false);
                    alert(
                        'Đăng kí thất bại!',
                        'error',
                        res?.response?.data === 'Username existed!'
                            ? 'Tài khoản đã tồn tại, vui lòng nhập tên tài khoản khác!'
                            : 'Email đã tồn tại trên hệ thống!',
                    );
                    return;
                }
                setCurrentUserId(res.user?._id);
                setLoading(false);
                setShowModal(true);
                await sendMail(res.user?._id);
            } catch (error) {
                setLoading(false);
                console.log(error);
                if (
                    error?.response?.data === 'Username existed!' ||
                    error?.response?.data === 'Email existed!'
                ) {
                    alert(
                        'Đăng kí thất bại!',
                        'error',
                        error?.response?.data === 'Username existed!'
                            ? 'Tài khoản đã tồn tại, vui lòng nhập tên tài khoản khác!'
                            : 'Email đã tồn tại trên hệ thống!',
                    );
                    return;
                }
            }
        }
    };

    const alert = (title, type, text) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${text}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed) {
                type === 'success' && navigate(config.routes.admin);
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        deletedUser(currentUserId).then((res) => console.log(res));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content-wrapper')}>
                <div className={cx('content')}>
                    <div className={cx('picture')}>
                        <div className={cx('logo')}>
                            <img
                                src={images.logo}
                                alt="logo"
                                className={cx('logo-img')}
                            />
                        </div>
                        <div className={cx('img-below')}>
                            <img
                                src={images.imgLogin}
                                alt="imgLogin"
                                className={cx('imgLogin')}
                            />
                        </div>
                        <span className={cx('text-login')}>
                            Timphongtro.vn dẫn lối
                        </span>
                    </div>
                    <div className={cx('register')}>
                        <h4 className={cx('welcome')}>Xin chào bạn</h4>
                        <h1 className={cx('title')}>Đăng ký tài khoản mới</h1>
                        <form
                            className={cx('form-register')}
                            onSubmit={handleRegister}
                        >
                            <div className={cx('input-register-wrapper')}>
                                <div className={cx('input-icon-register')}>
                                    <AiOutlineUser />
                                </div>
                                <input
                                    className={cx(
                                        'input-register',
                                        err &&
                                            !username &&
                                            message &&
                                            'invalid',
                                    )}
                                    type="text"
                                    placeholder="Nhập tên tài khoản"
                                    pattern="[^' ']+"
                                    value={username}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setUsernameValidate('');
                                    }}
                                />
                            </div>

                            {usernameValidate && (
                                <span className={cx('message')}>
                                    {usernameValidate}
                                </span>
                            )}

                            <div className={cx('input-register-wrapper')}>
                                <div
                                    className={cx(
                                        'input-icon-register',
                                        'email',
                                    )}
                                >
                                    <AiOutlineMail />
                                </div>
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailValidate('');
                                    }}
                                    className={cx(
                                        'input-register',
                                        err && !email && message && 'invalid',
                                    )}
                                    type="text"
                                    placeholder="Nhập email"
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            {emailValidate && (
                                <span className={cx('message')}>
                                    {emailValidate}
                                </span>
                            )}
                            <div className={cx('input-register-wrapper')}>
                                <div className={cx('input-icon-register')}>
                                    <FiLock />
                                </div>
                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordValidate('');
                                    }}
                                    className={cx(
                                        'input-register',
                                        err &&
                                            !password &&
                                            message &&
                                            'invalid',
                                    )}
                                    type="password"
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                            {passwordValidate && (
                                <span className={cx('message')}>
                                    {passwordValidate}
                                </span>
                            )}

                            <div className={cx('input-register-wrapper')}>
                                <div className={cx('input-icon-register')}>
                                    <VscVerified />
                                </div>
                                <input
                                    value={rePassword}
                                    onChange={(e) => {
                                        setRePassword(e.target.value);
                                        setConfirmPwValidate('');
                                    }}
                                    className={cx(
                                        'input-register',
                                        err &&
                                            !rePassword &&
                                            message &&
                                            'invalid',
                                    )}
                                    type="password"
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="Xác nhận mật khẩu"
                                />
                            </div>
                            {confirmPwValidate && (
                                <span className={cx('message')}>
                                    {confirmPwValidate}
                                </span>
                            )}
                            <Button
                                type="submit"
                                primary
                                className={cx('register-btn')}
                            >
                                Đăng ký
                            </Button>
                        </form>
                        <div className={cx('or-register')}>
                            <div className={cx('line')}></div>
                            <div className={cx('or-text')}>
                                <div className={cx('text')}>Hoặc</div>
                            </div>
                        </div>

                        <div className={cx('register-text')}>
                            <span className={cx('nm-text')}>
                                Bạn đã có tài khoản?{' '}
                                <Link to={config.routes.adminLogin}>
                                    <span className={cx('hl-text')}>
                                        Đăng nhập
                                    </span>{' '}
                                </Link>
                                tại đây
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal verify email */}
            {loading && <Loading />}
            {showModal && (
                <div className={cx('modal')}>
                    <div
                        className={cx('modal-content')}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={cx('modal-header')}>
                            <p className={cx('title-header')}>Xác thực email</p>
                            <IoCloseOutline
                                className={cx('close')}
                                onClick={handleCloseModal}
                            />
                        </div>
                        <div className={cx('modal-content-container')}>
                            <div className={cx('ct-container')}>
                                <div className={cx('sub-title')}>
                                    <p className={cx('sub-title-text')}>
                                        Mã xác thực đã được gửi vào email của
                                        bạn. Vui lòng kiểm tra email và nhập mã
                                        xác thực vào ô bên dưới!
                                    </p>
                                </div>
                                <div className={cx('verify-container')}>
                                    <label
                                        htmlFor="ip"
                                        className={cx('label-verify')}
                                    >
                                        Nhập mã xác thực
                                    </label>
                                    <input
                                        value={verifyCode}
                                        id="ip"
                                        type="text"
                                        className={cx('input-verify')}
                                        placeholder="Nhập mã xác thực"
                                        onChange={(e) =>
                                            setVerifyCode(e.target.value)
                                        }
                                    />
                                    {showAlert && (
                                        <span className={cx('validate')}>
                                            Mã xác thực chưa chính xác.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={cx('footer')}>
                            <button
                                className={cx('btn-verify-modal')}
                                onClick={handleClickVerify}
                            >
                                Xác thực Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminRegister;
