import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {EnumActions, ProcedureActions, TypeActions, EnumStore, ProcedureStore, TypeStore, TimerActions, TimerStore} from '../../Stores';
import {ChipsCard, HarmonicCardHeader, WarnPopover} from '../Util';
import {ViewProcedureDialog} from '../ProceduresAndTimers/ProcedureDialogs';
import {ViewTimerDialog} from '../ProceduresAndTimers/TimerDialogs';
import {EnumTypeChips} from '../Collections/CollectionsUtils/TypesEnumsUtils';
import {ProceduresTAG, TimersTAG} from '../../constants';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}, {
    store: TimerStore,
    keys: ['timers']
}, {
    store: ProcedureStore,
    keys: ['procedures']
}]);

const EditorSideContent = ({customTypes, enums, procedures, scope, onSetQueryInput, tag, timers}) => {
    const [viewProcedure, setViewProcedure] = React.useState({
        open: false,
        name: '',
        expand: false,
    });
    const [viewTimer, setViewTimer] = React.useState({
        open: false,
        id: '',
        expand: false,
    });
    const [viewEnum, setViewEnum] = React.useState({
        open: false,
        name: '',
        expand: false,
    });
    const [viewType, setViewType] = React.useState({
        open: false,
        name: '',
        expand: false,
    });

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [warnDescription, setWarnDescription] = React.useState('');

    React.useEffect(() => {
        handleGetAdditionals();
    }, [handleGetAdditionals]);

    const handleRefreshEnums = React.useCallback(() => EnumActions.getEnums(scope, tag), [scope, tag]);
    const handleRefreshTypes = React.useCallback(() => TypeActions.getTypes(scope, tag), [scope, tag]);
    const handleRefreshProcedures = React.useCallback(() => ProcedureActions.getProcedures(scope, tag), [scope, tag]);
    const handleRefreshTimers = React.useCallback(() => TimerActions.getTimers(scope, tag), [scope, tag]);

    const handleGetAdditionals = React.useCallback(() => {
        if (scope&&!scope.includes('@node')) {
            handleRefreshProcedures();
            handleRefreshTimers();
            if (!scope.includes('@thingsdb')) {
                handleRefreshTypes();
                handleRefreshEnums();
            }
        }
    }, [handleRefreshEnums, handleRefreshTypes, handleRefreshProcedures, handleRefreshTimers, scope]);

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
            () => {
                cb();
            }
        );
    };

    const handleClickRunProcedure = (n) => () => {
        let p = (procedures?procedures[scope]:[]).find(i=>i.name==n);
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
        setViewProcedure({...viewProcedure, open: true, name: n});
    };

    const handleCloseViewProcedure = () => {
        setViewProcedure({...viewProcedure, open: false, name: ''});
    };

    const handleChange = (a) => (n, c) => {
        switch(a){
        case 'view':
            if (c=='type') {
                setViewEnum({...viewEnum, open: false, name: ''});
                setViewType({open: true, expand: true, name: n});
            } else {
                setViewType({...viewType, open: false, name: ''});
                setViewEnum({open: true, expand: true, name: n});
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

    const handleClose = (_a, c) => {
        if (c=='type') {
            setViewType({...viewType, open: false, name: ''});
        } else {
            setViewEnum({...viewEnum, open: false, name: ''});
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

    const handleExpand = (ky) => (check) => {
        switch(ky){
        case 'type':
            setViewType({...viewType, expand: check});
            break;
        case 'enum':
            setViewEnum({...viewEnum, expand: check});
            break;
        case 'procedure':
            setViewProcedure({...viewProcedure, expand: check});
            break;
        }
    };

    return (
        <React.Fragment>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseWarn} description={warnDescription} />
            {scope&&scope.includes('@node') ? null : (
                <React.Fragment>
                    <Grid item xs={12}>
                        <HarmonicCardHeader expand={viewProcedure.expand} onExpand={handleExpand('procedure')} title="PROCEDURES" onRefresh={handleRefreshProcedures} unmountOnExit>
                            <ChipsCard
                                buttons={buttons(handleClickViewProcedure, handleClickRunProcedure)}
                                items={procedures[scope]}
                                onAdd={handleClickAddProcedure}
                                onDelete={handleClickDeleteProcedure}
                                tag={ProceduresTAG}
                                title="procedures"
                                warnExpression={i=>i.with_side_effects}
                            />
                            <ViewProcedureDialog open={viewProcedure.open} onClose={handleCloseViewProcedure} procedure={viewProcedure.name?(procedures?procedures[scope]:[]).find(i=>i.name==viewProcedure.name):{}} />
                        </HarmonicCardHeader>
                    </Grid>
                    <Grid item xs={12}>
                        <HarmonicCardHeader expand={viewProcedure.expand} onExpand={handleExpand('procedure')} title="PROCEDURES" onRefresh={handleRefreshProcedures} unmountOnExit>
                            <ChipsCard
                                buttons={buttons(handleClickViewTimer, handleClickRunTimer)}
                                items={timers[scope]}
                                onAdd={handleClickAddTimer}
                                onDelete={handleClickDeleteTimer}
                                tag={TimersTAG}
                                title="timers"
                                warnExpression={i=>i.with_side_effects}
                            />
                            <ViewTimerDialog open={viewTimer.open} onClose={handleCloseViewTimer} timer={viewTimer.id?(timers?timers[scope]:[]).find(i=>i.id==viewProcedure.id):{}} />
                        </HarmonicCardHeader>
                    </Grid>
                </React.Fragment>
            )}
            {scope&&scope.includes('@collection') ? (
                <React.Fragment>
                    <Grid item xs={12}>
                        <HarmonicCardHeader expand={viewType.expand} onExpand={handleExpand('type')} title="TYPES" onRefresh={handleRefreshTypes} unmountOnExit>
                            <EnumTypeChips
                                buttonsView={{add: false, edit: false, run: true, view: true}}
                                categoryInit="type"
                                items={customTypes[scope]}
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
                        </HarmonicCardHeader>
                    </Grid>
                    <Grid item xs={12}>
                        <HarmonicCardHeader expand={viewEnum.expand} onExpand={handleExpand('enums')} title="ENUMS" onRefresh={handleRefreshEnums} unmountOnExit>
                            <EnumTypeChips
                                buttonsView={{add: false, edit: false, run: true, view: true}}
                                categoryInit="enum"
                                items={enums[scope]}
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
                        </HarmonicCardHeader>
                    </Grid>
                </React.Fragment>
            ): null}
        </React.Fragment>

    );
};

EditorSideContent.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetQueryInput: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(EditorSideContent);