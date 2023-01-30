import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SavedItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { deleteSavePost } from '~/api';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
    currentPost,
    removedItem,
    savedPostItemChange,
} from '~/redux/slice/postSlice';
import config from '~/config';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function SavedItem({ data }) {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleDeleteSavePost = () => {
        const postId = JSON.stringify({ postId: data?._id });
        deleteSavePost(currentUser._id, postId).then((res) => {
            dispatch(savedPostItemChange());
            dispatch(removedItem(data?._id));
            console.log(res);
        });
    };

    const handleDetailPost = () => {
        dispatch(currentPost(data));
        navigate(config.routes.detailPage + `/${data?._id}`);
    };
    return (
        <div>
            {data.images && (
                <div className={cx('saved-item')} onClick={handleDetailPost}>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className={cx('deleted-icon')}
                        onClick={handleDeleteSavePost}
                    />
                    <div className={cx('img-container')}>
                        <img
                            src={HOST_NAME + data?.images[0]?.imagePath}
                            alt="a"
                            className={cx('image')}
                        />
                    </div>
                    <div className={cx('info')}>
                        <p className={cx('title')}>{data.title}</p>
                        <p
                            className={cx('time')}
                        >{`${data.ward}, ${data.district}, ${data.province}`}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// SavedItem.propTypes = {
//     data: PropTypes.object.isRequired,
//     onClick: PropTypes.func,
// };

export default SavedItem;
