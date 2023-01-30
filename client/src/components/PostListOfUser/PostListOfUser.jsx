import classNames from 'classnames/bind';
import styles from './PostListOfUser.module.scss';
import images from '~/assets/images';
import { BiPhoneCall } from 'react-icons/bi';
import { getPostListOfUser, getUser, SearchFilterPost } from '~/api';
import { Link } from 'react-router-dom';
import config from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { currentPost } from '~/redux/slice/postSlice';
import ImageSlider from '../ImageSlider';
import Button from '../Button';
import { useState, useEffect } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

const cx = classNames.bind(styles);
function PostListOfUser() {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const crPost = useSelector(
        (state) => state.post?.post?.currentPost?.createdBy[0],
    );
    const [allPost, setAllPost] = useState([]);
    const [savePost, setSavePost] = useState({});
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState([]);
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);

    console.log(totalPage);
    const limit = 8;
    useEffect(() => {
        getUser(crPost).then((res) => setUser(res.user));
        getPostListOfUser(`createdBy=${crPost}`)
            .then((res) => {
                console.log(res.pagination);
                setTotalPage(Math.ceil(res?.pagination?.total / limit));
                setAllPost(res?.post);
                if (currentUser?._id) {
                    getUser(currentUser._id).then((res) => {
                        res?.user?.savedPost.filter((item) =>
                            setSavePost({ ...savePost, [item._id]: true }),
                        );
                    });
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const handleOnClick = (item) => {
        dispatch(currentPost(item));
    };

    const handleOnClickMore = () => {
        let nextPage = currentPage + 1;
        if (totalPage - nextPage >= 0) {
            getPostListOfUser(`createdBy=${crPost}&page=${nextPage}`).then(
                (res) =>
                    res?.post.map((item) =>
                        setAllPost((prevState) => [...prevState, item]),
                    ),
            );
            setCurrentPage(nextPage);
            return;
        }
        if (totalPage - nextPage < 0) {
            getPostListOfUser(`createdBy=${crPost}`).then((res) =>
                setAllPost(res?.post),
            );
            setCurrentPage(1);
            return;
        }
    };
    const currentDate = new Date();
    const handleDate = (createdAt) => {
        const createdDate = new Date(createdAt);
        if (currentDate.getFullYear() === createdDate.getFullYear()) {
            if (currentDate.getMonth() === createdDate.getMonth()) {
                let result = currentDate.getDate() - createdDate.getDate();
                if (result === 0) {
                    return 'Hôm nay';
                }
                return `${result} ngày trước`;
            } else {
                let result = currentDate.getMonth() - createdDate.getMonth();
                return `${result} tháng trước`;
            }
        } else {
            let result = currentDate.getFullYear() - createdDate.getFullYear();
            return `${result} năm trước`;
        }
    };

    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + ',') + prev;
            });
    };

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
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('info')}>
                    <div className={cx('left')}>
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
                    <div className={cx('right')}>
                        <div
                            className={cx('phone')}
                            onClick={() => setShowPhoneNumber(true)}
                        >
                            <BiPhoneCall className={cx('icon')} />

                            <span>
                                {user?.phoneNumber
                                    ? showPhoneNumber
                                        ? formatNumber(user?.phoneNumber)
                                        : formatNumber(
                                              user?.phoneNumber,
                                              true,
                                          ) + ' · Hiện số'
                                    : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={cx('post-list')}>
                    <h2 className={cx('heading')}>Danh sách tin đăng</h2>
                    <div className={cx('post-container')}>
                        {allPost?.map((item, index) => (
                            <Link
                                key={index}
                                to={config.routes.detailPage + `/${item._id}`}
                            >
                                <div
                                    className={cx('post-item')}
                                    onClick={() => handleOnClick(item)}
                                >
                                    <div className={cx('image-container')}>
                                        <ImageSlider
                                            className={cx('show-post-slider')}
                                            slides={item && item.images}
                                            showPost={true}
                                        />
                                    </div>
                                    <div className={cx('describe')}>
                                        <p className={cx('title')}>
                                            {item.title}
                                        </p>
                                        <div className={cx('price-area')}>
                                            <span className={cx('price')}>
                                                {formatCash(`${item.price}`)}{' '}
                                            </span>
                                            <span className={cx('unit')}>
                                                VND
                                            </span>
                                            <span className={cx('dot')}>·</span>
                                            <span className={cx('area')}>
                                                {item.area}
                                            </span>
                                            <span className={cx('unit')}>
                                                m²
                                            </span>
                                        </div>
                                        <p className={cx('address')}>
                                            {`${item?.district}, ${item?.province}`}
                                        </p>
                                        <div className={cx('date-save')}>
                                            <p className={cx('date')}>
                                                {handleDate(item.createdAt)}
                                            </p>

                                            <p className={cx('save')}>
                                                {item.postType}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {totalPage > 1 && (
                        <div className={cx('more-post')}>
                            <Button
                                className={cx('more-btn')}
                                outline
                                rightIcon={
                                    totalPage > currentPage ? (
                                        <MdKeyboardArrowDown />
                                    ) : (
                                        <MdKeyboardArrowUp />
                                    )
                                }
                                more={true}
                                onClick={handleOnClickMore}
                            >
                                {totalPage > currentPage
                                    ? 'Mở rộng'
                                    : 'Thu gọn'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostListOfUser;
