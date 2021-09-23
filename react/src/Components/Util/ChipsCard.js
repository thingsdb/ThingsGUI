import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Switch from '@mui/material/Switch';

import {ChipsCardTAG} from '../../Constants/Tags';
import {ErrorMsg, HarmonicCardContent, orderByName, SimpleModal, CardMultiButton} from '.';


const useStyles = makeStyles(theme => ({
    customWidth: {
        maxWidth: 500,
    },
    warning: {
        color: theme.palette.primary.red
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const step = 20;

const ChipsCard = ({buttons, itemKey, items, moreButtons, onAdd, onDelete, tag, title, warnExpression}) => {
    const classes = useStyles();
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

    let searchList = orderByName(searchString?items.filter(i=>i[itemKey].includes(searchString)):items, itemKey);

    return (
        <React.Fragment>
            <HarmonicCardContent
                content={
                    <Grid container spacing={2}>
                        <Grid container item xs={12}>
                            <Grid item>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon />
                                    </div>
                                    <InputBase
                                        placeholder="Search…"
                                        value={searchString}
                                        onChange={handleSearchString}
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </div>
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
                                            color="primary"
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
                            className={classes.chip}
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
                    <Button color="primary" onClick={handleClickDelete} disabled={!switchDel} className={classes.warning}>
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