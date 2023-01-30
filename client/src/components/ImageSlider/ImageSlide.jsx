import { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import styles from './ImageSlider.module.scss';
import { useEffect } from 'react';
import images from '~/assets/images';

const cx = classNames.bind(styles);
const delay = 3000;
const HOST_NAME = process.env.REACT_APP_HOST_NAME;
const ImageSlider = ({
    slides,
    className,
    imgBottom,
    searchResult,
    showPost,
    detailPostOfUser,
    adminDetailPost,
    previewPost,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
                ),
            delay,
        );

        return () => {
            resetTimeout();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    let stringURLImg = slides[currentIndex]?.imagePath
        ? slides[currentIndex]?.imagePath.replace('\\', '/')
        : '';

    const slideStylesWidthBackground = {
        backgroundImage: slides[currentIndex]
            ? slides[currentIndex]?.imagePath
                ? `url(${HOST_NAME}${stringURLImg})`
                : `url(${slides[currentIndex].url})`
            : images.slider1,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div
            className={cx(
                'slider-wrapper',
                className,
                detailPostOfUser && 'detail-post-user',
                adminDetailPost && 'admin-detail-post',
                previewPost && 'previewPost',
            )}
        >
            <div
                className={cx(
                    'arrow-container',
                    searchResult && 'hide-arrow',
                    showPost && 'hide-arrow',
                )}
            >
                <div
                    onClick={() => {
                        goToPrevious();
                    }}
                    className={cx(
                        'left-arrow',
                        imgBottom && 'arrow',
                        detailPostOfUser && 'arrow',
                        adminDetailPost && 'arrow',
                    )}
                >
                    <MdKeyboardArrowLeft />
                </div>
                <div
                    onClick={() => {
                        goToNext();
                    }}
                    className={cx(
                        'right-arrow',
                        imgBottom && 'arrow',
                        detailPostOfUser && 'arrow',
                        adminDetailPost && 'arrow',
                    )}
                >
                    <MdKeyboardArrowRight />
                </div>
            </div>
            <div
                style={slideStylesWidthBackground}
                className={cx(
                    'slider-show',
                    imgBottom && 'sls',
                    searchResult && 'srs',
                    showPost && 'sp',
                    adminDetailPost && 'admin-dtp',
                )}
            ></div>
            <div
                className={cx(
                    'dots-container',
                    imgBottom && 'img-bottom-container',
                    detailPostOfUser && 'hide-arrow',
                    adminDetailPost && 'hide-arrow',
                )}
            >
                {slides.map((slide, slideIndex) =>
                    imgBottom ? (
                        <div
                            key={slideIndex}
                            className={cx('img-bottom')}
                            onClick={() => goToSlide(slideIndex)}
                        >
                            <img
                                src={
                                    slide?.imagePath
                                        ? HOST_NAME + slide?.imagePath
                                        : slide.url
                                }
                                alt=""
                                className={cx(
                                    'img-item',
                                    adminDetailPost && 'img-item-admin',
                                    currentIndex === slideIndex && 'img-active',
                                )}
                            />
                        </div>
                    ) : (
                        <div
                            className={cx(
                                'dot',
                                searchResult && 'hide-arrow',
                                showPost && 'hide-arrow',
                            )}
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                        >
                            ●
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};

export default ImageSlider;
