import classNames from 'classnames/bind';
import images from '~/assets/images';
import styles from './Message.module.scss';
import { SearchIcon } from '../Icons';
import { MdInfoOutline } from 'react-icons/md';
import { IoSend } from 'react-icons/io5';
import MessageItem from './MessageItem';
import Conversation from './Conversation';
import { useState, useEffect, useRef } from 'react';
import { addMessage, getConvOfUser, getMessages, getUser } from '~/api';
import { useSelector } from 'react-redux';
import { GoPrimitiveDot } from 'react-icons/go';
import { useDispatch } from 'react-redux';

import io from 'socket.io-client';
import { newMessage, sdMsg } from '~/redux/slice/messageSlice';

const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function Message({ sk }) {
    console.log(sk);
    const dispatch = useDispatch();
    const currentUser = useSelector(
        (state) => state.auth.login?.currentUser?.user,
    );
    const newMsg = useSelector((state) => state.message.message?.msg);
    const currentConversation = useSelector(
        (state) => state.message.conversation?.conv,
    );
    console.log(currentConversation);
    const [conversation, setConversation] = useState([]);
    const [currentChat, setCurrentChat] = useState(
        currentConversation && currentConversation,
    );
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [theirUser, setTheirUser] = useState(null);
    const [entering, setEntering] = useState(false);
    const [enteringText, setEnteringText] = useState('');
    const [sendMsg, setSendMsg] = useState(false);
    const scrollRef = useRef();
    // const socket = useRef();
    // console.log(socket);
    useEffect(() => {
        // sk.current = io(`${HOST_NAME}`);
        sk &&
            sk?.current?.on('getMessage', (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    seen: false,
                    createdAt: Date.now(),
                    receiver: data.receiverId,
                });
            });
    }, []);
    useEffect(() => {
        // sk.current = io(`${HOST_NAME}`);
        sk &&
            sk?.current?.on('getMessage', (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    seen: false,
                    createdAt: Date.now(),
                    receiver: data.receiverId,
                });
            });
    }, [sendMsg]);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);
    // useEffect(() => {
    //     arrivalMessage && dispatch(newMessage(arrivalMessage));
    // }, [arrivalMessage]);
    console.log(sendMsg);
    // add and get user when connected
    useEffect(() => {
        // currentUser && socket.current.emit('addUser', currentUser?._id);
        sk &&
            sk?.current?.on('getUsers', (users) => {
                setOnlineUser(users);
            });
    }, [currentUser]);

    // get all conversations of user
    useEffect(() => {
        currentUser &&
            getConvOfUser(currentUser._id).then((res) =>
                setConversation((prev) => [...prev, res?.conversation]),
            );
    }, [currentUser]);
    // get messages of conversation
    useEffect(() => {
        currentChat &&
            getMessages(currentChat._id).then((res) =>
                setMessages(res.message),
            );
        const theirId = currentChat?.members.find(
            (user) => user !== currentUser?._id,
        );
        currentChat &&
            getUser(theirId)
                .then((res) => setTheirUser(res.user))
                .catch((err) => console.log(err));
    }, [currentChat, currentUser]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessages.length > 0) {
            const data = {
                sender: currentUser._id,
                text: newMessages,
                conversationId: currentChat._id,
            };
            const receiverId = currentChat.members.find(
                (member) => member !== currentUser._id,
            );
            sk.current.emit('sendMessage', {
                senderId: currentUser._id,
                receiverId,
                text: newMessages,
            });
            dispatch(
                newMessage({
                    senderId: currentUser._id,
                    receiverId,
                    text: newMessages,
                }),
            );
            setSendMsg(!sendMsg);

            // add message to db
            addMessage(data)
                .then(
                    (res) => setMessages([...messages, res.savedMessage]),
                    setNewMessages(''),
                )
                .catch((err) => console.log(err));
            return;
        }
    };
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleOnClick = () => {
        dispatch(newMessage());
        console.log('seen');
        const receiverId = currentChat.members.find(
            (member) => member !== currentUser._id,
        );
        sk.current.emit('seenMessage', {
            receiverId,
            senderId: currentUser?._id,
        });
    };

    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter' && newMessages.length > 0) {
            dispatch(newMessage());

            setSendMsg(!sendMsg);
            const data = {
                sender: currentUser._id,
                text: newMessages,
                conversationId: currentChat._id,
            };
            const receiverId = currentChat.members.find(
                (member) => member !== currentUser._id,
            );
            sk.current.emit('sendMessage', {
                senderId: currentUser._id,
                receiverId,
                text: newMessages,
            });
            dispatch(
                newMessage({
                    senderId: currentUser._id,
                    receiverId,
                    text: newMessages,
                }),
            );

            // add message to db
            addMessage(data)
                .then(
                    (res) => setMessages([...messages, res.savedMessage]),
                    setNewMessages(''),
                )
                .catch((err) => console.log(err));
            return;
        }
    };

    const handleMouseDown = () => {
        setEntering(!entering);
        const receiverId = currentChat.members.find(
            (member) => member !== currentUser._id,
        );
        sk.current.emit(
            'entering',
            receiverId,
            currentUser.fullName || currentUser.username,
        );
    };
    useEffect(() => {
        sk &&
            sk?.current?.on('notifyEntering', (receiverId, sender) => {
                setEnteringText(`${sender} đang nhập...`);
            });
    }, [entering]);

    const handleMouseBlur = () => {
        setEnteringText('');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('list-message')}>
                <div className={cx('header')}>
                    <h1 className={cx('title')}>Tin nhắn</h1>
                    <div className={cx('search-message')}>
                        <SearchIcon className={cx('icon-search')} />
                        <input
                            type="text"
                            className={cx('search-input')}
                            placeholder="Tìm kiếm tin nhắn"
                        />
                    </div>
                </div>
                {conversation &&
                    conversation[0]?.map((item, index) => (
                        <div key={index} onClick={() => setCurrentChat(item)}>
                            <Conversation
                                data={item}
                                online={onlineUser}
                                socket={sk}
                            />
                        </div>
                    ))}
            </div>
            <div className={cx('chat-box')}>
                {currentChat ? (
                    <>
                        <div className={cx('header-chat-box')}>
                            <div className={cx('user-avatar')}>
                                <div className={cx('avatar-chat-box')}>
                                    <img
                                        src={
                                            theirUser
                                                ? `${HOST_NAME}${theirUser.profilePicture}`
                                                : images.defaultAvt
                                        }
                                        alt=""
                                        className={cx('img-chat-box')}
                                    />
                                    <GoPrimitiveDot
                                        className={cx('online-icon')}
                                    />
                                </div>
                                <div className={cx('full-name')}>
                                    {theirUser && theirUser.fullName}
                                </div>
                            </div>
                            <div className={cx('info-icon-container')}>
                                <MdInfoOutline className={cx('info-icon')} />
                            </div>
                        </div>
                        <div
                            className={cx('message-container')}
                            onClick={handleOnClick}
                        >
                            {messages.map((item, index) => (
                                <div key={index} ref={scrollRef}>
                                    <MessageItem
                                        theirUser={theirUser && theirUser}
                                        message={item}
                                        own={
                                            currentUser &&
                                            item?.sender === currentUser?._id
                                        }
                                    />
                                </div>
                            ))}
                            {enteringText.length ? (
                                <p className={cx('entering')}>{enteringText}</p>
                            ) : (
                                ''
                            )}
                        </div>

                        <div className={cx('bottom')}>
                            <div className={cx('text-send')}>
                                <input
                                    type="text"
                                    className={cx('text-input')}
                                    placeholder="write something..."
                                    onChange={(e) =>
                                        setNewMessages(e.target.value)
                                    }
                                    value={newMessages}
                                    onKeyDown={handleOnKeyDown}
                                    onMouseDown={handleMouseDown}
                                    onBlur={handleMouseBlur}
                                />
                                <button
                                    className={cx('icon-send')}
                                    onClick={handleSendMessage}
                                >
                                    <IoSend />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <span className={cx('no-current-chat')}>
                        Mở cuộc hội thoại để bắt đầu trò chuyện
                    </span>
                )}
            </div>
        </div>
    );
}

export default Message;
