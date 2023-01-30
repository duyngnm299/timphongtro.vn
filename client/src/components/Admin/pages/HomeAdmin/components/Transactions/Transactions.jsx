import classNames from 'classnames/bind';
import { useState } from 'react';
import { useEffect } from 'react';
import { getTransactionNewest, getUser } from '~/api';
import styles from './Transactions.module.scss';
const cx = classNames.bind(styles);
function Transactions() {
    const [listTransaction, setListTransaction] = useState([]);
    useEffect(() => {
        getTransactionNewest().then((res) => setListTransaction(res.result));
        return () => {};
    }, []);
    useEffect(() => {
        listTransaction?.map(async (item) => {
            const res = await getUser(item?.createdBy[0]);
            item['fullName'] = res?.user?.fullName;
            item['profilePicture'] = res?.user?.profilePicture;
            return item;
        });
    }, [listTransaction]);
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    return (
        <div className={cx('wrapper')}>
            <h4 className={cx('title')}>Giao dịch gần nhất</h4>
            <>
                <table className={cx('table-container')}>
                    <thead>
                        <tr className={cx('table-row-header')}>
                            <th className={cx('table-column')}>Ngày</th>
                            <th className={cx('table-column')}>Mã giao dịch</th>
                            <th className={cx('table-column')}>Số tiền</th>
                            <th className={cx('table-column')}>Loại</th>
                            <th className={cx('table-column')}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className={cx('table-body')}>
                        <>
                            {listTransaction?.length
                                ? listTransaction?.map((item, index) => {
                                      return (
                                          <tr
                                              key={index}
                                              className={cx('table-row')}
                                          >
                                              <td className={cx('date')}>
                                                  {item?.dayCreated}
                                              </td>
                                              <td className={cx('info-user')}>
                                                  {item?.transactionCode}
                                              </td>

                                              <td className={cx('price')}>
                                                  {`${formatCash(
                                                      item?.costs.toString(),
                                                  )} VND`}
                                              </td>
                                              <td className={cx('type')}>
                                                  {item?.typeTransaction}
                                              </td>
                                              <td className={cx('status')}>
                                                  Thành công
                                              </td>
                                          </tr>
                                      );
                                  })
                                : ''}
                        </>
                    </tbody>
                </table>
            </>
        </div>
    );
}

export default Transactions;
