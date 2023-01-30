import { memo } from 'react';
import PropTypes from 'prop-types';

import AccountItem from '~/components/AccountItem';

function RenderSearchResult({ data }) {
    return data.map((user) => <AccountItem key={user.id} data={user} />);
}

RenderSearchResult.propTypes = {
    data: PropTypes.array.isRequired,
};
export default memo(RenderSearchResult);
