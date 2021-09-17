const electronInstaller = require('electron-winstaller');

async function main() {

    // NB: Use this syntax within an async function, Node does not have support for
    //     top-level await as of Node 12.
    try {
        await electronInstaller.createWindowsInstaller({
            title:"smartphoneRemote",
            name:"smartphoneRemote",
            description: "Desktop client app for the smartphone remote",
            appDirectory: './smartphone-remote-desktop-client-win32-x64',
            outputDirectory: './smartphone-remote-desktop-client-installer',
            authors: 'rudxde',
            exe: 'smartphone-remote-desktop-client.exe',
        });
        console.log('It worked!');
    } catch (e) {
        console.log(`No dice: ${e.message}`);
    }
}
main().catch(err => {
    console.error(err);
    process.exit(1)
});
