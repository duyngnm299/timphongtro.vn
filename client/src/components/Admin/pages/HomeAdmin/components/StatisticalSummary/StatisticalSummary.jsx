import classNames from 'classnames/bind';
import styles from './StatisticalSummary.module.scss';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import {
    filterAllTransactionByMonth,
    filterPostByMonth,
    filterUserByMonth,
} from '~/api';
const cx = classNames.bind(styles);

function StatisticalSummary() {
    const [listRevenue, setListRevenue] = useState([]);
    const [listNewUser, setListNewUser] = useState([]);

    const [listPost, setListPost] = useState([]);
    const [rateRevenue, setRateRevenue] = useState(0);
    const [rateNewUser, setRateNewUser] = useState(0);
    const [ratePost, setRatePost] = useState(0);

    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    useEffect(() => {
        filterAllTransactionByMonth().then((res) => setListRevenue(res.result));
        filterUserByMonth().then((res) => setListNewUser(res.result));
        filterPostByMonth().then((res) => setListPost(res.result));
    }, []);
    useEffect(() => {
        listRevenue.length &&
            setRateRevenue(
                ((listRevenue[listRevenue?.length - 1].totalTransaction -
                    listRevenue[listRevenue?.length - 2].totalTransaction) /
                    listRevenue[listRevenue?.length - 2].totalTransaction) *
                    100,
            );
    }, [listRevenue]);
    useEffect(() => {
        listNewUser.length &&
            setRateNewUser(
                ((listNewUser[listNewUser?.length - 1].count -
                    listNewUser[listNewUser?.length - 2].count) /
                    listNewUser[listNewUser?.length - 2].count) *
                    100,
            );
    }, [listNewUser]);
    useEffect(() => {
        listPost.length &&
            setRatePost(
                ((listPost[listPost?.length - 1]?.count -
                    listPost[listPost?.length - 2]?.count) /
                    listPost[listPost?.length - 2]?.count) *
                    100,
            );
    }, [listPost]);
    console.log(rateNewUser);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('revenue')}>
                    <p className={cx('title')}>Doanh thu</p>
                    <div className={cx('revenue-data')}>
                        <div className={cx('left')}>
                            <span className={cx('left-text')}>
                                {listRevenue.length &&
                                    parseFloat(
                                        formatCash(
                                            listRevenue[
                                                listRevenue.length - 1
                                            ].totalTransaction.toString(),
                                        ),
                                    ).toFixed(2)}
                            </span>
                            <span className={cx('unit')}>triệu</span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('dot')}>·</span>
                            <span className={cx('right-text')}>
                                {rateRevenue.toFixed(2) + ' %'}
                            </span>
                            {rateRevenue > 0 ? (
                                <span className={cx('icon', 'up')}>
                                    <AiOutlineArrowUp />
                                </span>
                            ) : rateRevenue < 0 ? (
                                <span className={cx('icon', 'down')}>
                                    <AiOutlineArrowDown />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span className={cx('text')}>So với tháng trước</span>
                </div>
                <div className={cx('revenue')}>
                    <p className={cx('title')}>Số lượng thành viên mới</p>
                    <div className={cx('revenue-data')}>
                        <div className={cx('left')}>
                            <span className={cx('left-text')}>
                                {listNewUser?.length &&
                                    listNewUser[listNewUser?.length - 1]?.count}
                            </span>
                            <span className={cx('unit')}>thành viên</span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('dot')}>·</span>
                            <span className={cx('right-text')}>
                                {rateNewUser.toFixed(2)} %
                            </span>
                            {rateNewUser > 0 ? (
                                <span className={cx('icon', 'up')}>
                                    <AiOutlineArrowUp />
                                </span>
                            ) : rateRevenue < 0 ? (
                                <span className={cx('icon', 'down')}>
                                    <AiOutlineArrowDown />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span className={cx('text')}>So với tháng trước</span>
                </div>
                <div className={cx('revenue')}>
                    <p className={cx('title')}>Số lượng bài đăng</p>
                    <div className={cx('revenue-data')}>
                        <div className={cx('left')}>
                            <span className={cx('left-text')}>
                                {listPost?.length &&
                                    listPost[listPost?.length - 1]?.count}
                            </span>
                            <span className={cx('unit')}>bài đăng</span>
                        </div>
                        <div className={cx('right')}>
                            <span className={cx('dot')}>·</span>
                            <span className={cx('right-text')}>
                                {ratePost.toFixed(2)} %
                            </span>
                            {ratePost > 0 ? (
                                <span className={cx('icon', 'up')}>
                                    <AiOutlineArrowUp />
                                </span>
                            ) : rateRevenue < 0 ? (
                                <span className={cx('icon', 'down')}>
                                    <AiOutlineArrowDown />
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <span className={cx('text')}>So với tháng trước</span>
                </div>
            </div>
        </div>
    );
}

export default StatisticalSummary;
