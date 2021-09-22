import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import React from 'react';

import {ErrorActions, NodesActions, ThingsdbActions} from '../../Stores';
import {DragdownCard, ErrorMsg, HarmonicCard, TitlePage2, QueryOutput} from '../Util';
import {EditorTAG} from '../../Constants/Tags';
import EditorInput from './EditorInput';
import EditorSideContent from './EditorSideContent';
import SelectScope from './SelectScope';


const useStyles = makeStyles(theme => ({
    cardAction: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: theme.spacing(1),
        paddingRight: 0
    },
}));

const tag = EditorTAG;

const Editor = () => {
    const classes = useStyles();
    const [output, setOutput] = React.useState(null);
    const [scope, setScope] = React.useState('');
    const [input, setInput] = React.useState('');

    const [expandOutput, setExpandOutput] = React.useState(false);

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

    const handleExpand = (exp) => {
        setExpandOutput(exp);
    };

    const handleInput = React.useCallback((value) => {
        setInput(value);
    }, []);

    return (
        <TitlePage2
            preTitle='SCOPE:'
            title={<SelectScope onChangeScope={handleOnChangeScope} />}
            content={
                <React.Fragment>
                    <Grid item xs={12}>
                        <Card>
                            <CardActions className={classes.cardAction} disableSpacing>
                                <ErrorMsg tag={tag} />
                            </CardActions>
                        </Card>
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
            sideContent={scope ? <EditorSideContent scope={scope} onSetQueryInput={handleInput} /> : null}
        />
    );
};

export default Editor;