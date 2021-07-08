import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';


const bottomInfo = [
    {
        name: 'github',
        icon: '/img/githubLogo.svg',
        url: 'https://github.com/thingsdb',
    },
    {
        name: 'facebook',
        icon: '/img/facebookLogo.png',
        url: 'https://www.facebook.com/transceptor',
    },
    {
        name: 'linkedin',
        icon: '/img/linkedinLogo.png',
        url: 'https://www.linkedin.com/company/transceptor-technology',
    },
    {
        name: 'ttWebpage',
        icon: '/img/TTLogo.png',
        url: 'https://www.transceptor.technology',
    },

];


const BottomBar = () => {
    return (
        <div style={{position:'fixed', left: 0, bottom: 5, zIndex: 2}}>
            {bottomInfo.map((v, i) => (
                <IconButton color="primary" key={i} href={v.url} size="medium" target="_blank">
                    <img
                        alt={v.name}
                        src={v.icon}
                        draggable='false'
                        width='35em'
                        style={{opacity:'0.6'}}
                    />
                </IconButton>
            ))}
        </div>
    );
};

export default BottomBar;
