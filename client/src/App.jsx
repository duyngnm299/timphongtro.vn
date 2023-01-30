import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { getAllPostApproved, updateExpiredPost } from './api';

const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function App() {
    const socket = useRef();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const newMsg = useSelector((state) => state.message.message?.msg);
    console.log(newMsg);
    const currentDate = new Date();
    const date_diff_indays = function (date1, date2) {
        const dt1 = new Date(date1);
        const dt2 = new Date(date2);
        console.log('[dt1]:' + dt1);
        console.log('[dt2]:' + dt2);

        return Math.floor(
            (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
                (1000 * 60 * 60 * 24),
        );
    };
    const handleDate = (endDate) => {
        const [day, month, year] = endDate.split('/');
        const end = new Date(+year, month - 1, +day);
        const result = date_diff_indays(currentDate, end);
        if (result <= 0) {
            return true;
        }
    };
    useEffect(() => {
        socket.current = io(`${HOST_NAME}`);
        currentUser && socket.current.emit('addUser', currentUser?._id);
    }, [currentUser]);
    useEffect(() => {
        getAllPostApproved('status=approved').then((res) =>
            res.posts.map((item) => {
                let check = handleDate(item.endDate);
                console.log(check);
                if (check) {
                    const data = {
                        status: 'expired',
                    };
                    updateExpiredPost(item._id, data).then(console.log(res));
                }
            }),
        );
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout sk={socket && socket}>
                                        <Page sk={socket && socket} />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
