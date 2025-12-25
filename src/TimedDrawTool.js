import React from 'react'
import {
	StateNode
} from '@tldraw/editor'
import { DrawShapeUtil } from 'tldraw'
import * as DrawingModule from '../node_modules/tldraw/dist-esm/lib/shapes/draw/toolStates/Drawing.mjs'
import * as IdleModule from '../node_modules/tldraw/dist-esm/lib/shapes/draw/toolStates/Idle.mjs'
import { getTimedLineConfig } from './TimedLineTool'

const { Drawing } = DrawingModule
const { Idle } = IdleModule

export class TimedDrawShapeUtil extends DrawShapeUtil {
	static type = 'timed-draw'
	static migrations = {
		id: 'com.tldraw.shape.timed-draw',
		version: 1,
		sequence: []
	}

	component(shape) {
		const fade = shape?.meta?.fade ?? 1
		const opacity = Math.max(0, Math.min(1, fade))
		const base = super.component(shape)
		return React.cloneElement(base, {
			style: { ...(base?.props?.style || {}), opacity }
		})
	}
}

class TimedDrawing extends Drawing {
	shapeType = 'timed-draw'

	onEnter(info) {
		super.onEnter(info)
		const cfg = getTimedLineConfig()
		// initialShape is set by super.startShape inside onEnter
		const shape = this.initialShape ?? (this.editor && this.editor.getOnlySelectedShape?.())
		if (shape) {
			const opacityForShape = this.editor?.getStyleForNextShape?.('opacity') ?? 1
			this.editor.updateShapes([
				{
					id: shape.id,
					type: shape.type,
					meta: {
						...(shape.meta || {}),
						timed: true,
						createdAt: Date.now(),
						lifespanMs: cfg.lifespanMs,
						fadeMs: cfg.fadeMs,
						baseOpacity: opacityForShape,
						fade: opacityForShape
					}
				}
			])
		}
	}
}

class TimedDrawIdle extends Idle {
	static id = 'idle'
}

export class TimedDrawTool extends StateNode {
	static id = 'timed-draw'
	static initial = 'idle'
	static isLockable = false
	static useCoalescedEvents = true
	static children() {
		return [TimedDrawIdle, TimedDrawing]
	}

	shapeType = 'timed-draw'

	onExit() {
		const drawingState = this.children?.['drawing']
		if (drawingState) drawingState.initialShape = undefined
	}
}
