/* eslint-disable react-hooks/exhaustive-deps */
import {withVlow} from 'vlow';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import {ApplicationStore, ErrorActions, NodesActions} from '../../Stores';
import {DragdownCard, ErrorMsg, HarmonicCard, TitlePage2, QueryOutput} from '../Util';
import {EditorTAG} from '../../constants';
import EditorInput from './EditorInput';
import EditorSideContent from './EditorSideContent';
import SelectScope from './SelectScope';


const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}]);


const tag = EditorTAG;

const Editor = ({match}) => {
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState('');
    const [input, setInput] = React.useState('');

    const [expandOutput, setExpandOutput] = React.useState(false);

    React.useEffect(() => {
        NodesActions.getNodes();
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

    const handleExpand = (exp) => {
        setExpandOutput(exp);
    };

    const handleInput = (value) => {
        setInput(value);
    };

    return (
        <TitlePage2
            preTitle='Customize your query:'
            title={<SelectScope scope={match.scope} onChangeScope={handleOnChangeScope} />}
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <Card id='errMsg'>
                            <ErrorMsg tag={tag} />
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <DragdownCard>
                            {(height) => (
                                <EditorInput height={height} input={input} onExpand={handleExpand} onOutput={handleOutput} scope={scope} />
                            )}
                        </DragdownCard>
                    </Grid>
                    <Grid item xs={12}>
                        <HarmonicCard
                            title="OUTPUT"
                            content={
                                <QueryOutput output={output} />
                            }
                            noPadding
                            expand={expandOutput}
                        />
                    </Grid>
                </React.Fragment>
            }
            sideContent={<EditorSideContent scope={scope} onSetQueryInput={handleInput} tag={tag} />}
        />
    );
};

Editor.propTypes = {

    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
};

export default withStores(Editor);