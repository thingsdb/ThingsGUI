/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {EnumActions, ProcedureActions, TypeActions} from '../../Stores';
import {ChipsCard, WarnPopover} from '../Util';
import {ViewProcedureDialog} from '../Procedures/Dialogs';
import {EnumTypeChips} from '../Collections/CollectionsUtils/TypesEnumsUtils';

const EditorSideContent = ({scope, onSetQueryInput, tag}) => {
    const [procedures, setProcedures] = React.useState([]);
    const [viewProcedure, setViewProcedure] = React.useState({
        open: false,
        name: '',
    });
    const [viewEnum, setViewEnum] = React.useState({
        open: false,
        name: '',
    });
    const [viewType, setViewType] = React.useState({
        open: false,
        name: '',
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
        setViewProcedure({open: true, name: n});
    };

    const handleCloseViewProcedure = () => {
        setViewProcedure({open: false, name: ''});
    };

    const handleChange = (a, c, n) => {
        switch(a){
        case 'view':
            if (c=='type') {
                setViewEnum({open: false, name: ''});
                setViewType({open: true, name: n});
            } else {
                setViewType({open: false, name: ''});
                setViewEnum({open: true, name: n});
            }
            break;
        case 'add':
            if (c=='type') {
                onSetQueryInput('set_type("...", {...})');
            } else {
                onSetQueryInput('set_enum("...", {...})');
            }
            break;
        }
    };

    const handleClose = (a, c) => {
        if (c=='type') {
            setViewType({open: false, name: ''});
        } else {
            setViewEnum({open: false, name: ''});
        }
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
                    <ViewProcedureDialog open={viewProcedure.open} onClose={handleCloseViewProcedure} procedure={viewProcedure.name?procedures.find(i=>i.name==viewProcedure.name):{}} />
                </Grid>
            )}
            {scope&&scope.includes('@collection') ? (
                <React.Fragment>
                    <EnumTypeChips
                        buttonsView={{add: false, edit: false, run: true, view: true}}
                        categoryInit="type"
                        fields="fields"
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={TypeActions.deleteType}
                        onInfo={TypeActions.getTypes}
                        onMakeInstanceInit={makeTypeInstanceInit}
                        onSetQueryInput={onSetQueryInput}
                        scope={scope}
                        tag={tag}
                        view={{view: viewType.open, name: viewType.name}}
                    />
                    <EnumTypeChips
                        buttonsView={{add: false, edit: false, run: true, view: true}}
                        categoryInit="enum"
                        fields="members"
                        noLink
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={EnumActions.deleteEnum}
                        onInfo={EnumActions.getEnums}
                        onMakeInstanceInit={makeEnumInstanceInit}
                        onSetQueryInput={onSetQueryInput}
                        scope={scope}
                        tag={tag}
                        view={{view: viewEnum.open, name: viewEnum.name}}
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