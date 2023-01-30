import classNames from 'classnames/bind';
import PreviewContact from './components/PreviewContact';
import PreviewDetailDescribe from './components/PreviewDetailDescribe';
import styles from './PreviewDetailPost.module.scss';
const cx = classNames.bind(styles);
function PreviewDetailPost() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('detail-content')}>
                    <PreviewDetailDescribe />
                </div>
                <div className={cx('contact')}>
                    <PreviewContact />
                </div>
            </div>
        </div>
    );
}

export default PreviewDetailPost;
