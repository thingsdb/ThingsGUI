import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';

import {ChipsCardTAG} from '../../Constants/Tags';
import {ErrorMsg, HarmonicCardContent, orderByName, SearchInput, SimpleModal, TableWithButtons} from '.';


const step = 5;

const TableCard = ({buttons, header, itemKey, items, moreButtons, onAdd, onDelete, tag}) => {
    const [deleteItem, setDeleteItem] = React.useState('');
    const [switchDel, setSwitchDel] = React.useState(false);
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
    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchDel(checked);
    };
    const handleCloseDelete = () => {
        setDeleteItem('');
        setSwitchDel(false);
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
                        <Grid container item xs={12}>
                            <Grid item>
                                <SearchInput onChange={handleSearchString} value={searchString} />
                            </Grid>
                            <ErrorMsg tag={tag} />
                        </Grid>
                        <Grid item xs={12}>

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
            <SimpleModal
                open={Boolean(deleteItem)}
                onClose={handleCloseDelete}
                actionButtons={
                    <Button color="error" onClick={handleClickDelete} disabled={!switchDel}>
                        {'Submit'}
                    </Button>
                }
                maxWidth="xs"
                title={deleteItem?`Are you sure you want to remove '${deleteItem}'?`:''}
            >
                <React.Fragment>
                    <ErrorMsg tag={ChipsCardTAG} />
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switchDel}
                                color="primary"
                                id="description"
                                onChange={handleSwitch}
                            />
                        )}
                        label="Are you really sure?"
                    />
                </React.Fragment>
            </SimpleModal>
        </React.Fragment>
    );
};

TableCard.defaultProps = {
    itemKey: 'name',
    items: [],
    moreButtons: null,
},

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