import classNames from 'classnames/bind';
import styles from './AdminDetailPost.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import ImageSlider from '~/components/ImageSlider';
import { useEffect } from 'react';
import { adminCensorPost, deletedPost, getUser, updatePost } from '~/api';
import { useState } from 'react';
import images from '~/assets/images';
import { BsPhone } from 'react-icons/bs';
import { CiMail } from 'react-icons/ci';
import { BiArea, BiDollarCircle } from 'react-icons/bi';
import { TbBed } from 'react-icons/tb';
import { MdApartment } from 'react-icons/md';
import { GrRestroom } from 'react-icons/gr';
import { MdLocationSearching } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { UploadImage } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useRef } from 'react';
import { detailPost } from '~/redux/slice/adminSlice';
const cx = classNames.bind(styles);
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
function AdminDetailPost() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentPost = useSelector((state) => state.admin.post?.currentPost);

    const [user, setUser] = useState([]);

    // const [post, setPost] = useState([]);
    const [editPost, setEditPost] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState(0);
    const [price, setPrice] = useState(0);
    const [bedroom, setBedroom] = useState(0);
    const [restroom, setRestroom] = useState(0);
    const [floor, setFloor] = useState(0);
    const [describe, setDescribe] = useState('');
    const [imageList, setImageList] = useState([]);
    const [file, setFile] = useState([]);
    const [showNotifyText, setShowNotifyText] = useState(false);
    useEffect(() => {
        currentPost && setTitle(currentPost.title);
        currentPost && setAddress(currentPost.address);
        currentPost && setArea(currentPost.area);
        currentPost && setPrice(currentPost.price);
        currentPost && setDescribe(JSON.parse(currentPost?.describe)?.describe);
        currentPost && setBedroom(JSON.parse(currentPost?.describe)?.bedroom);
        currentPost && setRestroom(JSON.parse(currentPost?.describe)?.restroom);
        currentPost && setFloor(JSON.parse(currentPost?.describe)?.floor);
        currentPost && setImageList(currentPost.images);
        currentPost &&
            getUser(currentPost.createdBy).then((res) => setUser(res.user));
    }, []);

    useEffect(() => {
        currentPost && setTitle(currentPost.title);
        currentPost && setAddress(currentPost.address);
        currentPost && setArea(currentPost.area);
        currentPost && setPrice(currentPost.price);
        currentPost && setDescribe(JSON.parse(currentPost?.describe)?.describe);
        currentPost && setBedroom(JSON.parse(currentPost?.describe)?.bedroom);
        currentPost && setRestroom(JSON.parse(currentPost?.describe)?.restroom);
        currentPost && setFloor(JSON.parse(currentPost?.describe)?.floor);
        currentPost && setImageList(currentPost.images);
    }, [updated]);
    const imageRef = useRef();
    const titleRef = useRef();
    const addressRef = useRef();
    const areaRef = useRef();
    const priceRef = useRef();
    const describeRef = useRef();

    const alert = (title, type, message, to) => {
        Swal.fire({
            title: `<h2 class="notify-title">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 10px;">X??c nh???n</p>',
            confirmButtonColor: type === 'success' ? '#a5dc86' : '#e03c31',
            allowOutsideClick: false,
            focusConfirm: false,
            width: '500px',
            padding: '30px 20px',
        }).then((result) => {
            if (result.isConfirmed && type === 'success') {
                if (to) {
                    navigate(config.routes.adminPostMng);
                    return;
                }
                setUpdated(!updated);
                setEditPost(false);
            }
        });
    };
    const formatCash = (number) => {
        return number
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
                return (index % 3 ? next : next + '.') + prev;
            });
    };
    const handleEditPost = () => {
        setEditPost(true);
    };
    const handleBack = () => {
        navigate(config.routes.adminPostMng);
    };
    const handleChangeImage = (e) => {
        Object.entries(e.target.files).map((item) =>
            setImageList((prev) => [...prev, item[1]]),
        );
        Object.entries(e.target.files).map((item) =>
            setFile((prevState) => [
                ...prevState,
                URL.createObjectURL(item[1]),
            ]),
        );
    };
    const handleDeleteImage = (i) => {
        setFile((prevState) => prevState.filter((item, index) => index !== i));
        setImageList((prevState) =>
            prevState?.filter((item, index) => index !== i),
        );
    };

    const handleUpdatePost = () => {
        if (!imageList.length) {
            setShowNotifyText(true);
            imageRef.current.focus();
            return;
        }
        if (!title) {
            titleRef.current.focus();
            setShowNotifyText(true);
            return;
        }
        if (!address) {
            addressRef.current.focus();
            setShowNotifyText(true);
            return;
        }
        if (!area) {
            areaRef.current.focus();
            setShowNotifyText(true);
            return;
        }
        if (!price) {
            priceRef.current.focus();
            setShowNotifyText(true);
            return;
        }
        if (!describe) {
            describeRef.current.focus();
            setShowNotifyText(true);
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append(
            'describe',
            JSON.stringify({
                describe,
                area,
                price,
                bedroom,
                restroom,
                floor,
                furniture: 0,
            }),
        );
        formData.append('address', address);
        formData.append('area', area);
        formData.append('price', price);
        imageList.length > 0 &&
            imageList.map((item) => formData.append('images', item));
        currentPost &&
            updatePost(currentPost._id, formData).then((res) => {
                alert('C???p nh???t b??i ????ng th??nh c??ng', 'success', '');
                dispatch(detailPost(res.updatePost));
            });
    };
    const handleCancel = () => {
        setEditPost(false);
    };
    const handleCensorPost = async () => {
        const data = { status: 'approved' };
        await adminCensorPost(currentPost._id, data);
        alert('Duy???t b??i th??nh c??ng', 'success', '', true);
    };

    const handleDeletePost = () => {
        alert2(
            currentPost._id,
            'B???n c?? mu???n x??a kh??ng?',
            'info',
            'B??i ????ng s??? kh??ng th??? kh??i ph???c n???u b??? x??a',
        );
    };
    const alert2 = (id, title, type, message) => {
        Swal.fire({
            title: `<h2 class="notify-title" style="font-weight: normal">${title}</h2>`,
            icon: type,
            html: `<p style="font-size: 1.4rem; margin: 0 0 20px 0">${message}</p>`,
            showCancelButton: true,
            confirmButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">X??a</p>',
            cancelButtonText:
                '<p style="font-size: 16px; padding: 4px 12px;">H???y</p>',
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
                await deletedPost(id);
                alert('X??a th??nh c??ng!', 'success', '', true);
                return;
            }
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('top')}>
                    <button className={cx('back-btn')} onClick={handleBack}>
                        Quay l???i
                    </button>
                    <button className={cx('add-post-btn')}>T???o b??i ????ng</button>
                </div>

                {editPost ? (
                    <>
                        <div className={cx('edit-post')}>
                            <div className={cx('top')}>
                                <h1 className={cx('title')}>
                                    Ch???nh s???a b??i ????ng
                                </h1>
                            </div>
                            <div className={cx('upload-image')}>
                                <label
                                    ref={imageRef}
                                    htmlFor="upload-image"
                                    className={cx('label-upload')}
                                >
                                    <UploadImage />
                                    <p>B???m v??o ????y ????? ch???n ???nh c???n t???i l??n</p>
                                </label>
                                <input
                                    id="upload-image"
                                    style={{ display: 'none' }}
                                    accept="image/*,.heic"
                                    multiple
                                    type="file"
                                    autoComplete="off"
                                    onChange={handleChangeImage}
                                />

                                {!address && showNotifyText && (
                                    <span className={cx('validate-text')}>
                                        Tr?????ng n??y l?? b???t bu???c
                                    </span>
                                )}
                            </div>
                            {file.length > 0 ? (
                                <div className={cx('image-wrapper')}>
                                    {file?.map((item, index) => (
                                        <div
                                            className={cx('img-container')}
                                            key={index}
                                        >
                                            <img
                                                className={cx('image-item')}
                                                src={item}
                                                alt=""
                                            />
                                            <span
                                                className={cx('deleted')}
                                                onClick={() =>
                                                    handleDeleteImage(index)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                    className={cx(
                                                        'deleted-icon',
                                                    )}
                                                />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={cx('image-wrapper')}>
                                    {imageList?.map((item, index) => (
                                        <div
                                            className={cx('img-container')}
                                            key={index}
                                        >
                                            <img
                                                className={cx('image-item')}
                                                src={
                                                    item?.imagePath &&
                                                    `${HOST_NAME}${item.imagePath}`
                                                }
                                                alt=""
                                            />

                                            <span
                                                className={cx('deleted')}
                                                onClick={() =>
                                                    handleDeleteImage(index)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                    className={cx(
                                                        'deleted-icon',
                                                    )}
                                                />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    Ti??u ?????
                                </span>
                                <div className={cx('validate-wrapper')}>
                                    <input
                                        ref={titleRef}
                                        type="text"
                                        value={title}
                                        className={cx('input')}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                    {title.length < 30 && showNotifyText && (
                                        <span className={cx('validate-text')}>
                                            Ti??u ????? ph???i c?? ??t nh???t 30 k?? t???
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    ?????a ch???{' '}
                                </span>
                                <div className={cx('validate-wrapper')}>
                                    <input
                                        ref={addressRef}
                                        type="text"
                                        value={address}
                                        className={cx('input')}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                    />
                                    {!address && showNotifyText && (
                                        <span className={cx('validate-text')}>
                                            Tr?????ng n??y l?? b???t bu???c
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    Di???n t??ch
                                </span>

                                <div className={cx('input-wrapper')}>
                                    <div className={cx('validate-wrapper')}>
                                        <input
                                            ref={areaRef}
                                            type="number"
                                            value={area}
                                            className={cx(
                                                'input',
                                                'input-small',
                                            )}
                                            onChange={(e) =>
                                                setArea(e.target.value)
                                            }
                                            onWheel={(e) => e.target.blur()}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                        {!area &&
                                            area === 0 &&
                                            showNotifyText && (
                                                <span
                                                    className={cx(
                                                        'validate-text',
                                                    )}
                                                >
                                                    Tr?????ng n??y l?? b???t bu???c
                                                </span>
                                            )}
                                    </div>
                                    <span className={cx('unit')}>m??</span>
                                </div>
                            </div>
                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    M???c gi??
                                </span>

                                <div className={cx('input-wrapper')}>
                                    <div className={cx('validate-wrapper')}>
                                        <input
                                            ref={priceRef}
                                            className={cx(
                                                'input',
                                                'input-small',
                                            )}
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            onWheel={(e) => e.target.blur()}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                        {!price &&
                                            price === 0 &&
                                            showNotifyText && (
                                                <span
                                                    className={cx(
                                                        'validate-text',
                                                    )}
                                                >
                                                    Tr?????ng n??y l?? b???t bu???c
                                                </span>
                                            )}
                                    </div>
                                    <span className={cx('unit')}>VND</span>
                                </div>
                            </div>

                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    Ph??ng ng???
                                </span>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        type="number"
                                        className={cx('input', 'input-small')}
                                        value={bedroom}
                                        onChange={(e) =>
                                            setBedroom(e.target.value)
                                        }
                                        onWheel={(e) => e.target.blur()}
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className={cx('unit')}>Ph??ng</span>
                                </div>
                            </div>

                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    Ph??ng t???m
                                </span>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        type="number"
                                        className={cx('input', 'input-small')}
                                        value={restroom}
                                        onChange={(e) =>
                                            setRestroom(e.target.value)
                                        }
                                        onWheel={(e) => e.target.blur()}
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className={cx('unit')}>Ph??ng</span>
                                </div>
                            </div>

                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>
                                    S??? t???ng
                                </span>
                                <div className={cx('input-wrapper')}>
                                    <input
                                        type="number"
                                        className={cx('input', 'input-small')}
                                        value={floor}
                                        onChange={(e) =>
                                            setFloor(e.target.value)
                                        }
                                        onWheel={(e) => e.target.blur()}
                                        onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                    />
                                    <span className={cx('unit')}>T???ng</span>
                                </div>
                            </div>

                            <div className={cx('row')}>
                                <span className={cx('title-edit')}>M?? t???</span>
                                <div className={cx('validate-wrapper')}>
                                    <textarea
                                        ref={describeRef}
                                        type="text"
                                        className={cx('input', 'input-large')}
                                        value={describe}
                                        onChange={(e) =>
                                            setDescribe(e.target.value)
                                        }
                                    />
                                    {describe.length < 30 && showNotifyText && (
                                        <span className={cx('validate-text')}>
                                            M?? t??? ph???i c?? ??t nh???t 30 k?? t???
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={cx('action')}>
                                <button
                                    className={cx('cancel-btn')}
                                    onClick={handleCancel}
                                >
                                    H???y
                                </button>
                                <button
                                    className={cx('submit-btn')}
                                    onClick={handleUpdatePost}
                                >
                                    C???p nh???t
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={cx('content')}>
                        <div className={cx('left-wrapper')}>
                            <div className={cx('left')}>
                                <div className={cx('contact')}>
                                    <h1 className={cx('title')}>
                                        Th??ng tin li??n h???
                                    </h1>
                                    <div className={cx('info-contact')}>
                                        <div className={cx('avatar')}>
                                            <img
                                                src={
                                                    user?.profilePicture
                                                        ? `${HOST_NAME}${user?.profilePicture}`
                                                        : images.defaultAvt
                                                }
                                                alt="avatar"
                                                className={cx('img')}
                                            />
                                            <span className={cx('fullname')}>
                                                {user?.fullName ||
                                                    user?.username}
                                            </span>
                                        </div>
                                        {user?.phoneNumber && (
                                            <div className={cx('phone')}>
                                                <span className={cx('icon')}>
                                                    <BsPhone />
                                                </span>
                                                <span className={cx('text')}>
                                                    {user?.phoneNumber}
                                                </span>
                                            </div>
                                        )}
                                        {user?.email && (
                                            <div className={cx('phone')}>
                                                <span className={cx('icon')}>
                                                    <CiMail />
                                                </span>
                                                <span className={cx('text')}>
                                                    {user?.email}
                                                </span>
                                            </div>
                                        )}
                                        {user?.address && (
                                            <div className={cx('phone')}>
                                                <span className={cx('icon')}>
                                                    <MdLocationSearching />
                                                </span>
                                                <span className={cx('text')}>
                                                    {user?.address}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <div className={cx('top')}>
                                <h1 className={cx('title')}>
                                    Chi ti???t b??i ????ng
                                </h1>
                                {currentPost.status ===
                                'waiting for approva' ? (
                                    <div className={cx('button-wrapper')}>
                                        <button
                                            className={cx('censor-btn')}
                                            onClick={handleCensorPost}
                                        >
                                            Duy???t
                                        </button>
                                        <button
                                            className={cx('delete-btn')}
                                            onClick={handleDeletePost}
                                        >
                                            X??a
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className={cx('edit-btn')}
                                        onClick={handleEditPost}
                                    >
                                        Ch???nh s???a
                                    </button>
                                )}
                            </div>
                            <div className={cx('image-slider')}>
                                {imageList.length && (
                                    <ImageSlider
                                        slides={imageList}
                                        adminDetailPost={true}
                                    />
                                )}
                            </div>
                            <div className={cx('title-post')}>{title}</div>

                            <div className={cx('address-post')}>
                                ?????a ch???: {address}
                            </div>
                            <div className={cx('describe')}>
                                <div className={cx('area')}>
                                    <span className={cx('area-title')}>
                                        Di???n t??ch
                                    </span>
                                    <span className={cx('area-value')}>
                                        {area} m??
                                    </span>
                                </div>
                                <div className={cx('area')}>
                                    <span className={cx('area-title')}>
                                        M???c gi??
                                    </span>
                                    <span className={cx('area-value')}>
                                        {`${parseFloat(
                                            formatCash(price.toString()),
                                        ).toFixed(1)} tri???u`}
                                    </span>
                                </div>
                                {bedroom > 0 && (
                                    <div className={cx('area')}>
                                        <span className={cx('area-title')}>
                                            Ph??ng ng???
                                        </span>
                                        <span className={cx('area-value')}>
                                            {bedroom} Ph??ng
                                        </span>
                                    </div>
                                )}
                                {restroom > 0 && (
                                    <div className={cx('area')}>
                                        <span className={cx('area-title')}>
                                            Ph??ng t???m
                                        </span>
                                        <span className={cx('area-value')}>
                                            {restroom} Ph??ng
                                        </span>
                                    </div>
                                )}
                                {floor > 0 && (
                                    <div className={cx('area')}>
                                        <span className={cx('area-title')}>
                                            S??? t???ng
                                        </span>
                                        <span className={cx('area-value')}>
                                            {floor} T???ng
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className={cx('detail-describe')}>
                                <h1 className={cx('title')}>Th??ng tin m?? t???</h1>

                                <div className={cx('describe-content')}>
                                    {describe}
                                </div>
                            </div>
                            <div className={cx('feature')}>
                                <h1 className={cx('title')}>
                                    ?????c ??i???m b???t ?????ng s???n
                                </h1>
                                <div className={cx('post-type')}>
                                    <span className={cx('text')}>
                                        Lo???i tin ????ng:{' '}
                                        {currentPost.category_name}
                                    </span>
                                </div>
                                <div
                                    className={cx('details-features-describe')}
                                >
                                    <div
                                        className={cx(
                                            'row-item',
                                            'row-item-left',
                                        )}
                                    >
                                        <span className={cx('icon-container')}>
                                            <BiArea className={cx('icon')} />
                                        </span>
                                        <span className={cx('text-title')}>
                                            Di???n t??ch
                                        </span>
                                        <span className={cx('text-value')}>
                                            {area} m??
                                        </span>
                                    </div>
                                    <div className={cx('row-item')}>
                                        <span className={cx('icon-container')}>
                                            <BiDollarCircle
                                                className={cx('icon')}
                                            />
                                        </span>
                                        <span className={cx('text-title')}>
                                            M???c gi??
                                        </span>
                                        <span className={cx('text-value')}>
                                            {currentPost?.price &&
                                                `${parseFloat(
                                                    formatCash(
                                                        price?.toString(),
                                                    ),
                                                ).toFixed(1)} tri???u/th??ng`}
                                        </span>
                                    </div>
                                    {bedroom > 0 && (
                                        <div
                                            className={cx(
                                                'row-item',
                                                'row-item-left',
                                            )}
                                        >
                                            <span
                                                className={cx('icon-container')}
                                            >
                                                <TbBed className={cx('icon')} />
                                            </span>
                                            <span className={cx('text-title')}>
                                                S??? ph??ng ng???
                                            </span>
                                            <span className={cx('text-value')}>
                                                {bedroom} ph??ng
                                            </span>
                                        </div>
                                    )}
                                    {restroom > 0 && (
                                        <div className={cx('row-item')}>
                                            <span
                                                className={cx('icon-container')}
                                            >
                                                <GrRestroom
                                                    className={cx('icon')}
                                                />
                                            </span>
                                            <span className={cx('text-title')}>
                                                S??? toilet
                                            </span>
                                            <span className={cx('text-value')}>
                                                {restroom} ph??ng
                                            </span>
                                        </div>
                                    )}
                                    {floor > 0 && (
                                        <div className={cx('row-item')}>
                                            <span
                                                className={cx('icon-container')}
                                            >
                                                <MdApartment
                                                    className={cx('icon')}
                                                />
                                            </span>
                                            <span className={cx('text-title')}>
                                                S??? t???ng
                                            </span>
                                            <span className={cx('text-value')}>
                                                {floor} t???ng
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDetailPost;
