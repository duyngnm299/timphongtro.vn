import classNames from 'classnames/bind';
import { useState, useRef } from 'react';
import { updatePassword } from '~/api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Password.module.scss';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { logOutSuccess } from '~/redux/slice/authSlice';

const cx = classNames.bind(styles);
function Password() {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showNotify, setShowNotify] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [textNotify, setTextNotify] = useState('');
    const [oldPwNotify, setOutPwNotify] = useState('');
    const [lengthPwNtf, setLengthPwNtf] = useState('');
    const handleSubmit = () => {
        if (!oldPassword) {
            setShowNotify(true);
            oldRef.current.focus();
            return;
        }
        if (!newPassword) {
            setShowNotify(true);
            newRef.current.focus();

            return;
        }
        if (!confirmPassword) {
            setShowNotify(true);
            confirmRef.current.focus();
            return;
        }
        if (newPassword.length < 8) {
            setShowNotify(true);
            newRef.current.focus();
            setLengthPwNtf('Mật khẩu phải có ít nhất 8 kí tự!');
            return;
        }
        if (newPassword !== confirmPassword) {
            setTextNotify('Mật khẩu không khớp!');
            confirmRef.current.focus();
            setShowNotify(true);
            return;
        }
        setShowNotify(false);
        setOutPwNotify('');
        setTextNotify('');
        setLengthPwNtf('');
        const data = {
            oldPassword,
            newPassword,
        };
        currentUser &&
            updatePassword(currentUser._id, data)
                .then((res) => {
                    console.log(res);
                    if (!res.user) {
                        alert(
                            'Mật khẩu cũ không chính xác!',
                            'error',
                            'Vui lòng nhập lại mật khẩu!',
                        );
                        return;
                    }
                    alert(
                        'Đổi mật khẩu thành công!',
                        'success',
                        'Vui lòng đăng nhập lại!',
                    );
                })
                .catch((err) => console.log(err));
    };
    const oldRef = useRef();
    const newRef = useRef();
    const confirmRef = useRef();
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
                dispatch(logOutSuccess());
                navigate('/dang-nhap');
            }
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('heading')}>
                    <h4 className={cx('heading-text')}>thay đổi mật khẩu</h4>
                </div>
                <span className={cx('text')}>
                    Nếu bạn quên mật khẩu hoặc đăng nhập bằng Google mà không
                    cần đăng ký thì hãy thoát khỏi tài khoản, sau đó sử dụng
                    chức năng quên mật khẩu để lấy mật khẩu hiện tại.{' '}
                </span>
                <div className={cx('change-password')}>
                    <div className={cx('old-pw')}>
                        <label htmlFor="old" className={cx('label')}>
                            Mật khẩu cũ
                        </label>
                        <div className={cx('input-container')}>
                            <input
                                ref={oldRef}
                                id="old"
                                type="password"
                                className={cx('input')}
                                placeholder="Nhập mật khẩu cũ"
                                autoComplete="off"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />

                            <span className={cx('notify-text')}>
                                {showNotify && !oldPassword
                                    ? 'Cần phải nhập trường này!'
                                    : oldPwNotify
                                    ? oldPwNotify
                                    : ''}
                            </span>
                        </div>
                    </div>
                    <div className={cx('new-pw')}>
                        <label htmlFor="new" className={cx('label')}>
                            Mật khẩu mới
                        </label>
                        <div className={cx('input-container')}>
                            <input
                                ref={newRef}
                                id="new"
                                type="password"
                                className={cx('input')}
                                placeholder="Nhập mật khẩu mới"
                                autoComplete="off"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span className={cx('notify-text')}>
                                {showNotify && !newPassword
                                    ? 'Cần phải nhập trường này!'
                                    : lengthPwNtf
                                    ? lengthPwNtf
                                    : ''}
                            </span>
                        </div>
                    </div>
                    <div className={cx('confirm-pw')}>
                        <label htmlFor="confirm" className={cx('label')}>
                            Xác nhận mật khẩu
                        </label>
                        <div className={cx('input-container')}>
                            <input
                                ref={confirmRef}
                                id="confirm"
                                type="password"
                                className={cx('input')}
                                placeholder="Xác nhận mật khẩu"
                                autoComplete="off"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <span className={cx('notify-text')}>
                                {showNotify && !confirmPassword
                                    ? 'Cần phải nhập trường này!'
                                    : textNotify
                                    ? textNotify
                                    : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cx('submit')}>
                    <button className={cx('submit-btn')} onClick={handleSubmit}>
                        Lưu lại
                    </button>
                    <span className={cx('text-note')}>
                        Chú ý: Bạn cần phải đăng nhập lại sau khi đổi mật khẩu
                        thành công{' '}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Password;
