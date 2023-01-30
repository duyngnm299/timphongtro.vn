import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import Button from '~/components/Button';
import config from '~/config';
import { FiLock } from 'react-icons/fi';
import { AiOutlineUser } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { signIn, signInGoogle } from '~/api';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    rememberAccount,
} from '~/redux/slice/authSlice';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import images from '~/assets/images';
import Footer from '~/layouts/components/Footer';
// import GoogleLogin from 'react-google-login';
const cx = classNames.bind(styles);

function Login() {
    // Login
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const googleUsername = currentUser?.fullName;
    const rmbUsername = useSelector(
        (state) => state.auth.rememberAccount?.username,
    );
    const rmbPassword = useSelector(
        (state) => state.auth.rememberAccount?.password,
    );

    const [username, setUsername] = useState(rmbUsername ? rmbUsername : '');
    const [password, setPassword] = useState(rmbPassword ? rmbPassword : '');
    const [message, setMessage] = useState(false);
    const [showSuccessNotify, setShowSuccessNotify] = useState(false);
    const [showErrorNotify, setShowErrorNotify] = useState(false);
    const [rememberChecked, setRememberChecked] = useState(
        rmbUsername ? true : false,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const err = useSelector((state) => state.auth.login.error);

    const handleUsernameChange = (value) => {
        setUsername(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    function handleGoogleLoginSuccess(tokenResponse) {
        const accessToken = tokenResponse.access_token;
        // signInGoogle(accessToken, navigate, dispatch);
        dispatch(loginStart());
        signInGoogle(accessToken)
            .then((res) => {
                setShowSuccessNotify(true);
                dispatch(loginSuccess(res.data));
            })
            .catch((error) => {
                console.log(error?.response?.data?.message);
                dispatch(loginFailed(error?.response?.data?.message));
            });
    }

    const login = useGoogleLogin({ onSuccess: handleGoogleLoginSuccess });

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
        dispatch(loginStart());
        try {
            signIn(user)
                .then((res) => {
                    setShowErrorNotify(false);
                    setShowSuccessNotify(true);
                    dispatch(loginSuccess(res.data));
                    if (rememberChecked) {
                        dispatch(rememberAccount([username, password]));
                    } else {
                        dispatch(rememberAccount());
                    }
                })
                .catch((error) => {
                    console.log(error?.response?.data?.message);
                    if (
                        error.response.data.message === "User don't exist!" ||
                        error.response.data.message === 'Incorrect password!'
                    ) {
                        setShowErrorNotify(true);
                    }
                    setShowSuccessNotify(false);
                    dispatch(loginFailed(error?.response?.data?.message));
                });
        } catch (error) {
            // console.log(error.response.data.message);
        }
    }
    // Alert Success
    showSuccessNotify &&
        Swal.fire({
            title: '<h2 class="notify-title">Đăng nhập thành công!</h2>',
            icon: 'success',
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">Chào mừng ${
                googleUsername ? googleUsername : username
            } đến với website Timphongtro.vn</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: '#a5dc86',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/');
            }
        });
    // Alert Error
    let msg = '';
    if (err === "User don't exist!") {
        msg = 'Tài khoản không tồn tại!';
    } else if ('Incorrect password!') {
        msg = 'Mật khẩu không chính xác!';
    }

    showErrorNotify &&
        Swal.fire({
            title: '<h2 class="notify-title">Đăng nhập thất bại!</h2>',
            icon: 'error',
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${msg}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed) {
                setShowErrorNotify(false);
            }
        });
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
                        <h4 className={cx('welcome')}>Xin chào bạn</h4>
                        <h1 className={cx('title')}>Đăng nhập để tiếp tục</h1>
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
                            <Link to={config.routes.forgotPassword}>
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
                        <div
                            className={cx('login-with-google')}
                            onClick={() => login()}
                        >
                            <FcGoogle className={cx('google-icon')} />
                            <span className={cx('google-text')}>
                                Đăng nhập với Google
                            </span>
                        </div>
                        <div className={cx('register-text')}>
                            <span className={cx('nm-text')}>
                                Chưa là thành viên?
                                <Link to={config.routes.register}>
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
            <Footer />
        </div>
    );
}

export default Login;
