/**
 * Official SWK ONE Brand Architecture Asset Pipeline for SWK ONE & SWK OS.
 *
 * Uses the official SWK ONE Brand Assets package:
 *   01_SWK_ONE_Primary_Logo
 *   02_SWK_ONE_Master_Lockup
 *   03_SWK_ONE_Portal_Arch_Emblem
 *   04a_SWK_ONE_App_Icon_Dark_Labeled / 04b_SWK_ONE_App_Icon_Light_Labeled
 *   05_SWK_ONE_Horizontal_Portal_Lockup
 *   06_SWK_ONE_Portal_Map_Pin
 *   07_SWK_ONE_Portal_Arch_With_Wordmark
 *   08_SWK_ONE_Script_Logo_Compact
 *   09a_SWK_ONE_App_Icon_Light_Unlabeled / 09b_SWK_ONE_App_Icon_Dark_Unlabeled
 *
 * Official Brand Color Palette:
 *   - Deep Emerald Background:       #041615 (RGB: 4, 22, 21)
 *   - Champagne Gold Highlight:      #E0C1A3 (RGB: 224, 193, 163)
 *   - Brushed Bronze / Rose Gold:    #B68F70 (RGB: 182, 143, 112)
 *   - Deep Bronze Shadow:            #6F513B (RGB: 111, 81, 59)
 *   - App Icon Warm Ivory Surface:   #F3EFE6 (RGB: 243, 239, 230)
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { PNG } = require('pngjs')

const root = path.resolve(import.meta.dirname, '..')
const extractedZipDir = 'C:/Users/shamh/.gemini/antigravity/brain/41ab3c83-72df-4793-9436-1f9580148f65/scratch/SWK_ONE_Brand_Assets/SWK_ONE_Brand_Assets'
const brandSrcDir = path.join(root, 'assets-src', 'SWK_ONE_Brand_Assets')
const pubDir = path.join(root, 'public')
const brandDir = path.join(pubDir, 'brand')
const oneDir = path.join(brandDir, 'one')
const favDir = path.join(pubDir, 'favicon')

const DEEP_EMERALD_RGB = [4, 22, 21] // #041615
const WARM_IVORY_RGB = [243, 239, 230] // #F3EFE6

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

/** High-precision area-averaged + bilinear supersampled resize with premultiplied alpha. */
function resizeSmooth(src, w, h) {
  if (src.width === w && src.height === h) return src
  const out = new PNG({ width: w, height: h })
  const scaleX = src.width / w
  const scaleY = src.height / h

  const sampleBilinear = (fx, fy) => {
    const x0 = clamp(Math.floor(fx), 0, src.width - 1)
    const y0 = clamp(Math.floor(fy), 0, src.height - 1)
    const x1 = clamp(x0 + 1, 0, src.width - 1)
    const y1 = clamp(y0 + 1, 0, src.height - 1)
    const dx = fx - Math.floor(fx)
    const dy = fy - Math.floor(fy)
    const getPM = (px, py) => {
      const idx = (py * src.width + px) * 4
      const a = src.data[idx + 3] / 255
      return [src.data[idx] * a, src.data[idx + 1] * a, src.data[idx + 2] * a, a]
    }
    const p00 = getPM(x0, y0), p10 = getPM(x1, y0), p01 = getPM(x0, y1), p11 = getPM(x1, y1)
    const res = [0, 0, 0, 0]
    for (let c = 0; c < 4; c++) {
      const top = p00[c] * (1 - dx) + p10[c] * dx
      const bot = p01[c] * (1 - dx) + p11[c] * dx
      res[c] = top * (1 - dy) + bot * dy
    }
    return res
  }

  const samples = Math.max(2, Math.min(5, Math.ceil(Math.max(scaleX, scaleY))))
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let pr = 0, pg = 0, pb = 0, pa = 0
      for (let sy = 0; sy < samples; sy++) {
        const fy = (y + (sy + 0.5) / samples) * scaleY - 0.5
        for (let sx = 0; sx < samples; sx++) {
          const fx = (x + (sx + 0.5) / samples) * scaleX - 0.5
          const s = sampleBilinear(fx, fy)
          pr += s[0]; pg += s[1]; pb += s[2]; pa += s[3]
        }
      }
      const total = samples * samples
      pr /= total; pg /= total; pb /= total; pa /= total
      const di = (y * w + x) * 4
      if (pa <= 1e-4) {
        out.data[di] = 0; out.data[di + 1] = 0; out.data[di + 2] = 0; out.data[di + 3] = 0
      } else {
        out.data[di] = clamp(Math.round(pr / pa), 0, 255)
        out.data[di + 1] = clamp(Math.round(pg / pa), 0, 255)
        out.data[di + 2] = clamp(Math.round(pb / pa), 0, 255)
        out.data[di + 3] = clamp(Math.round(pa * 255), 0, 255)
      }
    }
  }
  return out
}

/** Compose a source PNG onto a w x h canvas with optional solid background and fit ratio. */
function composeOnCanvas(src, w, h, bg = null, ratio = 0.82) {
  const img = new PNG({ width: w, height: h })
  if (bg) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const di = (y * w + x) * 4
        img.data[di] = bg[0]; img.data[di + 1] = bg[1]; img.data[di + 2] = bg[2]; img.data[di + 3] = 255
      }
    }
  }
  const scale = Math.min((w * ratio) / src.width, (h * ratio) / src.height)
  const mw = Math.max(8, Math.round(src.width * scale))
  const mh = Math.max(8, Math.round(src.height * scale))
  const mark = resizeSmooth(src, mw, mh)
  const ox = Math.round((w - mark.width) / 2)
  const oy = Math.round((h - mark.height) / 2)
  for (let y = 0; y < mark.height; y++) {
    for (let x = 0; x < mark.width; x++) {
      const si = (y * mark.width + x) * 4
      const a = mark.data[si + 3] / 255
      if (a <= 0) continue
      const di = ((y + oy) * w + (x + ox)) * 4
      if (bg) {
        for (let c = 0; c < 3; c++) img.data[di + c] = Math.round(img.data[di + c] * (1 - a) + mark.data[si + c] * a)
        img.data[di + 3] = 255
      } else {
        img.data[di] = mark.data[si]; img.data[di + 1] = mark.data[si + 1]; img.data[di + 2] = mark.data[si + 2]; img.data[di + 3] = mark.data[si + 3]
      }
    }
  }
  return img
}

function makeWhiteSilhouette(src, w, h, ratio = 0.72) {
  const fitted = composeOnCanvas(src, w, h, null, ratio)
  for (let i = 0; i < fitted.data.length; i += 4) {
    const a = fitted.data[i + 3]
    if (a > 0) {
      fitted.data[i] = 255
      fitted.data[i + 1] = 255
      fitted.data[i + 2] = 255
      fitted.data[i + 3] = Math.min(255, Math.round(a * 1.25))
    }
  }
  return fitted
}

/** Unmix cool Deep Emerald (#041615) background to produce clean alpha-matting for Champagne Gold / Bronze marks. */
function cleanEmeraldBg(src) {
  const out = new PNG({ width: src.width, height: src.height })
  for (let i = 0; i < src.data.length; i += 4) {
    const r = src.data[i], g = src.data[i + 1], b = src.data[i + 2]
    const warmth = Math.max(0, (r - g) * 1.6 + (r - b) * 0.9)
    const luma = Math.max(0, r - 10)
    const signal = Math.max(warmth, luma * 0.85)
    let a = (signal - 14) / (52 - 14)
    a = Math.max(0, Math.min(1, a))
    if (a <= 0.01) {
      out.data[i] = 0; out.data[i + 1] = 0; out.data[i + 2] = 0; out.data[i + 3] = 0
    } else {
      const bgR = 6, bgG = 26, bgB = 24
      const ur = Math.min(255, Math.max(r, Math.round((r - bgR * (1 - a)) / a)))
      const ug = Math.min(255, Math.max(0, Math.round((g - bgG * (1 - a)) / a)))
      const ub = Math.min(255, Math.max(0, Math.round((b - bgB * (1 - a)) / a)))
      out.data[i] = ur
      out.data[i + 1] = Math.min(ur, ug)
      out.data[i + 2] = Math.min(ug, ub)
      out.data[i + 3] = Math.round(a * 255)
    }
  }
  return out
}

/** Exterior flood-fill for 06_SWK_ONE_Portal_Map_Pin so the inner emerald bevel stays solid while exterior is transparent. */
function cleanMapPinBg(pin) {
  const w = pin.width, h = pin.height
  const visited = new Uint8Array(w * h)
  const queue = []
  const isBg = (idx) => {
    const i = idx * 4
    const r = pin.data[i], g = pin.data[i + 1], b = pin.data[i + 2]
    const warmth = Math.max(0, (r - g) * 1.6 + (r - b) * 0.9)
    return warmth < 20 && r < 42
  }
  for (let x = 0; x < w; x++) {
    if (isBg(x)) { visited[x] = 1; queue.push(x) }
    const bIdx = (h - 1) * w + x
    if (isBg(bIdx)) { visited[bIdx] = 1; queue.push(bIdx) }
  }
  for (let y = 0; y < h; y++) {
    const lIdx = y * w, rIdx = y * w + (w - 1)
    if (!visited[lIdx] && isBg(lIdx)) { visited[lIdx] = 1; queue.push(lIdx) }
    if (!visited[rIdx] && isBg(rIdx)) { visited[rIdx] = 1; queue.push(rIdx) }
  }
  while (queue.length > 0) {
    const cur = queue.pop()
    const cx = cur % w, cy = (cur - cx) / w
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const nx = cx + dx, ny = cy + dy
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue
      const nIdx = ny * w + nx
      if (!visited[nIdx] && isBg(nIdx)) {
        visited[nIdx] = 1
        queue.push(nIdx)
      }
    }
  }
  const outPin = new PNG({ width: w, height: h })
  for (let idx = 0; idx < w * h; idx++) {
    const i = idx * 4
    if (visited[idx]) {
      outPin.data[i] = 0; outPin.data[i + 1] = 0; outPin.data[i + 2] = 0; outPin.data[i + 3] = 0
    } else {
      const cx = idx % w, cy = (idx - cx) / w
      let adjBg = 0
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = cx + dx, ny = cy + dy
        if (nx >= 0 && nx < w && ny >= 0 && ny < h && visited[ny * w + nx]) adjBg++
      }
      const r = pin.data[i], g = pin.data[i + 1], b = pin.data[i + 2]
      const alpha = adjBg > 0 ? Math.min(255, Math.max(90, (r + g) * 2)) : 255
      outPin.data[i] = r; outPin.data[i + 1] = g; outPin.data[i + 2] = b; outPin.data[i + 3] = alpha
    }
  }
  return outPin
}

function writePng(destAbs, pngObj) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true })
  fs.writeFileSync(destAbs, PNG.sync.write(pngObj))
}

function writeSvgWrapper(destAbs, pngBuf, width, height) {
  fs.mkdirSync(path.dirname(destAbs), { recursive: true })
  const b64 = pngBuf.toString('base64')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><image href="data:image/png;base64,${b64}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/></svg>`
  fs.writeFileSync(destAbs, svg)
}

function buildIco(pngBuffersWithSizes) {
  const count = pngBuffersWithSizes.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)
  let offset = 6 + 16 * count
  const dirs = []
  const blobs = []
  for (const { size, buf } of pngBuffersWithSizes) {
    const dir = Buffer.alloc(16)
    dir.writeUInt8(size >= 256 ? 0 : size, 0)
    dir.writeUInt8(size >= 256 ? 0 : size, 1)
    dir.writeUInt8(0, 2)
    dir.writeUInt8(0, 3)
    dir.writeUInt16LE(1, 4)
    dir.writeUInt16LE(32, 6)
    dir.writeUInt32LE(buf.length, 8)
    dir.writeUInt32LE(offset, 12)
    dirs.push(dir)
    blobs.push(buf)
    offset += buf.length
  }
  return Buffer.concat([header, ...dirs, ...blobs])
}

function main() {
  if (fs.existsSync(extractedZipDir)) {
    fs.mkdirSync(brandSrcDir, { recursive: true })
    fs.cpSync(extractedZipDir, brandSrcDir, { recursive: true })
  }
  if (!fs.existsSync(brandSrcDir)) {
    throw new Error(`Missing SWK_ONE_Brand_Assets at ${brandSrcDir}`)
  }

  const solidDir = path.join(brandSrcDir, '01_Clean_Assets_Solid_BG')
  const transDir = path.join(brandSrcDir, '02_Clean_Assets_Transparent_BG')
  const sheetsDir = path.join(brandSrcDir, '04_Master_Reference_Sheets')

  // Read solid & transparent masters
  const primaryLogoTrans = PNG.sync.read(fs.readFileSync(path.join(transDir, '01_SWK_ONE_Primary_Logo_Transparent.png')))
  const primaryLogoSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '01_SWK_ONE_Primary_Logo.png')))

  const masterLockupSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '02_SWK_ONE_Master_Lockup.png')))
  const masterLockupTrans = cleanEmeraldBg(masterLockupSolid)

  const portalArchSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '03_SWK_ONE_Portal_Arch_Emblem.png')))
  const portalArchTrans = cleanEmeraldBg(portalArchSolid)

  const appIconDarkLabeledTrans = PNG.sync.read(fs.readFileSync(path.join(transDir, '04a_SWK_ONE_App_Icon_Dark_Labeled_Transparent.png')))
  const appIconLightLabeledTrans = PNG.sync.read(fs.readFileSync(path.join(transDir, '04b_SWK_ONE_App_Icon_Light_Labeled_Transparent.png')))
  const appIconsPairTrans = PNG.sync.read(fs.readFileSync(path.join(transDir, '04_SWK_ONE_Mobile_App_Icons_Pair_Labeled_Transparent.png')))

  const horizontalSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '05_SWK_ONE_Horizontal_Portal_Lockup.png')))
  const horizontalTrans = cleanEmeraldBg(horizontalSolid)

  const mapPinSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '06_SWK_ONE_Portal_Map_Pin.png')))
  const mapPinTrans = cleanMapPinBg(mapPinSolid)

  const archWordmarkSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '07_SWK_ONE_Portal_Arch_With_Wordmark.png')))
  const archWordmarkTrans = cleanEmeraldBg(archWordmarkSolid)

  const scriptCompactSolid = PNG.sync.read(fs.readFileSync(path.join(solidDir, '08_SWK_ONE_Script_Logo_Compact.png')))
  const scriptCompactTrans = cleanEmeraldBg(scriptCompactSolid)

  const appIconLightUnlabeledTrans = PNG.sync.read(fs.readFileSync(path.join(transDir, '09a_SWK_ONE_App_Icon_Light_Unlabeled_Transparent.png')))
  const appIconDarkUnlabeledTrans = PNG.sync.read(fs.readFileSync(path.join(transDir, '09b_SWK_ONE_App_Icon_Dark_Unlabeled_Transparent.png')))

  // Save cleaned transparent PNGs back into assets-src/SWK_ONE_Brand_Assets/02_Clean_Assets_Transparent_BG
  writePng(path.join(transDir, '02_SWK_ONE_Master_Lockup_Transparent.png'), masterLockupTrans)
  writePng(path.join(transDir, '03_SWK_ONE_Portal_Arch_Emblem_Transparent.png'), portalArchTrans)
  writePng(path.join(transDir, '05_SWK_ONE_Horizontal_Portal_Lockup_Transparent.png'), horizontalTrans)
  writePng(path.join(transDir, '06_SWK_ONE_Portal_Map_Pin_Transparent.png'), mapPinTrans)
  writePng(path.join(transDir, '07_SWK_ONE_Portal_Arch_With_Wordmark_Transparent.png'), archWordmarkTrans)
  writePng(path.join(transDir, '08_SWK_ONE_Script_Logo_Compact_Transparent.png'), scriptCompactTrans)

  // 1. Populate /public/brand/one/* with the complete SWK ONE Brand Architecture suite
  fs.mkdirSync(oneDir, { recursive: true })
  writePng(path.join(oneDir, 'primary-logo.png'), primaryLogoTrans)
  writePng(path.join(oneDir, 'primary-logo-solid.png'), primaryLogoSolid)
  writePng(path.join(oneDir, 'master-lockup.png'), masterLockupTrans)
  writePng(path.join(oneDir, 'master-lockup-solid.png'), masterLockupSolid)
  writePng(path.join(oneDir, 'portal-arch-emblem.png'), portalArchTrans)
  writePng(path.join(oneDir, 'portal-arch-emblem-solid.png'), portalArchSolid)
  writePng(path.join(oneDir, 'app-icon-dark-labeled.png'), appIconDarkLabeledTrans)
  writePng(path.join(oneDir, 'app-icon-light-labeled.png'), appIconLightLabeledTrans)
  writePng(path.join(oneDir, 'app-icons-pair-labeled.png'), appIconsPairTrans)
  writePng(path.join(oneDir, 'horizontal-lockup.png'), horizontalTrans)
  writePng(path.join(oneDir, 'horizontal-lockup-solid.png'), horizontalSolid)
  writePng(path.join(oneDir, 'portal-map-pin.png'), mapPinTrans)
  writePng(path.join(oneDir, 'portal-map-pin-solid.png'), mapPinSolid)
  writePng(path.join(oneDir, 'portal-arch-wordmark.png'), archWordmarkTrans)
  writePng(path.join(oneDir, 'portal-arch-wordmark-solid.png'), archWordmarkSolid)
  writePng(path.join(oneDir, 'script-logo-compact.png'), scriptCompactTrans)
  writePng(path.join(oneDir, 'script-logo-compact-solid.png'), scriptCompactSolid)
  writePng(path.join(oneDir, 'app-icon-light-unlabeled.png'), appIconLightUnlabeledTrans)
  writePng(path.join(oneDir, 'app-icon-dark-unlabeled.png'), appIconDarkUnlabeledTrans)

  // Legacy /brand/one/* aliases used in AiPage, OllamaStudio, OneUtilityStudio, index.html
  writePng(path.join(oneDir, 'wordmark.png'), primaryLogoTrans)
  writePng(path.join(oneDir, 'properties.png'), horizontalTrans)
  writePng(path.join(oneDir, 'favicon.png'), composeOnCanvas(portalArchTrans, 256, 256, DEEP_EMERALD_RGB, 0.88))

  // Copy Master Reference Sheets & Labeled Panels into /public/brand/one/
  fs.copyFileSync(path.join(sheetsDir, '01_SWK_ONE_Master_Brand_Architecture_6Panel.png'), path.join(oneDir, 'sheet-complete-brand-system.png'))
  fs.copyFileSync(path.join(sheetsDir, '01_SWK_ONE_Master_Brand_Architecture_6Panel.jpg'), path.join(oneDir, 'sheet-complete-brand-system.jpg'))
  const panelsDir = path.join(brandSrcDir, '03_Labeled_Brand_Panels')
  fs.copyFileSync(path.join(panelsDir, 'Panel_04_SWK_ONE_Mobile_App_Icons.png'), path.join(oneDir, 'sheet-app-icon-suite.png'))
  fs.copyFileSync(path.join(panelsDir, 'Panel_07_Ecosystem_Column_SWK_ONE.png'), path.join(oneDir, 'sheet-core-identity-lockups.png'))

  // 2. Primary /brand/* assets used throughout Web & Mobile UI
  const mark512Trans = composeOnCanvas(portalArchTrans, 512, 512, null, 0.90)
  const mark512Emerald = composeOnCanvas(portalArchTrans, 512, 512, DEEP_EMERALD_RGB, 0.86)
  const mark512Ivory = composeOnCanvas(portalArchTrans, 512, 512, WARM_IVORY_RGB, 0.86)

  writePng(path.join(brandDir, 'swk-mark.png'), mark512Trans)
  writePng(path.join(brandDir, 'swk-mark-light.png'), mark512Trans)
  writePng(path.join(brandDir, 'swk-mark-black.png'), mark512Emerald)

  writePng(path.join(brandDir, 'swk-logo-white.png'), primaryLogoTrans)
  writePng(path.join(brandDir, 'swk-logo-ink.png'), primaryLogoTrans)
  writePng(path.join(brandDir, 'swk-logo-dark.png'), primaryLogoTrans)
  writePng(path.join(brandDir, 'swk-logo.png'), horizontalTrans)
  writePng(path.join(brandDir, 'swk-full-logo-dark.png'), horizontalTrans)
  writePng(path.join(brandDir, 'swk-full-logo-light.png'), horizontalTrans)

  writePng(path.join(brandDir, 'swk-signage-logo.png'), masterLockupSolid)
  writePng(path.join(brandDir, 'swk-signage-icon.png'), portalArchSolid)
  writePng(path.join(pubDir, 'swk-logo.png'), horizontalTrans)

  // SVG wrappers in /public/brand/*.svg and /public/brand/swk-os/**/*.svg
  const emblemBuf = PNG.sync.write(portalArchTrans)
  const wordmarkBuf = PNG.sync.write(primaryLogoTrans)
  const horizBuf = PNG.sync.write(horizontalTrans)
  const masterBuf = PNG.sync.write(masterLockupTrans)
  const emblemSolidBuf = PNG.sync.write(portalArchSolid)
  const wordmarkSolidBuf = PNG.sync.write(primaryLogoSolid)
  const horizSolidBuf = PNG.sync.write(horizontalSolid)
  const masterSolidBuf = PNG.sync.write(masterLockupSolid)

  writeSvgWrapper(path.join(brandDir, 'swk-os-emblem.svg'), emblemBuf, portalArchTrans.width, portalArchTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-mark.svg'), emblemBuf, portalArchTrans.width, portalArchTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os-wordmark.svg'), wordmarkBuf, primaryLogoTrans.width, primaryLogoTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os-horizontal.svg'), horizBuf, horizontalTrans.width, horizontalTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-logo.svg'), horizBuf, horizontalTrans.width, horizontalTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os-stacked.svg'), masterBuf, masterLockupTrans.width, masterLockupTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os-master.svg'), masterBuf, masterLockupTrans.width, masterLockupTrans.height)

  // Update /public/brand/swk-os/*
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Icon', 'SWK_Emblem_Transparent.svg'), emblemBuf, portalArchTrans.width, portalArchTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Icon', 'SWK_Emblem.svg'), emblemSolidBuf, portalArchSolid.width, portalArchSolid.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Logos', 'SWK_OS_Wordmark_Logo_Transparent.svg'), wordmarkBuf, primaryLogoTrans.width, primaryLogoTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Logos', 'SWK_OS_Wordmark_Logo.svg'), wordmarkSolidBuf, primaryLogoSolid.width, primaryLogoSolid.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Logos', 'SWK_OS_Horizontal_Logo_Transparent.svg'), horizBuf, horizontalTrans.width, horizontalTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Logos', 'SWK_OS_Horizontal_Logo.svg'), horizSolidBuf, horizontalSolid.width, horizontalSolid.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Logos', 'SWK_OS_Stacked_Logo_Transparent.svg'), masterBuf, masterLockupTrans.width, masterLockupTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Logos', 'SWK_OS_Stacked_Logo.svg'), masterSolidBuf, masterLockupSolid.width, masterLockupSolid.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Master', 'SWK_OS_Master_Transparent.svg'), masterBuf, masterLockupTrans.width, masterLockupTrans.height)
  writeSvgWrapper(path.join(brandDir, 'swk-os', 'Master', 'SWK_OS_Master.svg'), masterSolidBuf, masterLockupSolid.width, masterLockupSolid.height)

  // 3. Favicons & App Icons (Deep Emerald #041615 tile with SWK ONE Portal Arch + ONE)
  // For <= 48px use unlabeled Portal Arch for maximum legibility; for >= 64px use labeled SWK ONE App Icon / Arch+Wordmark
  const favSizes = [16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 512]
  const favDarkBuffers = new Map()
  const favLightBuffers = new Map()

  for (const n of favSizes) {
    const srcMark = n <= 48 ? portalArchTrans : archWordmarkTrans
    const ratio = n <= 48 ? 0.88 : 0.84
    const darkPng = composeOnCanvas(srcMark, n, n, DEEP_EMERALD_RGB, ratio)
    const lightPng = composeOnCanvas(srcMark, n, n, WARM_IVORY_RGB, ratio)
    const transPng = composeOnCanvas(srcMark, n, n, null, ratio)
    const darkBuf = PNG.sync.write(darkPng)
    const lightBuf = PNG.sync.write(lightPng)
    favDarkBuffers.set(n, darkBuf)
    favLightBuffers.set(n, lightBuf)

    fs.mkdirSync(favDir, { recursive: true })
    fs.writeFileSync(path.join(favDir, `favicon-${n}.png`), darkBuf)
    fs.mkdirSync(path.join(brandDir, 'icons', 'transparent'), { recursive: true })
    fs.writeFileSync(path.join(brandDir, 'icons', 'transparent', `swk-icon-${n}.png`), PNG.sync.write(transPng))
  }

  for (const n of [16, 32, 48, 96, 192, 512]) {
    fs.writeFileSync(path.join(pubDir, `favicon-${n}.png`), favDarkBuffers.get(n))
    fs.mkdirSync(path.join(brandDir, 'swk-os', 'Favicon'), { recursive: true })
    fs.writeFileSync(path.join(brandDir, 'swk-os', 'Favicon', `favicon-${n}.png`), favDarkBuffers.get(n))
  }

  const icoDark = buildIco([
    { size: 16, buf: favDarkBuffers.get(16) },
    { size: 32, buf: favDarkBuffers.get(32) },
    { size: 48, buf: favDarkBuffers.get(48) },
  ])
  const icoLight = buildIco([
    { size: 16, buf: favLightBuffers.get(16) },
    { size: 32, buf: favLightBuffers.get(32) },
    { size: 48, buf: favLightBuffers.get(48) },
  ])

  fs.writeFileSync(path.join(pubDir, 'favicon.ico'), icoDark)
  fs.writeFileSync(path.join(favDir, 'favicon.ico'), icoDark)
  fs.writeFileSync(path.join(brandDir, 'swk-os', 'Favicon', 'favicon.ico'), icoDark)

  fs.mkdirSync(path.join(brandDir, 'favicon'), { recursive: true })
  fs.writeFileSync(path.join(brandDir, 'favicon', 'favicon.ico'), icoDark)
  fs.writeFileSync(path.join(brandDir, 'favicon', 'favicon-dark.ico'), icoDark)
  fs.writeFileSync(path.join(brandDir, 'favicon', 'favicon-light.ico'), icoLight)
  for (const n of [16, 32, 48, 64]) {
    fs.writeFileSync(path.join(brandDir, 'favicon', `favicon-dark-${n}.png`), favDarkBuffers.get(n))
    fs.writeFileSync(path.join(brandDir, 'favicon', `favicon-light-${n}.png`), favLightBuffers.get(n))
  }

  // Apple touch icons & PWA 192 / 512 icons
  const apple180 = favDarkBuffers.get(180)
  const pwa192 = favDarkBuffers.get(192)
  const pwa512 = favDarkBuffers.get(512)

  fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), apple180)
  fs.writeFileSync(path.join(favDir, 'apple-touch-icon.png'), apple180)
  fs.writeFileSync(path.join(brandDir, 'swk-os', 'Favicon', 'apple-touch-icon.png'), apple180)
  fs.writeFileSync(path.join(pubDir, 'app-icon-192.png'), pwa192)
  fs.writeFileSync(path.join(pubDir, 'app-icon-512.png'), pwa512)
  fs.writeFileSync(path.join(pubDir, 'icon-192.png'), pwa192)
  fs.writeFileSync(path.join(pubDir, 'icon-512.png'), pwa512)

  fs.mkdirSync(path.join(brandDir, 'app-icons'), { recursive: true })
  fs.writeFileSync(path.join(brandDir, 'app-icons', 'apple-touch-icon.png'), apple180)
  fs.writeFileSync(path.join(brandDir, 'app-icons', 'android-chrome-192x192.png'), pwa192)
  fs.writeFileSync(path.join(brandDir, 'app-icons', 'android-chrome-512x512.png'), pwa512)
  fs.writeFileSync(path.join(brandDir, 'app-icons', 'maskable-192x192.png'), pwa192)
  fs.writeFileSync(path.join(brandDir, 'app-icons', 'maskable-512x512.png'), pwa512)
  writePng(path.join(brandDir, 'app-icons', 'app-store-1024.png'), composeOnCanvas(archWordmarkTrans, 1024, 1024, DEEP_EMERALD_RGB, 0.82))

  writeSvgWrapper(path.join(pubDir, 'favicon.svg'), pwa512, 512, 512)
  writeSvgWrapper(path.join(pubDir, 'favicon-16.svg'), favDarkBuffers.get(16), 16, 16)
  writeSvgWrapper(path.join(favDir, 'favicon.svg'), pwa512, 512, 512)
  writeSvgWrapper(path.join(favDir, 'favicon-16.svg'), favDarkBuffers.get(16), 16, 16)

  // 4. OpenGraph & Social Cards (1200x630 & 1080x1080)
  const ogDark = composeOnCanvas(horizontalTrans, 1200, 630, DEEP_EMERALD_RGB, 0.78)
  const ogLight = composeOnCanvas(horizontalTrans, 1200, 630, WARM_IVORY_RGB, 0.78)
  const ogDarkBuf = PNG.sync.write(ogDark)
  fs.writeFileSync(path.join(pubDir, 'og.png'), ogDarkBuf)
  fs.mkdirSync(path.join(brandDir, 'social'), { recursive: true })
  fs.writeFileSync(path.join(brandDir, 'social', 'social-card-charcoal-1200x630.png'), ogDarkBuf)
  fs.writeFileSync(path.join(brandDir, 'social', 'social-card-pearl-1200x630.png'), PNG.sync.write(ogLight))
  writePng(path.join(brandDir, 'social', 'avatar-charcoal-1080.png'), composeOnCanvas(masterLockupTrans, 1080, 1080, DEEP_EMERALD_RGB, 0.82))
  writePng(path.join(brandDir, 'social', 'avatar-pearl-1080.png'), composeOnCanvas(masterLockupTrans, 1080, 1080, WARM_IVORY_RGB, 0.82))

  // 5. Masters, Logos & Wordmark subdirectories
  fs.mkdirSync(path.join(brandDir, 'masters'), { recursive: true })
  writePng(path.join(brandDir, 'masters', 'swk-primary.png'), masterLockupTrans)
  writePng(path.join(brandDir, 'masters', 'swk-primary-approved-original.png'), masterLockupTrans)
  writePng(path.join(brandDir, 'masters', 'swk-dark.png'), masterLockupSolid)
  writePng(path.join(brandDir, 'masters', 'swk-dark-companion-original.png'), masterLockupSolid)
  writePng(path.join(brandDir, 'masters', 'swk-icon.png'), portalArchTrans)
  writePng(path.join(brandDir, 'masters', 'swk-icon-original.png'), portalArchSolid)
  writePng(path.join(brandDir, 'masters', 'swk-icon-approved-white-reference.png'), mark512Ivory)
  writePng(path.join(brandDir, 'masters', 'swk-wordmark.png'), primaryLogoTrans)

  for (const w of ['240', '320', '480', '640', '960', '1280', '1600', '4096-upscaled']) {
    writePng(path.join(brandDir, 'logos', 'dark', `swk-properties-${w}.png`), horizontalTrans)
    writePng(path.join(brandDir, 'logos', 'light', `swk-properties-${w}.png`), horizontalTrans)
  }
  for (const w of ['320', '640', '1280', '1600']) {
    writePng(path.join(brandDir, 'wordmark', `swk-wordmark-${w}.png`), primaryLogoTrans)
  }
  writePng(path.join(brandDir, 'wordmark', 'swk-wordmark-black.png'), primaryLogoTrans)
  writePng(path.join(brandDir, 'wordmark', 'swk-wordmark-flat-gold.png'), primaryLogoTrans)
  writePng(path.join(brandDir, 'wordmark', 'swk-wordmark-white.png'), primaryLogoTrans)

  // 6. assets-src convenience copies
  writePng(path.join(root, 'assets-src', 'swk-logo.png'), mark512Trans)
  fs.writeFileSync(path.join(root, 'assets-src', 'SWK_favicon.ico'), icoDark)
  fs.writeFileSync(path.join(root, 'assets-src', 'SWK_favicon_512.png'), pwa512)
  fs.writeFileSync(path.join(root, 'assets-src', 'favicon.png'), pwa512)

  // 7. Android App Icons, Adaptive Foreground/Monochrome, Splash Icons & Drawables
  const androidMain = path.join(root, 'android', 'app', 'src', 'main')
  const resDir = path.join(androidMain, 'res')
  if (fs.existsSync(resDir)) {
    fs.writeFileSync(path.join(androidMain, 'ic_launcher-playstore.png'), pwa512)

    const densities = [
      { name: 'mdpi', scale: 1.0, size: 48 },
      { name: 'hdpi', scale: 1.5, size: 72 },
      { name: 'xhdpi', scale: 2.0, size: 96 },
      { name: 'xxhdpi', scale: 3.0, size: 144 },
      { name: 'xxxhdpi', scale: 4.0, size: 192 },
    ]

    for (const d of densities) {
      const mipDir = path.join(resDir, `mipmap-${d.name}`)
      const drawDir = path.join(resDir, `drawable-${d.name}`)
      fs.mkdirSync(mipDir, { recursive: true })
      fs.mkdirSync(drawDir, { recursive: true })

      // Legacy & round launcher icons (Deep Emerald #041615 with SWK ONE Portal Arch + ONE)
      const launcherPng = composeOnCanvas(archWordmarkTrans, d.size, d.size, DEEP_EMERALD_RGB, 0.84)
      const launcherBuf = PNG.sync.write(launcherPng)
      fs.writeFileSync(path.join(mipDir, 'ic_launcher.png'), launcherBuf)
      fs.writeFileSync(path.join(mipDir, 'ic_launcher_round.png'), launcherBuf)

      // Adaptive icon foreground & monochrome (108dp canvas, emblem inside 66dp safe zone -> ratio 0.60)
      const canvas = Math.round(108 * d.scale)
      const fg = composeOnCanvas(archWordmarkTrans, canvas, canvas, null, 0.60)
      const mono = makeWhiteSilhouette(portalArchTrans, canvas, canvas, 0.60)
      fs.writeFileSync(path.join(mipDir, 'ic_launcher_foreground.png'), PNG.sync.write(fg))
      fs.writeFileSync(path.join(mipDir, 'ic_launcher_monochrome.png'), PNG.sync.write(mono))

      // Status-bar notification icon (24dp white silhouette of Portal Arch Emblem)
      const statSize = Math.round(24 * d.scale)
      const statIcon = makeWhiteSilhouette(portalArchTrans, statSize, statSize, 0.88)
      fs.writeFileSync(path.join(drawDir, 'ic_stat_swk.png'), PNG.sync.write(statIcon))

      // Android 12+ splash icon (288dp canvas with Master Lockup)
      const splashSize = Math.round(288 * d.scale)
      const splashIcon = composeOnCanvas(masterLockupTrans, splashSize, splashSize, null, 0.56)
      fs.writeFileSync(path.join(drawDir, 'splash_icon.png'), PNG.sync.write(splashIcon))
    }

    const drawableDir = path.join(resDir, 'drawable')
    fs.mkdirSync(drawableDir, { recursive: true })
    fs.writeFileSync(path.join(drawableDir, 'swk_app_icon.png'), pwa512)
    writePng(path.join(drawableDir, 'swk_logo.png'), mark512Trans)
    writePng(path.join(drawableDir, 'swk_logo_white.png'), primaryLogoTrans)
    writePng(path.join(drawableDir, 'swk_logo_ink.png'), primaryLogoTrans)

    const bgXmlPath = path.join(resDir, 'values', 'ic_launcher_background.xml')
    if (fs.existsSync(path.dirname(bgXmlPath))) {
      fs.writeFileSync(bgXmlPath, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#041615</color>\n</resources>\n`)
    }
  }

  console.log('✓ Synced official SWK ONE Brand Architecture assets across public/brand/one, public/brand, favicons, PWA, OpenGraph, and Android.')
}

main()
