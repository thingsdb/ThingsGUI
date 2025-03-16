import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Delete';

import { ChipsCardTAG } from '../../Constants/Tags';
import { ErrorMsg, HarmonicCardContent, orderByName, RemoveModal, SearchInput, TableWithButtons } from '.';


const step = 5;

const TableCard = ({
    buttons,
    header,
    itemKey = 'name',
    items = [],
    moreButtons = null,
    onAdd,
    onDelete,
    tag,
}: Props) => {
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

    let searchList = orderByName(searchString?items.filter(i=>String(i[itemKey]).includes(searchString)):items, itemKey);

    return (
        <React.Fragment>
            <HarmonicCardContent
                content={
                    <Grid container spacing={2}>
                        <Grid container size={12}>
                            <Grid>
                                <SearchInput onChange={handleSearchString} value={searchString} />
                            </Grid>
                            <ErrorMsg tag={tag} />
                        </Grid>
                        <Grid size={12}>

                            <TableWithButtons
                                header={header}
                                rows={searchList && searchList.length ? searchList.slice(0, maxAmount): []}
                                buttons={(listitem) =>
                                    [...buttons(listitem[itemKey]), remove(listitem[itemKey])].map((b, i)=>(
                                        <IconButton color="primary" key={i} onClick={b.onClick} size="small">
                                            {b.icon}
                                        </IconButton>
                                    ))
                                }
                            />
                        </Grid>
                        {searchList && (searchList.length > maxAmount) &&
                            <Grid container justifyContent="center" alignItems="center" size={12}>
                                <Grid>
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

TableCard.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    itemKey: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    moreButtons: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    buttons: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
};

export default TableCard;

interface Props {
    header: {
        ky: string;
        label: string;
        fn?: (d: unknown) => React.ReactNode;
    }[];
    itemKey: string;
    items: object[];
    moreButtons?: React.ReactElement;
    onAdd: () => void;
    onDelete: (id: string, cb: () => void, tag: string) => void;
    buttons: (name: string) => any[];
    tag: string;
}
