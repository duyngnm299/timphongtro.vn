import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/images';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiPhoneCall, BiUserVoice } from 'react-icons/bi';
import { FiHeadphones } from 'react-icons/fi';
const cx = classNames.bind(styles);
function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('left')}>
                    <div className={cx('logo')}>
                        <img
                            src={images.logo}
                            alt="logo"
                            className={cx('logo-img')}
                        />
                    </div>
                    <span className={cx('text')}>
                        CÔNG TY CỔ PHẦN TIMPHONGTRO.VN
                    </span>
                    <div className={cx('info')}>
                        <div className={cx('info-top')}>
                            <HiOutlineLocationMarker className={cx('icon')} />
                            <span className={cx('address-text')}>
                                48 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng
                            </span>
                        </div>
                        <div className={cx('info-top')}>
                            <BiPhoneCall className={cx('icon')} />
                            <span className={cx('address-text')}>
                                1900 0091 - 0962729658
                            </span>
                        </div>
                    </div>

                    <div className={cx('platform')}>
                        <img
                            src={images.googlePlay}
                            alt=""
                            className={cx('platform-img')}
                        />
                        <img
                            src={images.appStore}
                            alt=""
                            className={cx('platform-img')}
                        />
                    </div>
                </div>
                <div className={cx('right')}>
                    <div className={cx('info-contact')}>
                        <div className={cx('hotline')}>
                            <BiPhoneCall className={cx('icon-large')} />
                            <div className={cx('hotline-container')}>
                                <span className={cx('hotline-title')}>
                                    Hotline
                                </span>
                                <span className={cx('hotline-text')}>
                                    1900 0091
                                </span>
                            </div>
                        </div>
                        <div className={cx('supported')}>
                            <BiUserVoice className={cx('icon-large')} />
                            <div className={cx('hotline-container')}>
                                <span className={cx('hotline-title')}>
                                    Hỗ trợ khách hàng
                                </span>
                                <span className={cx('hotline-text')}>
                                    hotro.tpt.vn@gmail.com
                                </span>
                            </div>
                        </div>
                        <div className={cx('customer-care')}>
                            <FiHeadphones className={cx('icon-large')} />
                            <div className={cx('hotline-container')}>
                                <span className={cx('hotline-title')}>
                                    Chăm sóc khách hàng
                                </span>
                                <span className={cx('hotline-text')}>
                                    cskh.tpt.vn@gmail.com
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('link-footer')}>
                        <div className={cx('guide')}>
                            <span className={cx('guide-title')}>Hướng dẫn</span>
                            <span className={cx('guide-item')}>
                                Báo giá & hỗ trợ
                            </span>
                            <span className={cx('guide-item')}>
                                Câu hỏi thường gặp
                            </span>
                            <span className={cx('guide-item')}>Thông báo</span>
                            <span className={cx('guide-item')}>Liên hệ</span>
                        </div>
                        <div className={cx('guide')}>
                            <span className={cx('guide-title')}>quy định</span>
                            <span className={cx('guide-item')}>
                                Quy định đăng tin
                            </span>
                            <span className={cx('guide-item')}>
                                Quy chế hoạt động
                            </span>
                            <span className={cx('guide-item')}>
                                Điều khoản thỏa thuận
                            </span>
                            <span className={cx('guide-item')}>
                                Chính sách bảo mật
                            </span>
                            <span className={cx('guide-item')}>
                                Giải quyết khiếu nại
                            </span>
                            <span className={cx('guide-item')}>
                                Góp ý báo lỗi
                            </span>
                        </div>
                        <div className={cx('footer-email')}>
                            <span className={cx('guide-title')}>
                                ĐĂNG KÝ NHẬN TIN
                            </span>

                            <input
                                type="text"
                                className={cx('input-email')}
                                placeholder="Nhập email để nhận tin"
                            />

                            <div className={cx('certificated')}>
                                <img
                                    src={images.certificated}
                                    alt=""
                                    className={cx('certificated-img')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
