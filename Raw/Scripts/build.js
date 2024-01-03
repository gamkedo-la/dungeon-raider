// This script requires Node.js. (https://nodejs.org)
// It also assumes itch.io's Butler CLI is installed and has been granted permission to post to your itch.io developer account.
// Instructions for download, installation, and use (including setting your $PATH variable)
// of itch.io's Butler can be downloaded here: https://itch.io/docs/butler/

// This script copies the index.html, main.js, Public/, Phaser/, and Source/ folders to a Build/ folder
// It then changes all paths that begin '../../Public/ to be './Public/ in all files in the Source/ folder
// It then deploys the Build/ folder to itch.io using butler using the cli command:
// butler push ./Build renegadeapplications/dungeon-raiders:html-initial
// Replace "renegadeapplications" with your itch.io user name 
// Replace "dungeon-raiders" with your game's name and
// Replace ":html-initial" with your channel (see the Butler link above for more details about the channel
// TLDR is that it's required and can be most anything you want)

const fsp = require('node:fs').promises
const path = require('node:path')
const { exec } = require('node:child_process')

async function main () {
  try {
    await fsp.mkdir('./Build')
    await fsp.mkdir('./Build/Source')
    await fsp.mkdir('./Build/Phaser')
    await fsp.mkdir('./Build/Public')
  
    // Copy index.html, and main.js the ./Build/ folder
    await fsp.copyFile('./index.html', './Build/index.html')
    await fsp.copyFile('./main.js', './Build/main.js')
  
    // Copy the contents of the ./Source/ folder to the ./Build/Source/ folder
    const sourceFiles = await fsp.readdir('./Source')
    for (const file of sourceFiles) {
      const filePath = path.join('./Source', file)
      await fsp.cp(filePath, path.join('./Build/Source', file), { recursive: true })
    }
  
    // Copy the contents of the ./Public/ folder to the ./Build/Public/ folder
    const publicFiles = await fsp.readdir('./Public')
    for (const file of publicFiles) {
      const filePath = path.join('./Public', file)
      await fsp.cp(filePath, path.join('./Build/Public', file), { recursive: true })
    }
  
    // Copy the contents of the ./Phaser/ folder to the ./Build/Phaser/ folder
    const phaserFiles = await fsp.readdir('./Phaser')
    for (const file of phaserFiles) {
      const filePath = path.join('./Phaser', file)
      await fsp.cp(filePath, path.join('./Build/Phaser', file), { recursive: true })
    }
  
    // Recursively traverse the ./Build/Source/ folder and change any paths that begin with '../../Public/' to './Public/'
    const buildSourceFiles = await fsp.readdir('./Build/Source', { withFileTypes: true })
    for (const file of buildSourceFiles) {
      if (file.isDirectory()) {
        const subFiles = await fsp.readdir(path.join('./Build/Source', file.name), { withFileTypes: true })
        for (const subFile of subFiles) {
          if (subFile.isFile()) {
            const filePath = path.join('./Build/Source', file.name, subFile.name)
            const fileContents = await fsp.readFile(filePath, 'utf8')
            const newFileContents = fileContents.replace(/..\/..\/Public\//g, './Public/')
            await fsp.writeFile(filePath, newFileContents)
          }
        }
      } else if (file.isFile()) {
        const filePath = path.join('./Build/Source', file.name)
        const fileContents = await fsp.readFile(filePath, 'utf8')
        const newFileContents = fileContents.replace(/..\/..\/Public\//g, './Public/')
        await fsp.writeFile(filePath, newFileContents)
      }
    }
  
    // Deploy the ./Build/ folder to itch.io using butler
    await exec('butler push ./Build renegadeapplications/dungeon-raiders:html-initial', async (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      }

      // Delete the ./Build/ folder
      await fsp.rm('./Build', { recursive: true })

      // Log the output of the butler command
      console.log(stdout)
      console.log(stderr)
    })
  } catch (error) {
    console.log(error)
  }
}

main()