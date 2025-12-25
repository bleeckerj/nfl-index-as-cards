import React from 'react'
import { BaseBoxShapeUtil, HTMLContainer } from '@tldraw/editor'

export class CardShapeUtil extends BaseBoxShapeUtil {
  static type = 'card'

  getDefaultProps() {
    return {
      w: 360,
      h: 420,
      title: '',
      image: '',
      summary: '',
      content: '',
      cardId: '',
      opacity: 1
    }
  }

  canResize() {
    return true
  }

  isAspectRatioLocked() {
    return false
  }

  component(shape) {
    const { w, h, title, image, summary, tags = [], opacity = 1 } = shape.props
    const titleH = 40
    const imageH = Math.max(140, Math.min(220, h * 0.45))
    const summaryH = Math.max(80, h - titleH - imageH - 40)
    const tagsH = 40

    return (
      <HTMLContainer id={shape.id}>
        <div
          style={{
            width: w,
            height: h,
            background: '#0f1720',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
            color: '#f4f5f7',
            // fontFamily: 'serif',
            userSelect: 'none',
            opacity,
            pointerEvents: opacity === 0 ? 'none' : 'auto',
            visibility: opacity === 0 ? 'hidden' : 'visible'
          }}
        >
          <div
            style={{
              height: titleH,
              padding: '8px 12px',
              background: '#d1b35c',
              color: '#111',
              fontWeight: 700,
              fontSize: 20,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {title || '(untitled)'}
          </div>
          <div style={{ height: imageH, overflow: 'hidden', background: '#111' }}>
            {image ? (
              <img
                alt=""
                src={image}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#666' }}>
                (no image)
              </div>
            )}
          </div>
          <div
            style={{
              minHeight: tagsH,
              padding: '8px 12px',
              background: '#1c2230',
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            {tags.map(tag => (
              <span
                key={tag}
                className='text-xl font-mono tags'
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: '#27272a',
                  color: '#fff',
                  // fontSize: 12,
                  // fontFamily: 'monospace, Inter, sans-serif'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            style={{
              height: summaryH,
              padding: '12px',
              fontSize: 16,
              lineHeight: 1.35,
              background: '#222a35',
              color: '#e8eaed',
              boxSizing: 'border-box'
            }}
          >
            {summary || '(no summary)'}
          </div>
        </div>
      </HTMLContainer>
    )
  }

  indicator(shape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={12} ry={12} />
  }
}

export default CardShapeUtil
