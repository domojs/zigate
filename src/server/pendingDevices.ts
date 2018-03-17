import * as akala from '@akala/server';
import { Zigate } from 'zigate';

akala.injectWithName(['$router'], function (router: akala.worker.Router)
{
    router.get('/api/pending', akala.command(['devicesByAddress'], function (devices)
    {
        return devices;
    }));

    router.get('/api/gateways', akala.command([], async function ()
    {
        var serials = await Zigate.listEligibleSerials();
        return akala.map(serials, serial => { return { comName: serial.comName } });
    }));
})()