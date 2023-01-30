import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from './HaveSearchBarLayout.module.scss';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
const cx = classNames.bind(styles);
function HaveSearchBarLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <SearchBar />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

HaveSearchBarLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HaveSearchBarLayout;
