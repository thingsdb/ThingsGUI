import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import QueryInput from '../Util/QueryInput';


const Query = () => {
    const [query, setQuery] = React.useState('');
    const handleInput = ({target}) => {
        const {value} = target;
        setQuery(value);
    };

    return (
        <Grid container spacing={0}>
            {/* <Grid item xs={6}>
                <Typography variant={'caption'} >
                    {"Query:"}
                </Typography>
            </Grid>
            <Grid item xs={6}>
            <TextField
                onChange={handleInput}
                fullWidth
                label='Custom query:'
                type="input"
                name='query'
                value={query}
                multiline
                rows={10}
                rowsMax={20}
                placeholder="Write your custom query here..."
                InputProps={{
                    readOnly: false,
                    disableUnderline: true,
                }}
                inputProps={{
                    style: {
                        fontFamily: 'monospace',
                    },
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            </Grid> */}
            <QueryInput />
        </Grid>
    );
};

export default Query;