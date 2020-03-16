/* eslint-disable react/no-multi-comp */
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, ProcedureActions} from '../../Stores';
import {Closure, ErrorMsg} from '../Util';


const tag = '12';
const scope = '@thingsdb';
const Edit = ({procedure}) => {
    const [queryString, setQueryString] = React.useState('');
    const [closure, setClosure] = React.useState('');

    React.useEffect(() => {
        if (open) {
            setClosure(procedure.definition);
            setQueryString(`del_procedure("${procedure.name}"); new_procedure("${procedure.name}", ${procedure.definition});`);
        }
    },
    [open, procedure.definition, procedure.name],
    );

    const handleClosure = (c) => {
        setClosure(c);
        setQueryString(`del_procedure("${procedure.name}"); new_procedure("${procedure.name}", ${c});`);
    };

    const handleClickOk = () => {
        CollectionActions.rawQuery(
            scope,
            closure,
            tag,
            () => {
                handleSubmit();
            }
        );
    };


    const handleSubmit = () => {
        CollectionActions.rawQuery(
            scope,
            queryString,
            tag,
            () => {
                ProcedureActions.getProcedures(scope, tag);
            }
        );
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <ErrorMsg tag={tag} />
            </Grid>
            <Grid item xs={12}>
                <List disablePadding dense>
                    <ListItem>
                        <Closure input={closure} cb={handleClosure} />
                    </ListItem>
                    <ListItem>
                        <Grid container item xs={11} justify="flex-end">
                            <Box fontSize={10} fontStyle="italic" m={1}>
                                {`Created on: ${moment(procedure.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}`}
                            </Box>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Button onClick={handleClickOk} color="primary">
                            {'Save'}
                        </Button>
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    );
};

Edit.defaultProps = {
    procedure: {},
};

Edit.propTypes = {
    procedure: PropTypes.object,
};

export default Edit;
