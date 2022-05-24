import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Delete';

import { ChipsCardTAG } from '../../Constants/Tags';
import { CardMultiButton, ErrorMsg, HarmonicCardContent, orderByName, RemoveModal, SearchInput } from '.';


const step = 20;

const ChipsCard = ({buttons, itemKey, items, moreButtons, onAdd, onDelete, tag, title, warnExpression}) => {
    const [deleteItem, setDeleteItem] = React.useState('');
    const [searchString, setSearchString] = React.useState('');
    const [maxAmount, setMaxAmount] = React.useState(step);

    const handleClickDelete = () => {
        onDelete(deleteItem, handleCloseDelete, ChipsCardTAG);
    };

    const handleClickAdd = () => {
        onAdd();
    };

    const handleOpenDelete = (name) => () => {
        setDeleteItem(name);
    };

    const handleCloseDelete = () => {
        setDeleteItem('');
    };

    const handleSearchString = ({target}) => {
        const {value} = target;
        setSearchString(value);
        setMaxAmount(step);
    };

    const remove = (name)=>(
        {
            icon: <RemoveIcon fontSize="small" />,
            onClick: handleOpenDelete(name),
        });

    const handleClickLoadMore = () => {
        setMaxAmount(maxAmount=>maxAmount+step);
    };

    let searchList = orderByName(searchString ? items.filter(i=>i[itemKey].includes(searchString)) : items, itemKey);

    return (
        <React.Fragment>
            <HarmonicCardContent
                content={
                    <Grid container spacing={2}>
                        <Grid container item xs={12}>
                            <Grid item>
                                <SearchInput onChange={handleSearchString} value={searchString} />
                            </Grid>
                            <ErrorMsg tag={tag} />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                searchList && searchList.length ? searchList.slice(0, maxAmount).map((listitem, index) => (
                                    <React.Fragment key={index}>
                                        <CardMultiButton
                                            label={`${listitem[itemKey]}`}
                                            buttons={[...buttons(listitem[itemKey]), remove(listitem[itemKey])]}
                                            warn={warnExpression(listitem)}
                                        />
                                    </React.Fragment>
                                )) :  (
                                    <Box sx={{fontSize: 12, fontStyle: 'italic', m: 1}}>
                                        {`No ${title}`}
                                    </Box>
                                )
                            }
                        </Grid>
                        {searchList && (searchList.length > maxAmount) &&
                            <Grid container justifyContent="center" alignItems="center" item xs={12}>
                                <Grid item>
                                    <Button color="primary" onClick={handleClickLoadMore}>
                                        {'Load more'}
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                }
                buttons={
                    <React.Fragment>
                        <Chip
                            clickable
                            label="ADD"
                            onClick={handleClickAdd}
                            color="primary"
                            variant="outlined"
                        />
                        {moreButtons}
                    </React.Fragment>
                }
            />
            <RemoveModal
                open={Boolean(deleteItem)}
                onClose={handleCloseDelete}
                onSubmit={handleClickDelete}
                tag={ChipsCardTAG}
                title={deleteItem ? `Remove '${deleteItem}'` : ''}
            />
        </React.Fragment>
    );
};

ChipsCard.defaultProps = {
    itemKey: 'name',
    items: [],
    moreButtons: null,
    warnExpression: ()=>false,
},

ChipsCard.propTypes = {
    itemKey: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    moreButtons: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    buttons: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    warnExpression: PropTypes.func,
};

export default ChipsCard;