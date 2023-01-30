import classNames from 'classnames/bind';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as locales from 'react-date-range/dist/locale';
import { Calendar } from 'react-date-range';
import { FiCalendar } from 'react-icons/fi';
import styles from './Transaction.module.scss';
import { BsCaretDownFill } from 'react-icons/bs';
import { useRef, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { BiRefresh } from 'react-icons/bi';
import { useEffect } from 'react';
import { filterTransaction, getTransactionOfUser } from '~/api';
const cx = classNames.bind(styles);
const transaction_items = ['Tất cả', 'Nạp tiền', 'Thanh toán', 'Hoàn tiền'];
function Transaction() {
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    useEffect(() => {
        currentUser &&
            getTransactionOfUser(currentUser?._id).then((res) =>
                setListTransaction(res.transaction),
            );
        return () => {};
    }, []);
    console.log(currentUser?.createdAt);
    console.log(new Date(currentUser?.createdAt));
    const [listTransaction, setListTransaction] = useState([]);
    const [date, setDate] = useState(new Date(currentUser?.createdAt));
    const [dateTo, setDateTo] = useState(new Date());
    console.log(date);
    console.log(dateTo);
    const [transactionValue, setTransactionValue] = useState('Tất cả');
    const [currentIndexTrancsaction, setCurrentIndexTransaction] = useState(0);
    const [postCode, setPostCode] = useState('');
    const [showCalendarFrom, setShowCalendarFrom] = useState(false);
    const [showCalendarTo, setShowCalendarTo] = useState(false);
    const [showTransactionType, setShowTransactionType] = useState(false);
    const calendarRef = useRef();
    const calendarToRef = useRef();
    const transactionTypeRef = useRef();
    const handleClickOutside = (e) => {
        const { target } = e;
        if (calendarRef?.current === null) {
            setShowCalendarFrom(false);
            return;
        }
        if (calendarRef?.current === undefined) {
            setShowCalendarFrom(false);
            return;
        }
        if (!calendarRef?.current?.contains(target)) {
            setShowCalendarFrom(false);
            return;
        }
    };
    const handleClickOutside2 = (e) => {
        const { target } = e;
        if (calendarToRef?.current === null) {
            setShowCalendarTo(false);
            return;
        }
        if (calendarToRef?.current === undefined) {
            setShowCalendarTo(false);
            return;
        }
        if (!calendarToRef?.current.contains(target)) {
            setShowCalendarTo(false);
            return;
        }
    };
    const handleClickOutside3 = (e) => {
        const { target } = e;
        if (transactionTypeRef?.current === null) {
            setShowTransactionType(false);
            return;
        }
        if (transactionTypeRef?.current === undefined) {
            setShowTransactionType(false);
            return;
        }
        if (!transactionTypeRef?.current.contains(target)) {
            setShowTransactionType(false);
            return;
        }
    };
    const columns = [
        {
            field: 'createdAt',
            headerName: 'Ngày',
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
        { field: 'transactionCode', headerName: 'Mã giao dịch', width: 100 },

        { field: 'title', headerName: 'Tiêu đề', width: 348 },
        {
            field: 'typeTransaction',
            headerName: 'Loại',
            type: 'String',
            width: 110,
        },
        {
            field: 'costs',
            headerName: 'Số tiền',
            type: 'String',
            width: 110,
            valueGetter: (params) => {
                const costs = params?.row?.costs;
                if (costs) {
                    return `${formatCash(costs.toString())} VND`;
                }
            },
        },
        {
            field: 'textNote',
            headerName: 'Ghi chú',
            type: 'String',
            width: 230,
        },
        {
            field: 'finalBalance',
            headerName: 'Số dư cuối cùng',
            type: 'String',
            width: 136,
            valueGetter: (params) => {
                const finalBalance = params?.row?.finalBalance;
                if (finalBalance) {
                    return `${formatCash(finalBalance.toString())} VND`;
                }
            },
        },
    ];
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + ',') + prev;
            });
    };
    const handleFilterTransaction = () => {
        filterTransaction(
            `createdBy=${
                currentUser?._id
            }&dateFrom=${date}&dateTo=${dateTo}&postCode=${postCode}&typeTransaction=${
                transactionValue === 'Tất cả' ? '' : transactionValue
            }`,
        ).then((res) => setListTransaction(res?.result));
    };

    const handleRefresh = () => {
        getTransactionOfUser(currentUser?._id).then((res) =>
            setListTransaction(res.transaction),
        );
    };
    return (
        <div
            className={cx('wrapper')}
            onClick={(e) => {
                handleClickOutside(e);
                handleClickOutside2(e);
                handleClickOutside3(e);
            }}
        >
            <div className={cx('container')}>
                <h4 className={cx('heading')}>lịch sử giao dịch</h4>
                <div className={cx('content')}>
                    <div className={cx('sort')}>
                        <div className={cx('date-from')}>
                            <div className={cx('input-wrapper')}>
                                <label htmlFor="date-from">Từ ngày</label>
                                <input
                                    id="date-from"
                                    value={date.toLocaleDateString() || ''}
                                    type="text"
                                    className={cx(
                                        'input-right',
                                        'input-calendar',
                                    )}
                                    onChange={(e) => setDate(e.target.value)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCalendarFrom(true);
                                        setShowCalendarTo(false);
                                    }}
                                />
                                <span className={cx('dpk-icon')}>
                                    <FiCalendar />
                                </span>
                            </div>
                            {showCalendarFrom && (
                                <div ref={calendarRef}>
                                    <Calendar
                                        className={cx('calendar')}
                                        onChange={(item) => {
                                            setDate(item);
                                            setShowCalendarFrom(false);
                                        }}
                                        minDate={
                                            new Date(currentUser?.createdAt)
                                        }
                                        locale={locales['vi']}
                                        date={date}
                                        focusedInput={showCalendarFrom}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={cx('date-from')}>
                            <div className={cx('input-wrapper')}>
                                <label htmlFor="date-to">Đến ngày</label>
                                <input
                                    id="date-to"
                                    value={dateTo.toLocaleDateString() || ''}
                                    type="text"
                                    className={cx(
                                        'input-right',
                                        'input-calendar',
                                    )}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCalendarTo(true);
                                        setShowCalendarFrom(false);
                                    }}
                                />
                                <span className={cx('dpk-icon')}>
                                    <FiCalendar />
                                </span>
                            </div>
                            {showCalendarTo && (
                                <div ref={calendarToRef}>
                                    <Calendar
                                        className={cx('calendar')}
                                        onChange={(item) => {
                                            setDateTo(item);
                                            setShowCalendarTo(false);
                                        }}
                                        maxDate={new Date()}
                                        locale={locales['vi']}
                                        date={dateTo}
                                        focusedInput={showCalendarTo}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={cx('date-from')}>
                            <div className={cx('input-wrapper')}>
                                <label htmlFor="transaction-type">
                                    Loại giao dịch
                                </label>
                                <input
                                    id="transaction-type"
                                    value={transactionValue}
                                    type="text"
                                    className={cx('input-right')}
                                    onChange={(e) =>
                                        setTransactionValue(e.target.value)
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowTransactionType(true);
                                        setShowCalendarTo(false);
                                        setShowCalendarFrom(false);
                                    }}
                                    readOnly
                                />
                                <span className={cx('dpk-icon')}>
                                    <BsCaretDownFill />
                                </span>
                            </div>
                            {showTransactionType && (
                                <div
                                    className={cx('transaction-type-list')}
                                    ref={transactionTypeRef}
                                >
                                    {transaction_items.map((item, index) => (
                                        <p
                                            key={index}
                                            className={cx(
                                                'transaction-type-item',
                                                index ===
                                                    currentIndexTrancsaction &&
                                                    'active',
                                            )}
                                            onClick={() => {
                                                setCurrentIndexTransaction(
                                                    index,
                                                );
                                                setTransactionValue(item);
                                                setShowTransactionType(false);
                                            }}
                                        >
                                            {item}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={cx('date-from')}>
                            <div className={cx('input-wrapper')}>
                                <label htmlFor="post-code">Mã tin</label>
                                <input
                                    id="post-code"
                                    value={postCode}
                                    type="text"
                                    placeholder="Nhập mã tin"
                                    className={cx('input-right')}
                                    onChange={(e) =>
                                        setPostCode(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <button
                            className={cx('btn-search')}
                            onClick={handleFilterTransaction}
                        >
                            <BiSearch className={cx('icon')} />
                            <span className={cx('btn-text')}>Tìm kiếm</span>
                        </button>
                        <button
                            className={cx('btn-refresh')}
                            onClick={handleRefresh}
                        >
                            <BiRefresh className={cx('icon-refresh')} />
                        </button>
                    </div>

                    <div className={cx('table-transaction')}>
                        <div
                            style={{
                                width: '100%',
                                height: '407px',
                                marginTop: '48px',
                            }}
                        >
                            <DataGrid
                                sx={{
                                    '& .css-1jbbcbn-MuiDataGrid-columnHeaderTitle':
                                        {
                                            fontWeight: '700 !important',
                                        },
                                    '& .css-levciy-MuiTablePagination-displayedRows':
                                        {
                                            fontSize: '1.4rem',
                                        },
                                    '& .css-1j9kmqg-MuiDataGrid-toolbarContainer':
                                        {
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
                                        borderTop:
                                            '1px solid rgba(224, 224, 224, 1);',
                                    },
                                    '& .css-i4bv87-MuiSvgIcon-root': {
                                        width: '1.4em',
                                        height: '1.4em',
                                    },
                                    '& .css-17jjc08-MuiDataGrid-footerContainer':
                                        {
                                            maxHeight: '40px',
                                        },
                                }}
                                disableSelectionOnClick
                                rows={listTransaction}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                getRowId={(row) => row._id}
                                className={cx('list-user')}
                                style={{
                                    fontSize: '1.4rem',
                                    textAlign: 'left',
                                }}
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transaction;
