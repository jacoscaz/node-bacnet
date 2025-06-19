"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const bacnetClient = new index_1.default({ apduTimeout: 10000, interface: '0.0.0.0' });
bacnetClient.on('message', (msg, rinfo) => {
    console.log(msg);
    if (rinfo)
        console.log(rinfo);
});
bacnetClient.on('error', (err) => {
    console.error(err);
    bacnetClient.close();
});
bacnetClient.on('listening', () => {
    console.log(`sent whoIs ${Date.now()}`);
    bacnetClient.whoIs();
});
bacnetClient.on('covNotifyUnconfirmed', (data) => {
    console.log(`Received COV: ${JSON.stringify(data)}`);
});
bacnetClient.on('iAm', (device) => {
    console.log(`Received iAm: ${JSON.stringify(device, null, 4)}`);
    if (!device.header || !device.payload) {
        console.log('Received invalid device information');
        return;
    }
    const address = device.header.sender;
    const deviceId = device.payload.deviceId;
    console.log(`Found Device ${deviceId} on ${JSON.stringify(address)}`);
    const analogInput = { type: 0, instance: 0 };
    const options = {
        maxSegments: 0,
        maxApdu: 0,
    };
    bacnetClient.subscribeCov(address, analogInput, 85, false, false, 0, options, (err) => {
        console.log(`subscribeCOV${err ? err : ''}`);
    });
    setTimeout(() => {
        bacnetClient.subscribeCov(address, analogInput, 85, false, false, 1, options, (err) => {
            console.log(`UnsubscribeCOV${err ? err : ''}`);
        });
    }, 20000);
});
setTimeout(() => {
    bacnetClient.close();
    console.log(`closed transport ${Date.now()}`);
}, 30000);
//# sourceMappingURL=subscribe-cov.js.map