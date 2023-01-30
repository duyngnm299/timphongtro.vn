import classNames from 'classnames/bind';

import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './Search.module.scss';
import { SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';

import { getAllPostOfUser } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { postListOfUser } from '~/redux/slice/postSlice';

const cx = classNames.bind(styles);
function Search({ className }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const inputRef = useRef();
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!debouncedValue) {
            dispatch(postListOfUser());
            return;
        }
        setLoading(true);

        getAllPostOfUser(
            `createdBy=${currentUser._id}&title=${searchValue}`,
        ).then((res) => {
            setLoading(false);
            dispatch(postListOfUser(res.post));
        });
    }, [debouncedValue]);
    const handleInputChange = (searchValue) => {
        if (searchValue.startsWith(' ')) {
            return;
        }
        setSearchValue(searchValue);
    };
    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };
    const classes = cx('search', {
        [className]: className,
    });
    return (
        // Thêm thẻ div để Tippy không warning
        <div>
            <div className={classes}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={'Tìm theo tiêu đề'}
                    spellCheck={false}
                    onFocus={() => setShowResult(true)}
                />
                {!!searchValue && !loading && (
                    <button
                        className={cx(className ? 'clear-post-list' : 'clear')}
                        onClick={handleClear}
                    >
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}

                {loading && (
                    <FontAwesomeIcon
                        className={cx(
                            className ? 'loading-post-list' : 'loading',
                        )}
                        icon={faSpinner}
                    />
                )}

                <button
                    className={cx(
                        className ? 'search-btn-post-list' : 'search-btn',
                    )}
                    onMouseDown={(e) => {
                        e.preventDefault();
                    }}
                >
                    <SearchIcon
                        width={className && '1.8rem'}
                        height={className && '1.8rem'}
                    />
                </button>
            </div>
        </div>
    );
}

export default Search;
