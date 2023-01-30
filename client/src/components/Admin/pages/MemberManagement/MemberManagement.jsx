import classNames from 'classnames/bind';
import styles from './MemberManagement.module.scss';
import UserList from './components/UserList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AddUser from './components/addUser';
import { currentMenu } from '~/redux/slice/adminSlice';
const cx = classNames.bind(styles);

function MemberManagement() {
    const dispatch = useDispatch();
    const crMenu = useSelector((state) => state.admin.currentMenu?.menu);
    console.log(crMenu);
    const [showUserList, setShowUserList] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(
        (crMenu === 'list-user' && 0) || 0,
    );
    useEffect(() => {
        setShowUserList(true);
        if (crMenu === 'list-user') {
            setCurrentIndex(0);
            setShowUserList(true);
            setShowAddUser(false);
            return;
        }
        if (crMenu === 'add-user') {
            setCurrentIndex(1);
            setShowAddUser(true);
            setShowUserList(false);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (crMenu === 'list-user') {
            setShowUserList(true);
            setShowAddUser(false);
            setCurrentIndex(0);
            dispatch(currentMenu(null));
            return;
        }
        if (crMenu === 'add-user') {
            setShowAddUser(true);
            setShowUserList(false);
            setCurrentIndex(1);
            dispatch(currentMenu(null));
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crMenu]);

    const menuItems = [
        {
            title: 'Danh sách thành viên',
        },
        {
            title: 'Thêm thành viên mới',
        },
        {
            title: 'Thống kê',
        },
    ];
    const handleOnClickMenuItem = (index) => {
        setCurrentIndex(index);
        if (index === 0) {
            dispatch(currentMenu('list-user'));
            setShowUserList(true);
            setShowAddUser(false);
        } else if (index === 1) {
            dispatch(currentMenu('add-user'));
            setShowAddUser(true);
            setShowUserList(false);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('menu')}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={cx('menu-link')}
                        onClick={() => handleOnClickMenuItem(index)}
                    >
                        <span
                            className={cx(
                                'menu-item',
                                currentIndex === index && 'active',
                            )}
                        >
                            {item.title}
                        </span>
                    </div>
                ))}
            </div>
            {showUserList && <UserList />}
            {showAddUser && <AddUser />}
        </div>
    );
}

export default MemberManagement;
