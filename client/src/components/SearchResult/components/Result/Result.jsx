import classNames from 'classnames/bind';
import styles from './Result.module.scss';
import Sort from './components/Sort';
import { useSelector, useDispatch } from 'react-redux';
import ImageSlider from '~/components/ImageSlider';
import { getUser, SearchFilterPost } from '~/api';
import { useState, useEffect } from 'react';
import { currentPost } from '~/redux/slice/postSlice';
import { Link } from 'react-router-dom';
import config from '~/config';
import Button from '~/components/Button';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
const cx = classNames.bind(styles);

function Result() {
    const [createdBy, setCreatedBy] = useState([]);
    const [listResult, setListResult] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const crPost = useSelector((state) => state.post.post?.currentPost);
    const link = useSelector((state) => state.filter.linkSearch?.link);
    const sort = useSelector((state) => state.filter.sort?.link);
    const currentCategory = useSelector(
        (state) => state.filter.category?.currentCategory,
    );
    const filterResultPost = useSelector(
        (state) => state.filter.filterResult?.post,
    );

    const filterResultPg = useSelector(
        (state) => state.filter.filterResult?.pagination,
    );
    const dispatch = useDispatch();
    const limit = 8;
    console.log(filterResultPost);
    console.log(filterResultPg);
    useEffect(() => {
        setListResult(filterResultPost);
        filterResultPost &&
            filterResultPost?.map((item) =>
                getUser(item.createdBy).then((res) => {
                    setCreatedBy((prev) => [...prev, res?.user?.fullName]);
                }),
            );
        filterResultPg &&
            setTotalPage(Math.ceil(filterResultPg?.total / limit));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterResultPost]);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    console.log(totalPage, currentPage);
    const currentDate = new Date();
    const date_diff_indays = function (date1, date2) {
        const dt1 = new Date(date1);
        const dt2 = new Date(date2);
        return Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
                (1000 * 60 * 60 * 24),
        );
    };
    const handleDate = (createdAt) => {
        const createdDate = new Date(createdAt);
        const result = date_diff_indays(createdDate, currentDate);
        const a = Math.floor(result / 30);
        if (result === 0) {
            return 'Hôm nay';
        }
        if (a < 1) {
            return result + ' ngày trước';
        }
        if (a > 12 && a < 24) {
            return '1 năm trước';
        }
        if (a >= 24) {
            return '2 năm trước';
        }

        if (a > 1 && a < 12) {
            return a + ' tháng trước';
        }
    };
    const handleOnClickItem = (item) => {
        dispatch(currentPost(item));
    };
    const handleOnClickMore = () => {
        let nextPage = currentPage + 1;
        if (totalPage - nextPage >= 0) {
            SearchFilterPost(
                `${link && link}${
                    sort && sort
                }&page=${nextPage}&status=approved`,
            ).then((res) =>
                res?.post.map((item) =>
                    setListResult((prevState) => [...prevState, item]),
                ),
            );
            setCurrentPage(nextPage);
            return;
        }
        if (totalPage - nextPage < 0) {
            SearchFilterPost(
                `${link && link}${sort && sort}&status=approved`,
            ).then((res) => setListResult(res?.post));
            setCurrentPage(1);
            return;
        }
    };
    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>
                {currentCategory
                    ? currentCategory === 'Tìm người ở ghép'
                        ? 'Tìm người ở ghép'
                        : `Cho thuê ${currentCategory}`
                    : 'Tất cả bài đăng'}
            </h1>
            <div className={cx('sort-container')}>
                <span className={cx('count-post')}>
                    Hiện có {listResult && listResult?.length} bài viết
                </span>
                <Sort />
            </div>
            <div className={cx('result')}>
                {listResult && listResult?.length > 0 ? (
                    listResult?.map((item, index) => (
                        <Link
                            key={index}
                            to={
                                crPost &&
                                config.routes.detailPage + `/${item?._id}`
                            }
                        >
                            <div
                                className={cx('result-item')}
                                onClick={() => handleOnClickItem(item)}
                            >
                                <div className={cx('img-slider')}>
                                    <ImageSlider
                                        className={cx('result-img')}
                                        slides={item && item?.images}
                                        searchResult={true}
                                    />
                                </div>
                                <div className={cx('info')}>
                                    <div className={cx('title-post')}>
                                        <span className={cx('title-post-text')}>
                                            {item?.title}
                                        </span>
                                    </div>
                                    <div className={cx('details-info')}>
                                        <span className={cx('price')}>
                                            {`${parseFloat(
                                                formatCash(
                                                    item?.price?.toString(),
                                                ),
                                            ).toFixed(1)} triệu`}
                                        </span>
                                        <span className={cx('dot')}>·</span>
                                        <span className={cx('area')}>
                                            {item?.area} m²
                                        </span>
                                        <span className={cx('dot')}>·</span>

                                        <span className={cx('address')}>
                                            {item?.district}, {item?.province}
                                        </span>
                                    </div>
                                    <div className={cx('describe')}>
                                        {item?.describe &&
                                            JSON.parse(item?.describe)
                                                ?.describe}
                                    </div>
                                    <div className={cx('date-and-type')}>
                                        <div className={cx('date-createdby')}>
                                            <span className={cx('createdBy')}>
                                                Đăng bởi:{' '}
                                                {createdBy && createdBy[index]}
                                            </span>
                                            <span className={cx('date')}>
                                                {item?.createdAt &&
                                                    handleDate(item?.createdAt)}
                                            </span>
                                        </div>
                                        <span className={cx('type')}>
                                            {item?.postType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div>
                        <p>Rất tiếc, hiện tại không bài đăng nào phù hợp</p>
                    </div>
                )}
            </div>
            {totalPage > 1 && listResult.length > 0 && (
                <div className={cx('more-post')}>
                    <Button
                        className={cx('more-btn-result')}
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
                        {totalPage > currentPage ? 'Mở rộng' : 'Thu gọn'}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Result;
