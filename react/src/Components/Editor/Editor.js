import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import React from 'react';

import { CollectionActions, ErrorActions, NodesActions, ThingsdbActions } from '../../Stores';
import { DragdownCard, ErrorMsg, TitlePage2, QueryOutput } from '../Utils';
import { EditorTAG } from '../../Constants/Tags';
import EditorInput from './EditorInput';
import EditorSideContent from './EditorSideContent';
import SelectScope from './SelectScope';


const tag = EditorTAG;

const Editor = () => {
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState('');
    const [input, setInput] = React.useState('');
    const [args, setArgs] = React.useState(null);

    console.log(args)

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
    };

    const handleInput = React.useCallback((value) => {
        setInput(value);
    }, []);

    const handleArgs= (args) => {
        setArgs(args);
    };

    const handleQuery = (query) => {
        CollectionActions.query(scope, query, tag, handleOutput, null, null, args);
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
                                <EditorInput height={height} input={input} onQuery={handleQuery} />
                            )}
                        </DragdownCard>
                    </Grid>
                    <Grid item xs={12}>
                        <QueryOutput output={output} onArgs={handleArgs} />
                    </Grid>
                </React.Fragment>
            }
            sideContent={scope ? <EditorSideContent scope={scope} onSetQueryInput={handleInput} /> : null}
        />
    );
};

export default Editor;