import { fade, makeStyles } from '@material-ui/core/styles';
import {ErrorMsg, HarmonicCard, SimpleModal, CardMultiButton} from '../Util';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import Switch from '@material-ui/core/Switch';

import {ChipsCardTAG} from '../../constants';


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
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
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

const orderByName = (arr) => arr.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
});

const tag = ChipsCardTAG;

const ChipsCard = ({buttons, expand, items, moreButtons, onAdd, onDelete, onRefresh, title, warnExpression}) => {
    const classes = useStyles();
    const [deleteItem, setDeleteItem] = React.useState('');
    const [switchDel, setSwitchDel] = React.useState(false);
    const [searchString, setSearchString] = React.useState('');


    const handleClickDelete = () => {
        onDelete(deleteItem, handleCloseDelete, tag);
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
    };

    const remove = (name)=>(
        {
            icon: <RemoveIcon fontSize="small" />,
            onClick: handleOpenDelete(name),
        });

    let searchList = orderByName(searchString?items.filter(i=>i.name.includes(searchString)):items);

    return (
        <React.Fragment>
            <HarmonicCard
                title={title.toUpperCase()}
                expand={expand}
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
                        </Grid>
                        <Grid item xs={12}>
                            {
                                searchList && searchList.length ? searchList.map((listitem, index) => (
                                    <React.Fragment key={index}>
                                        <CardMultiButton
                                            label={listitem.name}
                                            buttons={[...buttons(listitem.name), remove(listitem.name)]}
                                            color="primary"
                                            warn={warnExpression(listitem)}
                                        />
                                    </React.Fragment>
                                )) :  (
                                    <Box fontSize={12} fontStyle="italic" m={1}>
                                        {`No ${title}`}
                                    </Box>
                                )
                            }
                        </Grid>
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
                onRefresh={onRefresh}
            />
            <SimpleModal
                open={Boolean(deleteItem)}
                onClose={handleCloseDelete}
                actionButtons={
                    <Button onClick={handleClickDelete} disabled={!switchDel} className={classes.warning}>
                        {'Submit'}
                    </Button>
                }
                maxWidth="xs"
                title={deleteItem?`Are you sure you want to remove '${deleteItem}'?`:''}
            >
                <React.Fragment>
                    <ErrorMsg tag={tag} />
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
    expand: null,
    items: [],
    moreButtons: null,
    onRefresh: null,
    warnExpression: ()=>false,
},

ChipsCard.propTypes = {
    expand: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.object),
    moreButtons: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onRefresh: PropTypes.func,
    title: PropTypes.string.isRequired,
    buttons: PropTypes.func.isRequired,
    warnExpression: PropTypes.func,
};

export default ChipsCard;