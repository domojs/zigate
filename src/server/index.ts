import { Zigate, MessageTypes, MessageType } from 'zigate';
import { DeviceType } from 'zigate/dist/messages/network';
import { deviceType, devices } from '@domojs/devices';
import * as akala from '@akala/server';
import { Status } from 'zigate/dist/messages/status';
import { Cluster } from 'zigate/dist/messages/common';
import { AttributeType } from 'zigate/dist/messages/attributes';
import { EventEmitter } from 'events';
import './pendingDevices';
import { TCSignificance } from 'zigate/dist/messages/permitjoin';

const log = akala.log('domojs:zigate');
var gateway: PromiseLike<Zigate>;
var devices: { [name: string]: ZDevices } = {};
var devicesByAddress: { [address: number]: ZDevice } = {};

akala.register('devices', devices);
akala.register('devicesByAddress', devicesByAddress);

type ZDevices = ZGateway | ZDevice;

interface ZGateway
{
    type: 'gateway';
    gateway: Zigate;
}

interface ZDevice
{
    type: 'device';
    address: number;
    category?: string;
    gateway: Zigate;
    name?: string;
    internalName?: string;
    clusters: Cluster[];
    attributes: { [key: number]: string | number }
}


akala.injectWithName(['$worker'], (worker: EventEmitter) =>
{
    var ready: boolean;

    worker.on('ready', function ()
    {
        ready = true;
        log('ready');
    });

    akala.worker.createClient('devices').then((client) =>
    {
        var c = deviceType.createClient(client)({
            exec: function (msg: { device: string, command: string, value?: any })
            {
                log(msg);
                switch (devices[msg.device].type)
                {
                    case 'gateway':
                        switch (msg.command)
                        {
                            case 'PermitJoining':
                                return new Promise((resolve, reject) =>
                                {
                                    devices[msg.device].gateway.send<MessageTypes.PermitJoiningRequest>(MessageType.PermitJoining, { interval: 0xFE, TCSignificance: TCSignificance.NoChangeInAuthentication, targetShortAddress: 0xFFFC });
                                    devices[msg.device].gateway.once<MessageTypes.PermitJoiningResponse>(MessageType.Status, (message) =>
                                    {
                                        if (message.status != Status.Success)
                                            reject(message.message);
                                        else
                                            resolve();
                                    });
                                });
                            case 'PermitJoin':
                            case 'GetVersion':
                            case 'Reset':
                            case 'ErasePersistentData':
                            case 'ZLO_ZLL_FactoryNew_Reset':
                            case 'PermitJoin':
                            case 'GetDevicesList':
                            case 'SetSecurityStateAndKey':
                            case 'StartNetworkScan':
                            case 'RemoveDevice':
                            case 'EnablePermissionsControlJoin':
                            case 'AuthenticateDevice':
                            case 'Bind':
                            case 'Unbind':
                            case 'ManagementLeave':
                                return new Promise((resolve, reject) =>
                                {
                                    devices[msg.device].gateway.send<MessageTypes.GetVersionRequest>(MessageType[msg.command as keyof MessageType]);
                                    devices[msg.device].gateway.once<MessageTypes.Status>(MessageType.Status, (message) =>
                                    {
                                        if (message.status != Status.Success)
                                            reject(message.message);
                                    });
                                    devices[msg.device].gateway.once<MessageTypes.GetVersionResponse>(MessageType.GetVersion | MessageType.Response, (message) =>
                                    {
                                        resolve();
                                    });
                                });
                            case 'GetDevicesList':
                                break;
                            case 'SetExtendedPanId':
                                break;
                            case 'SetChannelMask':
                                break;
                            case 'SetSecurityStateAndKey':
                                break;
                            case 'SetDeviceType':
                                break;
                            case 'RemoveDevice':
                                break;
                            case 'EnablePermissionsControlJoin':
                                break;
                            case 'AuthenticateDevice':
                                break;
                            case 'OutOfBandCommissionningData':
                                break;
                            case 'UserDescriptorSet':
                                break;
                            case 'UserDescriptor':
                                break;
                            case 'ComplexDescriptor':
                                break;
                            case 'Bind':
                                break;
                            case 'Unbind':
                                break;
                            case 'NetworkAddress':
                                break;
                            case 'IEEEAddress':
                                break;
                            case 'NodeDescriptor':
                                break;
                            case 'SimpleDescriptor':
                                break;
                            case 'PowerDescriptor':
                                break;
                            case 'ActiveEndpoint':
                                break;
                            case 'MatchDescriptor':
                                break;
                            case 'ManagementLeave':
                                break;
                            case 'PermitJoining':
                                break;
                            case 'ManagementNetworkUpdate':
                                break;
                            case 'SystemServerDiscovery':
                                break;
                            case 'DeviceAnnounce':
                                break;
                            case 'ManagementLQI':
                                break;
                            case 'AddGroup':
                                break;
                            case 'ViewGroup':
                                break;
                            case 'GetGroupMembership':
                                break;
                            case 'RemoveGroup':
                                break;
                            case 'RemoveAllGroup':
                                break;
                            case 'AddGroupIfIdentify':
                                break;
                            case 'IdentifySend':
                                break;
                            case 'IdentifyQuery':
                                break;
                            case 'MoveToLevel':
                                break;
                            case 'MoveToLevelWithWithoutOnOff':
                                break;
                            case 'MoveStep':
                                break;
                            case 'MoveStopMove':
                                break;
                            case 'MoveStopWithOnOff':
                                break;
                            case 'OnOffWithNoEffect':
                                break;
                            case 'OnOffTimedSend':
                                break;
                            case 'OnOffWithEffectsSend':
                                break;
                            case 'ViewScene':
                                break;
                            case 'AddScene':
                                break;
                            case 'RemoveScene':
                                break;
                            case 'RemoveAllScene':
                                break;
                            case 'StoreScene':
                                break;
                            case 'RecallScene':
                                break;
                            case 'SceneMembership':
                                break;
                            case 'AddEnhancedScene':
                                break;
                            case 'ViewEnhancedHost_NodeScene':
                                break;
                            case 'CopyScene':
                                break;
                            case 'MoveToHue':
                                break;
                            case 'MoveHue':
                                break;
                            case 'StepHue':
                                break;
                            case 'MoveToSaturation':
                                break;
                            case 'MoveSaturation':
                                break;
                            case 'StepSaturation':
                                break;
                            case 'MoveToHueAndSaturation':
                                break;
                            case 'MoveToColor':
                                break;
                            case 'MoveColor':
                                break;
                            case 'StepColor':
                                break;
                            case 'EnhancedMoveToHue':
                                break;
                            case 'EnhancedMoveHue':
                                break;
                            case 'EnhancedStepHue':
                                break;
                            case 'EnhancedMoveToHueAndSaturation':
                                break;
                            case 'ColorLoopSet':
                                break;
                            case 'StopMoveStep':
                                break;
                            case 'MoveToColorTemperature':
                                break;
                            case 'MoveColorTemperature':
                                break;
                            case 'StepColorTemperature':
                                break;
                            case 'InitiateTouchlink':
                                break;
                            case 'TouchlinkFactoryResetTarget':
                                break;
                            case 'IdentifyTriggerEffect':
                                break;
                            case 'LockUnlockDoor':
                                break;
                            case 'ReadAttribute':
                                break;
                            case 'WriteAttribute':
                                break;
                            case 'ConfigureReporting':
                                break;
                            case 'AttributeDiscovery':
                                break;
                            case 'IASZoneEnrollResponse':
                                break;
                            case 'RawAPSData':
                                break;
                        }
                        break;
                    case 'device':
                        break;
                }
            },
            getStatus: function (msg)
            {
                var device = devices[msg.device];
                switch (device.type)
                {
                    case 'device':
                        return device.attributes;
                    case 'gateway':
                    default:
                        return null;
                }
            },
            save: function (msg)
            {
                if (Object.keys(devices).length == 0 && !msg.body.IP && !msg.body.port)
                    throw new Error('A gateway first need to be registered');

                if (msg.body.IP || msg.body.port) //gateway
                {
                    if (!msg.body.IP)
                        gateway = Zigate.getSerial(msg.body.port.comName);
                    else
                        throw new Error('Wifi zigate are not (yet) supported');

                    return gateway.then((zigate) =>
                    {
                        msg.device.commands = {
                            'GetVersion': { type: 'button' },
                            'Reset': { type: 'button' },
                            'ErasePersistentData': { type: 'button' },
                            'ZLO_ZLL_FactoryNew_Reset': { type: 'button' },
                            'PermitJoin': { type: 'button' },
                            'GetDevicesList': { type: 'button' },
                            'SetSecurityStateAndKey': { type: 'button' },
                            'StartNetworkScan': { type: 'button' },
                            'RemoveDevice': { type: 'button' },
                            'EnablePermissionsControlJoin': { type: 'button' },
                            'AuthenticateDevice': { type: 'button' },
                            'Bind': { type: 'button' },
                            'Unbind': { type: 'button' },
                            'ManagementLeave': { type: 'button' },
                            'PermitJoining': { type: 'button' },
                        };

                        zigate.send<MessageTypes.SetChannelMaskRequest>(MessageType.SetChannelMask, { mask: 11 })
                        zigate.once(MessageType.Status, (response: MessageTypes.SetChannelMaskResponse) =>
                        {
                            zigate.send<MessageTypes.SetDeviceTypeRequest>(MessageType.SetDeviceType, { type: DeviceType.Coordinator });
                            zigate.once(MessageType.Status, (response: MessageTypes.SetDeviceTypeResponse) =>
                            {
                                zigate.send<MessageTypes.StartNetworkRequest>(MessageType.StartNetwork);
                                zigate.once(MessageType.StartNetwork, (response: MessageTypes.StartNetworkResponse) =>
                                {

                                })
                            })
                        });
                        zigate.on<MessageTypes.DeviceAnnounce>(MessageType.DeviceAnnounce, (message) =>
                        {
                            devicesByAddress[message.shortAddress] = {
                                type: 'device',
                                gateway: zigate,
                                address: message.shortAddress,
                                category: null,
                                clusters: [],
                                attributes: {}
                            };
                        });
                        zigate.on<MessageTypes.ReportIndividualAttribute>(MessageType.ReportIndividualAttribute, (attribute) =>
                        {
                            if (attribute.attributeEnum == 0x05)
                            {
                                devicesByAddress[attribute.sourceAddress].internalName = attribute.value.toString() + ' (' + attribute.sourceAddress + ')';
                            }
                            if (attribute.sourceAddress in devicesByAddress)
                                devicesByAddress[attribute.sourceAddress] = {
                                    type: 'device',
                                    gateway: zigate,
                                    address: attribute.sourceAddress,
                                    category: null,
                                    clusters: [],
                                    attributes: {}
                                }

                            if (devicesByAddress[attribute.sourceAddress].clusters.indexOf(attribute.clusterId) == -1)
                                devicesByAddress[attribute.sourceAddress].clusters.push(attribute.clusterId);
                            try
                            {
                                switch (attribute.dataType)
                                {
                                    case AttributeType.bitmap:
                                        break;
                                    case AttributeType.bool:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readUInt8(0);
                                        break;
                                    case AttributeType.enum:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readUInt8(0);
                                        break;
                                    case AttributeType.int16:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readInt16BE(0);
                                        break;
                                    case AttributeType.int32:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readInt32BE(0);
                                        break;
                                    case AttributeType.int8:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readInt8(0);
                                        break;
                                    case AttributeType.null:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = null;
                                        break;
                                    case AttributeType.string:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.toString();
                                        break;
                                    case AttributeType.uint16:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readUInt16BE(0);
                                        break;
                                    case AttributeType.uint32:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readUInt32BE(0);
                                        break;
                                    case AttributeType.uint48:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readUIntBE(0, 6);
                                        break;
                                    case AttributeType.uint8:
                                        devicesByAddress[attribute.sourceAddress].attributes[attribute.clusterId] = attribute.value.readUInt8(0);
                                        break;
                                    default:
                                        log(`Unsupported attribute type (${attribute.dataType})`);
                                }
                            }
                            catch (e)
                                {
                                    log(e);
                                }
                        })

                        devices[msg.device.name] = {
                            type: 'gateway',
                            gateway: zigate
                        };

                        return msg.device;
                    });
                }
                else //ZDevice
                {
                    msg.device.subdevices = [];
                    for (var cluster in devicesByAddress[msg.body.address].attributes)
                    {
                        msg.device.subdevices.push({
                            name: Cluster[cluster],
                            commands: [],
                            category: msg.device.category,
                            type: msg.device.type,
                            status: function ()
                            {
                                return Promise.resolve(devicesByAddress[msg.body.address].attributes[cluster].toString());
                            },
                            statusMethod: 'push'
                        })
                    }
                }

                return msg.device;
            }
        });
        var server = c.$proxy();
        if (ready)
        {
            log('registering');
            server.register({
                name: 'zigate',
                commandMode: 'static',
                view: '@domojs/zigate/device.html'
            });
        }
        else
            worker.on('ready', function ()
            {
                log('registering');
                server.register({
                    name: 'zigate',
                    commandMode: 'static',
                    view: '@domojs/zigate/device.html'
                });
            })
    })
})();