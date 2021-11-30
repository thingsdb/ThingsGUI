import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import React from 'react';

import { CollectionActions, ErrorActions, NodesActions, ThingsdbActions } from '../../Stores';
import { DragdownCard, ErrorMsg, QueryOutput, TitlePage2 } from '../Utils';
import { EditorTAG } from '../../Constants/Tags';
import EditorInput from './EditorInput';
import EditorSideContent from './EditorSideContent';
import SelectScope from './SelectScope';


const tag = EditorTAG;
const tabs = {
    tree: 0,
    json: 1,
    args: 2
};

const Editor = () => {
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState('');
    const [input, setInput] = React.useState('');
    const [args, setArgs] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [tabIndex, setTabIndex] = React.useState(tabs.tree);

    React.useEffect(() => {
        NodesActions.getNodes();
        ThingsdbActions.getCollections();
    },[]);

    const handleOnChangeScope = (s) => {
        handleCloseError();
        setScope(s);
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const handleOutput = (out) => {
        setOutput(out);
        setLoading(false);
    };

    const handleFail = () => {
        setLoading(false);
    };

    const handleInput = React.useCallback((value) => {
        setInput(value);
    }, []);

    const handleArgs= (args) => {
        setArgs(args);
    };

    const handleQuery = (query) => {
        setLoading(true);
        CollectionActions.query(scope, query, tag, handleOutput, null, null, args, handleFail);
    };

    const handleChangeTab = (newValue) => {
        setTabIndex(newValue);
    };

    return (
        <TitlePage2
            preTitle='SCOPE:'
            title={<SelectScope onChangeScope={handleOnChangeScope} />}
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <Card>
                            <CardActions disableSpacing sx={{padding: 0}}>
                                <ErrorMsg tag={tag} />
                            </CardActions>
                        </Card>
                        <DragdownCard>
                            {(height) => (
                                <EditorInput loading={loading} height={height} input={input} onQuery={handleQuery} />
                            )}
                        </DragdownCard>
                    </Grid>
                    <Grid item xs={12}>
                        <QueryOutput output={output} onArgs={handleArgs} tabIndex={tabIndex} onChangeTab={handleChangeTab} />
                    </Grid>
                </React.Fragment>
            }
            sideContent={scope ? <EditorSideContent scope={scope} onSetQueryInput={handleInput} /> : null}
        />
    );
};

export default Editor;