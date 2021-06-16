import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import {ProcedureActions, TimerActions} from '../../../Stores';
import {ErrorMsg, QueryOutput, changeSingleToDoubleQuotes, addDoubleQuotesAroundKeys} from '../../Util';
import {useEdit, InputField} from '../../Collections/CollectionsUtils';
import {RunProcedureTAG} from '../../../Constants/Tags';
import {BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL, VARIABLE} from '../../../Constants/ThingTypes';
import {THINGSDB_SCOPE} from '../../../Constants/Scopes';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(2),
    },
    warnColor: {
        color: amber[700],
    },
}));

const dataTypes = [BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL]; // Supported types
const tag = RunProcedureTAG;
const scope = THINGSDB_SCOPE;

const Run = ({item, type}) => {
    const classes = useStyles();
    const [output, setOutput] = React.useState('');
    const editState = useEdit()[0];
    const {val} = editState;

    const handleResult = (data) => {
        setOutput(data);
    };
    const handleClickRun = () => {
        const jsonProof = changeSingleToDoubleQuotes(addDoubleQuotesAroundKeys(val)); // make it json proof

        if(type === 'procedure') {
            ProcedureActions.runProcedure(scope, item.name, jsonProof, tag, handleResult);
        } else {
            TimerActions.runTimer(scope, item, tag, handleResult);
        }
    };

    return (
        <Grid item xs={12}>
            <Card>
                {type === 'procedure' && item.arguments.length !== 0 && (
                    <CardContent>
                        <List disablePadding dense>
                            <ListItem disableGutters>
                                <ListItemText primary="Arguments" primaryTypographyProps={{variant: 'button'}} />
                            </ListItem>
                            <ListItem>
                                <InputField dataType={VARIABLE} dataTypes={dataTypes} variables={item.arguments} />
                            </ListItem>
                        </List>
                    </CardContent>
                )}
                <CardHeader
                    title="Click RUN and view the output below."
                    titleTypographyProps={{
                        variant:'subtitle2'
                    }}
                    subheader={item.with_side_effects ? `Note: this ${type} generates an event.` : ''}
                    subheaderTypographyProps={{
                        className: classes.warnColor,
                        variant: 'caption'
                    }}
                    action={
                        <Button
                            className={classes.button}
                            onClick={handleClickRun}
                            variant="outlined"
                            color="primary"
                            size="small"
                        >
                            {'Run'}
                        </Button>
                    }
                />
                <CardActions disableSpacing>
                    <QueryOutput output={output} />
                </CardActions>
                <ErrorMsg tag={tag} />
            </Card>
        </Grid>
    );
};

Run.defaultProps = {
    item: {},
};

Run.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default Run;
