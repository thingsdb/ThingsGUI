import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import React from 'react';
import {withVlow} from 'vlow';

import SelectScope from './SelectScope';
import Procedures from './Procedures';
import {ApplicationStore} from '../../Stores/ApplicationStore';
import {CollectionActions, CollectionStore} from '../../Stores/CollectionStore';
import {ProcedureActions, ProcedureStore} from '../../Stores/ProcedureStore';
import {ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['input']
}, {
    store: ProcedureStore,
}, {
    store: CollectionStore,
}]);

const tag = '9';

const Query = ({input}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState({});
    const [queryInput, setQueryInput] = React.useState('');

    React.useEffect(() => {
        setQueryInput(input);
    }, [input]);

    const handleInput = (value) => {
        setQueryInput('');
        setQuery(value);
    };

    const handleSubmit = () => {
        CollectionActions.queryEditor(query, scope.value, scope.collectionId, handleOutput, tag);
        if (query.includes('new_procedure') || query.includes('del_procedure')) {
            ProcedureActions.getProcedures(scope.value, tag);
        }
    };

    const handleOutput = (out) => {
        setOutput(out === null ? 'nil' : out);
    };

    const handleOnChangeScope = (s) => {
        setScope(s);
    };

    const handleSetAsInput = (i) => {
        setQueryInput(i);
    };
    console.log('QUERY');

    return (
        <TitlePage2
            preTitle='Customize your:'
            title='Query'
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                title="INPUT"
                                titleTypographyProps={{variant: 'body1'}}
                            />
                            <CardContent>
                                <ErrorMsg tag={tag} />
                                <QueryInput onChange={handleInput} input={queryInput} />
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <Button
                                    onClick={handleSubmit}
                                    variant="text"
                                    color="primary"
                                    size="large"
                                >
                                    {<SendIcon />}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <HarmonicCard
                            title="OUTPUT"
                            content={
                                <QueryOutput output={output} />
                            }
                        />
                    </Grid>
                </React.Fragment>
            }
            sideContent={
                <React.Fragment>
                    <Grid item xs={12}>
                        <SelectScope onChangeScope={handleOnChangeScope} />
                    </Grid>
                    <Grid item xs={12}>
                        <Procedures scope={scope.hasOwnProperty('value') ? scope.value : ''} onSetAsInput={handleSetAsInput} />
                    </Grid>
                </React.Fragment>
            }
        />
    );
};

Query.propTypes = {

    /* Application properties */
    input: ApplicationStore.types.input.isRequired,
};

export default withStores(Query);