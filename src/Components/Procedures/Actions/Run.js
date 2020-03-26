/* eslint-disable react/no-multi-comp */
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

import {ProcedureActions} from '../../../Stores';
import {ErrorMsg, HarmonicCard, QueryOutput, changeSingleToDoubleQuotes, addDoubleQuotesAroundKeys} from '../../Util';
import {useEdit, InputField} from '../../Collections/CollectionsUtils';


const dataTypes = ['str', 'int', 'float', 'bool', 'nil', 'list', 'thing']; // Supported types
const tag = '19';
const scope = '@thingsdb';
const Run = ({procedure}) => {
    const [output, setOutput] = React.useState('');
    const [expandOutput, setExpandOutput] = React.useState(false);
    const editState = useEdit()[0];
    const {val} = editState;

    const handleResult = (data) => {
        setExpandOutput(true);
        setOutput(data);
    };
    const handleClickRun = () => {
        const jsonProof = changeSingleToDoubleQuotes(addDoubleQuotesAroundKeys(val)); // make it json proof
        ProcedureActions.runProcedure(
            scope,
            procedure&&procedure.name,
            jsonProof,
            tag,
            handleResult,
        );
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" >
                                        {'RUN PROCEDURE'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <ErrorMsg tag={tag} />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <List disablePadding dense>
                                    {procedure.arguments.length!==0 && (
                                        <React.Fragment>
                                            <ListItem>
                                                <ListItemText primary="Arguments:" />
                                            </ListItem>
                                            <ListItem>
                                                <InputField dataType="variable" dataTypes={dataTypes} variables={procedure.arguments} />
                                            </ListItem>
                                        </React.Fragment>
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <HarmonicCard
                    title={
                        <Button
                            onClick={handleClickRun}
                            variant="text"
                            color="primary"
                            size="large"
                        >
                            {'Run'}
                        </Button>
                    }
                    content={
                        <QueryOutput output={output} />
                    }
                    noPadding
                    expand={expandOutput}
                    unmountOnExit={false}
                />
            </Grid>
        </React.Fragment>
    );
};

Run.defaultProps = {
    procedure: {},
};

Run.propTypes = {
    procedure: PropTypes.object,
};

export default Run;
