import classNames from 'classnames/bind';
import styles from './DetailDescribe.module.scss';
import ImageSlider from '~/components/ImageSlider';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { BiArea, BiDollarCircle } from 'react-icons/bi';

import { TbBed, TbSofa } from 'react-icons/tb';
import { MdApartment } from 'react-icons/md';
import { GrRestroom } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import Mapbox from '~/components/Mapbox';

import { savedPostItemChange } from '~/redux/slice/postSlice';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserSavePost, deleteSavePost, getUser } from '~/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import {
    faHeart as HeartIcon,
    faExclamation,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function DetailDescribe() {
    const removed = useSelector((state) => state.post?.removed);
    const crPost = useSelector((state) => state.post?.post?.currentPost);
    const des = crPost?.describe && JSON.parse(crPost?.describe);
    const dispatch = useDispatch();
    const [savedPost, setSavedPost] = useState(false);
    const currentUser = useSelector(
        (state) => state.auth?.login?.currentUser?.user,
    );
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };

    useEffect(() => {
        currentUser &&
            getUser(currentUser?._id).then((res) => {
                let temp = res.user.savedPost.some(
                    (item) => item._id === crPost._id,
                );
                if (temp) {
                    return setSavedPost(true);
                } else {
                    return setSavedPost(false);
                }
            });
    }, []);

    useEffect(() => {
        if (savedPost) {
            const data = JSON.stringify({ saved: crPost });
            currentUser &&
                updateUserSavePost(currentUser?._id, data).then((res) => {
                    dispatch(savedPostItemChange());
                    console.log(res);
                });
        } else {
            const data = crPost && JSON.stringify({ postId: crPost._id });
            currentUser &&
                deleteSavePost(currentUser?._id, data).then((res) => {
                    dispatch(savedPostItemChange());
                    console.log(res);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedPost]);
    useEffect(() => {
        if (removed.postId === crPost?._id) {
            setSavedPost(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removed.isRemove]);
    const handleSavePost = () => {
        if (!currentUser) {
            alert('Bạn chưa đăng nhập');
            return;
        }
        setSavedPost(!savedPost);
    };
    return (
        <div className={cx('detail-content')}>
            <div className={cx('image-slider')}>
                {crPost && (
                    <ImageSlider
                        slides={crPost?.images}
                        imgBottom={true}
                        className={cx('slider-detail-post')}
                    />
                )}
            </div>
            <div className={cx('detail-describe')}>
                <div className={cx('header')}>
                    <div className={cx('title-container')}>
                        <h1 className={cx('title')}>{crPost?.title}</h1>
                        <p className={cx('sub-title')}>
                            {`${crPost?.ward}, ${crPost?.district}, ${crPost?.province}`}
                        </p>
                    </div>
                    <div className={cx('info')}>
                        <div className={cx('left-info')}>
                            <div className={cx('left-info-item')}>
                                <p className={cx('left-info-item-title')}>
                                    Mức giá
                                </p>
                                <p className={cx('left-info-item-text')}>
                                    {crPost?.price &&
                                        `${parseFloat(
                                            formatCash(
                                                crPost?.price?.toString(),
                                            ),
                                        ).toFixed(1)} triệu`}
                                </p>
                            </div>
                            <div className={cx('left-info-item')}>
                                <p className={cx('left-info-item-title')}>
                                    Diện tích
                                </p>
                                <p className={cx('left-info-item-text')}>
                                    {crPost?.area} m²
                                </p>
                            </div>
                            {des?.bedroom > 0 && (
                                <div className={cx('left-info-item')}>
                                    <p className={cx('left-info-item-title')}>
                                        Phòng ngủ
                                    </p>
                                    <p className={cx('left-info-item-text')}>
                                        {des?.bedroom} PN
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className={cx('right-info')}>
                            <Tippy
                                content="Báo xấu tin đăng"
                                delay={(0, 200)}
                                placement="top"
                            >
                                <div className={cx('report')}>
                                    <FontAwesomeIcon
                                        icon={faExclamation}
                                        className={cx('icon-report')}
                                    />
                                </div>
                            </Tippy>
                            <Tippy
                                content="Lưu tin"
                                delay={(0, 200)}
                                placement="top"
                            >
                                <div
                                    className={cx('saved')}
                                    onClick={handleSavePost}
                                >
                                    {savedPost ? (
                                        <FontAwesomeIcon
                                            icon={HeartIcon}
                                            className={cx('icon-saved')}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className={cx('icon-saved')}
                                        />
                                    )}
                                </div>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div className={cx('info-describe')}>
                    <h4 className={cx('title-info-describe')}>
                        Thông tin mô tả
                    </h4>
                    <div className={cx('detail-info-describe')}>
                        {des?.describe}
                    </div>
                </div>

                <div className={cx('features-describe')}>
                    <h4 className={cx('title-features-describe')}>
                        Đặc điểm bất động sản
                    </h4>
                    <p className={cx('post-type')}>
                        Loại tin đăng: Cho thuê{' '}
                        {crPost && crPost.category_name.toLocaleLowerCase()}
                    </p>
                    <div className={cx('details-features-describe')}>
                        <div className={cx('row-item', 'row-item-left')}>
                            <span className={cx('icon-container')}>
                                <BiArea className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Diện tích</span>
                            <span className={cx('text-value')}>
                                {crPost?.area} m²
                            </span>
                        </div>
                        <div className={cx('row-item')}>
                            <span className={cx('icon-container')}>
                                <BiDollarCircle className={cx('icon')} />
                            </span>
                            <span className={cx('text-title')}>Mức giá</span>
                            <span className={cx('text-value')}>
                                {crPost?.price &&
                                    `${parseFloat(
                                        formatCash(crPost?.price?.toString()),
                                    ).toFixed(1)} triệu/tháng`}
                            </span>
                        </div>
                        {des?.bedroom > 0 && (
                            <div className={cx('row-item', 'row-item-left')}>
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
                            <div className={cx('row-item', 'row-item-left')}>
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
            </div>
            <div className={cx('map')}>
                <h4 className={cx('title-info-describe')}>Xem trên bản đồ</h4>
                <Mapbox
                    className={cx('mapbox-details-post')}
                    searchAddress={crPost?.address}
                />
            </div>
        </div>
    );
}

export default DetailDescribe;
