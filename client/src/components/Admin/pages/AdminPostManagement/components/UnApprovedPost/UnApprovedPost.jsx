import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './UnApprovedPost.module.scss';
import * as React from 'react';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiPencil } from 'react-icons/bi';
import { useEffect } from 'react';
import { adminCensorPost, deletedPost, getAllPostApproved } from '~/api';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import config from '~/config';
import { useDispatch } from 'react-redux';
import { detailPost } from '~/redux/slice/adminSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function UnApprovedPost() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listPosts, setListPosts] = useState([]);
    const [deletePost, setDeletedPost] = useState(false);

    useEffect(() => {
        getAllPostApproved('status=waiting for approva').then((res) =>
            setListPosts(res.posts),
        );
    }, []);

    useEffect(() => {
        getAllPostApproved('status=waiting for approva').then((res) =>
            setListPosts(res.posts),
        );
    }, [deletePost]);
    const handleEditPost = (post) => {
        dispatch(detailPost(post));
        navigate(config.routes.adminDetailPost + `/${post._id}`);
    };
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    const columns = [
        { field: 'postCode', headerName: 'Mã bài đăng', width: 120 },
        {
            field: 'title',
            headerName: 'Tiêu đề',
            width: 240,
        },
        { field: 'category_name', headerName: 'Thể loại', width: 100 },
        {
            field: 'location',
            headerName: 'Khu vực',
            type: 'String',
            width: 150,
            valueGetter: (params) => `${params.row.district}`,
        },
        {
            field: 'area',
            headerName: 'Diện tích',
            type: 'Number',
            width: 90,
            valueGetter: (params) => {
                return `${params.row.area} m²`;
            },
        },
        {
            field: 'price',
            headerName: 'Giá tiền',
            type: 'Number',
            width: 90,
            valueGetter: (params) => {
                return `${parseFloat(
                    formatCash(params.row.price.toString()),
                ).toFixed(1)} triệu`;
            },
        },
        {
            field: 'createdAt',
            headerName: 'Ngày đăng',
            type: 'String',
            width: 100,
            valueGetter: (params) => {
                var options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                };
                const d = new Date(params.row.createdAt);
                return d.toLocaleDateString('vni', options);
            },
        },
        {
            field: 'action',
            headerName: 'Thao tác',
            flex: 1,
            renderCell: (params) => {
                return (
                    <div className={cx('action')}>
                        <button
                            className={cx('edit-btn')}
                            onClick={() => handleEditPost(params.row)}
                        >
                            {' '}
                            <BiPencil className={cx('icon')} />
                            <span className={cx('text')}>Chi tiết</span>
                        </button>
                        <button
                            className={cx('censor-btn')}
                            onClick={() => handleCensorPost(params.row._id)}
                        >
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={cx('icon')}
                            />
                            <span className={cx('text')}>Duyệt</span>
                        </button>
                        <button
                            className={cx('delete-btn')}
                            onClick={() => handleDeletedPost(params.row)}
                        >
                            <AiOutlineDelete className={cx('icon')} />{' '}
                            <span className={cx('text')}>Xóa</span>
                        </button>
                    </div>
                );
            },
        },
    ];
    const handleCensorPost = (id) => {
        const data = {
            status: 'approved',
        };
        adminCensorPost(id, data).then((res) => {
            console.log(res.post);
            setDeletedPost(!deletePost);
            alert('Duyệt bài thành công', 'success');
        });
    };
    const handleDeletedPost = (item) => {
        alert2(item, 'Bạn có muốn xóa không?', '', '');
    };
    const alert = (title, type) => {
        Swal.fire({
            title: `<h2 class="notify-title" style="font-weight: normal">${title}</h2>`,
            icon: type,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">Xác nhận</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        });
    };
    const alert2 = (item, title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title" style="font-weight: normal">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            showCancelButton: true,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">Xóa</p>',
            cancelButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">Hủy</p>',
            customClass: {
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
            },
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deletedPost(item?._id);
                // const createdBy = item?.createdBy[0];
                // const res = await getUser(createdBy);
                // const newBalance = JSON.stringify({
                //     balance: item?.costPost + res?.user?.balance,
                // });
                // const udt = await updateUser(createdBy, newBalance);

                // dispatch(adminDeletedPost());
                setDeletedPost(!deletePost);
                alert('Xóa thành công!', 'success');
                return;
            }
        });
    };
    const theme = createTheme(
        {
            palette: {
                primary: { main: '#1976d2' },
            },
        },
        viVN,
    );
    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: 'calc(100vh - 80px - 12px)',
                    padding: '24px',
                    paddingTop: '70px',
                }}
            >
                <ThemeProvider theme={theme}>
                    <DataGrid
                        sx={{
                            '& .css-1jbbcbn-MuiDataGrid-columnHeaderTitle': {
                                fontWeight: '700 !important',
                            },
                            '& .css-levciy-MuiTablePagination-displayedRows': {
                                fontSize: '1.4rem',
                            },
                            '& .css-1j9kmqg-MuiDataGrid-toolbarContainer': {
                                display: 'block',
                                float: 'right',
                            },
                            '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root:nth-of-type(1)':
                                {
                                    display: 'none',
                                },
                            '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root:nth-of-type(2)':
                                {
                                    display: 'none',
                                },
                            '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root:nth-of-type(3)':
                                {
                                    display: 'none',
                                },
                            '& .css-1knaqv7-MuiButtonBase-root-MuiButton-root':
                                {
                                    fontSize: '1.2rem',
                                    fontFamily: 'var(--font-family)',
                                },
                            '& .css-f3jnds-MuiDataGrid-columnHeaders': {
                                borderTop: '1px solid rgba(224, 224, 224, 1);',
                            },
                            '& .css-i4bv87-MuiSvgIcon-root': {
                                width: '1.4em',
                                height: '1.4em',
                            },
                            '& .css-17jjc08-MuiDataGrid-footerContainer': {
                                maxHeight: '40px',
                            },
                        }}
                        disableSelectionOnClick
                        rows={listPosts}
                        columns={columns}
                        pageSize={listPosts?.length}
                        rowsPerPageOptions={[listPosts?.length]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        className={cx('list-user')}
                        style={{
                            fontSize: '1.4rem',
                            textAlign: 'left',
                            height: '500px',
                        }}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </ThemeProvider>
            </div>
        </>
    );
}

export default UnApprovedPost;
