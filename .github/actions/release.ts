import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import * as github from '@actions/github'
import { execaCommand } from 'execa'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_TOKEN: string
    }
  }
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const tauriConfPath = path.join(dirname, '..', '..', 'src-tauri', 'tauri.conf.json')
const packageJsonPath = path.join(dirname, '..', '..', 'package.json')
const token = process.env.GITHUB_TOKEN

const OWNER = 'kadiryazici'
const REPO = 'eye-health-202020'

async function run() {
  const tauriConf = JSON.parse(
    await fs.readFile(tauriConfPath, 'utf-8'),
  ) as typeof import('../../src-tauri/tauri.conf.json')

  const packageJSON = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as typeof import('../../package.json')

  if (packageJSON.version !== tauriConf.package.version)
    throw new Error('Tauri config and Package JSON versions are not the same, update both of them!')

  const dmgFileName = `${tauriConf.package.productName}_${packageJSON.version}_universal.dmg`

  const dmgPath = path.join(
    dirname,
    '..',
    '..',
    'src-tauri',
    'target',
    'universal-apple-darwin',
    'release',
    'bundle',
    'dmg',
    dmgFileName,
  )

  const octokit = github.getOctokit(token)

  try {
    const remoteRelease = await octokit.rest.repos.getLatestRelease({
      owner: OWNER,
      repo: REPO,
    })

    if (remoteRelease.data.name === packageJSON.version.toString()) {
      console.log('No version change detected, skipping build.')
      return
    }
  }
  catch { /* If endpoint throws, it means no release yet */ }

  await execaCommand('pnpm tauri build --target universal-apple-darwin', { stdio: 'inherit' })

  const release = await octokit.rest.repos.createRelease({
    owner: OWNER,
    repo: REPO,
    tag_name: packageJSON.version.toString(),
    name: packageJSON.version.toString(),
  })

  octokit.rest.repos.uploadReleaseAsset({
    owner: OWNER,
    repo: REPO,
    name: dmgFileName,
    release_id: release.data.id,
    // @ts-expect-error type
    data: (await fs.readFile(dmgPath)).buffer,
  })
}

run()
