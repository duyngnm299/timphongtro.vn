import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import images from '~/assets/images';
import { FiCopy } from 'react-icons/fi';
import { MenuIcon } from '~/components/Icons';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FiSettings } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { AiOutlineUser } from 'react-icons/ai';
import {
    MdOutlineKeyboardArrowRight,
    MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import config from '~/config';
import { useSelector, useDispatch } from 'react-redux';
import { currentMenu } from '~/redux/slice/menuSlice';
import { useNavigate } from 'react-router-dom';
import { editPost } from '~/redux/slice/postSlice';
const cx = classNames.bind(styles);

const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const crMenu = useSelector((state) => state.menu.menu?.currentMenu);
    const [showPostItem, setShowPostItem] = useState(false);
    const [showFinancialItem, setShowFinancialItem] = useState(false);
    const [showCostItem, setShowCostItem] = useState(false);
    const [showUtilityItem, setShowUtilityItem] = useState(false);
    const [showInfoItem, setShowInfoItem] = useState(false);
    const [postMngIndex, setPostMngIndex] = useState(
        crMenu === 'new_post' ? 0 : crMenu === 'post_list' ? 1 : -1,
    );
    const [financialMngIndex, setFinancialMngIndex] = useState(-1);
    const [costsMngIndex, setCostsMngIndex] = useState(-1);
    const [utilityMngIndex, setUtilityMngIndex] = useState(-1);
    const [infoMngIndex, setInfoMngIndex] = useState(
        crMenu === 'change_profile' ? 0 : crMenu === 'change_password' ? 1 : -1,
    );
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const updatedUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );

    const postMngItems = {
        title: 'Quản lý bài đăng',
        childrenTitle: [
            {
                text: 'Đăng mới',
                to: config.routes.post,
                disp: currentMenu('new_post'),
                dispt: editPost(null),
            },
            {
                text: 'Danh sách tin đăng',
                to: config.routes.postlist + `/${currentUser?._id}`,
                disp: currentMenu('post_list'),
            },
        ],
    };
    const financialMngItems = {
        title: 'Quản lý tài chính',
        childrenTitle: [
            {
                text: 'Lịch sử giao dịch',
                to: config.routes.transaction + `/${currentUser?._id}`,
            },

            {
                text: 'Nạp tiền vào tài khoản',
                to: config.routes.payment + `/${currentUser?._id}`,
            },
        ],
    };

    const costsMngItems = {
        title: 'Báo giá & hướng dẫn',
        childrenTitle: [
            {
                text: 'Báo giá',
                to: '#',
            },
            {
                text: 'Hướng dẫn thanh toán',
                to: '#',
            },
            { text: 'Hướng dẫn sử dụng', to: '#' },
        ],
    };
    const utilityMngItems = {
        title: 'Tiện ích',
        childrenTitle: [
            {
                text: 'Thông báo',
                to: '#',
            },
            {
                text: 'Yêu cầu khóa tài khoản',
                to: '#',
            },
        ],
    };
    const infoItem = {
        title: 'Thông tin cá nhân',
        childrenTitle: [
            {
                text: 'Thay đổi thông tin cá nhân',
                to: config.routes.profile + `/${currentUser?._id}`,
            },
            {
                text: 'Thay đổi mật khẩu',
                to: config.routes.password + `/${currentUser?._id}`,
            },
        ],
    };
    useEffect(() => {
        if (crMenu === 'new_post') {
            setPostMngIndex(0);
            setInfoMngIndex(-1);
            setFinancialMngIndex(-1);
            setUtilityMngIndex(-1);
            setCostsMngIndex(-1);
            return;
        }
        if (crMenu === 'post_list') {
            setPostMngIndex(1);
            setInfoMngIndex(-1);
            setFinancialMngIndex(-1);
            setUtilityMngIndex(-1);
            setCostsMngIndex(-1);
            return;
        }
        if (crMenu === 'change_profile') {
            setInfoMngIndex(0);
            setPostMngIndex(-1);
            setFinancialMngIndex(-1);
            setUtilityMngIndex(-1);
            setCostsMngIndex(-1);
            return;
        }
        if (crMenu === 'change_password') {
            setInfoMngIndex(1);
            setPostMngIndex(-1);
            setFinancialMngIndex(-1);
            setUtilityMngIndex(-1);
            setCostsMngIndex(-1);
            return;
        }
    }, [crMenu]);
    console.log(crMenu);
    // useEffect(() => {
    //     setBalance(currentUser?.balance);
    // }, [currentUser?.balance]);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + ',') + prev;
            });
    };
    const handleProfile = () => {
        dispatch(currentMenu('change_profile'));
        navigate(config.routes.profile + `/${currentUser?._id}`);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <div className={cx('user')}>
                    <div onClick={handleProfile} className={cx('user-avatar')}>
                        <img
                            src={
                                updatedUser?.profilePicture
                                    ? updatedUser?.profilePicture.includes(
                                          'https://lh3',
                                      )
                                        ? updatedUser?.profilePicture
                                        : `${HOST_NAME}${updatedUser?.profilePicture}`
                                    : currentUser?.profilePicture
                                    ? currentUser?.profilePicture.includes(
                                          'https://lh3',
                                      )
                                        ? currentUser?.profilePicture
                                        : `${HOST_NAME}${currentUser?.profilePicture}`
                                    : images.defaultAvt
                            }
                            alt="avatar"
                            className={cx('avatar')}
                        />
                    </div>
                    <div onClick={handleProfile} className={cx('user-details')}>
                        <span className={cx('username')}>
                            {updatedUser?.fullName
                                ? updatedUser?.fullName
                                : currentUser?.fullName
                                ? currentUser?.fullName
                                : currentUser?.username}
                        </span>
                        <span className={cx('email')}>
                            {currentUser?.email
                                ? currentUser.email
                                : 'Chưa cập nhật email'}
                        </span>
                    </div>
                </div>
                <div className={cx('account-balance')}>
                    <div className={cx('member')}>
                        <div className={cx('left')}>
                            <span className={cx('member-text')}>
                                Mã thành viên
                            </span>
                            <span className={cx('member-code')}>
                                {currentUser?.memberCode}
                            </span>
                        </div>
                        <FiCopy className={cx('right')} />
                    </div>
                    <div className={cx('balance')}>
                        <p className={cx('balance-title')}>Số dư tài khoản</p>

                        <div className={cx('separate')}>
                            <span className={cx('balance-text')}>
                                TK chính:{' '}
                            </span>
                            <span className={cx('balance-number')}>
                                {updatedUser
                                    ? formatCash(
                                          updatedUser?.balance?.toString(),
                                      )
                                    : currentUser
                                    ? formatCash(
                                          currentUser?.balance?.toString(),
                                      )
                                    : ''}{' '}
                                VND
                            </span>
                        </div>
                    </div>
                    <button
                        className={cx('btn-payment')}
                        onClick={() => {
                            navigate(
                                config.routes.payment + `/${currentUser?._id}`,
                            );
                        }}
                    >
                        Nạp tiền
                    </button>
                </div>
            </div>
            <div className={cx('post-container')}>
                <div
                    className={cx(
                        'post-management',
                        postMngIndex !== -1 && 'title-active',
                    )}
                    onClick={() => {
                        setShowPostItem(!showPostItem);
                        dispatch(currentMenu(null));
                    }}
                >
                    <span className={cx('left-icon')}>
                        <MenuIcon />
                    </span>
                    <span className={cx('text')}>{postMngItems.title}</span>
                    <span className={cx('right-icon')}>
                        {showPostItem ||
                        crMenu === 'new_post' ||
                        crMenu === 'post_list' ? (
                            <MdOutlineKeyboardArrowUp />
                        ) : (
                            <MdOutlineKeyboardArrowRight />
                        )}
                    </span>
                </div>
                {showPostItem ||
                crMenu === 'new_post' ||
                crMenu === 'post_list' ? (
                    <>
                        {postMngItems.childrenTitle.map((item, index) => (
                            <Link to={item.to} key={index}>
                                <div
                                    className={cx(
                                        'post-item',
                                        postMngIndex === index && 'active',
                                    )}
                                    onClick={() => {
                                        item?.dispt && dispatch(item?.dispt);
                                        dispatch(item.disp);
                                        setInfoMngIndex(-1);
                                        setFinancialMngIndex(-1);
                                        setUtilityMngIndex(-1);
                                        setCostsMngIndex(-1);
                                        setPostMngIndex(index);
                                    }}
                                >
                                    <span className={cx('text')}>
                                        {item.text}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    ''
                )}
            </div>
            <div className={cx('financial-container')}>
                <div
                    className={cx(
                        'financial-management',
                        financialMngIndex !== -1 && 'title-active',
                    )}
                    onClick={() => setShowFinancialItem(!showFinancialItem)}
                >
                    <span className={cx('left-icon')}>
                        <RiMoneyDollarCircleLine />
                    </span>
                    <span className={cx('text')}>
                        {financialMngItems.title}
                    </span>
                    <span className={cx('right-icon')}>
                        {showFinancialItem ? (
                            <MdOutlineKeyboardArrowUp />
                        ) : (
                            <MdOutlineKeyboardArrowRight />
                        )}
                    </span>
                </div>
                {showFinancialItem ? (
                    <>
                        {financialMngItems.childrenTitle.map((item, index) => (
                            <Link to={item.to} key={index}>
                                <div
                                    className={cx(
                                        'financial-item',
                                        financialMngIndex === index && 'active',
                                    )}
                                    onClick={() => {
                                        setInfoMngIndex(-1);
                                        setPostMngIndex(-1);
                                        setUtilityMngIndex(-1);
                                        setCostsMngIndex(-1);
                                        setFinancialMngIndex(index);
                                    }}
                                >
                                    <span className={cx('text')}>
                                        {item.text}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    ''
                )}
            </div>
            <div className={cx('cost-container')}>
                <div
                    className={cx(
                        'cost-management',
                        costsMngIndex !== -1 && 'title-active',
                    )}
                    onClick={() => setShowCostItem(!showCostItem)}
                >
                    <span className={cx('left-icon')}>
                        <IoPricetagsOutline />
                    </span>
                    <span className={cx('text')}>{costsMngItems.title}</span>
                    <span className={cx('right-icon')}>
                        {showCostItem ? (
                            <MdOutlineKeyboardArrowUp />
                        ) : (
                            <MdOutlineKeyboardArrowRight />
                        )}
                    </span>
                </div>

                {showCostItem ? (
                    <>
                        {costsMngItems.childrenTitle.map((item, index) => (
                            <Link to={item.to} key={index}>
                                <div
                                    className={cx(
                                        'cost-item',
                                        costsMngIndex === index && 'active',
                                    )}
                                    onClick={() => {
                                        setInfoMngIndex(-1);
                                        setPostMngIndex(-1);
                                        setFinancialMngIndex(-1);
                                        setUtilityMngIndex(-1);
                                        setCostsMngIndex(index);
                                    }}
                                >
                                    <span className={cx('text')}>
                                        {item.text}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    ''
                )}
            </div>
            <div className={cx('utility-container')}>
                <div
                    className={cx(
                        'utility-management',
                        utilityMngIndex !== -1 && 'title-active',
                    )}
                    onClick={() => setShowUtilityItem(!showUtilityItem)}
                >
                    <span className={cx('left-icon')}>
                        <FiSettings />
                    </span>
                    <span className={cx('text')}>{utilityMngItems.title}</span>
                    <span className={cx('right-icon')}>
                        {showUtilityItem ? (
                            <MdOutlineKeyboardArrowUp />
                        ) : (
                            <MdOutlineKeyboardArrowRight />
                        )}
                    </span>
                </div>

                {showUtilityItem ? (
                    <>
                        {utilityMngItems.childrenTitle.map((item, index) => (
                            <Link to={item.to} key={index}>
                                <div
                                    className={cx(
                                        'utility-item',
                                        utilityMngIndex === index && 'active',
                                    )}
                                    onClick={() => {
                                        setInfoMngIndex(-1);
                                        setCostsMngIndex(-1);
                                        setFinancialMngIndex(-1);
                                        setPostMngIndex(-1);
                                        setUtilityMngIndex(index);
                                    }}
                                >
                                    <span className={cx('text')}>
                                        {item.text}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    ''
                )}
            </div>
            <div className={cx('info-container')}>
                <div
                    className={cx(
                        'info-management',
                        infoMngIndex !== -1 && 'title-active',
                    )}
                    onClick={() => setShowInfoItem(!showInfoItem)}
                >
                    <span className={cx('left-icon')}>
                        <AiOutlineUser />
                    </span>
                    <span className={cx('text')}>{infoItem.title}</span>
                    <span className={cx('right-icon')}>
                        {showInfoItem ||
                        crMenu === 'change_password' ||
                        crMenu === 'change_profile' ? (
                            <MdOutlineKeyboardArrowUp />
                        ) : (
                            <MdOutlineKeyboardArrowRight />
                        )}
                    </span>
                </div>

                {showInfoItem ||
                crMenu === 'change_password' ||
                crMenu === 'change_profile' ? (
                    <>
                        {infoItem.childrenTitle.map((item, index) => (
                            <Link to={item.to} key={index}>
                                <div
                                    className={cx(
                                        'utility-item',
                                        infoMngIndex === index && 'active',
                                    )}
                                    onClick={() => {
                                        setCostsMngIndex(-1);
                                        setFinancialMngIndex(-1);
                                        setPostMngIndex(-1);
                                        setUtilityMngIndex(-1);
                                        setInfoMngIndex(index);
                                    }}
                                >
                                    <span className={cx('text')}>
                                        {item.text}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}

export default Sidebar;
