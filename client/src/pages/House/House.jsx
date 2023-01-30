import SearchResult from '~/components/SearchResult';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SearchFilterPost } from '~/api';
import { currentCategory, filterResult } from '~/redux/slice/filterSlice';
function House() {
    const dispatch = useDispatch();
    useEffect(() => {
        SearchFilterPost('category_name=Nhà nguyên căn&status=approved').then(
            (res) => dispatch(filterResult(res)),
            dispatch(currentCategory('Nhà nguyên căn')),
        );
    }, []);
    return <SearchResult />;
}

export default House;
