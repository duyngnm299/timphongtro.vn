import classNames from 'classnames/bind';
import styles from './AdminForgotPassword.module.scss';
import { IoMdArrowBack } from 'react-icons/io';
import Button from '~/components/Button';
import { Link } from 'react-router-dom';
import config from '~/config';
import { useState } from 'react';
import { getUserByEmail, sendMail, updatePassword, verifyEmail } from '~/api';
import Loading from '~/components/Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
const cx = classNames.bind(styles);

function AdminForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [textValidate, setTextValidate] = useState('');
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [sendCode, setSendCode] = useState(false);
    const [showFormMessage, setShowFormMessage] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPwValidate, setNewPwValidate] = useState('');
    const [confirmPwValidate, setConfirmPwValidate] = useState('');

    console.log(textValidate);
    const validateEmail = (em) => {
        return String(em)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );
    };
    console.log(showFormMessage);
    const handleSubmit = () => {
        const validate = validateEmail(email);
        if (!email) {
            setTextValidate('Cần phải nhập trường này!');
            return;
        }
        if (!validate) {
            setTextValidate('Vui lòng nhập đúng định dạng email!');
            return;
        }
        setLoading(true);
        getUserByEmail(email).then((res) => {
            if (!res.user.length) {
                const timerId = setTimeout(() => {
                    setLoading(false);
                    setTextValidate('Email không tồn tại!');
                }, 500);
                return () => clearInterval(timerId);
            }
            console.log(res.user[0]);
            const timerId = setTimeout(() => {
                setLoading(false);
                setUser(res.user[0]);
                sendMail(res.user[0]._id).then((res) => console.log(res));
                setSendCode(true);
            }, 500);
            return () => clearInterval(timerId);
        });
        setTextValidate('');
    };

    const handleSendCode = () => {
        if (!code) {
            setTextValidate('Cần phải nhập trường này!');
            return;
        }
        const data = {
            otp: code,
        };
        setLoading(true);
        verifyEmail(user._id, data).then((res) => {
            if (!res.newUser) {
                const timerId = setTimeout(() => {
                    setLoading(false);
                    setTextValidate('Mã xác nhận không chính xác!');
                }, 500);
                return () => clearInterval(timerId);
            }

            const timerId = setTimeout(() => {
                setLoading(false);
                setTextValidate('');
                setSendCode(false);
                setShowFormMessage(true);
            }, 500);
            return () => clearInterval(timerId);
        });
    };

    const handleChangePassword = () => {
        if (!newPassword) {
            setNewPwValidate('Cần phải nhập trường này');
            return;
        }

        if (!confirmPassword) {
            setConfirmPwValidate('Cần phải nhập trường này');
            return;
        }
        if (newPassword.length < 8) {
            setNewPwValidate('Mật khẩu phải có ít nhất 8 kí tự!');
            return;
        }
        if (newPassword !== confirmPassword) {
            setConfirmPwValidate('Mật khẩu không khớp!');
            return;
        }
        setLoading(true);
        const data = { newPassword: newPassword };
        updatePassword(user._id, data).then((res) => {
            const timerId = setTimeout(() => {
                setLoading(false);
                alert(
                    'Thay đổi mật khẩu thành công!',
                    'success',
                    'Vui lòng đăng nhập lại!',
                );
            }, 500);
            return () => clearInterval(timerId);
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
        }).then((result) => {
            if (result.isConfirmed && type === 'success') {
                navigate(config.routes.adminLogin);
            }
        });
    };
    const handleBack = (i) => {
        console.log(i);
        switch (i) {
            case 0:
                setSendCode(false);
                return;
            case 1:
                setShowFormMessage(false);
                setSendCode(true);
                return;
            case 2:
                navigate(config.routes.adminLogin);
                return;
            default:
                break;
        }
    };

    const handleResendCode = () => {
        sendMail(user._id).then((res) => console.log(res));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content-wrapper')}>
                <div className={cx('content')}>
                    {loading && <Loading />}

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

                    <div className={cx('forgot-container')}>
                        <div className={cx('forgot-password')}>
                            {sendCode ? (
                                <>
                                    <div className={cx('back-btn')}>
                                        <IoMdArrowBack
                                            onClick={() => handleBack(0)}
                                            className={cx('back-icon')}
                                        />
                                    </div>{' '}
                                    <h4 className={cx('forget-title')}>
                                        Mã xác nhận đã được gửi. Vui lòng kiểm
                                        tra email của bạn
                                    </h4>
                                    <div className={cx('resend-code')}>
                                        <h4 className={cx('forget-text')}>
                                            Nhập mã xác nhận
                                        </h4>
                                        <h4
                                            className={cx('resend-code-text')}
                                            onClick={handleResendCode}
                                        >
                                            Gửi lại mã
                                        </h4>
                                    </div>
                                    <div
                                        className={cx('input-register-wrapper')}
                                    >
                                        <input
                                            className={cx('input-register')}
                                            type="number"
                                            placeholder="Nhập mã xác nhận"
                                            value={code}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={(e) => {
                                                setCode(e.target.value);
                                                setTextValidate('');
                                            }}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.code === 'Space') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        {textValidate && (
                                            <span className={cx('validate')}>
                                                {textValidate}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        primary
                                        className={cx('send-btn')}
                                        onClick={handleSendCode}
                                    >
                                        Gửi mã xác nhận
                                    </Button>
                                </>
                            ) : showFormMessage ? (
                                <>
                                    <div className={cx('back-btn')}>
                                        <IoMdArrowBack
                                            onClick={() => handleBack(1)}
                                            className={cx('back-icon')}
                                        />
                                    </div>
                                    <h4 className={cx('forget-text')}>
                                        Thay đổi mật khẩu
                                    </h4>
                                    <div
                                        className={cx('input-register-wrapper')}
                                    >
                                        <input
                                            className={cx('input-register')}
                                            type="password"
                                            placeholder="Nhập mật khẩu mới"
                                            value={newPassword}
                                            onKeyDown={(e) => {
                                                if (e.code === 'Space') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setNewPwValidate('');
                                            }}
                                        />
                                        {newPwValidate && (
                                            <span className={cx('validate')}>
                                                {newPwValidate}
                                            </span>
                                        )}
                                    </div>
                                    <div
                                        className={cx('input-register-wrapper')}
                                    >
                                        <input
                                            className={cx('input-register')}
                                            type="password"
                                            placeholder="Xác nhận mật khẩu"
                                            value={confirmPassword}
                                            onKeyDown={(e) => {
                                                if (e.code === 'Space') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setConfirmPassword(
                                                    e.target.value,
                                                );
                                                setConfirmPwValidate('');
                                            }}
                                        />
                                        {confirmPwValidate && (
                                            <span className={cx('validate')}>
                                                {confirmPwValidate}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        primary
                                        className={cx('send-btn')}
                                        onClick={handleChangePassword}
                                    >
                                        Thay đổi mật khẩu
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className={cx('back-btn')}>
                                        <IoMdArrowBack
                                            onClick={() => handleBack(2)}
                                            className={cx('back-icon')}
                                        />
                                    </div>
                                    <h4 className={cx('forget-text')}>
                                        Khôi phục mật khẩu
                                    </h4>
                                    <div
                                        className={cx('input-register-wrapper')}
                                    >
                                        <input
                                            className={cx('input-register')}
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            value={email}
                                            onKeyDown={(e) => {
                                                if (e.code === 'Space') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setTextValidate('');
                                            }}
                                        />
                                        {textValidate && (
                                            <span className={cx('validate')}>
                                                {textValidate}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        primary
                                        className={cx('send-btn')}
                                        onClick={handleSubmit}
                                    >
                                        Gửi mã xác nhận
                                    </Button>
                                </>
                            )}
                        </div>
                        <div className={cx('login-text')}>
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
        </div>
    );
}

export default AdminForgotPassword;
