export function drawIcon(ctx, iconKey, cx, cy, size, color) {
  const s = size
  const h = s / 2

  ctx.save()
  ctx.translate(cx - h, cy - h)
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.07
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (iconKey) {
    case 'job-intel-agent': {
      const r = s * 0.3
      const ox = s * 0.35
      const oy = s * 0.35
      ctx.beginPath()
      ctx.arc(ox, oy, r, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ox + r * 0.7, oy + r * 0.7)
      ctx.lineTo(h + s * 0.18, h + s * 0.18)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(h + s * 0.08, cy - cy + s * 0.08, s * 0.05, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(h + s * 0.2, cy - cy + s * 0.05, s * 0.04, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(h + s * 0.12, cy - cy + s * 0.18, s * 0.035, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'unity-showcase': {
      const cubeW = s * 0.38
      const cubeH = s * 0.22
      const top = s * 0.12
      const mid = s * 0.38
      const bot = s * 0.78
      ctx.beginPath()
      ctx.moveTo(h, top)
      ctx.lineTo(h + cubeW, top + cubeH)
      ctx.lineTo(h + cubeW, mid + cubeH)
      ctx.lineTo(h, bot)
      ctx.lineTo(h - cubeW, mid + cubeH)
      ctx.lineTo(h - cubeW, top + cubeH)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(h, top)
      ctx.lineTo(h, bot)
      ctx.moveTo(h + cubeW, top + cubeH)
      ctx.lineTo(h - cubeW, top + cubeH)
      ctx.stroke()
      break
    }
    case '3d-portfolio': {
      ctx.beginPath()
      ctx.arc(h, h, h * 0.85, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(h, h, h * 0.42, h * 0.85, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(h * 0.15, h)
      ctx.lineTo(h * 1.85, h)
      ctx.moveTo(h, h * 0.15)
      ctx.lineTo(h, h * 1.85)
      ctx.stroke()
      break
    }
    case 'video-automation': {
      const bx = s * 0.06
      const by = s * 0.14
      const bw = s * 0.64
      const bh = s * 0.7
      roundRect(ctx, bx, by, bw, bh, s * 0.06)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(bx + bw, by + s * 0.08)
      ctx.lineTo(s * 0.94, by + bh * 0.28)
      ctx.lineTo(s * 0.94, by + bh * 0.56)
      ctx.lineTo(bx + bw, by + bh * 0.72)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(bx, by + s * 0.14)
      ctx.lineTo(bx + bw, by + s * 0.14)
      ctx.stroke()
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        const tx = bx + s * 0.12 + i * s * 0.14
        ctx.rect(tx, by, s * 0.08, s * 0.14)
      }
      ctx.fill()
      break
    }
    case 'webar': {
      const brac = s * 0.22
      ctx.beginPath()
      ctx.moveTo(brac, s * 0.08)
      ctx.lineTo(s * 0.08, s * 0.08)
      ctx.lineTo(s * 0.08, brac)
      ctx.moveTo(s - brac, s * 0.08)
      ctx.lineTo(s * 0.92, s * 0.08)
      ctx.lineTo(s * 0.92, brac)
      ctx.moveTo(s * 0.08, s - brac)
      ctx.lineTo(s * 0.08, s * 0.92)
      ctx.lineTo(brac, s * 0.92)
      ctx.moveTo(s * 0.92, s - brac)
      ctx.lineTo(s * 0.92, s * 0.92)
      ctx.lineTo(s - brac, s * 0.92)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(h, h, s * 0.18, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(h, h, s * 0.06, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'rag-tool': {
      const dx = s * 0.08
      const dy = s * 0.04
      const dw = s * 0.55
      const dh = s * 0.76
      const fold = s * 0.18
      ctx.beginPath()
      ctx.moveTo(dx, dy)
      ctx.lineTo(dx + dw - fold, dy)
      ctx.lineTo(dx + dw, dy + fold)
      ctx.lineTo(dx + dw, dy + dh)
      ctx.lineTo(dx, dy + dh)
      ctx.closePath()
      ctx.stroke()
      for (let i = 0; i < 3; i++) {
        const ly = dy + s * 0.3 + i * s * 0.16
        ctx.beginPath()
        ctx.moveTo(dx + s * 0.1, ly)
        ctx.lineTo(dx + dw - s * 0.1, ly)
        ctx.stroke()
      }
      const mr = s * 0.18
      const mx = dx + dw - s * 0.02
      const my = dy + dh - s * 0.06
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(mx + mr * 0.7, my + mr * 0.7)
      ctx.lineTo(mx + mr * 1.2, my + mr * 1.2)
      ctx.stroke()
      break
    }
    case 'game-jam': {
      roundRect(ctx, s * 0.04, s * 0.26, s * 0.92, s * 0.5, s * 0.14)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(h, s * 0.2, s * 0.14, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.28, h)
      ctx.lineTo(s * 0.38, h)
      ctx.moveTo(s * 0.33, h - s * 0.06)
      ctx.lineTo(s * 0.33, h + s * 0.06)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(s * 0.67, h - s * 0.04, s * 0.04, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(s * 0.76, h + s * 0.04, s * 0.04, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'invoicex': {
      roundRect(ctx, s * 0.04, s * 0.1, s * 0.92, s * 0.8, s * 0.08)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.14, s * 0.28)
      ctx.lineTo(s * 0.14, s * 0.18)
      ctx.arc(s * 0.14 + s * 0.05, s * 0.18, s * 0.05, Math.PI, 0)
      ctx.lineTo(s * 0.24, s * 0.28)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(s * 0.34, s * 0.18, s * 0.05, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(s * 0.46, s * 0.18, s * 0.05, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = `bold ${s * 0.26}px monospace`
      ctx.fillStyle = color
      ctx.textBaseline = 'middle'
      ctx.fillText('>', s * 0.14, h + s * 0.06)
      ctx.fillText('_', s * 0.3, h + s * 0.06)
      break
    }
    case 'motion-library': {
      ctx.beginPath()
      ctx.moveTo(s * 0.06, h)
      ctx.bezierCurveTo(s * 0.2, h, s * 0.2, s * 0.14, s * 0.35, s * 0.14)
      ctx.bezierCurveTo(s * 0.5, s * 0.14, s * 0.5, s * 0.86, s * 0.65, s * 0.86)
      ctx.bezierCurveTo(s * 0.8, s * 0.86, s * 0.8, h, s * 0.94, h)
      ctx.stroke()
      for (let i = 0; i < 3; i++) {
        const px = s * 0.2 + i * s * 0.3
        const py = i === 1 ? s * 0.86 : (i === 0 ? s * 0.14 : h)
        ctx.beginPath()
        ctx.arc(px, py, s * 0.06, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'ar-business-card': {
      roundRect(ctx, s * 0.04, s * 0.22, s * 0.92, s * 0.56, s * 0.08)
      ctx.stroke()
      const qx = s * 0.14
      const qy = s * 0.32
      const qz = s * 0.24
      ctx.beginPath()
      ctx.rect(qx, qy, qz, qz)
      ctx.stroke()
      ctx.beginPath()
      ctx.rect(qx + s * 0.06, qy + s * 0.06, s * 0.12, s * 0.12)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(s * 0.48, qy + s * 0.04)
      ctx.lineTo(s * 0.62, qy + s * 0.04)
      ctx.moveTo(s * 0.48, qy + s * 0.12)
      ctx.lineTo(s * 0.72, qy + s * 0.12)
      ctx.moveTo(s * 0.48, qy + s * 0.2)
      ctx.lineTo(s * 0.58, qy + s * 0.2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(h, s * 0.68, s * 0.1, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(h, s * 0.68)
      ctx.lineTo(h + s * 0.1 * Math.cos(-0.5), s * 0.68 + s * 0.1 * Math.sin(-0.5))
      ctx.stroke()
      break
    }
    case 'docket-whale': {
      roundRect(ctx, s * 0.1, s * 0.08, s * 0.8, s * 0.84, s * 0.06)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.1, s * 0.28)
      ctx.lineTo(s * 0.9, s * 0.28)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.3, s * 0.18)
      ctx.lineTo(s * 0.5, s * 0.18)
      ctx.stroke()
      for (let i = 0; i < 3; i++) {
        const ry = s * 0.42 + i * s * 0.18
        ctx.beginPath()
        ctx.moveTo(s * 0.2, ry)
        ctx.lineTo(s * 0.54, ry)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(s * 0.74, ry, s * 0.05, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    }
    case 'roley': {
      ctx.beginPath()
      ctx.arc(s * 0.38, s * 0.48, s * 0.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.38 + s * 0.21, s * 0.48 + s * 0.21)
      ctx.lineTo(s * 0.86, s * 0.86)
      ctx.stroke()
      roundRect(ctx, s * 0.54, s * 0.04, s * 0.4, s * 0.28, s * 0.06)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(s * 0.74, s * 0.04 + s * 0.28 + s * 0.05, s * 0.04, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'psyche': {
      ctx.beginPath()
      ctx.arc(h, s * 0.52, s * 0.28, Math.PI, 0)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(h + s * 0.28, s * 0.52)
      ctx.arc(h + s * 0.14, s * 0.66, s * 0.14, 0, Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(h, s * 0.14, s * 0.1, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 3; i++) {
        const nx = s * (0.18 + i * 0.32)
        ctx.beginPath()
        ctx.arc(nx, s * 0.8, s * 0.06, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    }
    case 'grazi-assistant': {
      roundRect(ctx, s * 0.06, s * 0.26, s * 0.76, s * 0.56, s * 0.07)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.06, s * 0.34)
      ctx.lineTo(s * 0.44, s * 0.56)
      ctx.lineTo(s * 0.82, s * 0.34)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(s * 0.78, s * 0.22, s * 0.16, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.78, s * 0.1)
      ctx.lineTo(s * 0.78, s * 0.14)
      ctx.moveTo(s * 0.78, s * 0.3)
      ctx.lineTo(s * 0.78, s * 0.34)
      ctx.moveTo(s * 0.66, s * 0.22)
      ctx.lineTo(s * 0.7, s * 0.22)
      ctx.moveTo(s * 0.86, s * 0.22)
      ctx.lineTo(s * 0.9, s * 0.22)
      ctx.stroke()
      break
    }
    default: {
      ctx.beginPath()
      ctx.arc(h, h, h * 0.7, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
  }

  ctx.restore()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
