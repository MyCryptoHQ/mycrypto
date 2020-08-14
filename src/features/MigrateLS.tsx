import React, { useState, useMemo, useEffect } from 'react';

import { IFrame } from '@components';
import { path, prop } from '@vendor';
import { getCurrentDBConfig } from '@database';
import { TURL } from '@types';

const DBName = prop('main', getCurrentDBConfig());
const getHostName: (obj: Window) => string | undefined = path(['location', 'hostname']);
const getOrigin: (obj: any) => string | undefined = path(['contentWindow', 'location', 'origin']);

/**
 * Take an HTMLIFrameElement and check if the localstorage has the correct key
 */
export const getLS: (obj: HTMLIFrameElement) => string | undefined = path([
  'contentWindow',
  'localStorage',
  DBName
]);

/**
 * Retrieve the url of the landing page according to current execution envirionment
 * @param hostname : TURL
 */
export const getIFrameSrc = (hostname: string) => {
  switch (hostname) {
    case 'mycrypto.com':
      return 'https://beta.mycrypto.com' as TURL;
    case 'mycryptobuilds.com':
      return 'https://landing.mycryptobuilds.com' as TURL;
    default:
      return 'https://localhost:8000' as TURL;
  }
};

const MigrateLS = ({
  isDefault: isDefaultStore = false,
  importStorage = () => false,
  isValidImport
}: {
  isDefault?: boolean;
  importStorage(ls: string): boolean;
  isValidImport(ls: string): boolean;
}) => {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement>();
  const [prevStorage, setPrevStorage] = useState<string>();
  const [canImport, setCanImport] = useState(false);
  const [error, setError] = useState(false);
  // We only need to get the iFrame src once
  const src = useMemo(() => getIFrameSrc(getHostName(window)!), []);

  useEffect(() => {
    if (!prevStorage) {
      return;
    } else if (isValidImport(prevStorage)) {
      setCanImport(true);
    } else {
      console.debug(`[MYC-Migrate] ${prevStorage} is not a valid LS`);
    }
  }, [prevStorage]);

  const handleLoad = (frame: HTMLIFrameElement) => {
    const storage = getLS(frame);
    if (getOrigin(frame) !== src) {
      // We want to fail hard if ever this happens
      throw new Error(`[MYC-Migrate] Iframe from unauthorized source ${getOrigin(frame)}`);
    } else if (!storage) {
      // Just in case
      console.debug(`[MYC-Migrate] No LS found with key ${DBName}`);
    } else {
      setIframeRef(frame);
      setPrevStorage(storage);
    }
  };

  const handleImport = () => {
    try {
      const success = importStorage(prevStorage!);
      if (success) {
        console.debug(`[MYC-Migrate] Successfully imported storage`);
      } else {
        throw new Error(`[MYC-Migrate] Import failed`);
      }
      // deletePrevStorage!();
    } catch (err) {
      console.debug(`[MYC-Migrate] ${err}`);
      setError(true);
    }
  };

  const handleCancel = () => {
    deletePrevStorage();
    setCanImport(false);
  };

  const deletePrevStorage = () => {
    if (!iframeRef) return;
    iframeRef.contentWindow?.localStorage.removeItem(DBName);
  };

  return (
    <>
      {isDefaultStore && <IFrame src={src} onLoad={handleLoad} hidden={true} />}
      {isDefaultStore && canImport && (
        <div>
          You may have notice that the url changed to app.mycrypto.com We found your previous
          storage from beta.mycrypto.com. Would you like to import your settings?
          <button onClick={handleImport}>Yes</button>
          <button onClick={handleCancel}>No</button>
          {error && <div>Error occured. Please contact support with the file</div>}
        </div>
      )}
    </>
  );
};

export default MigrateLS;