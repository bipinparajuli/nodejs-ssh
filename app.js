const { readFileSync } = require('fs');

const { Client } = require('ssh2');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create a new SSH client instance
const sshClient = new Client();

// Configure the connection parameters
const connectionParams = {
    host: 'your remote server host',
  username: 'your username',
  privateKey: readFileSync('path/to/private/key')
};

// Connect to the SSH server
sshClient.connect(connectionParams);


// Handle events when the connection is established
sshClient.on('ready', () => {
    console.log('Connected via SSH!');
          // Prompt the user to enter a command
rl.question('Enter a command to execute on the remote server: ', (command) => {
    ececute(command)
});

  });

  function ececute(command){
  
    // Execute the user-entered command on the remote server
    sshClient.exec(command, (err, stream) => {
      if (err) throw err;
  
      stream.on('close', (code, signal) => {
        console.log('Command execution closed');
        sshClient.end();
        rl.close();
      })
      .on('data', (data) => {
        console.log('Command output:', data.toString());
      })
      .stderr.on('data', (data) => {
        console.error('Command error:', data.toString());
      });
    });
  }

