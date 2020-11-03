import { AxiosInstance } from 'axios';

import { ApiService } from '@services/ApiService';
import { IS_DEV } from '@utils';

import {
  ANALYTICS_API_URL,
  ANALYTICS_ID_DESKTOP_DEV,
  ANALYTICS_ID_SITE,
  ANALYTICS_REC
} from './constants';
import { CvarEntry, Params } from './types';

let instantiated = false;
let analyticsId: number = ANALYTICS_ID_SITE;

export default class AnalyticsService {
  public static instance = new AnalyticsService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: ANALYTICS_API_URL,
    timeout: 5000
  });

  constructor() {
    if (instantiated) {
      throw new Error(`AnalyticsService has already been instantiated.`);
    } else {
      instantiated = true;
    }

    if (IS_DEV) {
      analyticsId = ANALYTICS_ID_DESKTOP_DEV;
    }
  }

  public trackLegacy(category: string, eventAction: string, eventParams?: TObject): Promise<any> {
    return this.track(category, `Legacy_${eventAction}`, eventParams);
  }

  public track(category: string, eventAction: string, eventParams?: TObject): Promise<any> {
    const customParams: Params = {
      local: IS_DEV.toString(),
      desktop: 'false',
      ...eventParams
    };

    const cvar: TObject = this.mapParamsToCvars(customParams);

    const params: TObject = {
      action_name: eventAction,
      e_c: category,
      e_a: eventAction,
      idsite: analyticsId,
      rec: ANALYTICS_REC,
      cvar: JSON.stringify(cvar)
    };

    return this.service.get('', { params }).catch();
  }

  public trackPageVisit(pageUrl: string): Promise<any> {
    const customParams: Params = {
      local: IS_DEV.toString(),
      desktop: 'false'
    };

    const cvar: TObject = this.mapParamsToCvars(customParams);

    const params: TObject = {
      action_name: 'Page navigation',
      url: pageUrl,
      idsite: analyticsId,
      rec: ANALYTICS_REC,
      cvar: JSON.stringify(cvar)
    };

    return this.service.get('', { params }).catch();
  }

  private mapParamsToCvars(params: Params): TObject {
    return Object.keys(params).reduce((tempObject: CvarEntry, key, index) => {
      tempObject[index + 1] = [key, params[key].toString()];
      return tempObject;
    }, {});
  }
}
