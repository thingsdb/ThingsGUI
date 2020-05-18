/* eslint-disable react-hooks/exhaustive-deps */
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
            name: '',
        },
        types: {
            open: false,
            name: '',
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
    const makeTypeInstanceInit = (n, circularRefFlag, target) => {
        if (customTypeNames.includes(n)) {
            if (circularRefFlag[n]) {
                setAnchorEl(target);
                setWarnDescription('Circular reference detected');
                return '';
            } else {
                circularRefFlag[n] = true;
                return `${n}{${customTypes.find(i=>i.name==n).fields.map(c =>`${c[0]}: ${makeTypeInstanceInit(c[1], {...circularRefFlag}, target)}`)}}`;
            }
        }
        return `<${n}>`;
    };

    const handleClickDeleteProcedure = (n, cb, tag) => {
        ProcedureActions.deleteProcedure(
            scope,
            n,
            tag,
            (p) => {
                cb();
                handleProcedures(p);
            }
        );
    };
    const handleClickDeleteTypes = (n, cb, tag) => {
        TypeActions.deleteType(
            scope,
            n,
            tag,
            (t) => {
                cb();
                handleTypes(t);
            }
        );
    };

    const handleClickRunProcedure = (n) => () => {
        let p = procedures.find(i=>i.name==n);
        const i = p.with_side_effects ? `wse(run('${n}',${p.arguments.map(a=>` <${a}>` )}))` : `run('${n}',${p.arguments.map(a=>` <${a}>` )})`;
        onSetQueryInput(i);
    };
    const handleClickRunTypes = (n) => ({target}) => {
        const circularRefFlag = {};
        const i = makeTypeInstanceInit(n, circularRefFlag, target);
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

    const handleChangeType = (n) => {
        setView({...view, types: {open: true, name: n}});
    };

    const handleClickViewProcedure = (n) => () => {
        setView({...view, procedure: {open: true, name: n}});
    };

    const handleCloseViewProcedure = () => {
        setView({...view, procedure: {...view.procedure, open: false, }});
    };

    const handleClickViewTypes = (n) => () => {
        setView({...view, types: {open: true, name: n}});
    };

    const handleCloseViewTypes = () => {
        setView({...view, types: {...view.types, open: false}});
    };

    const buttons = (fnView, fnRun) => (n)=>([
        {
            icon: <ViewIcon fontSize="small" />,
            onClick: fnView(n),
        },
        {
            icon: <RunIcon fontSize="small" />,
            onClick: fnRun(n),
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
                    <ViewProcedureDialog open={view.procedure.open} onClose={handleCloseViewProcedure} procedure={view.procedure.name?procedures.find(i=>i.name==view.procedure.name):{}} />
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
                    <ViewTypeDialog open={view.types.open} onClose={handleCloseViewTypes} onChangeType={handleChangeType} customType={view.types.name&&customTypes?customTypes.find(i=>i.name==view.types.name):{}} customTypes={customTypes||[]} />
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