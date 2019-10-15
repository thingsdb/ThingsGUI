import Chip from '@material-ui/core/Chip';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ProcedureActions, ProcedureStore} from '../../Stores/ProcedureStore';
import {HarmonicCard} from '../Util';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    customWidth: {
        maxWidth: 500,
    },
}));

const tag = '8';

const Procedures = ({scope, onSetAsInput, procedures}) => {
    const classes = useStyles();

    React.useEffect(() => {
        if (!(scope == '@node' || scope == '')) {
            ProcedureActions.getProcedures(scope, tag);
        }
    }, [scope]);

    const handleClickProcedure = (index) => () => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` '<${a}>'` )}))` : `run('${procedures[index].name}', ${procedures[index].arguments.map(a=>` '<${a}>'` )})`;
        onSetAsInput(i);
    };

    const handleClickDeleteProcedure = (i) => () => {
        ProcedureActions.deleteProcedure(scope, procedures[i].name, tag);
    };

    const handleClickAddProcedure = () => {
        onSetAsInput('new_procedure("...", ...)');
    };

    const p = scope == '@node' || scope == '' ? [] : procedures;

    return (
        <HarmonicCard
            title="PROCEDURES"
            content={
                <React.Fragment>
                    {p ? p.map((listitem, index) => (
                        <Tooltip
                            key={index}
                            disableFocusListener
                            disableTouchListener
                            classes={{ tooltip: classes.customWidth }}
                            title={
                                <Typography variant="caption">
                                    {listitem.definition}
                                </Typography>
                            }
                        >
                            <Chip
                                clickable
                                id={listitem.name}
                                className={classes.chip}
                                label={listitem.name}
                                onClick={handleClickProcedure(index)}
                                onDelete={handleClickDeleteProcedure(index)}
                                color="primary"
                            />
                        </Tooltip>
                    )) : null}
                </React.Fragment>
            }
            buttons={
                <Chip
                    clickable
                    className={classes.chip}
                    label="ADD"
                    onClick={handleClickAddProcedure}
                    color="primary"
                    variant="outlined"
                />
            }
        />
    );
};

Procedures.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetAsInput: PropTypes.func.isRequired,

    // procedures store
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedures);