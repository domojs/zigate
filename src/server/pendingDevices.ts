import * as akala from '@akala/server';
import { Zigate } from 'zigate';
import { ZDevice } from '.';
import { Cluster } from 'zigate/dist/messages/common';

akala.injectWithName(['$router'], function (router: akala.worker.Router)
{
    router.get('/api/pending', akala.command(['devicesByAddress'], function (devices: { [address: number]: ZDevice })
    {
        return akala.map(devices, function (device)
        {
            return {
                name: device.internalName || device.address + ' ('+(device.clusters.map(function (cluster)
                {
                    return Cluster[cluster];
                }).toString())+')', address: device.address
            };
        }, true);
    }));

    router.get('/api/gateways', akala.command([], async function ()
    {
        var serials = await Zigate.listEligibleSerials();
        return akala.map(serials, serial => { return { comName: serial.comName } });
    }));
})()