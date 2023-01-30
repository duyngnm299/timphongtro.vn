import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './Category.module.scss';
import { AiOutlineHome } from 'react-icons/ai';
import { MdKeyboardArrowDown } from 'react-icons/md';
// import CategoryItem from './CategoryItem';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { BiRefresh } from 'react-icons/bi';
import { useEffect } from 'react';
import { getAllCategories } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { currentCategory } from '~/redux/slice/filterSlice';
const cx = classNames.bind(styles);

// const defaultFn = () => {};
function Category({ className }) {
    const crCategory = useSelector(
        (state) => state.filter.category?.currentCategory,
    );
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [showCategory, setShowCategory] = useState(false);
    const [checkedIndex, setCheckedIndex] = useState(-1);
    const [checked, setChecked] = useState([]);
    const [ipChecked, setIpCheck] = useState(true);

    useEffect(() => {
        getAllCategories().then((res) => {
            setData(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setCategoryList(data.map((item) => ({ ...item, isChecked: false })));
    }, [data]);
    const handleChange = (e) => {
        const { name } = e.target;
        setCheckedIndex(parseInt(name));
        let itemChecked = categoryList[name];

        if (e.target.checked) {
            setIpCheck(true);
            itemChecked = { ...itemChecked, isChecked: true };
            setChecked([itemChecked]);
            categoryList[name].isChecked = true;
            dispatch(currentCategory(itemChecked.category_name));
        } else {
            setChecked(false);
            categoryList[name].isChecked = false;
            dispatch(currentCategory(null));
            setChecked([]);
        }
    };

    const renderItems = () => {
        return categoryList.map((item, index) => {
            return (
                <label
                    key={index}
                    htmlFor={`checkbox${index}`}
                    className={cx(
                        'category-item',
                        className && 'category-sb-item',
                    )}
                >
                    <span className={cx('icon')}>
                        {' '}
                        <AiOutlineHome />
                    </span>
                    <span className={cx('text')}>{item.category_name}</span>
                    <input
                        id={`checkbox${index}`}
                        className={cx('checkbox')}
                        type="checkbox"
                        name={index}
                        value={{ item }}
                        checked={
                            ipChecked &&
                            categoryList[index].isChecked &&
                            index === checkedIndex
                                ? true
                                : false
                        }
                        onChange={handleChange}
                    />
                </label>
            );
        });
    };

    const handleRefresh = () => {
        setIpCheck(false);
        setChecked([]);
        categoryList.map((item) => (item.isChecked = false));
        dispatch(currentCategory(null));
    };

    const renderResult = (attrs) => (
        <div
            className={cx('category-list', className && 'category-sb-list')}
            tabIndex="-1"
            {...attrs}
        >
            <PopperWrapper className={cx('category-popper')}>
                <div className={cx('category-body')}>{renderItems()}</div>
                <div className={cx('refresh')}>
                    <div className={cx('left')} onClick={handleRefresh}>
                        <BiRefresh className={cx('rf-icon')} />
                        <p className={cx('rf-text')}>Đặt lại</p>
                    </div>
                    <button
                        className={cx('btn-refresh')}
                        onClick={() => setShowCategory(false)}
                    >
                        Áp dụng
                    </button>
                </div>
            </PopperWrapper>
        </div>
    );
    // console.log(nameCategory);
    return className ? (
        <div>
            <HeadlessTippy
                // visible
                visible={showCategory}
                delay={[0, 1000]}
                offset={className ? [68, 12] : [90, 8]}
                interactive
                placement="bottom-end"
                render={renderResult}
                onClickOutside={() => setShowCategory(false)}
            >
                <div
                    className={cx(
                        'category',
                        className && 'category-search-bar',
                    )}
                    onClick={() => setShowCategory(!showCategory)}
                >
                    {className ? (
                        <>
                            <div className={cx('category-sb-item')}>
                                <div className={cx('title-wrapper')}>
                                    <span className={cx('title')}>
                                        Phân loại
                                    </span>
                                    <span>
                                        <FontAwesomeIcon
                                            className={cx('arrow-down')}
                                            icon={faChevronDown}
                                        />
                                    </span>
                                </div>

                                <p className={cx('sort-value')}>
                                    {' '}
                                    {crCategory && checked[0]
                                        ? checked[0].category_name
                                        : 'Tất cả'}
                                </p>
                            </div>
                        </>
                    ) : crCategory && checked.length > 0 ? (
                        <>
                            <span className={cx('icon-left')}>
                                <AiOutlineHome />
                            </span>
                            <span className={cx('text-ctgr')}>
                                {' '}
                                {crCategory && checked[0].category_name}
                            </span>
                            <span className={cx('icon-right')}>
                                <MdKeyboardArrowDown />
                            </span>
                        </>
                    ) : (
                        <>
                            <span className={cx('icon-left')}>
                                <AiOutlineHome />
                            </span>
                            <span className={cx('text-ctgr')}>
                                Loại tìm kiếm
                            </span>
                            <span className={cx('icon-right')}>
                                <MdKeyboardArrowDown />
                            </span>
                        </>
                    )}
                </div>
            </HeadlessTippy>
        </div>
    ) : (
        <Tippy
            className={cx('tippy-content')}
            content={
                checked.length > 0 && crCategory
                    ? checked[0].category_name
                    : null
            }
            disabled={checked.length === 0 ? true : false}
            delay={(0, 200)}
            placement="bottom"
        >
            <div>
                <HeadlessTippy
                    // visible
                    visible={showCategory}
                    delay={[0, 1000]}
                    offset={className ? [70, 8] : [90, 8]}
                    interactive
                    placement="bottom-end"
                    render={renderResult}
                    onClickOutside={() => setShowCategory(false)}
                >
                    <div
                        className={cx(
                            'category',
                            className && 'category-search-bar',
                        )}
                        onClick={() => setShowCategory(!showCategory)}
                    >
                        {className ? (
                            <>
                                <div className={cx('category-sb-item')}>
                                    <div className={cx('title-wrapper')}>
                                        <span className={cx('title')}>
                                            Phân loại
                                        </span>
                                        <span>
                                            <FontAwesomeIcon
                                                className={cx('arrow-down')}
                                                icon={faChevronDown}
                                            />
                                        </span>
                                    </div>

                                    <p className={cx('sort-value')}>
                                        {' '}
                                        {crCategory
                                            ? checked[0].category_name
                                            : 'Tất cả'}
                                    </p>
                                </div>
                            </>
                        ) : crCategory && checked.length > 0 ? (
                            <>
                                <span className={cx('icon-left')}>
                                    <AiOutlineHome />
                                </span>
                                <span className={cx('text-ctgr')}>
                                    {' '}
                                    {crCategory && checked[0].category_name}
                                </span>
                                <span className={cx('icon-right')}>
                                    <MdKeyboardArrowDown />
                                </span>
                            </>
                        ) : (
                            <>
                                <span className={cx('icon-left')}>
                                    <AiOutlineHome />
                                </span>
                                <span className={cx('text-ctgr')}>
                                    Loại tìm kiếm
                                </span>
                                <span className={cx('icon-right')}>
                                    <MdKeyboardArrowDown />
                                </span>
                            </>
                        )}
                    </div>
                </HeadlessTippy>
            </div>
        </Tippy>
    );
}

Category.propTypes = {
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    // onChange: PropTypes.func,
};

export default Category;
