import React from 'react'
import { BaseBoxShapeUtil, HTMLContainer } from '@tldraw/editor'
import stylesConfig from './data/styles.json'

function getSectionStyle(section, collection) {
  const defaults = stylesConfig.sections?.[section] || {}
  const overrides = stylesConfig.collections?.[collection]?.[section] || {}
  return { ...defaults, ...overrides }
}

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
      collection: '',
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
    const { w, h, title, image, summary, tags = [], opacity = 1, collection } = shape.props
    const [aspectRatio, setAspectRatio] = React.useState(null)
    const titleH = 40
    const tagsH = 40
    const reserved = titleH + tagsH + 20
    const fallbackImageH = Math.max(140, Math.min(220, h * 0.45))
    const maxImageH = Math.max(100, h - reserved)
    const imageH = aspectRatio
      ? Math.max(80, Math.min(maxImageH, w * aspectRatio))
      : fallbackImageH
    const summaryH = Math.max(80, h - titleH - imageH - tagsH - 10)
    const cardStyle = getSectionStyle('card', collection)
    const titleStyle = getSectionStyle('titleBar', collection)
    const imageStyle = getSectionStyle('image', collection)
    const tagsBarStyle = getSectionStyle('tagsBar', collection)
    const tagStyle = getSectionStyle('tag', collection)
    const summaryStyle = getSectionStyle('summary', collection)

    return (
      <HTMLContainer id={shape.id}>
        <div
          style={{
            ...cardStyle,
            width: w,
            height: h,
            overflow: 'hidden',
            // fontFamily: 'serif',
            userSelect: 'none',
            opacity,
            pointerEvents: opacity === 0 ? 'none' : 'auto',
            visibility: opacity === 0 ? 'hidden' : 'visible'
          }}
        >
          <div
            style={{
              ...titleStyle,
              height: titleH,
              padding: '8px 12px',
              fontWeight: 700,
              fontSize: 20,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {title || '(untitled)'}
          </div>
          <div style={{ height: imageH, overflow: 'hidden', ...imageStyle }}>
            {image ? (
              <img
                alt=""
                src={image}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  background: imageStyle.background || '#111'
                }}
                onLoad={e => {
                  const nw = e.target.naturalWidth || 0
                  const nh = e.target.naturalHeight || 0
                  if (nw > 0 && nh > 0) {
                    const ar = nh / nw
                    if (!aspectRatio || Math.abs(ar - aspectRatio) > 0.001) {
                      setAspectRatio(ar)
                    }
                  }
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#666' }}>
                (no image)
              </div>
            )}
          </div>
          <div
            style={{
              ...tagsBarStyle,
              minHeight: tagsH,
              padding: '8px 12px',
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            {tags.map(tag => (
              <span
                key={tag}
                className='text-sm font-mono tags'
                style={{
                  ...tagStyle,
                  padding: '4px 10px',
                  borderRadius: 999,
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
              ...summaryStyle,
              height: summaryH,
              padding: '12px',
              fontSize: 16,
              lineHeight: 1.35,
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
