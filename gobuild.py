#!/usr/bin/python3
import os
import sys
import argparse
import subprocess
import base64


template = '''// +build !debug
package {package}
import "encoding/base64"
// {variable} is a byte representation for {fn}
var {variable}, _ = base64.StdEncoding.DecodeString("{base64str}")
'''


goosarchs = [
    # ('darwin', '386'),  // not supported
    ('darwin', 'amd64'),
    # # ('darwin', 'arm'),  // not compiling
    # # ('darwin', 'arm64'),  // not compiling
    # ('dragonfly', 'amd64'),
    ('freebsd', '386'),
    ('freebsd', 'amd64'),
    ('freebsd', 'arm'),
    ('linux', '386'),
    ('linux', 'amd64'),
    ('linux', 'arm'),
    ('linux', 'arm64'),
    # ('linux', 'ppc64'),
    # ('linux', 'ppc64le'),
    # ('linux', 'mips'),
    # ('linux', 'mipsle'),
    # ('linux', 'mips64'),
    # ('linux', 'mips64le'),
    # ('netbsd', '386'),
    # ('netbsd', 'amd64'),
    # ('netbsd', 'arm'),
    # ('openbsd', '386'),
    # ('openbsd', 'amd64'),
    # ('openbsd', 'arm'),
    # ('plan9', '386'),
    # ('plan9', 'amd64'),
    # # ('solaris', 'amd64'),  // not compiling
    ('windows', '386'),
    ('windows', 'amd64'),
]

GOFILE = 'things-gui.go'
TARGET = 'things-gui'


def get_version(path):
    version = None
    with open(os.path.join(path, GOFILE), 'r') as f:
        for line in f:
            if line.startswith('const AppVersion ='):
                version = line.split('"')[1]
    if version is None:
        raise Exception('Cannot find version in {}'.format(GOFILE))
    return version


binfiles = [
    ('''./react/static/js/main-bundle-{}.min.js'''.format(
        get_version(os.path.dirname(__file__))), "FileMainBundleMinJS"),
    ('''./react/static/js/vendors-bundle-{}.min.js'''.format(
        get_version(os.path.dirname(__file__))), "FileVendorsBundleMinJS"),
    ("./react/static/js/editor.worker.js", "FileEditorWorkerJS"),
    ("./react/static/fonts/monaco-font.ttf", "FileMonacoFontTTF"),
    ("./react/static/img/thingsdb.gif", "FileThingsdbGIF"),
    ("./react/static/img/thingsgui-logo.png", "FileThingsguiLogo"),
    ("./react/static/img/thingsdb-logo.png", "FileThingsdbLogo"),
    ("./react/static/img/CesbitLogo.png", "FileCesbitLogo"),
    ("./react/static/img/view-edit.png", "FileViewEditLogo"),
    ("./react/static/favicon.ico", "FileFaviconICO"),
    ("./react/templates/app.html", "FileAppHTML"),
]


def build_all():
    path = os.path.dirname(os.path.abspath(__file__))
    version = get_version(path)
    outpath = os.path.join(path, 'bin', version)
    if not os.path.exists(outpath):
        os.makedirs(outpath)

    for goos, goarch in goosarchs:
        tmp_env = os.environ.copy()
        tmp_env["GOOS"] = goos
        tmp_env["GOARCH"] = goarch
        outfile = os.path.join(outpath, '{}_{}_{}_{}.{}'.format(
            TARGET,
            version,
            goos,
            goarch,
            'exe' if goos == 'windows' else 'bin'))
        with subprocess.Popen(
                ['go', 'build', '-o', outfile],
                env=tmp_env,
                cwd=path,
                stdout=subprocess.PIPE) as proc:
            print('Building {}/{}...'.format(goos, goarch))


def build(output=''):
    path = os.path.dirname(os.path.abspath(__file__))
    version = get_version(path)
    outfile = output if output else os.path.join(path, '{}_{}.{}'.format(
        TARGET, version, 'exe' if sys.platform.startswith('win') else 'bin'))
    args = ['go', 'build', '-o', outfile]

    with subprocess.Popen(
            args,
            cwd=path,
            stdout=subprocess.PIPE) as proc:
        print('Building {}...'.format(outfile))


def compile(fn, variable, empty=False):
    if empty:
        data = b''
    else:
        with open(fn, 'rb') as f:
            data = f.read()
    with open('{}.go'.format(variable.lower()), 'w', encoding='utf-8') as f:
        f.write(template.format(
            package='main',
            fn=fn,
            variable=variable,
            base64str=base64.b64encode(data).decode('utf-8')
        ))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument(
        '-o', '--output',
        default='',
        help='alternative output filename (requires -b/--build)')

    parser.add_argument(
        '-a', '--build-all',
        action='store_true',
        help='build binaries for all goos and goarchs')

    args = parser.parse_args()

    print('Create go files...')
    for bf in binfiles:
        compile(*bf)
    print('Finished creating go files!')

    if args.build_all:
        build_all()
        print('Finished building binaries!')
    else:
        build(output=args.output)
