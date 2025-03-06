'use client';

import { useOsStore } from '@/app/store/os.store';
import { useEffect } from 'react';

const OsDetector = () => {
  const { setOsType } = useOsStore();

  useEffect(() => {
    const userAgent =
      window.navigator.userAgent.toLowerCase();
    let detectedOS = 'Unknown OS';

    if (userAgent.indexOf('win') !== -1)
      detectedOS = 'Windows';
    else if (userAgent.indexOf('mac') !== -1)
      detectedOS = 'MacOS';
    else if (userAgent.indexOf('linux') !== -1)
      detectedOS = 'Linux';
    else if (userAgent.indexOf('android') !== -1)
      detectedOS = 'Android';
    else if (userAgent.indexOf('ios') !== -1)
      detectedOS = 'iOS';

    setOsType(detectedOS); // Set the OS type in the store
  }, [setOsType]);

  return null; // This component does not render anything
};

export default OsDetector;
