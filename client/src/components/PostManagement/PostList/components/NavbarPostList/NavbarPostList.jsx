import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NavbarPostList.module.scss';
import images from '~/assets/images';
import { TbListDetails } from 'react-icons/tb';
import { BiPencil } from 'react-icons/bi';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
    getPostOfUser,
    checkExpiredPost,
    updateUser,
    deletedPost,
    getAllPostOfUser,
    createTransaction,
} from '~/api';
import DetailPostOfUser from './DetailPostOfUser';
import { editPost, isEditPost } from '~/redux/slice/postSlice';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { AiFillInfoCircle } from 'react-icons/ai';
import Button from '~/components/Button';
import { updatedUser } from '~/redux/slice/authSlice';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { currentPost } from '~/redux/slice/postSlice';
import { currentMenu } from '~/redux/slice/menuSlice';
import config from '~/config';
const cx = classNames.bind(styles);

const item = ['Tất cả', 'Hết hạn', 'Đang hiển thị', 'Chờ hiển thị'];
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function NavbarPostList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const crPost = useSelector((state) => state.post.editPost?.currentPost);
    const listPost = useSelector((state) => state.post.postList?.list);
    console.log(listPost);
    const [indexId, setIndexId] = useState(0);
    const [postList, setPostList] = useState([]);
    const [crrPost, setCurrentPost] = useState([]);
    const [showDetailPost, setShowDetailPost] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [dltPost, setDltPost] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [checkedAll, setCheckedAll] = useState(false);
    const [showDeleteAll, setShowDeleteAll] = useState(false);

    const [totalCost, setTotalCost] = useState(0);
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const modal = useSelector((state) => state.post.modal?.show);
    const udtUser = useSelector(
        (state) => state.auth.update?.currentUser?.user,
    );
    let balance = currentUser?.balance;
    let updateBalance = udtUser?.balance;
    const id = currentUser?._id;
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    useEffect(() => {
        getAllPostOfUser(`createdBy=${id}`).then((res) =>
            setPostList(res.post),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        listPost
            ? setPostList(listPost)
            : getAllPostOfUser(`createdBy=${id}`).then((res) =>
                  setPostList(res.post),
              );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listPost]);
    useEffect(() => {
        getAllPostOfUser(`createdBy=${id}`).then((res) =>
            setPostList(res.post),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dltPost]);
    useEffect(() => {
        setShowDetailPost(false);
    }, [modal]);

    const handleShowPost = (index) => {
        switch (index) {
            case 0:
                getAllPostOfUser(`createdBy=${id}`).then((res) =>
                    setPostList(res.post),
                );
                return;
            case 1:
                getAllPostOfUser(`createdBy=${id}&status=expired`).then((res) =>
                    setPostList(res.post),
                );

                return;
            case 2:
                getAllPostOfUser(`createdBy=${id}&status=approved`).then(
                    (res) => setPostList(res.post),
                );
                return;
            case 3:
                getAllPostOfUser(
                    `createdBy=${id}&status=waiting for approva`,
                ).then((res) => setPostList(res.post));
                return;
            default:
                break;
        }
    };
    const handleDetailsPost = (item, e) => {
        e.stopPropagation();
        setShowDetailPost(true);
        setCurrentPost(item);
    };
    const handleEditPost = (item, e) => {
        e.stopPropagation();
        dispatch(isEditPost());
        dispatch(editPost(item));
        dispatch(currentMenu('new_post'));
        navigate('/quan-ly-bai-dang/dang-tin');
    };
    const handleDeletePost = (e) => {
        e.stopPropagation();
        setShowModal(true);
    };
    const handleConfirmDeletePost = () => {
        if (crrPost.status === 'waiting for approva') {
            deletedPost(crrPost._id).then((res) => console.log(res));
            let newBalance = 0;
            newBalance = udtUser
                ? updateBalance + crrPost.costPost
                : balance + crrPost.costPost;
            console.log(newBalance);
            const data = { balance: newBalance };
            updateUser(id, data).then((res) => {
                console.log(res);
                dispatch(updatedUser(res));
                alert('Xóa tin thành công!', 'success', '');
                setShowModal(false);
            });
            const transaction = {
                postCode: crrPost?.postCode,
                title: crrPost?.title,
                typeTransaction: 'Hoàn tiền',
                costs: crrPost.costPost,
                textNote: 'Hoàn tiền cho KH vì KH xóa tin',
                finalBalance: newBalance,
                createdBy: currentUser?._id,
            };
            createTransaction(transaction).then((res) => console.log(res));
            setDltPost(!dltPost);
            return;
        }
        deletedPost(crrPost._id).then((res) => {
            setDltPost(!dltPost);
            console.log(res);
        });
    };
    const handleOnClickPostItem = (item) => {
        if (
            item.status === 'expired' ||
            item.status === 'waiting for approva'
        ) {
            setShowAlert(true);

            const timerId = setTimeout(() => {
                setShowAlert(false);
            }, 2000);

            return () => clearTimeout(timerId);
        }
        dispatch(currentPost(item));
        navigate(config.routes.detailPage + `/${item._id}`);
    };

    const handleDeleteAll = () => {
        setShowDeleteAll(!showDeleteAll);
    };
    useEffect(() => {
        let newBalance = 0;
        newBalance = udtUser ? updateBalance + totalCost : balance + totalCost;
        const data = { balance: newBalance };
        totalCost &&
            updateUser(currentUser._id, data).then((res) =>
                dispatch(updatedUser(res)),
            );
    }, [totalCost]);
    const handleConfirmDeleteAllPost = () => {
        setShowDeleteAll(false);
        postList.map(async (item) => {
            if (item.status === 'waiting for approva') {
                setTotalCost((prev) => prev + item.costPost);
            }

            await deletedPost(item._id);
            setDltPost(!dltPost);
            alert('Xóa tin thành công!', 'success', '');
        });
    };

    const alert = (title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed) {
                type === 'success' && setShowModal(false);
            }
        });
    };
    const handleCategory = (name) => {
        switch (name) {
            case 'Phòng trọ':
                return 'Cho thuê nhà trọ, phòng trọ';
            case 'Nhà nguyên căn':
                return 'Cho thuê nhà nguyên căn';
            case 'Văn phòng':
                return 'Cho thuê văn phòng';
            case 'Chung cư - căn hộ':
                return 'Cho thuê chung cư, căn hộ';
            case 'Mặt bằng':
                return 'Cho thuê mặt bằng';
            case 'Tìm người ở ghép':
                return 'Tìm người ở ghép';
            default:
                return 'Cho thuê nhà trọ, phòng trọ';
        }
    };
    const handleStatus = (item) => {
        switch (item) {
            case 'waiting for approva':
                return 'Chờ duyệt';
            case 'approved':
                return 'Đã duyệt';
            case 'deleted':
                return 'Đã xóa';
            case 'expired':
                return 'Đã hết hạn';
            default:
                break;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('navbar')}>
                {item?.map((item, index) => (
                    <div
                        key={index}
                        className={cx(
                            'navbar-item',
                            indexId === index ? 'active' : '',
                        )}
                        onClick={() => {
                            setIndexId(index);
                            handleShowPost(index);
                        }}
                    >
                        <p className={cx('title')}>
                            {item} (
                            {(indexId === index && postList?.length) || 0})
                        </p>
                    </div>
                ))}
            </div>
            {postList?.length === 0 ? (
                <div className={cx('post-list-container')}>
                    <div className={cx('post-list')}>
                        <img src={images.emptyPost} alt="" />
                        <span className={cx('no-post')}>
                            Không có bài đăng nào
                        </span>
                        <button
                            className={cx('btn-new-post')}
                            onClick={() => {
                                dispatch(currentMenu('new_post'));
                                navigate('/quan-ly-bai-dang/dang-tin');
                            }}
                        >
                            Đăng tin mới
                        </button>
                    </div>
                </div>
            ) : (
                <div className={cx('post-list-container')}>
                    <div className={cx('select-all')}>
                        <input
                            id="cb"
                            type="checkbox"
                            className={cx('checkbox')}
                            checked={checkedAll}
                            onChange={() => setCheckedAll(!checkedAll)}
                            onClick={handleDeleteAll}
                        />
                        <label htmlFor="cb" className={cx('cb-text')}>
                            Chọn tất cả
                        </label>
                    </div>
                    {showDeleteAll && (
                        <div className={cx('delete-all')}>
                            <div className={cx('left-delete')}>
                                <input
                                    className={cx('cb-delete')}
                                    type="checkbox"
                                    checked={checkedAll}
                                    onClick={() => {
                                        setCheckedAll(!checkedAll);
                                        setShowDeleteAll(!showDeleteAll);
                                    }}
                                    onChange={() => {}}
                                />
                                <span className={cx('delete-text')}>
                                    Hiện tại có {postList?.length} tin được chọn
                                </span>
                            </div>

                            <button
                                className={cx('delete-btn')}
                                onClick={handleConfirmDeleteAllPost}
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                    {showAlert && (
                        <div className={cx('notify')}>
                            <span className={cx('notify-text')}>
                                Tin của bạn chưa được duyệt hoặc đã hết hạn!
                            </span>
                        </div>
                    )}
                    {postList?.map((item, index) => (
                        <div className={cx('post-item-wrapper')} key={index}>
                            {showDetailPost && (
                                <DetailPostOfUser item={crrPost} />
                            )}

                            <div
                                className={cx('post-item')}
                                onClick={() => handleOnClickPostItem(item)}
                            >
                                <div className={cx('top')}>
                                    <div className={cx('image')}>
                                        <img
                                            src={`${HOST_NAME}${item?.images[0]?.imagePath}`}
                                            alt="abc"
                                            className={cx('img')}
                                        />
                                    </div>
                                    <div className={cx('info')}>
                                        <div className={cx('heading-wrapper')}>
                                            <p className={cx('heading')}>
                                                {item.title}
                                            </p>
                                            <p className={cx('sub-heading')}>
                                                {handleCategory(
                                                    item?.category_name,
                                                )}{' '}
                                                • {item?.district},{' '}
                                                {item?.province}
                                            </p>
                                        </div>
                                        <div className={cx('describe')}>
                                            <div className={cx('status')}>
                                                <p className={cx('title')}>
                                                    Trạng thái
                                                </p>
                                                <p
                                                    className={cx(
                                                        'text-status',
                                                    )}
                                                >
                                                    {handleStatus(item?.status)}
                                                </p>
                                            </div>
                                            <div className={cx('status')}>
                                                <p className={cx('title')}>
                                                    Mã tin
                                                </p>
                                                <p className={cx('text')}>
                                                    {item?.postCode}
                                                </p>
                                            </div>
                                            <div className={cx('status')}>
                                                <p className={cx('title')}>
                                                    Loại tin
                                                </p>
                                                <p className={cx('text')}>
                                                    {item?.postType}
                                                </p>
                                            </div>
                                            <div className={cx('status')}>
                                                <p className={cx('title')}>
                                                    Ngày đăng
                                                </p>
                                                <p className={cx('text')}>
                                                    {item?.startDate}
                                                </p>
                                            </div>
                                            <div className={cx('status')}>
                                                <p className={cx('title')}>
                                                    Ngày hết hạn
                                                </p>
                                                <p className={cx('text')}>
                                                    {item?.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('bottom')}>
                                    <div className={cx('left')}>
                                        <input
                                            type="checkbox"
                                            className={cx('checkbox')}
                                            id="cb2"
                                            checked={checkedAll}
                                            onChange={() => {}}
                                        />
                                        <label
                                            htmlFor="cb2"
                                            className={cx('cb-text')}
                                        >
                                            #{index + 1}
                                        </label>
                                    </div>
                                    <div className={cx('right')}>
                                        <>
                                            <div
                                                className={cx('button')}
                                                onClick={(e) =>
                                                    handleDetailsPost(item, e)
                                                }
                                            >
                                                <TbListDetails
                                                    className={cx('icon')}
                                                />
                                                <span
                                                    className={cx(
                                                        'text-control',
                                                    )}
                                                >
                                                    Chi tiết
                                                </span>
                                            </div>
                                            <div
                                                className={cx('button')}
                                                onClick={(e) => {
                                                    handleEditPost(item, e);
                                                }}
                                            >
                                                <BiPencil
                                                    className={cx('icon')}
                                                />
                                                <span
                                                    className={cx(
                                                        'text-control',
                                                    )}
                                                >
                                                    Sửa tin
                                                </span>
                                            </div>
                                            <div
                                                className={cx('button')}
                                                onClick={(e) => {
                                                    setCurrentPost(item);
                                                    handleDeletePost(e);
                                                }}
                                            >
                                                <MdDeleteOutline
                                                    className={cx('icon')}
                                                />
                                                <span
                                                    className={cx(
                                                        'text-control',
                                                    )}
                                                >
                                                    Xóa tin
                                                </span>
                                            </div>
                                        </>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showModal && (
                        <div
                            className={cx('modal')}
                            onClick={() => setShowModal(false)}
                        >
                            <div
                                className={cx('modal-content')}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={cx('header')}>
                                    <h4 className={cx('title-header')}>
                                        Xóa tin
                                    </h4>
                                    <IoCloseOutline
                                        className={cx('close')}
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>
                                <div className={cx('content')}>
                                    <div className={cx('top-content')}>
                                        <div className={cx('post-code')}>
                                            <span className={cx('text')}>
                                                Mã tin
                                            </span>
                                            <span className={cx('code')}>
                                                {crrPost?.postCode}
                                            </span>
                                        </div>
                                        <div className={cx('refund')}>
                                            <span className={cx('text')}>
                                                Hoàn tiền
                                            </span>
                                            <span className={cx('money')}>
                                                {crrPost?.status ===
                                                'waiting for approva'
                                                    ? crrPost?.costPost
                                                    : 0}{' '}
                                                <span className={cx('unit')}>
                                                    {' '}
                                                    VND
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className={cx('bottom-content')}>
                                        <AiFillInfoCircle
                                            className={cx('icon-warning')}
                                        />
                                        <span className={cx('text-bold')}>
                                            Lưu ý:{' '}
                                        </span>
                                        <span className={cx('text-normal')}>
                                            Tin đăng sau khi xóa sẽ không thể
                                            khôi phục
                                        </span>
                                    </div>
                                    <div className={cx('action')}>
                                        <Button
                                            text
                                            className={cx('cancel')}
                                            onClick={() => setShowModal(false)}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            primary
                                            className={cx('submit')}
                                            onClick={handleConfirmDeletePost}
                                        >
                                            Xóa tin
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NavbarPostList;
