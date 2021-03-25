import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {ProcedureActions, TimerActions} from '../../../Stores';
import {ErrorMsg, QueryOutput, changeSingleToDoubleQuotes, addDoubleQuotesAroundKeys} from '../../Util';
import {useEdit, InputField} from '../../Collections/CollectionsUtils';
import {RunProcedureTAG} from '../../../constants';


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(2),
    },
    warnColor: {
        color: amber[700],
    },
}));

const dataTypes = ['bool', 'code', 'datetime', 'float', 'int', 'list', 'nil', 'str', 'thing', 'timeval']; // Supported types
const tag = RunProcedureTAG;
const scope = '@thingsdb';

const Run = ({item, type}) => {
    const classes = useStyles();
    const [output, setOutput] = React.useState('');
    const editState = useEdit()[0];
    const {val} = editState;

    const handleResult = (data) => {
        setOutput(data);
    };
    const handleClickRun = () => {
        console.log(val)
        const jsonProof = changeSingleToDoubleQuotes(addDoubleQuotesAroundKeys(val)); // make it json proof

        if(type === 'procedure') {
            ProcedureActions.runProcedure(scope, item.name, jsonProof, tag, handleResult);
        } else {
            TimerActions.runTimer(scope, item, tag, handleResult);
        }
    };

    return (
        <React.Fragment>
            {type === 'procedure' &&
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid item xs={12}>
                                <List disablePadding dense>
                                    {item.arguments.length !== 0 && (
                                        <React.Fragment>
                                            <ListItem>
                                                <ListItemText primary="Arguments:" primaryTypographyProps={{variant: 'h6'}} />
                                            </ListItem>
                                            <ListItem>
                                                <InputField dataType="variable" dataTypes={dataTypes} variables={item.arguments} />
                                            </ListItem>
                                        </React.Fragment>
                                    )}
                                </List>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            }
            <Grid item xs={12}>
                <Card>
                    <Grid container item xs={12}>
                        <Grid item xs={12}>
                            <Button
                                className={classes.button}
                                onClick={handleClickRun}
                                variant="outlined"
                                color="primary"
                                size="small"
                            >
                                {'Run'}
                            </Button>
                        </Grid>
                        {item.with_side_effects && (
                            <Grid item xs={12}>
                                <Typography variant="caption" className={classes.warnColor}>
                                    {`Note: this ${type} generates an event.`}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <ErrorMsg tag={tag} />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <QueryOutput output={output} />
            </Grid>
        </React.Fragment>
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
