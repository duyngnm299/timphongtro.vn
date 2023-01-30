import classNames from 'classnames/bind';
import styles from './HomeAdmin.module.scss';
import StatisticalSummary from './components/StatisticalSummary';
import Chart from './components/Chart';
import NewUsers from './components/NewUsers';
import Transactions from './components/Transactions';
import { useEffect } from 'react';
import { getAllTransactionByDistrict } from '~/api';
import { useState } from 'react';
const cx = classNames.bind(styles);

function HomeAdmin() {
    const [listRevenue, setListRevenue] = useState([]);
    useEffect(() => {
        getAllTransactionByDistrict().then((res) => setListRevenue(res.result));
    }, []);
    console.log(listRevenue);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <StatisticalSummary />
                <Chart
                    data={listRevenue}
                    title="Biểu đồ doanh thu"
                    dataKey="totalTransaction"
                    name={'_id'}
                />
                <div className={cx('bottom')}>
                    <NewUsers />
                    <Transactions />
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
