import React from 'react';
// import PropTypes from 'prop-types';
// import { makeStyles} from '@material-ui/core/styles';

import {QueryOutput} from '../Util';

const Watcher = () => {

    return (
        <React.Fragment >
            <QueryOutput output={null} />
        </React.Fragment>

    );
};

// Watcher.defaultProps = {
//     output: null,
// };

// Watcher.propTypes = {
//     output: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
// };
export default Watcher;

// class ThingForGui(Thing):

//     def __init__(self, client):
//         self.client = client

//     def __new__(cls, *arg, **kwargs):
//         return Object.__new__()

//     async def on_init(self, event, data):
//         await socket.emit(self._collection._client, event, data)



// id=5 collection='stuff'

// thing = ThingForGui(id, collection)
