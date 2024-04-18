import { GlobalConfigParamsEnum } from '@annuadvent/ngx-core/global-config';
import { remoteConfig } from 'firebase-admin';
import { RemoteConfigTemplate } from 'firebase-admin/lib/remote-config/remote-config-api';

export const getRemoteConfigParamValue = async (
  paramName: GlobalConfigParamsEnum
): Promise<any> => {
  const fConfig = remoteConfig();
  const rConfig: RemoteConfigTemplate = await fConfig.getTemplate();

  const pParam = rConfig.parameters[paramName];
  if (!pParam) {
    throw new Error(`Parameter ${paramName} does not exist in remote config`);
  }

  let pParamValue = rConfig.parameters[paramName]?.defaultValue || null;

  if (pParam.valueType === 'JSON') {
    return JSON.parse((pParamValue as any).value);
  } else {
    return (pParamValue as any).value;
  }
};
