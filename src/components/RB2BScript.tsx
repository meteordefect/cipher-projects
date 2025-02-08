'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    reb2b?: {
      invoked?: boolean;
      methods?: string[];
      [key: string]: any;
    }
  }
}

export default function RB2BScript() {
  useEffect(() => {
    try {
      const script = document.createElement('script');
      script.textContent = `
        !function(){var reb2b=window.reb2b=window.reb2b||[];
        if(reb2b.invoked)return;reb2b.invoked=true;reb2b.methods=["identify","collect"];
        reb2b.factory=function(method){return function(){var args=Array.prototype.slice.call(arguments);
        args.unshift(method);reb2b.push(args);return reb2b;}};
        for(var i=0;i<reb2b.methods.length;i++){var key=reb2b.methods[i];reb2b[key]=reb2b.factory(key);}
        reb2b.load=function(key){var script=document.createElement("script");script.type="text/javascript";script.async=true;
        script.src="https://s3-us-west-2.amazonaws.com/b2bjsstore/b/"+key+"/GNLKQHELP06Q.js.gz";
        var first=document.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(script,first);};
        reb2b.SNIPPET_VERSION="1.0.1";reb2b.load("GNLKQHELP06Q");}();
      `;
      document.head.appendChild(script);
      
      // Add debug logs
      console.log('RB2B Script initialized');
      setTimeout(() => {
        console.log('RB2B Object status:', {
          exists: !!window.reb2b,
          invoked: window.reb2b?.invoked,
          methods: window.reb2b?.methods
        });
      }, 2000); // Check after 2 seconds to allow for initialization
    } catch (error) {
      console.error('Error initializing RB2B script:', error);
    }
  }, []);

  return null;
}
