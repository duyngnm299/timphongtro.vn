import classNames from 'classnames/bind';
import styles from './TransactionList.module.scss';
import * as React from 'react';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import images from '~/assets/images';
import { getAllTransaction, getUser } from '~/api';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function TransactionList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listTransaction, setListTransaction] = useState([]);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    useEffect(() => {
        getAllTransaction().then((res) => setListTransaction(res?.transaction));
    }, []);
    useEffect(() => {
        listTransaction?.map(async (item) => {
            const res = await getUser(item?.createdBy);
            console.log(res);
            item['fullName'] = res?.user?.fullName;
            item['profilePicture'] = res?.user?.profilePicture;
            return item;
        });
    }, [listTransaction]);
    console.log(listTransaction);
    const columns = [
        {
            field: 'createdAt',
            headerName: 'Ngày tháng',
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
        { field: 'transactionCode', headerName: 'Mã giao dịch', width: 120 },
        { field: 'title', headerName: 'Tiêu đề', width: 300 },

        {
            field: 'user',
            headerName: 'Khách hàng',
            width: 200,
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
        {
            field: 'typeTransaction',
            headerName: 'Loại',
            type: 'String',
            width: 100,
        },
        {
            field: 'costs',
            headerName: 'Số tiền',
            type: 'Date',
            width: 110,
            valueGetter: (params) => {
                return `${formatCash(params.row.costs.toString())} VND`;
            },
        },
        {
            field: 'textNote',
            headerName: 'Ghi chú',
            type: 'String',
            flex: 1,
        },
    ];
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
                        rows={listTransaction}
                        columns={columns}
                        pageSize={listTransaction?.length}
                        rowsPerPageOptions={[listTransaction?.length]}
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

export default TransactionList;
