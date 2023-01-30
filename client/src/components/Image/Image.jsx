import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { forwardRef, useState } from 'react';
import images from '~/assets/images';
import styles from './image.module.scss';

const cx = classNames.bind(styles);
const Image = forwardRef(
    (
        {
            src = images.defaultAvt,
            alt,
            className,
            fallBack: customFallBack = images.defaultAvt,
            ...props
        },
        ref,
    ) => {
        const [fallBack, setFallBack] = useState('');
        const handleError = () => {
            setFallBack(customFallBack);
        };
        return (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
                className={cx('wrapper', className)}
                ref={ref}
                src={fallBack || src}
                alt={alt}
                {...props}
                onError={handleError}
            />
        );
    },
);

// Image.propTypes = {
//     src: PropTypes.string,
//     alt: PropTypes.string,
//     className: PropTypes.string,
//     fallBack: PropTypes.string,
// };

export default Image;
