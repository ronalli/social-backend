import { DevicesViewModel } from '../../features/security/api/models/output/devices.view.model';
import { DeviceEntity } from '../../features/security/domain/device.entity';


export const mappingSessions = (data: DeviceEntity[]): DevicesViewModel[] => {
  return data.map(deviceDB => {
    return {
      ip: deviceDB.ip,
      title: deviceDB.deviceName,
      lastActiveDate: deviceDB.iat,
      deviceId: deviceDB.deviceId,
    }
  })
}