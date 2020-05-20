/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {EnumActions, ProcedureActions, TypeActions} from '../../Stores';
import {ChipsCard, WarnPopover} from '../Util';
import {ViewProcedureDialog} from '../Procedures/Dialogs';
import {AddLink, ViewDialog} from '../Collections/CollectionsUtils/TypesEnumsUtils';
import EditorEnumType from './EditorEnumType';

const EditorSideContent = ({scope, onSetQueryInput, tag}) => {
    const [procedures, setProcedures] = React.useState([]);

    const [view, setView] = React.useState({
        procedure: {
            open: false,
            name: '',
        },
        enum: {
            open: false,
            name: '',
        },
        type: {
            open: false,
            name: '',
        }
    });

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [warnDescription, setWarnDescription] = React.useState('');

    React.useEffect(() => {
        handleGetAdditionals();
    }, [scope]);

    const handleProcedures = (p) => {
        setProcedures(p);
    };

    const handleGetAdditionals = () => {
        if (scope&&!scope.includes('@node')) {
            ProcedureActions.getProcedures(scope, tag, handleProcedures);
        }
        // if (scope&&scope.includes('collection')) {
        //     TypeActions.getTypes(scope, tag, handleTypes);
        //     EnumActions.getEnums(scope, tag, handleEnums);
        // }
    };

    const handleRefreshProcedures = () => ProcedureActions.getProcedures(scope, tag, handleProcedures);

    const makeTypeInstanceInit = (n, customTypeNames, customTypes, circularRefFlag, target) => {
        if (customTypeNames.includes(n)) {
            if (circularRefFlag[n]) {
                setAnchorEl(target);
                setWarnDescription('Circular reference detected');
                return '';
            } else {
                circularRefFlag[n] = true;
                return `${n}{${customTypes.find(i=>i.name==n).fields.map(c =>`${c[0]}: ${makeTypeInstanceInit(c[1], customTypeNames, customTypes, {...circularRefFlag}, target)}`)}}`;
            }
        }
        return `<${n}>`;
    };
    const makeEnumInstanceInit = (n)  => {
        return `${n}{...}`;
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

    const handleClickRunProcedure = (n) => () => {
        let p = procedures.find(i=>i.name==n);
        const i = p.with_side_effects ? `wse(run('${n}',${p.arguments.map(a=>` <${a}>` )}))` : `run('${n}',${p.arguments.map(a=>` <${a}>` )})`;
        onSetQueryInput(i);
    };

    const handleClickAddProcedure = () => {
        onSetQueryInput('new_procedure("...", ...)');
    };

    const handleCloseWarn = () => {
        setAnchorEl(null);
    };

    const handleClickViewProcedure = (n) => () => {
        setView({...view, procedure: {open: true, name: n}});
    };

    const handleCloseViewProcedure = () => {
        setView({...view, procedure: {...view.procedure, open: false}});
    };

    const handleChangeView = (n, c) => {
        console.log('hi')
        setView({...view, [c]: {open: true, name: n}});
    };

    const handleCloseViewType = () => {
        setView({...view, type: {open: false, name: ''}});
    };
    const handleCloseViewEnum = () => {
        setView({...view, enum: {open: false, name: ''}});
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
    console.log(view)
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
                <React.Fragment>
                    <EditorEnumType
                        addInput={'set_type("...", {...})'}
                        categoryInit="type"
                        fields="fields"
                        onChange={handleChangeView}
                        onCloseView={handleCloseViewType}
                        onDeleteItem={TypeActions.deleteType}
                        onInfo={TypeActions.getTypes}
                        onMakeInstanceInit={makeTypeInstanceInit}
                        onSetQueryInput={onSetQueryInput}
                        scope={scope}
                        tag={tag}
                        view={view.type}
                    />
                    <EditorEnumType
                        addInput={'set_enum("...", {...})'}
                        categoryInit="enum"
                        fields="members"
                        noLink
                        onChange={handleChangeView}
                        onCloseView={handleCloseViewEnum}
                        onDeleteItem={EnumActions.deleteEnum}
                        onInfo={EnumActions.getEnums}
                        onMakeInstanceInit={makeEnumInstanceInit}
                        onSetQueryInput={onSetQueryInput}
                        scope={scope}
                        tag={tag}
                        view={view.enum}
                    />
                </React.Fragment>
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