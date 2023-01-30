import classNames from 'classnames/bind';
import styles from './Result.module.scss';
import Sort from './components/Sort';
import { useSelector, useDispatch } from 'react-redux';
import ImageSlider from '~/components/ImageSlider';

const cx = classNames.bind(styles);

function Result() {
    const crPost = useSelector((state) => state.post.previewPost?.post);
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    console.log(crPost);
    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>
                {crPost
                    ? crPost?.category_name === 'Tìm người ở ghép'
                        ? 'Tìm người ở ghép'
                        : `Cho thuê ${crPost?.category_name}`
                    : 'Tất cả bài đăng'}
            </h1>
            <div className={cx('sort-container')}>
                <span className={cx('count-post')}>Hiện có 1 bài viết</span>
                <Sort />
            </div>
            <div className={cx('result')}>
                <div className={cx('result-item')}>
                    {crPost && (
                        <div className={cx('img-slider')}>
                            <ImageSlider
                                className={cx('result-img')}
                                slides={crPost && crPost?.images}
                                searchResult={true}
                            />
                        </div>
                    )}
                    <div className={cx('info')}>
                        <div className={cx('title-post')}>
                            <span className={cx('title-post-text')}>
                                {crPost?.title}
                            </span>
                        </div>
                        <div className={cx('details-info')}>
                            <span className={cx('price')}>
                                {crPost &&
                                    `${parseFloat(
                                        formatCash(crPost?.price?.toString()),
                                    ).toFixed(1)} triệu`}
                            </span>
                            <span className={cx('dot')}>·</span>
                            <span className={cx('area')}>
                                {crPost?.area} m²
                            </span>
                            <span className={cx('dot')}>·</span>

                            <span className={cx('address')}>
                                {crPost?.district}, {crPost?.province}
                            </span>
                        </div>
                        <div className={cx('describe')}>
                            {crPost?.describe &&
                                JSON.parse(crPost?.describe)?.describe}
                        </div>
                        <div className={cx('date-and-type')}>
                            <div className={cx('date-createdby')}>
                                <span className={cx('createdBy')}>
                                    Đăng bởi:{' '}
                                    {currentUser && currentUser?.fullName
                                        ? currentUser?.fullName
                                        : currentUser?.username}
                                </span>
                                <span className={cx('date')}>Hôm nay</span>
                            </div>
                            <span className={cx('type')}>
                                {crPost?.postType}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;
