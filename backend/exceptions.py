class HandlerException(Exception):
    '''Raise this exception in socket handlers.
    Keyword arguments:
        exc: When not None, the str(exc) will be logged to the console. Can be
             used to log the original exception.
        log: When not None, additional log will be send to the client which in
             turn logs this message to the window.console.
        status: Can be used to set the status (default: 500)
    '''
    def __init__(self, *args, exc=None, log=None, status=500):
        self.exc = exc
        self.log = log
        self.status = status
