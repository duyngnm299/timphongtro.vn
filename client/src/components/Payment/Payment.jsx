import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Payment.module.scss';
import { IoCloseOutline } from 'react-icons/io5';
import Loading from '../Loading';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import {
    sendMail,
    deletedUser,
    verifyEmail,
    updateUser,
    createTransaction,
} from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { updatedUser } from '~/redux/slice/authSlice';
const cx = classNames.bind(styles);
function Payment() {
    const crUser = useSelector((state) => state.auth.login?.currentUser?.user);
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [notifyText, setNotifyText] = useState('');
    const [showNotifyText, setShowNotifyText] = useState(false);
    const alert = (title, type, text, id) => {
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
            }
        });
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleContinue = async () => {
        if (!amount) {
            setNotifyText('Trường này là bắt buộc!');
            setShowNotifyText(true);
            return;
        }
        if (amount < 100000) {
            setNotifyText('Số tiền nạp vào phải ít nhất 100.000 VND');
            setShowNotifyText(true);
            return;
        }
        setShowNotifyText(false);
        setShowModal(true);
        setVerifyCode('');
        await sendMail(crUser?._id);
    };
    const handleClickVerify = async () => {
        if (verifyCode.length > 0) {
            const data = JSON.stringify({ otp: verifyCode });
            const res = await verifyEmail(crUser?._id, data);
            if (res?.newUser?.isVerify) {
                console.log(udtUser?.balance);
                console.log(parseInt(amount));
                console.log(udtUser?.balance + parseInt(amount));
                let newBalance = udtUser
                    ? udtUser?.balance + parseInt(amount)
                    : crUser?.balance + parseInt(amount);
                const data = JSON.stringify({ balance: newBalance });
                const result = await updateUser(crUser?._id, data);
                setShowModal(false);
                dispatch(updatedUser(result));
                alert('Nạp tiền thành công!', 'success', '');
                const transaction = {
                    title: `Khách hàng nạp tiền vào tài khoản`,
                    typeTransaction: 'Nạp tiền',
                    costs: parseInt(amount),
                    textNote: 'Khách hàng nạp tiền vào tài khoản',
                    finalBalance: newBalance,
                    createdBy: crUser?._id,
                };
                createTransaction(transaction);
                setAmount('');
                return;
            }
            setShowAlert(true);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('heading')}>
                    <h4 className={cx('heading-text')}>
                        nạp tiền vào tài khoản
                    </h4>
                </div>
                <div className={cx('payment')}>
                    <label htmlFor="input">Số tiền bạn muốn nạp</label>
                    <div className={cx('input-container')}>
                        <input
                            type="number"
                            id="input"
                            value={amount}
                            className={cx('payment-input')}
                            placeholder="Nhập số tiền muốn nạp"
                            onWheel={(e) => e.target.blur()}
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className={cx('unit')}>VND</span>
                        {showNotifyText && (
                            <span className={cx('validate')}>{notifyText}</span>
                        )}
                    </div>
                    <button
                        className={cx('btn-confirm')}
                        onClick={handleContinue}
                    >
                        Tiếp tục
                    </button>
                </div>
                {showModal && (
                    <div className={cx('modal')}>
                        <div
                            className={cx('modal-content')}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={cx('modal-header')}>
                                <p className={cx('title-header')}>
                                    Xác thực email
                                </p>
                                <IoCloseOutline
                                    className={cx('close')}
                                    onClick={handleCloseModal}
                                />
                            </div>
                            <div className={cx('modal-content-container')}>
                                <div className={cx('ct-container')}>
                                    <div className={cx('sub-title')}>
                                        <p className={cx('sub-title-text')}>
                                            Mã xác thực đã được gửi vào email
                                            của bạn. Vui lòng kiểm tra email và
                                            nhập mã xác thực vào ô bên dưới!
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
        </div>
    );
}

export default Payment;
