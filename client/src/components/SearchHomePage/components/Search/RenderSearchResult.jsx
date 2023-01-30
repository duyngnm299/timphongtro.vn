import { memo } from 'react';
import PropTypes from 'prop-types';

import SearchItem from '../SearchItem/SearchItem';

function RenderSearchResult({ data, className }) {
    return data?.map((item) => (
        <SearchItem key={item._id} data={item} className={className} />
    ));
}

RenderSearchResult.propTypes = {
    data: PropTypes.array.isRequired,
};
export default memo(RenderSearchResult);
