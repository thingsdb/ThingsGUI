'''
The version should be equal to the version field in packages.json
    production example: 0.1.39
    development example: 0.1.40-alpha1
'''
__version_info__ = (0, 0, 1)       # Increase after deploy
__alpha__info_ = 1                  # None for release, number for dev

__alpha__ = '' if __alpha__info_ is None else '-alpha{}'.format(__alpha__info_)
__version__ = '.'.join(map(str, __version_info__)) + __alpha__
