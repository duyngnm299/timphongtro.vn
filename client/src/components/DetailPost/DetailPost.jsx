import classNames from 'classnames/bind';
import styles from './DetailPost.module.scss';
import DetailDescribe from './components/DetailDescribe/DetailDescribe';
import Contact from './components/Contact';
import Footer from '~/layouts/components/Footer';
const cx = classNames.bind(styles);

function DetailPost() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('detail-content')}>
                    <DetailDescribe />
                </div>
                <div className={cx('contact')}>
                    <Contact />
                </div>
            </div>
            <div className={cx('footer')}>
                <Footer />
            </div>
        </div>
    );
}

export default DetailPost;
