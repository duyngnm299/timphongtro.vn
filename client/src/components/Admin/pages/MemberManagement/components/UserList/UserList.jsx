import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './UserList.module.scss';
import * as React from 'react';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AiOutlineDelete } from 'react-icons/ai';
import { BiPencil } from 'react-icons/bi';
import { useEffect } from 'react';
import { deletedUser, getAllUser } from '~/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import config from '~/config';
import { useDispatch } from 'react-redux';
import { editedUser } from '~/redux/slice/adminSlice';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function UserList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listUsers, setListUsers] = useState([]);
    const [deleteUser, setDeleteUser] = useState(false);

    useEffect(() => {
        getAllUser().then((res) => setListUsers(res.allUser));
    }, []);
    useEffect(() => {
        getAllUser().then((res) => setListUsers(res.allUser));
    }, [deleteUser]);
    const handleEditUser = (user) => {
        dispatch(editedUser(user));
        navigate(config.routes.detailMember + `/${user._id}`);
    };
    const columns = [
        {
            field: 'createdAt',
            headerName: 'Ngày đăng ký',
            type: 'String',
            width: 120,
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
        { field: 'memberCode', headerName: 'Mã thành viên', width: 120 },
        {
            field: 'user',
            headerName: 'Khách hàng',
            width: 220,
            renderCell: (params) => {
                return (
                    <div
                        className={cx('full-name')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: '240px',
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={
                                params.row.profilePicture
                                    ? `${HOST_NAME}${params.row.profilePicture}`
                                    : images.defaultAvt
                            }
                            alt=""
                            className={cx('avatar')}
                        />
                        <span className={cx('full-name-text')}>
                            {params.row.fullName || params.row.username || ''}
                        </span>
                    </div>
                );
            },
        },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'gender',
            headerName: 'Giới tính',
            type: 'String',
            width: 90,
            valueGetter: (params) =>
                params.row.gender === 'male'
                    ? 'Nam'
                    : params.row.gender === 'female'
                    ? 'Nữ'
                    : '',
        },
        {
            field: 'dateOfBirth',
            headerName: 'Ngày sinh',
            type: 'Date',
            width: 110,
        },
        {
            field: 'phoneNumber',
            headerName: 'Điện thoại',
            type: 'String',
            width: 110,
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
                            onClick={() => handleEditUser(params.row)}
                        >
                            {' '}
                            <BiPencil className={cx('icon')} />
                            <span className={cx('text')}>Chỉnh sửa</span>
                        </button>

                        <button
                            className={cx('delete-btn')}
                            onClick={() => handleDeleteUser(params.row._id)}
                        >
                            <AiOutlineDelete className={cx('icon')} />{' '}
                            <span className={cx('text')}>Xóa</span>
                        </button>
                    </div>
                );
            },
        },
    ];
    const handleDeleteUser = (id) => {
        alert2(id, 'Bạn có muốn xóa không?', '', '');
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
    const alert2 = (id, title, type, message) => {
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
                await deletedUser(id);
                setDeleteUser(!deleteUser);
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
                    height: 'calc(100vh - 92px)',
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
                        rows={listUsers}
                        columns={columns}
                        pageSize={listUsers.length}
                        rowsPerPageOptions={[listUsers.length]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        className={cx('list-user')}
                        style={{ fontSize: '1.4rem', textAlign: 'left' }}
                        components={{
                            Toolbar: GridToolbar,
                        }}
                    />
                </ThemeProvider>
            </div>
        </>
    );
}

export default UserList;
