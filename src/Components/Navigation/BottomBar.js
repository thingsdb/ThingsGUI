import React from 'react';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';



const bottomInfo = [
    {
        name: 'github',
        icon: '/img/githubLogo.svg',
        url: 'https://github.com/thingsdb',
    },
    // {
    //     name: 'twitter',
    //     icon: ,
    //     url: '',
    // },
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
    const [value, setValue] = React.useState(0);
    return (
        <div style={{position:'fixed', left:'50%', transform: 'translate(-50%, -2%)', bottom: 0, zIndex: 2}}>
            <Toolbar>
                {bottomInfo.map((v, i) => (
                    <Button key={i} href={v.url} variant='text'>
                        <img
                            alt={v.name}
                            src={v.icon}
                            draggable='false'
                            width='40em'
                            style={{opacity:'0.4'}}
                        />
                    </Button>
                ))}
            </Toolbar>
        </div>
        // <BottomNavigation
        //     value={value}
        //     onChange={(e, newValue) => {
        //         setValue(newValue);
        //     }}
        //     showLabels={false}
        // >
        //     {bottomInfo.map((v, i) => (
        //         <Button key={i} href={v.url} variant='text'>
        //             <img
        //                 alt={v.name}
        //                 src={v.icon}
        //                 draggable='false'
        //                 width='40em'
        //                 style={{opacity:'0.4'}}
        //             />
        //         </Button>

        //     ))}
        // </BottomNavigation>
    );
};

export default BottomBar;
