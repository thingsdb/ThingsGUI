import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import React from 'react';

import { ErrorStore } from '../../Stores';
import {ErrorToastCard} from '../Util';

const useStyles = makeStyles(() => ({
    portal: {
        position: 'absolute',
        bottom: '1%',
        right: '1%',
        width: '400px',
        zIndex: 3000,
    },
}));

const withStores = withVlow([{
    store: ErrorStore,
    keys: ['toastErrors']
}]);


const ErrorToast = ({toastErrors}) => {
    const classes = useStyles();
    return(
        <div className={classes.portal}>
            <ul>
                {[...toastErrors].map((err, i) => <ErrorToastCard key={`error_toast_card_${i}`} index={i} thingsError={err} />)}
            </ul>
        </div>
    );
};

ErrorToast.propTypes = {
    toastErrors: ErrorStore.types.toastErrors.isRequired,
};

export default withStores(ErrorToast);

