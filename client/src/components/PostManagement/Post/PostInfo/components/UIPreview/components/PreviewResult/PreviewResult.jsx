import classNames from 'classnames/bind';
import Result from './components/Result';
import styles from './PreviewResult.module.scss';
const cx = classNames.bind(styles);
function PreviewResult() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <Result />
            </div>
        </div>
    );
}

export default PreviewResult;
