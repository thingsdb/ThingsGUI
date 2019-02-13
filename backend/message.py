"""Message module."""


class Message(dict):
    """Message Class."""

    __slots__ = ('status',)

    kinds = ('default',)
    severities = ('info', 'success', 'warning', 'danger')
    displayable = ('always', 'only_once', 'visible_once')

    def __init__(
            self,
            text,
            kind='default',
            severity='danger',
            display='always',
            log=None,
            status=0):
        assert kind in self.kinds, \
            'Invalid message kind: {}'.format(severity)
        assert severity in self.severities, \
            'Invalid message type: {}'.format(severity)
        assert display in self.displayable, \
            'Invalid display option: {}'.format(display)

        super().__init__(
            text=text,
            kind=kind,
            severity=severity,
            display=display,
            log=log)

        self.status = status
