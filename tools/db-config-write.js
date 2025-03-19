const { exec } = require("child_process");
const util = require("util");

module.exports = async function() {
    const command = `node generateConfig`;

    // execute this command
    const execPromise = util.promisify(exec);
    
    try {
        const { stdout, stderr } = await execPromise(command);
        
        if (stderr) {
            console.error(`Error during execution: ${stderr}`);
            return { success: false, error: stderr };
        }
        
        console.log(`Command executed successfully: ${stdout}`);
        return { success: true, output: stdout };
    } catch (error) {
        console.error(`Failed to execute command: ${error.message}`);
        return { success: false, error: error.message };
    }
}