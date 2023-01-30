import classNames from 'classnames/bind';
import styles from './RevenueManagement.module.scss';
import * as React from 'react';
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import {
    filterAllTransactionByDate,
    filterAllTransactionByMonth,
    getAllTransactionByDistrict,
} from '~/api';
import { BsInfoCircle } from 'react-icons/bs';
import { detailRevenue, revenueTotal } from '~/redux/slice/adminSlice';
import Box from '@mui/material/Box';
import config from '~/config';
import { useRef } from 'react';
import Chart from '../../../HomeAdmin/components/Chart';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;

function RevenueManagement() {
    const selectionItems = ['Theo ngày', 'Theo tháng', 'Theo khu vực'];
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [listRevenue, setListRevenue] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [selectionInputValue, setSelectionInputValue] = useState('Theo ngày');
    const [showSelection, setShowSelection] = useState(false);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    useEffect(() => {
        if (selectionInputValue === 'Theo khu vực') {
            getAllTransactionByDistrict().then((res) =>
                setListRevenue(res.result),
            );
            return;
        }
        if (selectionInputValue === 'Theo ngày') {
            filterAllTransactionByDate().then((res) => setListRevenue(res));
            return;
        }
        if (selectionInputValue === 'Theo tháng') {
            filterAllTransactionByMonth().then((res) => {
                console.log(res.result);
                setListRevenue(res.result);
            });
            return;
        }
    }, [selectionInputValue]);
    console.log(listRevenue);
    useEffect(() => {
        filterAllTransactionByDate().then((res) => setListRevenue(res));
    }, []);
    useEffect(() => {
        let total = 0;
        listRevenue.length &&
            listRevenue.map((item) => (total += item?.totalTransaction));
        setTotalRevenue(total);
    }, [listRevenue]);
    console.log(listRevenue);
    console.log(totalRevenue);
    const byDate = [
        selectionInputValue === 'Theo ngày'
            ? {
                  field: '_id',
                  headerName: 'Ngày tháng',
                  type: 'String',
                  width: 150,
                  valueGetter: (params) => {
                      var options = {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                      };
                      const d = new Date(params.row._id);
                      return d.toLocaleDateString('vni', options);
                  },
              }
            : selectionInputValue === 'Theo tháng'
            ? {
                  field: '_id',
                  headerName: 'Ngày tháng',
                  type: 'String',
                  width: 150,
                  valueGetter: (params) => {
                      const str = params.row._id.split('/');
                      return `Tháng ${str[1]}/${str[0]}`;
                  },
              }
            : {
                  field: '_id',
                  headerName: 'Khu vực',
                  type: 'String',
                  width: 150,
                  valueGetter: (params) => params.row._id,
              },
        {
            field: 'count',
            headerName: 'Tổng số giao dịch',
            width: 180,
            valueGetter: (params) => {
                return params.row.count + ' giao dịch';
            },
        },
        {
            field: 'totalTransaction',
            headerName: 'Doanh thu',
            width: 250,
            valueGetter: (params) => {
                return `${formatCash(
                    params.row.totalTransaction.toString(),
                )} VND`;
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
                            onClick={() => handleDetailRevenue(params.row)}
                        >
                            {' '}
                            <BsInfoCircle className={cx('icon')} />
                            <span className={cx('text')}>Chi tiết</span>
                        </button>
                    </div>
                );
            },
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
    const handleDetailRevenue = (item) => {
        if (selectionInputValue === 'Theo ngày') {
            const d = item._id.split('/');
            if (d[2][0] === '0') {
                d[2] = d[2][1];
            }
            if (d[1][0] === '0') {
                d[1] = d[1][1];
            }
            const str = `${d[2]}/${d[1]}/${d[0]}`;
            dispatch(revenueTotal(item.totalTransaction));
            dispatch(detailRevenue(str));
            // getTransactionOfDay(`date=${str}`).then((res) => {
            //     dispatch(detailRevenue(res.transaction));
            navigate(config.routes.adminDetailRevenue);
            // });
            return;
        }
        if (selectionInputValue === 'Theo tháng') {
            const str = item._id.split('/');
            dispatch(detailRevenue(`Tháng ${str[1]}/${str[0]}`));
            dispatch(revenueTotal(item.totalTransaction));
            navigate(config.routes.adminDetailRevenue);
            return;
        }
        if (selectionInputValue === 'Theo khu vực') {
            console.log(item);
            dispatch(detailRevenue(item._id));
            dispatch(revenueTotal(item.totalTransaction));
            navigate(config.routes.adminDetailRevenue);

            return;
        }
    };
    const selectionRef = useRef();
    const handleClickOutside = (e) => {
        const { target } = e;
        if (selectionRef.current === null) {
            setShowSelection(false);
            return;
        }
        if (selectionRef.current === undefined) {
            setShowSelection(false);
            return;
        }
        if (!selectionRef.current.contains(target)) {
            setShowSelection(false);
            return;
        }
    };
    const CustomFooterTotal = () => {
        return (
            <Box className={cx('footer')}>
                <div className={cx('left')}>
                    <span className={cx('title-revenue')}>Tổng doanh thu:</span>
                    <span className={cx('total-revenue')}>
                        {formatCash(totalRevenue.toString())}
                    </span>
                    <span className={cx('unit')}>VND</span>
                </div>
                <div className={cx('right')}>
                    Tổng số <strong>{listRevenue?.length}</strong> Giao dịch
                </div>
            </Box>
        );
    };

    return (
        <>
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    padding: '24px',
                    paddingTop: '70px',
                }}
                onClick={handleClickOutside}
            >
                <div className={cx('selection')}>
                    <label htmlFor="input">Doanh thu</label>
                    <div className={cx('input-wrapper')}>
                        <input
                            type="text"
                            id="input"
                            className={cx('input-selection')}
                            value={selectionInputValue}
                            readOnly
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSelection(!showSelection);
                            }}
                        />
                        <MdOutlineKeyboardArrowDown
                            className={cx('icon-selection')}
                        />
                        {showSelection && (
                            <div className={cx('selection-list')}>
                                {selectionItems.map((item, index) => (
                                    <p
                                        className={cx('selection-item')}
                                        key={index}
                                        onClick={() => {
                                            setSelectionInputValue(item);
                                            setShowSelection(false);
                                        }}
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <ThemeProvider theme={theme}>
                    <DataGrid
                        disableSelectionOnClick
                        rows={listRevenue}
                        columns={byDate}
                        pageSize={listRevenue?.length}
                        rowsPerPageOptions={[listRevenue?.length]}
                        getRowId={(row) => row._id}
                        className={cx('list-user')}
                        style={{
                            fontSize: '1.4rem',
                            textAlign: 'left',
                            height: '500px',
                        }}
                        components={{
                            Toolbar: GridToolbar,
                            Footer: CustomFooterTotal,
                        }}
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
                    />
                </ThemeProvider>
                <Chart
                    data={listRevenue}
                    title="Biểu đồ doanh thu"
                    dataKey="totalTransaction"
                    name={'_id'}
                />
            </div>
        </>
    );
}

export default RevenueManagement;
