/* eslint-disable react-hooks/exhaustive-deps */
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ProcedureActions, TypeActions} from '../../Stores';
import {ChipsCard, WarnPopover} from '../Util';
import {ViewProcedureDialog} from '../Procedures/Dialogs';
import {ViewTypeDialog} from '../Collections/Types/Dialogs';

const EditorSideContent = ({scope, onSetQueryInput, tag}) => {
    const [procedures, setProcedures] = React.useState([]);
    const [customTypes, setCustomTypes] = React.useState([]);

    const [view, setView] = React.useState({
        procedure: {
            open: false,
            index: null,
        },
        types: {
            open: false,
            index: null,
        }
    });

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

    const handleClickRunProcedure = (index) => () => {
        const i = procedures[index].with_side_effects ? `wse(run('${procedures[index].name}',${procedures[index].arguments.map(a=>` <${a}>` )}))` : `run('${procedures[index].name}',${procedures[index].arguments.map(a=>` <${a}>` )})`;
        onSetQueryInput(i);
    };
    const handleClickRunTypes = (index, target) => () => {
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

    const handleCloseWarn = () => {
        setAnchorEl(null);
    };

    const handleClickViewProcedure = (i) => () => {
        setView({...view, procedure: {open: true, index: i}});
    };

    const handleCloseViewProcedure = () => {
        setView({...view, procedure: {open: false, index: null}});
    };

    const handleClickViewTypes = (i) => () => {
        setView({...view, types: {open: true, index: i}});
    };

    const handleCloseViewTypes = () => {
        setView({...view, types: {open: false, index: null}});
    };

    const buttons = (fnView, fnRun) => (index)=>([
        {
            icon: <ViewIcon fontSize="small" />,
            onClick: fnView(index),
        },
        {
            icon: <RunIcon fontSize="small" />,
            onClick: fnRun(index),
        },
    ]);

    return (
        <React.Fragment>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseWarn} description={warnDescription} />
            {scope&&scope.includes('@node') ? null : (
                <Grid item xs={12}>
                    <ChipsCard
                        buttons={buttons(handleClickViewProcedure, handleClickRunProcedure)}
                        expand={false}
                        items={procedures}
                        onAdd={handleClickAddProcedure}
                        onRefresh={handleRefreshProcedures}
                        onDelete={handleClickDeleteProcedure}
                        title="procedures"
                        warnExpression={i=>i.with_side_effects}
                    />
                    <ViewProcedureDialog open={view.procedure.open} onClose={handleCloseViewProcedure} procedure={view.procedure.index!==null?procedures[view.procedure.index]:{}} />
                </Grid>
            )}
            {scope&&scope.includes('@collection') ? (
                <Grid item xs={12}>
                    <ChipsCard
                        buttons={buttons(handleClickViewTypes, handleClickRunTypes)}
                        expand={false}
                        items={customTypes}
                        onAdd={handleClickAddTypes}
                        onRefresh={handleRefreshTypes}
                        onDelete={handleClickDeleteTypes}
                        title="custom types"
                    />
                    <ViewTypeDialog open={view.types.open} onClose={handleCloseViewTypes} customType={view.types.index!=null&&customTypes?customTypes[view.types.index]:{}} />
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