import { amber } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import { ProcedureActions, TaskActions } from '../../../Stores';
import { ErrorMsg, InputField, jsonify, QueryOutput, useEdit } from '../../Utils';
import { RunProcedureTAG } from '../../../Constants/Tags';
import { BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL, VARIABLE } from '../../../Constants/ThingTypes';
import { THINGSDB_SCOPE } from '../../../Constants/Scopes';


const dataTypes = [BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL]; // Supported types
const tag = RunProcedureTAG;
const scope = THINGSDB_SCOPE;

const Run = ({item, type}) => {
    const [output, setOutput] = React.useState('');
    const [tabIndex, setTabIndex] = React.useState(0);
    const editState = useEdit()[0];
    const {val} = editState;

    const handleResult = (data) => {
        setOutput(data);
    };
    const handleClickRun = () => {
        const jsonProof = jsonify(val); // make it json proof
        if(type === 'procedure') {
            ProcedureActions.runProcedure(scope, item.name, jsonProof, tag, handleResult);
        } else {
            TaskActions.runTask(scope, item, tag, handleResult);
        }
    };

    const handleChangeTab = (newValue) => {
        setTabIndex(newValue);
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
                        sx: {color: amber[700]},
                        variant: 'caption'
                    }}
                    action={
                        <Button
                            onClick={handleClickRun}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{margin: '16px'}}
                        >
                            {'Run'}
                        </Button>
                    }
                />
                <CardActions disableSpacing>
                    <QueryOutput output={output} tabIndex={tabIndex} onChangeTab={handleChangeTab} />
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
