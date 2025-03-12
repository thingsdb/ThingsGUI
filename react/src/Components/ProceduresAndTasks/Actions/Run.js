import { amber } from '@mui/material/colors';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import { ProcedureActions } from '../../../Stores';
import { ErrorMsg, InputField, QueryOutput, SendButton, useEdit } from '../../Utils';
import { RunProcedureTAG } from '../../../Constants/Tags';
import { BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL, VARIABLE } from '../../../Constants/ThingTypes';
import { THINGSDB_SCOPE } from '../../../Constants/Scopes';


const dataTypes = [BOOL, CODE, DATETIME, FLOAT, INT, LIST, NIL, STR, THING, TIMEVAL]; // Supported types
const tag = RunProcedureTAG;
const scope = THINGSDB_SCOPE;

const Run = ({
    item = {},
    type,
}) => {
    const [output, setOutput] = React.useState('');
    const [tabIndex, setTabIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const editState = useEdit()[0];
    const {obj} = editState;

    const handleResult = (data) => {
        setOutput(data);
        setTimeout(()=> {
            setLoading(false);
        }, 750);
    };
    const handleClickRun = () => {
        setLoading(true);
        if(type === 'procedure') {
            ProcedureActions.runProcedure(
                scope,
                item.name,
                obj,
                tag,
                handleResult,
                () => {
                    setTimeout(()=> {
                        setLoading(false);
                    }, 750);
                }
            );
        }
    };

    const handleChangeTab = (newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Grid size={12}>
            <Card>
                {type === 'procedure' && item.arguments.length !== 0 && (
                    <CardContent>
                        <List disablePadding dense>
                            <ListItem disableGutters>
                                <ListItemText primary="Arguments" slotProps={{primary: {variant: 'button'}}} />
                            </ListItem>
                            <ListItem>
                                <InputField dataType={VARIABLE} dataTypes={dataTypes} variables={item.arguments} />
                            </ListItem>
                        </List>
                    </CardContent>
                )}
                <CardHeader
                    title="Click RUN and view the output below."
                    slotProps={{
                        title: {
                            variant:'subtitle2'
                        },
                        subheader: {
                            sx: {color: amber[700]},
                            variant: 'caption'
                        }
                    }}
                    subheader={item.with_side_effects ? `Note: this ${type} generates an event.` : ''}
                    action={
                        <SendButton
                            label="Run"
                            loading={loading}
                            onClickSend={handleClickRun}
                        />
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

Run.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default Run;
