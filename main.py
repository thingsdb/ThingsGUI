from lib.app import App


app = App(port=8080, config_file='default.conf')
app.start()

# #!/usr/bin/python3
#
# """Oversight HTTP
#
# :copyright: 2016, Transceptor Technology
# """
# import argparse
# import setproctitle
# from lib.utils import error_middleware
# from lib.version import __version__
# from lib.logger import setup_logger
# from lib.app import App
# from lib.socketrouter import SocketRouter
# import socketio
#
# if __name__ == '__main__':
#     setproctitle.setproctitle('oshttp')
#
#     parser = argparse.ArgumentParser()
#
#     parser.add_argument(
#         '-v', '--version',
#         action='store_true',
#         help='print version information and exit')
#
#     parser.add_argument(
#         '-c', '--config',
#         default='/etc/oshttp/oshttp.conf',
#         help='specify alternative config file',
#         type=str)
#
#     parser.add_argument(
#         '-o', '--port',
#         default=8080,
#         help='specify alternate port',
#         type=int)
#
#     parser.add_argument(
#         '-l', '--log-level',
#         default='info',
#         help='set the log level',
#         choices=['debug', 'info', 'warning', 'error'])
#
#     parser.add_argument(
#         '--log-file-max-size',
#         default=50000000,
#         help='max size of log files before rollover ' +
#              '(--log-file-prefix must be set)',
#         type=int)
#
#     parser.add_argument(
#         '--log-file-num-backups',
#         default=6,
#         help='number of log files to keep (--log-file-prefix must be set)',
#         type=int)
#
#     parser.add_argument(
#         '--log-file-prefix',
#         help='path prefix for log files (when not provided we send the ' +
#              'output to the console)',
#         type=str)
#
#     parser.add_argument(
#         '--log-colorized',
#         action='store_true',
#         help='use colorized logging')
#
#     parser.add_argument(
#         '--debug',
#         action='store_true',
#         help='enable debug mode (in debug mode the webserver will use '
#              'original less and js files instead of the minified files)')
#
#     parser.add_argument(
#         '--create-local-tokens',
#         action='store_true',
#         help='if tokens do not exist yet, create them in the token directory')
#
#     args = parser.parse_args()
#
#     # set-up the log handler with optional colors etc.
#     setup_logger(args)
#
#     # respond to --version argument
#     if args.version:
#         exit('''
# Oversight HTTP Server {version}
#         '''.strip().format(version=__version__))
#
#     app = App(
#         port=args.port,
#         debug_mode=args.debug,
#         config_file=args.config,
#         create_local_tokens=args.create_local_tokens)
#     app.start()
#
#     # bye
#     exit(0)
