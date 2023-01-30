import classNames from 'classnames/bind';
import ImageSlider from '~/components/ImageSlider';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './DetailPostOfUser.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BiArea, BiDollarCircle } from 'react-icons/bi';
import { BsChatLeftText } from 'react-icons/bs';
import { TbBed, TbSofa } from 'react-icons/tb';
import { MdApartment } from 'react-icons/md';
import { GrRestroom } from 'react-icons/gr';
import Mapbox from '~/components/Mapbox';
import { useEffect } from 'react';
import { getUser } from '~/api';
import { BiPhoneCall } from 'react-icons/bi';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images';
import { changeModal, editPost } from '~/redux/slice/postSlice';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function DetailPostOfUser({ item }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    useEffect(() => {
        getUser(item.createdBy).then((res) => setUser(res.user));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    const des = item && JSON.parse(item?.describe);
    function formatNumber(entry = '', hide = false) {
        const match = entry
            .replace(/\D+/g, '')
            .replace(/^1/, '')
            .match(/([^\d]*\d[^\d]*){1,10}$/)[0];
        const part1 = match.length > 2 ? `${match.substring(0, 4)}` : match;
        const part2 = match.length > 3 ? ` ${match.substring(4, 7)}` : '';
        const part3 =
            match.length > 6
                ? hide
                    ? ` ***`
                    : ` ${match.substring(7, 10)}`
                : '';
        return `${part1}${part2}${part3}`;
    }
    const handleEditPost = () => {
        dispatch(editPost(item));
        navigate('/quan-ly-bai-dang/dang-tin');
    };

    return (
        <div className={cx('wrapper')} onClick={() => dispatch(changeModal())}>
            <div className={cx('content')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('image-slider')}>
                    <ImageSlider slides={item.images} detailPostOfUser={true} />
                </div>
                <h4 className={cx('title')}>{item.title}</h4>
                <span className={cx('address')}>{item.address}</span>
                <div className={cx('describe')}>
                    <div className={cx('price')}>
                        <span className={cx('title-price')}>Mức giá</span>
                        <span className={cx('text')}>{`${parseFloat(
                            formatCash(item?.price?.toString()),
                        ).toFixed(1)} triệu/tháng`}</span>
                    </div>
                    <div className={cx('price')}>
                        <span className={cx('title-price')}>Diện tích</span>
                        <span className={cx('text')}>{`${item?.area} m²`}</span>
                    </div>
                    {des?.bedroom.length > 0 && des?.bedroom !== 0 && (
                        <div className={cx('price')}>
                            <span className={cx('title-price')}>Phòng ngủ</span>
                            <span
                                className={cx('text')}
                            >{`${des?.bedroom} PN`}</span>
                        </div>
                    )}
                    {des?.restroom?.length > 0 && des?.restroom !== 0 && (
                        <div className={cx('price')}>
                            <span className={cx('title-price')}>
                                Phòng vệ sinh
                            </span>
                            <span
                                className={cx('text')}
                            >{`${des?.restroom} phòng`}</span>
                        </div>
                    )}
                    {des?.floor?.lenght > 0 && (
                        <div className={cx('price')}>
                            <span className={cx('title-price')}>Số tầng</span>
                            <span
                                className={cx('text')}
                            >{`${des?.floor} tầng`}</span>
                        </div>
                    )}
                </div>
                <div className={cx('details-describe')}>
                    <h4 className={cx('title-describe')}>Thông tin mô tả</h4>
                    <div className={cx('describe-text')}>
                        {des && des.describe}
                    </div>
                </div>
                <div className={cx('save-and-report')}>
                    <div className={cx('report')}>
                        <FontAwesomeIcon
                            icon={faExclamation}
                            className={cx('icon')}
                        />
                        <span>Báo xấu</span>
                    </div>
                    <div className={cx('save')}>
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={cx('icon')}
                        />
                        <span>Lưu tin</span>
                    </div>
                </div>
                <div className={cx('features')}>
                    <h4 className={cx('title-describe')}>
                        {item.category_name
                            ? item.category_name === 'Tìm người ở ghép'
                                ? 'Đặc điểm'
                                : `Đặc điểm ${item.category_name}`
                            : 'Đặc điểm bất động sản'}
                    </h4>
                    <div className={cx('details-features-describe')}>
                        <div className={cx('row-item')}>
                            <span className={cx('icon-container')}>
                                <BiArea className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Diện tích</span>
                            <span className={cx('text-value')}>
                                {item?.area} m²
                            </span>
                        </div>
                        <div className={cx('row-item')}>
                            <span className={cx('icon-container')}>
                                <BiDollarCircle className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Mức giá</span>
                            <span className={cx('text-value')}>
                                {item?.price &&
                                    `${parseFloat(
                                        formatCash(item?.price?.toString()),
                                    ).toFixed(1)} triệu/tháng`}
                            </span>
                        </div>
                        {des?.bedroom > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <TbBed className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Số phòng ngủ
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.bedroom} phòng
                                </span>
                            </div>
                        )}
                        {des?.restroom > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <GrRestroom className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Số toilet
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.restroom} phòng
                                </span>
                            </div>
                        )}
                        {des?.floor > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <MdApartment className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Số tầng
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.floor} tầng
                                </span>
                            </div>
                        )}
                        {des?.furniture > 0 && (
                            <div className={cx('row-item')}>
                                <span className={cx('icon-container')}>
                                    <TbSofa className={cx('icon')} />
                                </span>
                                <span className={cx('text-title')}>
                                    Nội thất
                                </span>
                                <span className={cx('text-value')}>
                                    {des?.furniture}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className={cx('map')}>
                    <h4 className={cx('title-info-describe')}>
                        Xem trên bản đồ
                    </h4>
                    <Mapbox
                        detailPostOfUser={true}
                        searchAddress={item?.address}
                    />
                </div>
                <div className={cx('created-by')}>
                    <span className={cx('title-created')}>
                        Liên hệ người đăng tin
                    </span>
                    <div className={cx('avatar-container')}>
                        <div className={cx('avatar')}>
                            <img
                                src={
                                    user?.profilePicture
                                        ? `${HOST_NAME}${user?.profilePicture}`
                                        : images.defaultAvt
                                }
                                alt=""
                                className={cx('avatar-img')}
                            />
                        </div>
                        <span className={cx('full-name')}>
                            {user?.fullName || user?.username}
                        </span>
                    </div>
                </div>
                <div className={cx('post-type')}>
                    <div className={cx('top')}>
                        <div className={cx('left')}>
                            <span className={cx('title-type')}>Ngày đăng</span>
                            <span className={cx('value-type')}>
                                {item.startDate}
                            </span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('title-type')}>Loại tin</span>
                            <span className={cx('value-type')}>
                                {item.postType}
                            </span>
                        </div>
                    </div>
                    <div className={cx('top')}>
                        <div className={cx('left')}>
                            <span className={cx('title-type')}>
                                Ngày hết hạn
                            </span>
                            <span className={cx('value-type')}>
                                {item.endDate}
                            </span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('title-type')}>Mã tin</span>
                            <span className={cx('value-type')}>
                                {item.postCode}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cx('contact')}>
                    <div className={cx('info-contact')}>
                        <div className={cx('chat')}>
                            <BsChatLeftText className={cx('chat-icon')} />
                            <span className={cx('chat-text')}>Nhắn tin</span>
                        </div>
                        <div className={cx('phone')}>
                            <BiPhoneCall className={cx('phone-icon')} />
                            <span className={cx('phone-text')}>
                                {user?.phoneNumber &&
                                    formatNumber(user?.phoneNumber, true) +
                                        ' · Hiện số'}
                            </span>
                        </div>
                    </div>
                    <div className={cx('edit-and-delete')}>
                        <div className={cx('edit')}>
                            <button
                                className={cx('edit-btn')}
                                onClick={handleEditPost}
                            >
                                Sửa tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailPostOfUser;
