import React from 'react';

// a component to display the Leta logo
export default function Logo({height} : {height : number}): React.ReactElement {
    // the logo svg
    return (
        <svg width="210" height={height} viewBox="0 0 210 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M209.583 41.7778L191.969 9.21411L174.359 41.7778H209.583ZM196.714 34.2824H187.208L191.961 25.4877L196.714 34.2824Z" fill="#CD3234"/>
            <path d="M70.9933 41.7778V9.21411H78.2626V35.3144H92.1515V41.7778H70.9933Z" fill="#CD3234"/>
            <path d="M130.274 9.21411V15.6898H114.058V22.404H128.646V28.6207H114.058V35.3802H130.788V41.7778H106.785V9.21411H130.274Z" fill="#CD3234"/>
            <path d="M159.678 15.5048V41.7778H152.409V15.5048H143.182V9.21411H168.908V15.5048H159.678Z" fill="#CD3234"/>
            <path d="M0 0L19.4642 35.9927L38.9243 0H0ZM14.226 8.28071H24.727L19.4847 17.9964L14.226 8.28071Z" fill="#CE3234"/>
            <path d="M19.4677 36.1531L12.0668 43.5539L19.5047 51L26.9836 43.5251L19.4677 36.1531Z" fill="#CE3234"/>
        </svg>
    );
}