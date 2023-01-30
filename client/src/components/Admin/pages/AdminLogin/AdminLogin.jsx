import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminLogin.module.scss';
import Button from '~/components/Button';
import config from '~/config';
import { FiLock } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { adminLogin } from '~/api';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { adminLoginSuccess } from '~/redux/slice/adminSlice';
import images from '~/assets/images';
// import GoogleLogin from 'react-google-login';
const cx = classNames.bind(styles);

function AdminLogin() {
    const rmbUsername = useSelector(
        (state) => state.auth.rememberAccount?.username,
    );
    const rmbPassword = useSelector(
        (state) => state.auth.rememberAccount?.password,
    );

    const [username, setUsername] = useState(rmbUsername ? rmbUsername : '');
    const [password, setPassword] = useState(rmbPassword ? rmbPassword : '');
    const [message, setMessage] = useState(false);
    const [rememberChecked, setRememberChecked] = useState(
        rmbUsername ? true : false,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUsernameChange = (value) => {
        setUsername(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: username,
            password: password,
        };
        if (!username || !password || password.length < 8) {
            setMessage(true);
            return;
        }
        try {
            adminLogin(user).then((res) => {
                if (res?.response?.data?.message === "User don't exist!") {
                    alert(
                        'Đăng nhập thất bại',
                        'error',
                        'Tên tài khoản không tồn tại!',
                    );
                    return;
                }
                if (res?.response?.data?.message === 'Incorrect password!') {
                    alert(
                        'Đăng nhập thất bại',
                        'error',
                        'Mật khẩu không chính xác',
                    );
                    return;
                }
                if (res?.response?.data?.message === 'You are not an admin') {
                    alert(
                        'Đăng nhập thất bại',
                        'error',
                        'Bạn không phải là quản trị viên!',
                    );
                    return;
                }
                console.log(res);
                alert(
                    'Đăng nhập thành công',
                    'success',
                    `Chào mừng ${username} đến với website Timphongtro.vn!`,
                );
                dispatch(adminLoginSuccess(res));
                // if (rememberChecked) {
                //     dispatch(rememberAccount([username, password]));
                // } else {
                //     dispatch(rememberAccount());
                // }
            });
        } catch (error) {
            // console.log(error.response.data.message);
        }
    }
    // Alert Success
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
                navigate(config.routes.admin);
            }
        });
    };

    const handleRememberAccount = () => {
        setRememberChecked(!rememberChecked);
    };
    console.log(rememberChecked);
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

                    <div className={cx('auth')}>
                        <h4 className={cx('welcome')}>Trang đăng nhập</h4>
                        <h1 className={cx('title')}>Dành cho quản trị viên</h1>
                        <form className="form-login">
                            <div className={cx('input-wrapper')}>
                                <div className={cx('input-icon')}>
                                    <AiOutlineUser />
                                </div>
                                <input
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    value={username}
                                    className={cx(
                                        'input',
                                        !username && message && 'invalid',
                                    )}
                                    type="text"
                                    placeholder="Tên tài khoản hoặc email"
                                    onChange={(e) => {
                                        handleUsernameChange(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={cx('input-wrapper')}>
                                <div className={cx('input-icon')}>
                                    <FiLock />
                                </div>
                                <input
                                    value={password}
                                    className={cx(
                                        'input',
                                        !password && message && 'invalid',
                                    )}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Space') {
                                            e.preventDefault();
                                        }
                                    }}
                                    type="password"
                                    placeholder="Mật khẩu"
                                    onChange={(e) => {
                                        handlePasswordChange(e.target.value);
                                    }}
                                />
                            </div>
                            {message && (
                                <span className={cx('message')}>
                                    {!username || !password
                                        ? 'Tài khoản hoặc mật khẩu không được để trống!'
                                        : password.length > 0 &&
                                          password.length < 8
                                        ? 'Mật khẩu phải có ít nhất 8 kí tự'
                                        : ''}
                                </span>
                            )}
                            <Button
                                type="submit"
                                primary
                                className={cx('login-btn')}
                                onClick={handleSubmit}
                            >
                                Đăng nhập
                            </Button>
                        </form>
                        <div className={cx('remember-forgot')}>
                            <div className={cx('remember')}>
                                <input
                                    className={cx('checkbox')}
                                    type="checkbox"
                                    name="rememberAccount"
                                    id="rememberAccount"
                                    checked={rememberChecked}
                                    onChange={handleRememberAccount}
                                />
                                <label
                                    htmlFor="rememberAccount"
                                    className={cx('remember-text')}
                                >
                                    Nhớ tài khoản
                                </label>
                            </div>
                            <Link to={config.routes.adminForgotPassword}>
                                <div className={cx('forgot')}>
                                    <span className={cx('forgot-text')}>
                                        Quên mật khẩu?
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className={cx('or')}>
                            <div className={cx('line')}></div>
                            <div className={cx('or-text')}>
                                <div className={cx('text')}>Hoặc</div>
                            </div>
                        </div>

                        <div className={cx('register-text')}>
                            <span className={cx('nm-text')}>
                                Chưa có tài khoản?
                                <Link to={config.routes.adminRegister}>
                                    <span className={cx('hl-text')}>
                                        {' '}
                                        Đăng ký{' '}
                                    </span>
                                </Link>
                                tại đây
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
