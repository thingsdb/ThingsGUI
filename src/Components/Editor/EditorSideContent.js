/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import {ProcedureActions, TypeActions} from '../../Stores';
import {ChipsCard, WarnPopover} from '../Util';

const EditorSideContent = ({scope, onSetQueryInput, tag}) => {
    const [procedures, setProcedures] = React.useState([]);
    const [customTypes, setCustomTypes] = React.useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [warnDescription, setWarnDescription] = React.useState('');

    React.useEffect(() => {
        handleGetAdditionals();
    }, [scope]);

    const handleTypes = (t) => {
        setCustomTypes(t);
    };
    const handleProcedures = (p) => {
        setProcedures(p);
    };

    const handleGetAdditionals = () => {
        if (scope&&!scope.includes('@node')) {
            ProcedureActions.getProcedures(scope, tag, handleProcedures);
        }
        if (scope&&scope.includes('collection')) {
            TypeActions.getTypes(scope, tag, handleTypes);
        }
    };

    const handleRefreshProcedures = () => ProcedureActions.getProcedures(scope, tag, handleProcedures);
    const handleRefreshTypes = () => TypeActions.getTypes(scope, tag, handleTypes);

    const customTypeNames = [...customTypes.map(c=>c.name)];
    const makeTypeInstanceInit = (index, circularRefFlag, target) => {
        if (circularRefFlag[customTypes[index].name]) {
            setAnchorEl(target);
            setWarnDescription(`Circular reference detected in type ${customTypes[index].name}`);
            return '';
        } else {
            circularRefFlag[customTypes[index].name] = true;
        }
        return `${customTypes[index].name}{${customTypes[index].fields.map(c =>`${c[0]}: ${customTypeNames.includes(c[1]) ? makeTypeInstanceInit(customTypeNames.indexOf(c[1]), circularRefFlag, target) : `<${c[1]}>`}` )}}`;
    };

    const handleClickDeleteProcedure = (index, cb, tag) => {
        ProcedureActions.deleteProcedure(
            scope,
            procedures[index].name,
            tag,
            (p) => {
                cb();
                handleProcedures(p);
            }
        );
    };
    const handleClickDeleteTypes = (index, cb, tag) => {
        TypeActions.deleteType(
            scope,
            customTypes[index].name,
            tag,
            (t) => {
                cb();
                handleTypes(t);
            }
        );
    };

    const handleClickProcedure = (index) => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}',${procedures[index].arguments.map(a=>` <${a}>` )}))` : `run('${procedures[index].name}',${procedures[index].arguments.map(a=>` <${a}>` )})`;
        onSetQueryInput(i);
    };
    const handleClickTypes = (index, target) => {
        const circularRefFlag = {};
        const i = makeTypeInstanceInit(index, circularRefFlag, target);
        onSetQueryInput(i);
    };
    const handleClickAddProcedure = () => {
        onSetQueryInput('new_procedure("...", ...)');
    };
    const handleClickAddTypes = () => {
        onSetQueryInput('set_type("...", {...})');
    };

    const handleCloseDelete = () => {
        setAnchorEl(null);
    };


    return (
        <React.Fragment>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} description={warnDescription} />
            {scope&&scope.includes('@node') ? null : (
                <Grid item xs={12}>
                    <ChipsCard
                        expand={false}
                        items={procedures}
                        onAdd={handleClickAddProcedure}
                        onEdit={handleClickProcedure}
                        onRefresh={handleRefreshProcedures}
                        onDelete={handleClickDeleteProcedure}
                        title="procedures"
                    />
                </Grid>
            )}
            {scope&&scope.includes('@collection') ? (
                <Grid item xs={12}>
                    <ChipsCard
                        expand={false}
                        items={customTypes}
                        onAdd={handleClickAddTypes}
                        onEdit={handleClickTypes}
                        onRefresh={handleRefreshTypes}
                        onDelete={handleClickDeleteTypes}
                        title="custom types"
                    />
                </Grid>
            ): null}
        </React.Fragment>

    );
};

EditorSideContent.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetQueryInput: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
};

export default EditorSideContent;