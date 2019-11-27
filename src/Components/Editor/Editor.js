import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import SendIcon from '@material-ui/icons/Send';
import React from 'react';
import {withVlow} from 'vlow';

import SelectScope from './SelectScope';
import Procedures from './Procedures';
import CustomTypes from './CustomTypes';
import {ApplicationStore, CollectionActions, CollectionStore, ErrorActions, ProcedureActions, ProcedureStore, TypeActions} from '../../Stores';
import {ErrorMsg, HarmonicCard, TitlePage2, QueryInput, QueryOutput} from '../Util';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: ProcedureStore,
}, {
    store: CollectionStore,
}]);

const tag = '9';

const Editor = ({match}) => {
    const [query, setQuery] = React.useState('');
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState({});
    const [queryInput, setQueryInput] = React.useState('');
    const [shrink, setShrink] = React.useState(false);

    React.useEffect(() => {
        setQueryInput(match.item);
    }, [match.item]);

    const handleInput = (value) => {
        handleCloseError();
        setQueryInput('');
        setQuery(value);
    };

    const handleSubmit = () => {
        setShrink(false);
        CollectionActions.queryEditor(scope.value, query, scope.collectionId, handleOutput, tag);
        if (scope.value&&!scope.value.includes('@node')) {
            ProcedureActions.getProcedures(scope.value, tag);
        }
        if (scope.value.includes('collection')) {
            TypeActions.getTypes(scope.value, tag);
        }
    };

    const handleKeyPress = (e) => {
        const {key, ctrlKey} = e;
        if (ctrlKey && key == 'Enter') {
            handleSubmit();
        }
    };

    const handleOutput = (out) => {
        setOutput(out);
    };

    const handleOnChangeScope = (s) => {
        handleCloseError();
        setScope(s);
    };

    const handleSetAsInput = (i) => {
        handleCloseError();
        setQueryInput(i);
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const handleShrink = () => {
        setShrink(true);
    };

    // const element = document.getElementById('editor');
    // console.log('el', element);
    return (
        <TitlePage2
            preTitle='Customize your:'
            title='Query'
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <Card id='editor'>
                            <CardHeader
                                title="INPUT"
                                titleTypographyProps={{variant: 'body1'}}
                            />
                            <CardContent onKeyDown={handleKeyPress} onClick={handleShrink}>
                                <ErrorMsg tag={tag} />
                                <Collapse in={shrink} collapsedHeight="40px">
                                    <QueryInput onChange={handleInput} input={queryInput} />
                                </Collapse>
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
                            expand={!shrink}
                        />
                    </Grid>
                </React.Fragment>
            }
            sideContent={
                <React.Fragment>
                    <Grid item xs={12}>
                        <SelectScope scope={match.scope} onChangeScope={handleOnChangeScope} />
                    </Grid>
                    {scope.value && scope.value.includes('@node') ? null : (
                        <Grid item xs={12}>
                            <Procedures scope={scope.hasOwnProperty('value') ? scope.value : ''} onSetAsInput={handleSetAsInput} />
                        </Grid>
                    )}
                    {scope.value && scope.value.includes('@collection') ? (
                        <Grid item xs={12}>
                            <CustomTypes scope={scope.hasOwnProperty('value') ? scope.value : ''} onSetAsInput={handleSetAsInput} />
                        </Grid>
                    ): null}
                </React.Fragment>
            }
        />
    );
};

Editor.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
};

export default withStores(Editor);