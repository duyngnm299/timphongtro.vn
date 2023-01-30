import classNames from 'classnames/bind';
import styles from './UIPreview.module.scss';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { closePreviewPost, previewPost } from '~/redux/slice/postSlice';
import { deletedPost } from '~/api';
import { useState } from 'react';
import PreviewDetailPost from './components/PreviewDetailPost';
import PreviewResult from './components/PreviewResult';
const cx = classNames.bind(styles);
function UIPreview() {
    const dispatch = useDispatch();
    const prvPost = useSelector((state) => state.post.previewPost?.post);
    console.log(prvPost);
    const [showPreviewDetailPost, setShowPreviewDetailPost] = useState(false);
    const [showPreviewResult, setShowPreviewResult] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleClosePreview = () => {
        dispatch(closePreviewPost());
        dispatch(previewPost(null));
    };
    const handlePreviewResult = () => {
        setCurrentIndex(0);
        setShowPreviewResult(true);
        setShowPreviewDetailPost(false);
    };
    const handlePreviewDetailPost = () => {
        setCurrentIndex(1);
        setShowPreviewResult(false);
        setShowPreviewDetailPost(true);
    };
    return (
        <div className={cx('modal')}>
            <div className={cx('modal-content')}>
                <div className={cx('header')}>
                    <div className={cx('header-left')}>
                        <button
                            className={cx(
                                'btn-left',
                                currentIndex === 0 && 'btn-active',
                            )}
                            onClick={handlePreviewResult}
                        >
                            Trang tìm kiếm
                        </button>
                        <button
                            className={cx(
                                'btn-right',
                                currentIndex === 1 && 'btn-active',
                            )}
                            onClick={handlePreviewDetailPost}
                        >
                            Trang chi tiết
                        </button>
                    </div>
                    <div className={cx('header-right')}>
                        <IoCloseOutline
                            className={cx('close-icon')}
                            onClick={handleClosePreview}
                        />
                    </div>
                </div>
                <div className={cx('content')}>
                    {showPreviewDetailPost && <PreviewDetailPost />}
                    {showPreviewResult && <PreviewResult />}
                </div>
            </div>
        </div>
    );
}

export default UIPreview;
