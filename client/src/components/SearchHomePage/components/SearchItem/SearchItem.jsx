import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SearchItem.module.scss';

import { AiOutlineHome } from 'react-icons/ai';
import config from '~/config';
import { useDispatch } from 'react-redux';
import { currentPost } from '~/redux/slice/postSlice';
const cx = classNames.bind(styles);

function SearchItem({ data, className }) {
    const dispatch = useDispatch();
    const handleOnClick = () => {
        dispatch(currentPost(data));
    };
    console.log(data);
    return (
        <div>
            <Link
                to={config.routes.detailPage + `/${data._id}`}
                onClick={handleOnClick}
                className={cx('wrapper')}
            >
                <div
                    className={cx(
                        'info-container',
                        className && 'search-bar-container',
                    )}
                >
                    <div>
                        <AiOutlineHome className={cx('icon')} />
                    </div>
                    <div className={cx('info', className && 'search-bar-info')}>
                        <h4 className={cx('title')}>{data.title}</h4>
                        <span className={cx('address')}>
                            {data.ward}, {data.district}, {data?.province}{' '}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

SearchItem.propTypes = {
    data: PropTypes.object.isRequired,
};
export default SearchItem;
